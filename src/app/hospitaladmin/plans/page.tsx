"use client";

import { useEffect, useState } from "react";
import { Check, X, Sparkles, Clock, ShieldCheck, Phone, Mail } from "lucide-react";
import { PLANS, PLAN_ENUM_TO_KEY, PlanKey } from "@/lib/plans";

interface HospitalInfo {
  subscriptionPlan?: string | null;
  subscriptionStatus?: string | null;
  billingCycle?: string | null;
  trialEndDate?: string | null;
  subscriptionEndDate?: string | null;
}

const STATUS_META: Record<string, { label: string; color: string; bg: string }> = {
  TRIAL: { label: "Free Trial", color: "#0E898F", bg: "#E6F4F4" },
  ACTIVE: { label: "Active", color: "#059669", bg: "#ECFDF5" },
  EXPIRED: { label: "Expired", color: "#DC2626", bg: "#FEF2F2" },
  SUSPENDED: { label: "Suspended", color: "#D97706", bg: "#FFF7ED" },
  CANCELLED: { label: "Cancelled", color: "#64748B", bg: "#F1F5F9" },
};

function formatDate(d?: string | null) {
  if (!d) return null;
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function PlansPage() {
  const [hospital, setHospital] = useState<HospitalInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setHospital(d.data?.hospital || null);
      })
      .finally(() => setLoading(false));
  }, []);

  const currentPlanKey: PlanKey | undefined = hospital?.subscriptionPlan
    ? PLAN_ENUM_TO_KEY[hospital.subscriptionPlan]
    : undefined;
  const status = hospital?.subscriptionStatus || "TRIAL";
  const statusMeta = STATUS_META[status] || STATUS_META.TRIAL;
  const renewalDate = status === "TRIAL" ? formatDate(hospital?.trialEndDate) : formatDate(hospital?.subscriptionEndDate);

  return (
    <>
      <style>{`
        .pl-wrap { max-width: 1100px; }
        .pl-head { display: flex; align-items: flex-start; justify-content: space-between; flex-wrap: wrap; gap: 16px; margin-bottom: 24px; }
        .pl-title { font-size: 20px; font-weight: 800; color: #1e293b; letter-spacing: -0.02em; margin-bottom: 4px; }
        .pl-sub { font-size: 12.5px; color: #64748b; }
        .pl-status-card { display: flex; align-items: center; gap: 12px; background: #fff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 14px 18px; min-width: 260px; }
        .pl-status-icon { width: 38px; height: 38px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .pl-status-badge { display: inline-flex; align-items: center; gap: 5px; font-size: 10.5px; font-weight: 700; padding: 3px 9px; border-radius: 100px; text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 3px; }
        .pl-status-plan { font-size: 14px; font-weight: 700; color: #1e293b; }
        .pl-status-meta { font-size: 11px; color: #94a3b8; margin-top: 1px; }

        .pl-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
        @media (max-width: 900px) { .pl-grid { grid-template-columns: 1fr; } }
        .pl-card { position: relative; background: #fff; border: 1.5px solid #e2e8f0; border-radius: 18px; padding: 24px 22px; display: flex; flex-direction: column; transition: all 0.2s; }
        .pl-card.current { border-color: #0E898F; box-shadow: 0 0 0 3px rgba(14,137,143,0.1); }
        .pl-badge { position: absolute; top: -11px; right: 20px; background: linear-gradient(135deg, #7C3AED, #6D28D9); color: #fff; font-size: 10px; font-weight: 700; padding: 4px 12px; border-radius: 100px; }
        .pl-current-tag { position: absolute; top: -11px; left: 20px; background: #0E898F; color: #fff; font-size: 10px; font-weight: 700; padding: 4px 12px; border-radius: 100px; display: flex; align-items: center; gap: 4px; }
        .pl-name { font-size: 16px; font-weight: 800; color: #1e293b; margin-bottom: 4px; margin-top: 6px; }
        .pl-desc { font-size: 11.5px; color: #94a3b8; margin-bottom: 14px; line-height: 1.5; min-height: 32px; }
        .pl-price { font-size: 28px; font-weight: 800; color: #1e293b; }
        .pl-price span { font-size: 13px; font-weight: 600; color: #94a3b8; }
        .pl-price-note { font-size: 11px; color: #94a3b8; margin-bottom: 16px; }
        .pl-features { list-style: none; padding: 0; margin: 0 0 20px; display: flex; flex-direction: column; gap: 9px; flex: 1; }
        .pl-feature { display: flex; align-items: flex-start; gap: 8px; font-size: 12.5px; color: #334155; line-height: 1.4; }
        .pl-feature svg { flex-shrink: 0; margin-top: 1px; color: #10B981; }
        .pl-cta { width: 100%; padding: 11px; border-radius: 10px; font-size: 13px; font-weight: 700; border: none; cursor: pointer; transition: all 0.15s; font-family: inherit; }
        .pl-cta.primary { background: linear-gradient(135deg, #0E898F, #07595D); color: #fff; box-shadow: 0 4px 14px rgba(14,137,143,0.25); }
        .pl-cta.primary:hover { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(14,137,143,0.35); }
        .pl-cta.current { background: #f1f5f9; color: #64748b; cursor: default; }

        .pl-support { display: flex; align-items: center; gap: 20px; flex-wrap: wrap; background: #F8FAFC; border: 1px solid #e2e8f0; border-radius: 14px; padding: 16px 20px; margin-top: 24px; }
        .pl-support-title { font-size: 12.5px; font-weight: 700; color: #1e293b; margin-bottom: 2px; }
        .pl-support-sub { font-size: 11.5px; color: #64748b; }
        .pl-support-links { display: flex; gap: 14px; margin-left: auto; }
        .pl-support-link { display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 600; color: #0E898F; text-decoration: none; }
      `}</style>

      <div className="hd-center">
      <div className="pl-wrap">
        <div className="pl-head">
          <div>
            <h1 className="pl-title">Subscription Plans</h1>
            <p className="pl-sub">Manage your subscription and explore available plans for your hospital.</p>
          </div>

          {!loading && (
            <div className="pl-status-card">
              <div className="pl-status-icon" style={{ background: statusMeta.bg }}>
                <Sparkles size={18} color={statusMeta.color} />
              </div>
              <div>
                <span className="pl-status-badge" style={{ background: statusMeta.bg, color: statusMeta.color }}>
                  {statusMeta.label}
                </span>
                <div className="pl-status-plan">
                  {currentPlanKey ? PLANS.find((p) => p.key === currentPlanKey)?.name : "No Plan"} Plan
                </div>
                {renewalDate && (
                  <div className="pl-status-meta">
                    <Clock size={11} style={{ verticalAlign: -1, marginRight: 3 }} />
                    {status === "TRIAL" ? "Trial ends" : "Renews / ends"} {renewalDate}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="pl-grid">
          {PLANS.map((plan) => {
            const isCurrent = currentPlanKey === plan.key;
            return (
              <div key={plan.key} className={`pl-card${isCurrent ? " current" : ""}`}>
                {plan.badge && !isCurrent && <div className="pl-badge">{plan.badge}</div>}
                {isCurrent && (
                  <div className="pl-current-tag">
                    <ShieldCheck size={12} /> Current Plan
                  </div>
                )}
                <div className="pl-name">{plan.name}</div>
                <p className="pl-desc">{plan.desc}</p>
                <div className="pl-price">₹{plan.monthlyPrice}<span>/mo</span></div>
                <div className="pl-price-note">Billed monthly · cancel anytime</div>

                <ul className="pl-features">
                  {plan.features.map((f) => (
                    <li key={f.label} className="pl-feature">
                      {f.included ? <Check size={14} /> : <X size={14} color="#CBD5E1" />}
                      {f.label}
                    </li>
                  ))}
                </ul>

                {isCurrent ? (
                  <button className="pl-cta current" disabled>Your Current Plan</button>
                ) : (
                  <button
                    className="pl-cta primary"
                    onClick={() => window.open("mailto:aihospitalerp@gmail.com?subject=Plan Change Request", "_blank")}
                  >
                    Switch to {plan.name}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <div className="pl-support">
          <div>
            <div className="pl-support-title">Need to upgrade, downgrade, or have billing questions?</div>
            <div className="pl-support-sub">Our team will help you switch plans without any downtime.</div>
          </div>
          <div className="pl-support-links">
            <a href="mailto:aihospitalerp@gmail.com" className="pl-support-link"><Mail size={14} /> aihospitalerp@gmail.com</a>
            <a href="tel:+919168081355" className="pl-support-link"><Phone size={14} /> +91 9168 08 1355</a>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
