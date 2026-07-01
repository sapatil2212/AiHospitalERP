import { NextRequest } from "next/server";
import { verifyToken } from "../utils/jwt";
import { errorResponse } from "../utils/response";
import prisma from "../config/db";

export const authMiddleware = async (req: NextRequest) => {
  try {
    const authHeader = req.headers.get("authorization");
    let token = "";

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else {
      token = req.cookies.get("hms_session")?.value || "";
    }

    if (!token) {
      return { user: null, error: errorResponse("Unauthorized", 401) };
    }

    const payload = verifyToken(token);
    if (!payload) {
      return { user: null, error: errorResponse("Invalid token", 401) };
    }

    // Check hospital subscription/trial status
    if (payload.role !== "SUPER_ADMIN" && payload.hospitalId) {
      const hospital = await (prisma as any).hospital.findUnique({
        where: { id: payload.hospitalId },
      });
      if (hospital) {
        const now = new Date();
        const status = hospital.subscriptionStatus;
        const trialEnd = hospital.trialEndDate ? new Date(hospital.trialEndDate) : null;
        const subEnd = hospital.subscriptionEndDate ? new Date(hospital.subscriptionEndDate) : null;

        if (!hospital.isVerified) {
          return { user: null, error: errorResponse("HOSPITAL_DISABLED::Your hospital account is currently disabled.", 403) };
        }
        if (status === "TRIAL" && trialEnd && now > trialEnd) {
          return { user: null, error: errorResponse("TRIAL_EXPIRED::Your free trial has ended. Please subscribe to continue.", 403) };
        }
        if (status === "EXPIRED" || (status === "ACTIVE" && subEnd && now > subEnd)) {
          return { user: null, error: errorResponse("SUBSCRIPTION_EXPIRED::Your subscription has expired. Please renew.", 403) };
        }
        if (status === "SUSPENDED") {
          return { user: null, error: errorResponse("ACCOUNT_SUSPENDED::Your account has been suspended.", 403) };
        }
        if (status === "CANCELLED") {
          return { user: null, error: errorResponse("ACCOUNT_CANCELLED::Your subscription is cancelled.", 403) };
        }
      }
    }

    return { user: payload, error: null };
  } catch (error) {
    return { user: null, error: errorResponse("Unauthorized", 401) };
  }
};

