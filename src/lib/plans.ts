// ─────────────────────────────────────────────────────────────────────────────
// SHARED SUBSCRIPTION PLAN DEFINITIONS
// Used by: landing page pricing section, signup plan selector, the
// hospitaladmin "Plans" dashboard page, and the plan-gate middleware.
// Keep this as the single source of truth so pricing/features never drift.
// ─────────────────────────────────────────────────────────────────────────────

export type PlanKey = "starter" | "pro" | "enterprise";

// ── Feature keys used by the plan-gate middleware ──────────────────────────
export type FeatureKey =
  | "OPD_APPOINTMENTS"
  | "PATIENT_RECORDS"
  | "BASIC_BILLING"
  | "DEPARTMENT_CONFIG"
  | "SCHEDULE_BUILDER"
  | "STAFF_MANAGEMENT"
  | "ENQUIRY_MANAGEMENT"
  | "IPD_WARD"
  | "FOLLOWUP_SYSTEM"
  | "PHARMACY"
  | "INVENTORY_MANAGEMENT"
  | "LAB_PATHOLOGY"
  | "BILLING_QUEUE_FINANCE"
  | "AI_PRESCRIPTION"
  | "VOICE_PRESCRIPTION"
  | "TREATMENT_PLANS"
  | "NURSING"
  | "WHATSAPP_NOTIFICATIONS"
  | "REPORTS_ANALYTICS"
  | "DATA_EXPORT"
  | "MULTI_HOSPITAL"
  | "SUB_DEPARTMENT_DASHBOARDS"
  | "PARENT_DEPARTMENT_DASHBOARDS"
  | "AI_CHATBOT"
  | "BLOG_CMS";

// Maps the UI plan key to the Prisma `SubscriptionPlan` enum value
export const PLAN_KEY_TO_ENUM: Record<PlanKey, "STARTER" | "PROFESSIONAL" | "ENTERPRISE"> = {
  starter: "STARTER",
  pro: "PROFESSIONAL",
  enterprise: "ENTERPRISE",
};

export const PLAN_ENUM_TO_KEY: Record<string, PlanKey> = {
  STARTER: "starter",
  PROFESSIONAL: "pro",
  ENTERPRISE: "enterprise",
};

// ── Feature sets per plan tier ─────────────────────────────────────────────
const STARTER_FEATURES: Set<FeatureKey> = new Set([
  "OPD_APPOINTMENTS",
  "PATIENT_RECORDS",
  "BASIC_BILLING",
  "DEPARTMENT_CONFIG",
  "SCHEDULE_BUILDER",
  "STAFF_MANAGEMENT",
  "ENQUIRY_MANAGEMENT",
]);

const PRO_FEATURES: Set<FeatureKey> = new Set([
  ...STARTER_FEATURES,
  "IPD_WARD",
  "FOLLOWUP_SYSTEM",
  "PHARMACY",
  "INVENTORY_MANAGEMENT",
  "LAB_PATHOLOGY",
  "BILLING_QUEUE_FINANCE",
  "AI_PRESCRIPTION",
  "VOICE_PRESCRIPTION",
  "TREATMENT_PLANS",
  "NURSING",
  "WHATSAPP_NOTIFICATIONS",
  "REPORTS_ANALYTICS",
  "DATA_EXPORT",
]);

const ENTERPRISE_FEATURES: Set<FeatureKey> = new Set([
  ...PRO_FEATURES,
  "MULTI_HOSPITAL",
  "SUB_DEPARTMENT_DASHBOARDS",
  "PARENT_DEPARTMENT_DASHBOARDS",
  "AI_CHATBOT",
  "BLOG_CMS",
]);

/** Map from plan key to its allowed feature set */
export const PLAN_FEATURE_ACCESS: Record<PlanKey, Set<FeatureKey>> = {
  starter: STARTER_FEATURES,
  pro: PRO_FEATURES,
  enterprise: ENTERPRISE_FEATURES,
};

/** Human-readable feature names for error messages */
export const FEATURE_LABELS: Record<FeatureKey, string> = {
  OPD_APPOINTMENTS: "OPD & Appointments",
  PATIENT_RECORDS: "Patient Registration & Records",
  BASIC_BILLING: "Basic Billing & Invoicing",
  DEPARTMENT_CONFIG: "Department Configuration",
  SCHEDULE_BUILDER: "Doctor Schedule Builder",
  STAFF_MANAGEMENT: "Staff Management",
  ENQUIRY_MANAGEMENT: "Enquiry Management",
  IPD_WARD: "IPD & Ward Management",
  FOLLOWUP_SYSTEM: "Follow-up System",
  PHARMACY: "Pharmacy Counter Sales & Inventory",
  INVENTORY_MANAGEMENT: "Central & Department Inventory Management",
  LAB_PATHOLOGY: "Lab & Pathology Dashboard",
  BILLING_QUEUE_FINANCE: "Billing Queue & Finance Panel",
  AI_PRESCRIPTION: "AI Smart Prescription",
  VOICE_PRESCRIPTION: "Voice Prescription",
  TREATMENT_PLANS: "Treatment Plans & Clinical Notes",
  NURSING: "Nursing Dashboard",
  WHATSAPP_NOTIFICATIONS: "WhatsApp Notifications",
  REPORTS_ANALYTICS: "Reports & Analytics",
  DATA_EXPORT: "Data Export & Reports Download",
  MULTI_HOSPITAL: "Multi-Hospital Super Admin",
  SUB_DEPARTMENT_DASHBOARDS: "Sub-department Dashboards",
  PARENT_DEPARTMENT_DASHBOARDS: "Parent Department Dashboards",
  AI_CHATBOT: "AI Chatbot (Clinical Support)",
  BLOG_CMS: "Blog & Content Management",
};

