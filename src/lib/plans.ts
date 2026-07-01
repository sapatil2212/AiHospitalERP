// ─────────────────────────────────────────────────────────────────────────────
// SHARED SUBSCRIPTION PLAN DEFINITIONS
// Used by: landing page pricing section, signup plan selector, and the
// hospitaladmin "Plans" dashboard page. Keep this as the single source of
// truth so pricing/features never drift between pages.
// ─────────────────────────────────────────────────────────────────────────────

export type PlanKey = "starter" | "pro" | "enterprise";

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
