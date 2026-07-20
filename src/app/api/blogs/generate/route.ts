import { NextRequest } from "next/server";
import { requireHospitalAdmin } from "../../../../../backend/middlewares/role.middleware";
import { requirePlanFeature } from "../../../../../backend/middlewares/plan-gate.middleware";
import { successResponse, errorResponse } from "../../../../../backend/utils/response";
import { aiGenerateSchema } from "../../../../../backend/validations/blog.validation";
import { generateBlogWithAI } from "../../../../../backend/services/blog.service";

// POST /api/blogs/generate — AI-generate blog content
export async function POST(req: NextRequest) {
  const auth = await requireHospitalAdmin(req);
  if (auth.error) return auth.error;
  const planError = await requirePlanFeature(auth.hospitalId, "BLOG_CMS", auth.user.role);
  if (planError) return planError;

  try {
    const body = await req.json();
    const parsed = aiGenerateSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse("Validation error", 400, parsed.error.flatten().fieldErrors);
    }

    const generated = await generateBlogWithAI(
      parsed.data.topic,
      parsed.data.tone,
      parsed.data.length
    );

    return successResponse(generated, "Blog content generated successfully");
  } catch (e: any) {
    return errorResponse(e.message || "Failed to generate blog content", 500);
  }
}
