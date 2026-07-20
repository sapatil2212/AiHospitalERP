import { NextRequest, NextResponse } from "next/server";
import { processVoiceRecording } from "@/../../backend/services/voice-prescription.service";
import { authMiddleware } from "@/../../backend/middlewares/auth.middleware";
import { requirePlanFeature } from "@/../../backend/middlewares/plan-gate.middleware";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const authResult = await authMiddleware(req);
    if (authResult.error || !authResult.user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { hospitalId, role } = authResult.user;

    const planError = await requirePlanFeature(hospitalId || "", "VOICE_PRESCRIPTION", role);
    if (planError) return planError;

    if (role !== "DOCTOR" && role !== "HOSPITAL_ADMIN" && role !== "SUPER_ADMIN") {
      return NextResponse.json({ success: false, message: "Unauthorized role for voice prescription" }, { status: 403 });
    }

    const body = await req.json();
    const { prescriptionId, transcriptText, voiceRecordingUrl, language } = body;

    if (!prescriptionId || !transcriptText) {
      return NextResponse.json(
        { success: false, message: "Prescription ID and transcript text are required" },
        { status: 400 }
      );
    }

    let effectiveHospitalId = hospitalId;
    if (role === "SUPER_ADMIN" && !effectiveHospitalId) {
      const { default: prisma } = await import("@/../../backend/config/db");
      const rx = await (prisma as any).prescription.findUnique({
        where: { id: prescriptionId },
        select: { hospitalId: true },
      });
      if (rx) effectiveHospitalId = rx.hospitalId;
    }

    if (!effectiveHospitalId) {
      return NextResponse.json({ success: false, message: "Hospital ID not found" }, { status: 400 });
    }

    const result = await processVoiceRecording(
      prescriptionId,
      effectiveHospitalId,
      transcriptText,
      voiceRecordingUrl,
      language
    );

    return NextResponse.json({
      success: true,
      data: result,
      message: "Voice prescription processed successfully",
    });
  } catch (error: any) {
    console.error("Voice transcription API error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to process voice recording" },
      { status: 500 }
    );
  }
}
