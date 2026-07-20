import { NextRequest, NextResponse } from "next/server";
import { treatmentService } from "../../../../../backend/services/treatment.service";
import { updateTreatmentPlanSchema } from "../../../../../backend/validations/treatment.validation";
import { withAuth, checkPermission, createPermissionError, createUnauthorizedError } from "../../../../../backend/middlewares/permission.middleware";
import { requirePlanFeature } from "../../../../../backend/middlewares/plan-gate.middleware";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authReq = withAuth(req);
    if (!authReq.user) return createUnauthorizedError();
    const planError = await requirePlanFeature(authReq.user.hospitalId, "TREATMENT_PLANS", authReq.user.role);
    if (planError) return planError;

    const plan = await treatmentService.getTreatmentPlan(params.id, authReq.user.hospitalId);
    return NextResponse.json({ success: true, data: plan });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Not found" },
      { status: 404 }
    );
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authReq = withAuth(req);
    if (!authReq.user) return createUnauthorizedError();
    const planError = await requirePlanFeature(authReq.user.hospitalId, "TREATMENT_PLANS", authReq.user.role);
    if (planError) return planError;

    if (!checkPermission(authReq, "PROCEDURE_PERFORM")) return createPermissionError("PROCEDURE_PERFORM");

    const body = await req.json();
    const validated = updateTreatmentPlanSchema.parse({ id: params.id, ...body });
    const plan = await treatmentService.updateTreatmentPlan(params.id, authReq.user.hospitalId, validated);

    return NextResponse.json({ success: true, message: "Treatment plan updated", data: plan });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update" },
      { status: 400 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authReq = withAuth(req);
    if (!authReq.user) return createUnauthorizedError();

    if (!checkPermission(authReq, "PROCEDURE_PERFORM")) return createPermissionError("PROCEDURE_PERFORM");

    await treatmentService.deleteTreatmentPlan(params.id, authReq.user.hospitalId);
    return NextResponse.json({ success: true, message: "Treatment plan deleted" });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to delete" },
      { status: 400 }
    );
  }
}
