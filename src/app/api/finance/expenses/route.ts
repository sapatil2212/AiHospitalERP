import { NextRequest } from "next/server";
import { requireRole } from "../../../../../backend/middlewares/role.middleware";
import { requirePlanFeature } from "../../../../../backend/middlewares/plan-gate.middleware";
import { successResponse, errorResponse } from "../../../../../backend/utils/response";
import { getExpenseStats } from "../../../../../backend/services/finance.service";

const ALLOWED = ["HOSPITAL_ADMIN", "FINANCE_HEAD"];
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const auth = await requireRole(req, ALLOWED);
  if (auth.error) return auth.error;
  const planError = await requirePlanFeature(auth.hospitalId, "BILLING_QUEUE_FINANCE", auth.user.role);
  if (planError) return planError;
  
  try {
    const { searchParams } = new URL(req.url);
    const dateFrom = searchParams.get("dateFrom") || undefined;
    const dateTo = searchParams.get("dateTo") || undefined;

    const stats = await getExpenseStats(auth.hospitalId, { dateFrom, dateTo });
    return successResponse(stats, "Expense stats fetched");
  } catch (e: any) {
    return errorResponse(e.message, 500);
  }
}