/** Returns the minimum plan required for a feature */
export const getMinimumPlanForFeature = (feature: FeatureKey): PlanKey => {
  if (STARTER_FEATURES.has(feature)) return "starter";
  if (PRO_FEATURES.has(feature)) return "pro";
  return "enterprise";
};

export interface PlanFeature {
  label: string;
  included: boolean;
}

export interface Plan {
  key: PlanKey;
  name: string;
  monthlyPrice: number;
  desc: string;
  badge: string | null;
  tag: string;
  /** Max active doctors allowed on this plan. null = unlimited */
  doctorLimit: number | null;
  features: PlanFeature[];
  /** Set of backend feature keys this plan grants access to */
  featureAccess: Set<FeatureKey>;
}

export const PLANS: Plan[] = [
  {
    key: "starter",
    name: "Starter",
    monthlyPrice: 499,
    desc: "For small clinics & solo practitioners",
    badge: null,
    tag: "Get started free",
    doctorLimit: 3,
    featureAccess: STARTER_FEATURES,
    features: [
      { label: "Up to 3 Doctors", included: true },
      { label: "OPD & Appointments", included: true },
      { label: "Patient Registration & Records", included: true },
      { label: "Basic Billing & Invoicing", included: true },
      { label: "Department Configuration", included: true },
      { label: "Doctor Schedule Builder", included: true },
      { label: "Staff Management", included: true },
      { label: "Enquiry Management", included: true },
      { label: "Email Support", included: true },
    ],
  },
  {
    key: "pro",
    name: "Pro",
    monthlyPrice: 1299,
    desc: "For growing hospitals with full clinical operations",
    badge: "Most Popular",
    tag: "Most chosen",
    doctorLimit: 25,
    featureAccess: PRO_FEATURES,
    features: [
      { label: "Up to 25 Doctors", included: true },
      { label: "OPD + IPD + Ward Management", included: true },
      { label: "Appointment & Follow-up System", included: true },
      { label: "Pharmacy Counter Sales & Inventory", included: true },
      { label: "Lab & Pathology Dashboard", included: true },
      { label: "Billing Queue & Finance Panel", included: true },
      { label: "AI Smart Prescription", included: true },
      { label: "Voice Prescription", included: true },
      { label: "Treatment Plans & Clinical Notes", included: true },
      { label: "Nursing Dashboard", included: true },
      { label: "WhatsApp Widget & Notifications", included: true },
      { label: "Reports & Analytics", included: true },
    ],
  },
  {
    key: "enterprise",
    name: "Enterprise",
    monthlyPrice: 2999,
    desc: "For hospital networks, chains & multi-location care",
    badge: "Full Suite",
    tag: "Talk to us",
    doctorLimit: null,
    featureAccess: ENTERPRISE_FEATURES,
    features: [
      { label: "Unlimited Doctors & Staff", included: true },
      { label: "Multi-Hospital Super Admin", included: true },
      { label: "All Pro Features", included: true },
      { label: "Sub-department Dashboards", included: true },
      { label: "Ambulance / Biomedical / Housekeeping", included: true },
      { label: "Role-based Access (all roles)", included: true },
      { label: "AI Chatbot (Clinical Support)", included: true },
      { label: "Blog & Content Management", included: true },
      { label: "Medical Tourism Module", included: true },
      { label: "Receptionist & Nursing Admin Roles", included: true },
      { label: "Dedicated Account Manager", included: true },
      { label: "Priority SLA + 24/7 Phone Support", included: true },
    ],
  },
];

export const getPlanByKey = (key: string | null | undefined): Plan | undefined =>
  PLANS.find((p) => p.key === key);

export const getPlanByEnum = (planEnum: string | null | undefined): Plan | undefined => {
  if (!planEnum) return undefined;
  const key = PLAN_ENUM_TO_KEY[planEnum];
  return getPlanByKey(key);
};

/**
 * Check if a given subscription plan (Prisma enum value) has access to a feature.
 * Returns true if the feature is included, false otherwise.
 * If planEnum is null/undefined, defaults to Starter restrictions.
 */
export const planHasFeature = (planEnum: string | null | undefined, feature: FeatureKey): boolean => {
  const plan = getPlanByEnum(planEnum);
  if (!plan) return STARTER_FEATURES.has(feature); // default to Starter
  return plan.featureAccess.has(feature);
};
