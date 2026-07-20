import { NextRequest, NextResponse } from "next/server";
import { streamTranscription } from "@/../../backend/services/voice-prescription.service";
import { authMiddleware } from "@/../../backend/middlewares/auth.middleware";
import { requirePlanFeature } from "@/../../backend/middlewares/plan-gate.middleware";

export async function POST(req: NextRequest) {
  try {
    const authResult = await authMiddleware(req);
    if (authResult.error || !authResult.user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { role } = authResult.user;
    const planError = await requirePlanFeature(authResult.user.hospitalId || "", "VOICE_PRESCRIPTION", authResult.user.role);
    if (planError) return planError;

    if (role !== "DOCTOR") {
      return NextResponse.json({ success: false, message: "Only doctors can use voice prescription" }, { status: 403 });
    }

    const body = await req.json();
    const { audioChunk, patientName, doctorName, previousTranscript } = body;

    if (!audioChunk || !patientName || !doctorName) {
      return NextResponse.json(
        { success: false, message: "Audio chunk, patient name, and doctor name are required" },
        { status: 400 }
      );
    }

    const result = await streamTranscription(audioChunk, {
      patientName,
      doctorName,
      previousTranscript,
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error("Voice stream API error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to process audio stream" },
      { status: 500 }
    );
  }
}
