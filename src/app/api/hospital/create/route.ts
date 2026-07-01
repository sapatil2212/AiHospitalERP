import { NextRequest } from "next/server";
import { authMiddleware } from "../../../../../backend/middlewares/auth.middleware";
import { roleMiddleware } from "../../../../../backend/middlewares/role.middleware";
import { Role } from "@prisma/client";
import prisma from "../../../../../backend/config/db";
import { hashPassword } from "../../../../../backend/utils/hash";
import { successResponse, errorResponse } from "../../../../../backend/utils/response";
import { z } from "zod";

const createHospitalSchema = z.object({
  hospitalName: z.string().min(2),
  adminName: z.string().min(2),
  email: z.string().email(),
  mobile: z.string().min(10),
  password: z.string().min(6),
});

export async function POST(req: NextRequest) {
  try {
    const { user, error: authError } = await authMiddleware(req);
    if (authError) return authError;

    // Only Super Admin can directly create a hospital without signing up via OTP
    const roleCheck = roleMiddleware(user!, [Role.SUPER_ADMIN]);
    if (roleCheck.error) return roleCheck.error;

    const body = await req.json();
    const result = createHospitalSchema.safeParse(body);

    if (!result.success) {
      return errorResponse("Validation Failed", 400, result.error.issues);
    }

    const { hospitalName, adminName, email, mobile, password } = result.data;

    // Check if user email is already registered
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return errorResponse("Email address already registered", 400);
    }

    const now = new Date();
    const trialEnd = new Date(now);
    trialEnd.setDate(trialEnd.getDate() + 14);

    const hashedPassword = await hashPassword(password);

    // Create hospital & admin user inside a Prisma transaction
    const transactionResult = await prisma.$transaction(async (tx) => {
      const hospital = await tx.hospital.create({
        data: {
          name: hospitalName,
          mobile,
          email,
          isVerified: true,
          trialStartDate: now,
          trialEndDate: trialEnd,
          subscriptionStatus: "TRIAL",
        },
      });

      // Generate user code for the admin
      const count = await tx.user.count({ where: { hospitalId: hospital.id } });
      const userCode = `USR-${String(count + 1).padStart(4, "0")}`;

      const userRecord = await tx.user.create({
        data: {
          name: adminName,
          email,
          password: hashedPassword,
          role: Role.HOSPITAL_ADMIN,
          hospitalId: hospital.id,
          userCode,
          isActive: true,
        },
      });

      return { hospital, user: userRecord };
    });

    return successResponse(transactionResult, "Hospital and Admin created successfully", 201);
  } catch (error: any) {
    return errorResponse(error.message || "Failed to create hospital", 500);
  }
}

