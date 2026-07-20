import {
  FeatureKey,
  PlanKey,
  planHasFeature,
  getMinimumPlanForFeature,
  FEATURE_LABELS,
  getPlanByEnum,
} from "@/lib/plans";

export interface PlanGateResult {
  hasAccess: boolean;
  featureLabel: string;
  minimumPlan: PlanKey;
  minimumPlanName: string;
}

/**
 * Helper function to check feature access client-side given a hospital's subscription plan enum
 * (e.g. from session, context, or user object).
 *
 * @param planEnum - Prisma `SubscriptionPlan` enum value ("STARTER", "PROFESSIONAL", "ENTERPRISE", or null)
 * @param status   - Prisma `SubscriptionStatus` enum value ("TRIAL", "ACTIVE", etc.)
 * @param feature  - FeatureKey to check
 */
export function checkPlanFeature(
  planEnum: string | null | undefined,
  status: string | null | undefined,
  feature: FeatureKey
): PlanGateResult {
  const isTrial = status === "TRIAL";
  const hasAccess = isTrial || planHasFeature(planEnum, feature);
  const minimumPlan = getMinimumPlanForFeature(feature);
  const minPlanObj = getPlanByEnum(
    minimumPlan === "starter" ? "STARTER" : minimumPlan === "pro" ? "PROFESSIONAL" : "ENTERPRISE"
  );

  return {
    hasAccess,
    featureLabel: FEATURE_LABELS[feature] || feature,
    minimumPlan,
    minimumPlanName: minPlanObj?.name || minimumPlan,
  };
}
