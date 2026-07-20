import { NextResponse } from "next/server";
import prisma from "../config/db";
import {
  FeatureKey,
  planHasFeature,
  getMinimumPlanForFeature,
  FEATURE_LABELS,
  getPlanByEnum,
} from "@/lib/plans";

// ─────────────────────────────────────────────────────────────────────────────
// PLAN-GATE MIDDLEWARE
// Enforces feature access based on the hospital's subscription plan.
// Call this at the top of any API route handler that needs to be restricted.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Check if a hospital's subscription plan includes a given feature.
 *
 * @param hospitalId - The hospital UUID (from auth middleware)
 * @param feature    - The feature key to check
 * @returns `null` if the feature is allowed, or a `NextResponse` 403 error
 *
 * Bypass rules:
 * - Hospitals on TRIAL status get access to ALL features (full demo experience)
 * - SUPER_ADMIN role is not checked here (handle at route level via `userRole` param)
 */
export async function requirePlanFeature(
  hospitalId: string,
  feature: FeatureKey,
  userRole?: string
): Promise<NextResponse | null> {
  try {
    // Super Admins bypass plan restrictions
    if (userRole === "SUPER_ADMIN") {
      return null;
    }

    const hospital = await prisma.hospital.findUnique({
      where: { id: hospitalId },
      select: {
        subscriptionStatus: true,
        subscriptionPlan: true,
      },
    });

    if (!hospital) {
      return NextResponse.json(
        {
          success: false,
          message: "Hospital not found",
          error: "HOSPITAL_NOT_FOUND",
        },
        { status: 404 }
      );
    }

    // Trial users get full access to all features
    if (hospital.subscriptionStatus === "TRIAL") {
      return null; // allow
    }

    // Check feature access based on subscription plan
    const planEnum = hospital.subscriptionPlan as string | null;
    if (planHasFeature(planEnum, feature)) {
      return null; // allowed
    }

    // Feature is NOT included in the current plan — block with upgrade message
    const featureLabel = FEATURE_LABELS[feature];
    const minimumPlan = getMinimumPlanForFeature(feature);
    const currentPlan = getPlanByEnum(planEnum);
    const currentPlanName = currentPlan?.name || "Starter";

    // Determine which plan to suggest upgrading to
    const upgradePlanName = minimumPlan === "pro" ? "Pro" : "Enterprise";

    return NextResponse.json(
      {
        success: false,
        message: `${featureLabel} is not available on your ${currentPlanName} plan. Please upgrade to the ${upgradePlanName} plan to access this feature.`,
        error: "PLAN_FEATURE_RESTRICTED",
        data: {
          feature,
          featureLabel,
          currentPlan: currentPlanName,
          requiredPlan: upgradePlanName,
          requiredPlanKey: minimumPlan,
        },
      },
      { status: 403 }
    );
  } catch (error) {
    console.error("Plan gate middleware error:", error);
    // On error, allow the request to proceed (fail-open) rather than
    // blocking legitimate users due to a DB hiccup.
    return null;
  }
}
