import { findUserByEmail, createUser } from "../repositories/user.repo";
import { createHospital, findHospitalById } from "../repositories/hospital.repo";
import { hashPassword, comparePassword } from "../utils/hash";
import { generateToken } from "../utils/jwt";
import { Role } from "@prisma/client";
import { verifyOTP } from "./otp.service";

const PLAN_KEY_TO_ENUM: Record<string, "STARTER" | "PROFESSIONAL" | "ENTERPRISE"> = {
  starter: "STARTER",
  pro: "PROFESSIONAL",
  enterprise: "ENTERPRISE",
};

export const signupHospitalService = async (data: any) => {
  const { hospitalName, mobile, email, password, adminName, otp, plan } = data;

  // Verify OTP
  try {
    await verifyOTP(email, otp);
  } catch (error: any) {
    throw new Error(error.message);
  }

  // Check if hospital admin already exists
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new Error("Email already registered");
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create Hospital with 14-day free trial on the selected plan
  const now = new Date();
  const trialEnd = new Date(now);
  trialEnd.setDate(trialEnd.getDate() + 14);
  const subscriptionPlan = PLAN_KEY_TO_ENUM[plan] || "PROFESSIONAL";

  const newHospital = await createHospital({
    name: hospitalName,
    mobile,
    email,
    isVerified: true,
    trialStartDate: now,
    trialEndDate: trialEnd,
    subscriptionStatus: "TRIAL",
    subscriptionPlan,
    billingCycle: "MONTHLY",
  } as any);

  // Create Admin User
  const newUser = await createUser({
    name: adminName,
    email,
    password: hashedPassword,
    role: Role.HOSPITAL_ADMIN,
    hospital: { connect: { id: newHospital.id } },
  });

  return { hospital: newHospital, user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role } };
};

export const loginUserService = async (email: string, password: string) => {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error("NOT_REGISTERED::No account found with this email. Please register your hospital to get started.");
  }
  if (!user.isActive) {
    throw new Error("ACCOUNT_INACTIVE::Your account is inactive. Please contact your hospital admin or AiHospitalERP support for assistance.");
  }

  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Incorrect password. Please try again or use \"Forgot password?\" to reset it.");
  }

  // Check trial/subscription status for non-super-admin users
  if (user.role !== Role.SUPER_ADMIN) {
    const hospital = await findHospitalById(user.hospitalId);
    if (hospital) {
      const now = new Date();
      const status = (hospital as any).subscriptionStatus;
      const trialEnd = (hospital as any).trialEndDate ? new Date((hospital as any).trialEndDate) : null;
      const subEnd = (hospital as any).subscriptionEndDate ? new Date((hospital as any).subscriptionEndDate) : null;

      if (status === "TRIAL" && trialEnd && now > trialEnd) {
        throw new Error("TRIAL_EXPIRED::Your 14-day free trial has ended. Please contact AiHospitalERP support to subscribe and continue using the platform. Email: support@aihospitalerp.com | Phone: +91-9876543210");
      }
      if (status === "EXPIRED" || (status === "ACTIVE" && subEnd && now > subEnd)) {
        throw new Error("SUBSCRIPTION_EXPIRED::Your subscription has expired. Please contact AiHospitalERP support to renew your plan. Email: support@aihospitalerp.com | Phone: +91-9876543210");
      }
      if (status === "SUSPENDED") {
        throw new Error("ACCOUNT_SUSPENDED::Your hospital account has been suspended. Please contact AiHospitalERP support for assistance. Email: support@aihospitalerp.com | Phone: +91-9876543210");
      }
      if (status === "CANCELLED") {
        throw new Error("ACCOUNT_CANCELLED::Your hospital subscription has been cancelled. Please contact AiHospitalERP support to reactivate. Email: support@aihospitalerp.com | Phone: +91-9876543210");
      }
    }
  }

  const tokenParams = {
    userId: user.id,
    role: user.role,
    hospitalId: user.hospitalId,
  };

  const token = generateToken(tokenParams);

  return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role, hospitalId: user.hospitalId } };
};
