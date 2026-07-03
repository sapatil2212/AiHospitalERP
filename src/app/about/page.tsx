"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles, CalendarClock, Users, CreditCard, Pill, BedDouble,
  Brain, BarChart3, ShieldCheck, Rocket, Stethoscope, HeartHandshake,
  Check, ArrowRight,
} from "lucide-react";
import SaasNavbar from "@/components/SaasNavbar";
import SaasFooter from "@/components/SaasFooter";
import styles from "./about.module.css";

const stats = [
  { num: "500+", label: "Departments running" },
  { num: "50K+", label: "Patients managed" },
  { num: "99.9%", label: "Platform uptime" },
  { num: "24/7", label: "Support & monitoring" },
];

const modules = [
  { icon: <CalendarClock size={22} />, title: "Appointment Scheduling", desc: "Smart OPD/IPD scheduling with doctor availability, tokens, and automated reminders." },
  { icon: <Users size={22} />, title: "Patient Management", desc: "Unified patient records, history, documents, and visit tracking in one place." },
  { icon: <CreditCard size={22} />, title: "Billing & Revenue", desc: "Invoicing, payments, and real-time revenue tracking across every department." },
  { icon: <Pill size={22} />, title: "Pharmacy & Inventory", desc: "Stock, batches, and dispensing managed with low-stock alerts and audits." },
  { icon: <BedDouble size={22} />, title: "IPD & Wards", desc: "Admissions, bed allocation, clinical notes, and discharge summaries." },
  { icon: <Brain size={22} />, title: "AI Prescriptions", desc: "Assisted, voice-ready prescriptions that save doctors time and reduce errors." },
  { icon: <BarChart3 size={22} />, title: "Analytics Dashboard", desc: "Live operational and financial insights for confident decision-making." },
  { icon: <Stethoscope size={22} />, title: "Doctor Portal", desc: "A focused workspace for consultations, follow-ups, and patient care." },
  { icon: <ShieldCheck size={22} />, title: "Multi-Tenant & Secure", desc: "Isolated, encrypted workspaces with role-based access for every hospital." },
];

const values = [
  { icon: <ShieldCheck size={20} />, bg: "#7c3aed", title: "Security first", desc: "Encryption, tenant isolation, and access controls protect sensitive health data." },
  { icon: <Rocket size={20} />, bg: "#0891b2", title: "Built for scale", desc: "From a single clinic to multi-branch hospital groups, without re-platforming." },
  { icon: <Stethoscope size={20} />, bg: "#16a34a", title: "Doctor-friendly", desc: "Designed with clinicians so daily workflows feel fast and natural." },
  { icon: <HeartHandshake size={20} />, bg: "#dc2626", title: "Partner mindset", desc: "Hands-on onboarding and support so your team is productive from day one." },
];

const missionPoints = [
  "One platform for OPD, IPD, billing, pharmacy, and analytics",
  "AI that assists clinicians instead of adding busywork",
  "Enterprise-grade security with HIPAA-aligned practices",
  "Fast onboarding with a 14-day free trial, no credit card",
];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5 },
};

export default function AboutPage() {
  return (
    <>
      <SaasNavbar />
      <main className={styles.page}>
        <div className={styles.wrap}>
          {/* Hero */}
          <motion.section className={styles.hero} {...fadeUp}>
            <span className={styles.badge}><Sparkles size={15} /> About AiHospitalERP</span>
            <h1 className={styles.heroTitle}>
              The operating system for <span>modern hospitals</span>
            </h1>
            <p className={styles.heroSubtitle}>
              AiHospitalERP is a multi-tenant hospital management SaaS platform that connects doctors
              and patients. We help healthcare providers run appointments, records, billing, pharmacy,
              and analytics from one secure, intelligent system.
            </p>
          </motion.section>

          {/* Stats */}
          <motion.section className={styles.stats} {...fadeUp}>
            {stats.map((s) => (
              <div key={s.label} className={styles.statCard}>
                <div className={styles.statNum}>{s.num}</div>
                <div className={styles.statLabel}>{s.label}</div>
              </div>
            ))}
          </motion.section>

          {/* Mission */}
          <motion.section className={styles.section} {...fadeUp}>
            <div className={styles.missionGrid}>
              <div>
                <div className={styles.kicker}>Our Mission</div>
                <h2 className={styles.sectionTitle}>Smarter healthcare, connected everywhere</h2>
                <p className={styles.sectionText}>
                  Hospitals still lose hours every day to fragmented software, paperwork, and
                  disconnected tools. We started AiHospitalERP to change that — to give healthcare
                  teams a single, reliable platform that handles the operational heavy lifting so
                  they can focus on patients.
                </p>
                <p className={styles.sectionText}>
                  From a single clinic to a multi-branch hospital group, our goal is the same:
                  make world-class hospital management accessible, affordable, and effortless.
                </p>
              </div>
              <div className={styles.missionCard}>
                <div className={styles.missionCardTitle}>What we believe in</div>
                {missionPoints.map((p) => (
                  <div key={p} className={styles.missionPoint}>
                    <span className={styles.missionPointIcon}><Check size={15} /></span>
                    <span className={styles.missionPointText}>{p}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* Platform modules */}
          <section className={styles.section}>
            <motion.div className={styles.sectionHeader} {...fadeUp}>
              <div className={styles.kicker}>The Platform</div>
              <h2 className={styles.sectionTitle}>Everything a hospital needs, in one place</h2>
            </motion.div>
            <div className={styles.modulesGrid}>
              {modules.map((m, i) => (
                <motion.div
                  key={m.title}
                  className={styles.moduleCard}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.4, delay: (i % 3) * 0.08 }}
                >
                  <div className={styles.moduleIcon}>{m.icon}</div>
                  <h3 className={styles.moduleTitle}>{m.title}</h3>
                  <p className={styles.moduleDesc}>{m.desc}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Values */}
          <section className={styles.valuesSection}>
            <motion.div className={styles.sectionHeader} {...fadeUp}>
              <div className={styles.kicker}>Our Values</div>
              <h2 className={styles.sectionTitle}>What guides how we build</h2>
            </motion.div>
            <div className={styles.valuesGrid}>
              {values.map((v, i) => (
                <motion.div
                  key={v.title}
                  className={styles.valueCard}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                >
                  <div className={styles.valueIcon} style={{ background: v.bg }}>{v.icon}</div>
                  <h3 className={styles.valueTitle}>{v.title}</h3>
                  <p className={styles.valueDesc}>{v.desc}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <motion.section className={styles.cta} {...fadeUp}>
            <h2 className={styles.ctaTitle}>See AiHospitalERP in action</h2>
            <p className={styles.ctaText}>
              Book a personalized demo or start your free 14-day trial — no credit card required.
            </p>
            <div className={styles.ctaBtns}>
              <Link href="/contact" className={styles.btnPrimary}>Book a Demo <ArrowRight size={17} /></Link>
              <Link href="/signup" className={styles.btnGhost}>Start Free Trial</Link>
            </div>
          </motion.section>
        </div>
      </main>
      <SaasFooter />
    </>
  );
}
