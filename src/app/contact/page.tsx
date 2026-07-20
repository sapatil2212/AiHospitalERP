"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Sparkles, Send, Loader2, Building2, User, Mail, Phone,
  MapPin, CalendarDays, Clock, Check, ShieldCheck,
} from "lucide-react";
import SaasNavbar from "@/components/SaasNavbar";
import SaasFooter from "@/components/SaasFooter";
import styles from "./bookdemo.module.css";

const TIME_SLOTS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30", "18:00",
];

const formatSlot = (t: string) => {
  const [h, m] = t.split(":");
  const hour = parseInt(h, 10);
  return `${hour % 12 || 12}:${m} ${hour < 12 ? "AM" : "PM"}`;
};

const BENEFITS = [
  "A personalized walkthrough of the entire HMS platform",
  "AI prescriptions, OPD, IPD, billing & pharmacy in action",
  "Pricing & onboarding tailored to your hospital",
  "Zero obligation — cancel or reschedule anytime",
];

export default function BookDemoPage() {
  const todayStr = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    hospitalName: "", adminName: "", email: "", mobile: "",
    city: "", preferredDate: "", preferredTime: "", message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showModal, setShowModal] = useState(false);

  const set = (name: string, value: string) => setForm((p) => ({ ...p, [name]: value }));
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => set(e.target.name, e.target.value);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/demo-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setShowModal(true);
        setForm({
          hospitalName: "", adminName: "", email: "", mobile: "",
          city: "", preferredDate: "", preferredTime: "", message: "",
        });
      } else {
        setErrorMsg(data.message || "Failed to submit your request. Please try again.");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
    }
    setIsSubmitting(false);
  };

  return (
    <>
      <SaasNavbar />
      <main className={styles.page}>
        <div className={styles.wrap}>
          {/* Intro */}
          <motion.div
            className={styles.intro}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className={styles.badge}>
              <Sparkles size={15} /> Free Product Demo
            </span>
            <h1 className={styles.title}>
              See <span>AiHospitalERP</span> in action
            </h1>
            <p className={styles.subtitle}>
              Book a live, personalized demo with our team. Pick a date and time that suits you,
              and we&apos;ll show you exactly how to run your hospital smarter.
            </p>
            <span style={{ display: "block", marginTop: 16, fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "#94a3b8" }}>A product of Brightwave Digital Products LLP.</span>
          </motion.div>

          {/* Card */}
          <motion.div
            className={styles.card}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
          >
            {/* Brand aside */}
            <aside className={styles.aside}>
              <div className={styles.asideInner}>
                <div className={styles.asideKicker}>Why book a demo</div>
                <h2 className={styles.asideTitle}>Everything you need, shown live in 30 minutes</h2>
                <p className={styles.asideText}>
                  A product specialist will tailor the session to your workflows — from appointments
                  to analytics — so you can decide with confidence.
                </p>

                <div className={styles.benefits}>
                  {BENEFITS.map((b) => (
                    <div key={b} className={styles.benefit}>
                      <span className={styles.benefitIcon}><Check size={16} color="#fff" /></span>
                      <span className={styles.benefitText}>{b}</span>
                    </div>
                  ))}
                </div>

                <div className={styles.asideDivider} />

                <div className={styles.stats}>
                  <div>
                    <div className={styles.statNum}>500+</div>
                    <div className={styles.statLabel}>Departments run</div>
                  </div>
                  <div>
                    <div className={styles.statNum}>30 min</div>
                    <div className={styles.statLabel}>Avg. demo length</div>
                  </div>
                  <div>
                    <div className={styles.statNum}>14-day</div>
                    <div className={styles.statLabel}>Free trial after</div>
                  </div>
                </div>
              </div>
            </aside>

            {/* Form */}
            <section className={styles.formPanel}>
              <h3 className={styles.formHeading}>Tell us about you</h3>
              <p className={styles.formSub}>We&apos;ll confirm your slot over email within one business day.</p>

              {errorMsg && <div className={styles.alertError}>{errorMsg}</div>}

              <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.row}>
                  <div className={styles.field}>
                    <label htmlFor="hospitalName" className={styles.label}>Hospital / Clinic <span className={styles.req}>*</span></label>
                    <div className={styles.inputWrap}>
                      <input id="hospitalName" name="hospitalName" required value={form.hospitalName} onChange={handleChange} placeholder="City Medical Center" className={styles.input} />
                      <span className={styles.inputIcon}><Building2 size={16} /></span>
                    </div>
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="adminName" className={styles.label}>Your Name <span className={styles.req}>*</span></label>
                    <div className={styles.inputWrap}>
                      <input id="adminName" name="adminName" required value={form.adminName} onChange={handleChange} placeholder="Dr. Jane Doe" className={styles.input} />
                      <span className={styles.inputIcon}><User size={16} /></span>
                    </div>
                  </div>
                </div>

                <div className={styles.row}>
                  <div className={styles.field}>
                    <label htmlFor="email" className={styles.label}>Work Email <span className={styles.req}>*</span></label>
                    <div className={styles.inputWrap}>
                      <input type="email" id="email" name="email" required value={form.email} onChange={handleChange} placeholder="admin@hospital.com" className={styles.input} />
                      <span className={styles.inputIcon}><Mail size={16} /></span>
                    </div>
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="mobile" className={styles.label}>Mobile <span className={styles.req}>*</span></label>
                    <div className={styles.inputWrap}>
                      <input type="tel" id="mobile" name="mobile" required value={form.mobile} onChange={handleChange} placeholder="+91 98765 43210" className={styles.input} />
                      <span className={styles.inputIcon}><Phone size={16} /></span>
                    </div>
                  </div>
                </div>

                <div className={styles.row}>
                  <div className={styles.field}>
                    <label htmlFor="city" className={styles.label}>City</label>
                    <div className={styles.inputWrap}>
                      <input id="city" name="city" value={form.city} onChange={handleChange} placeholder="Pune" className={styles.input} />
                      <span className={styles.inputIcon}><MapPin size={16} /></span>
                    </div>
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="preferredDate" className={styles.label}>Preferred Date <span className={styles.req}>*</span></label>
                    <div className={styles.inputWrap}>
                      <input type="date" id="preferredDate" name="preferredDate" required min={todayStr} value={form.preferredDate} onChange={handleChange} className={styles.input} />
                      <span className={styles.inputIcon}><CalendarDays size={16} /></span>
                    </div>
                  </div>
                </div>

                <div className={styles.field}>
                  <label htmlFor="preferredTime" className={styles.label}>Preferred Time <span className={styles.req}>*</span></label>
                  <div className={styles.inputWrap}>
                    <select id="preferredTime" name="preferredTime" required value={form.preferredTime} onChange={handleChange} className={styles.select}>
                      <option value="">Select a time slot</option>
                      {TIME_SLOTS.map((t) => <option key={t} value={t}>{formatSlot(t)}</option>)}
                    </select>
                    <span className={styles.inputIcon}><Clock size={16} /></span>
                  </div>
                </div>

                <div className={styles.field}>
                  <label htmlFor="message" className={styles.label}>Anything specific you&apos;d like to see?</label>
                  <textarea id="message" name="message" value={form.message} onChange={handleChange} rows={3} placeholder="Hospital size, departments, or specific needs..." className={styles.textarea} />
                </div>

                <button type="submit" disabled={isSubmitting} className={styles.submitBtn}>
                  {isSubmitting ? (
                    <><Loader2 size={18} className={styles.spin} /> Submitting...</>
                  ) : (
                    <><Send size={17} /> Book My Demo</>
                  )}
                </button>

                <p className={styles.consent}>
                  <ShieldCheck size={13} style={{ verticalAlign: "-2px", marginRight: 4 }} />
                  Your details are safe with us. By submitting you agree to our{" "}
                  <a href="/privacy-policy">Privacy Policy</a>.
                </p>
              </form>
            </section>
          </motion.div>
        </div>
      </main>
      <SaasFooter />

      {/* Success Modal */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <motion.div
            className={styles.modalCard}
            initial={{ opacity: 0, scale: 0.8, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.tickCircle}>
              <svg viewBox="0 0 52 52" className={styles.tickSvg}>
                <circle className={styles.tickCircleBg} cx="26" cy="26" r="25" fill="none" />
                <path className={styles.tickCheck} fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
              </svg>
            </div>
            <h3 className={styles.modalTitle}>Demo Request Sent!</h3>
            <p className={styles.modalText}>
              Thanks for your interest. Our team will reach out shortly to confirm your demo slot.
            </p>
            <button className={styles.modalBtn} onClick={() => setShowModal(false)}>Done</button>
          </motion.div>
        </div>
      )}
    </>
  );
}
