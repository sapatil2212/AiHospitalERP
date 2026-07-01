import { NextRequest } from "next/server";
import { authMiddleware } from "./auth.middleware";
import { errorResponse } from "../utils/response";
import { JwtPayload } from "../utils/jwt";

/**
 * Combined auth + role guard middleware.
 * Returns the authenticated user payload or an error response.
 * Used for all config APIs that require HOSPITAL_ADMIN role.
 */
export const requireHospitalAdmin = async (
  req: NextRequest
): Promise<{ user: JwtPayload; hospitalId: string; error: null } | { user: null; hospitalId: null; error: Response }> => {
  const { user, error } = await authMiddleware(req);
  if (error) return { user: null, hospitalId: null, error };

  if (user!.role !== "HOSPITAL_ADMIN" && user!.role !== "SUPER_ADMIN") {
    return {
      user: null,
      hospitalId: null,
      error: errorResponse("Forbidden: Hospital Admin or Super Admin access required", 403),
    };
  }

  let hospitalId = user!.hospitalId;
  if (user!.role === "SUPER_ADMIN") {
    const url = req.nextUrl.searchParams;
    hospitalId = url.get("hospitalId") || url.get("hid") || req.headers.get("x-hospital-id") || "";
    if (!hospitalId) {
      try {
        const clone = req.clone();
        const body = await clone.json();
        hospitalId = body.hospitalId;
      } catch {}
    }
  }

  if (!hospitalId) {
    return {
      user: null,
      hospitalId: null,
      error: errorResponse("No hospital associated with this account", 400),
    };
  }

  return { user: user!, hospitalId: hospitalId, error: null };
};

/**
 * Generic role guard — allows multiple roles.
 */
export const requireRole = async (
  req: NextRequest,
  allowedRoles: string[]
): Promise<{ user: JwtPayload; hospitalId: string; error: null } | { user: null; hospitalId: null; error: Response }> => {
  const { user, error } = await authMiddleware(req);
  if (error) return { user: null, hospitalId: null, error };

  if (user!.role === "SUPER_ADMIN") {
    let hospitalId = user!.hospitalId;
    const url = req.nextUrl.searchParams;
    hospitalId = url.get("hospitalId") || url.get("hid") || req.headers.get("x-hospital-id") || "";
    if (!hospitalId) {
      try {
        const clone = req.clone();
        const body = await clone.json();
        hospitalId = body.hospitalId;
      } catch {}
    }
    if (!hospitalId) {
      return {
        user: null,
        hospitalId: null,
        error: errorResponse("No hospital associated with this account", 400),
      };
    }
    return { user: user!, hospitalId, error: null };
  }

  if (!allowedRoles.includes(user!.role)) {
    return {
      user: null,
      hospitalId: null,
      error: errorResponse(`Forbidden: Requires one of [${allowedRoles.join(", ")}]`, 403),
    };
  }

  return { user: user!, hospitalId: user!.hospitalId || "", error: null };
};

/**
 * Synchronous role guard for parsed JWT payloads.
 */
export const roleMiddleware = (user: JwtPayload, allowedRoles: string[]) => {
  if (!allowedRoles.includes(user.role)) {
    return {
      error: errorResponse(`Forbidden: Requires one of [${allowedRoles.join(", ")}]`, 403),
    };
  }
  return { error: null };
};
