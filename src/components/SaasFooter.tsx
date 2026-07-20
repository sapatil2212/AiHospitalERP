"use client";

import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";

const PURPLE_LIGHT = "#A78BFA";
const DARK = "#0F172A";

const companyLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms-of-service" },
  { label: "Refund & Cancellation Policy", href: "/refund-policy" },
  { label: "Shipping & Delivery Policy", href: "/shipping-delivery-policy" },
  { label: "Contact Us", href: "/contact" },
  { label: "About Us", href: "/about" },
  { label: "Cookie Policy", href: "/cookie-policy" },
  { label: "Security Policy", href: "/security-policy" },
];

const featureLinks = [
  { label: "Appointment Scheduling", href: "/#features" },
  { label: "Patient Management", href: "/#features" },
  { label: "Revenue Tracking", href: "/#features" },
  { label: "Doctor Portal", href: "/#features" },
  { label: "Analytics Dashboard", href: "/#features" },
  { label: "Multi-Clinic Support", href: "/#features" },
];

/**
 * Marketing-site (SaaS) footer — Company links + Features + Contact.
 */
export default function SaasFooter() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .mn-footer { background: ${DARK}; padding: 72px 5% 32px; font-family: 'Inter', sans-serif; }
        .mn-footer-inner { max-width: 1200px; margin: 0 auto; }
        .mn-footer-top { display: grid; grid-template-columns: 1.6fr 1.3fr 1fr 1fr; gap: 40px; margin-bottom: 56px; }
        @media (max-width: 900px) { .mn-footer-top { grid-template-columns: 1fr 1fr; gap: 32px; } }
        @media (max-width: 500px) { .mn-footer-top { grid-template-columns: 1fr; } }
        .mn-footer-brand p { font-size: 14px; color: #64748B; line-height: 1.7; margin-top: 16px; max-width: 300px; }
        .mn-footer-col-title { font-size: 13px; font-weight: 700; color: #fff; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 20px; }
        .mn-footer-links { display: flex; flex-direction: column; gap: 12px; }
        .mn-footer-links a { font-size: 14px; color: #64748B; text-decoration: none; transition: color 0.2s; }
        .mn-footer-links a:hover { color: ${PURPLE_LIGHT}; }
        .mn-footer-contact { display: flex; flex-direction: column; gap: 14px; }
        .mn-footer-contact a, .mn-footer-contact-item { display: flex; align-items: flex-start; gap: 10px; font-size: 14px; color: #64748B; text-decoration: none; transition: color 0.2s; line-height: 1.4; }
        .mn-footer-contact a:hover { color: ${PURPLE_LIGHT}; }
        .mn-footer-contact svg { flex-shrink: 0; margin-top: 1px; color: ${PURPLE_LIGHT}; }
        .mn-footer-divider { height: 1px; background: rgba(255,255,255,0.07); margin-bottom: 32px; }
        .mn-footer-bottom { display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: 16px; }
        .mn-footer-copy { font-size: 13px; color: #475569; text-align: center; }
      ` }} />

      <footer className="mn-footer">
        <div className="mn-footer-inner">
          <div className="mn-footer-top">
            <div className="mn-footer-brand">
              <Link href="/" className="mn-logo">
                <img src="/logo/aihospitalerp-logo.png" alt="PrimeInbox" style={{ height: 36, width: "auto", objectFit: "contain" }} />
              </Link>
              <p>Smarter healthcare connecting doctors and patients. The multi-tenant HMS SaaS platform for modern healthcare providers.</p>
            </div>

            <div>
              <div className="mn-footer-col-title">Company</div>
              <div className="mn-footer-links">
                {companyLinks.map((link) => (
                  <Link key={link.label} href={link.href}>{link.label}</Link>
                ))}
              </div>
            </div>

            <div>
              <div className="mn-footer-col-title">Features</div>
              <div className="mn-footer-links">
                {featureLinks.map((link) => (
                  <Link key={link.label} href={link.href}>{link.label}</Link>
                ))}
              </div>
            </div>

            <div>
              <div className="mn-footer-col-title">Contact</div>
              <div className="mn-footer-contact">
                <a href="tel:+919168081355">
                  <Phone size={15} />
                  <span>+91 9168 08 1355</span>
                </a>
                <a href="mailto:aihospitalerp@gmail.com">
                  <Mail size={15} />
                  <span>aihospitalerp@gmail.com</span>
                </a>
                <div className="mn-footer-contact-item">
                  <MapPin size={15} />
                  <span>Pune, Maharashtra, India</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mn-footer-divider" />

          <div className="mn-footer-bottom">
            <p className="mn-footer-copy">Copyright © {new Date().getFullYear()} PrimeInbox All rights reserved. | A product of <span style={{ color: "#A78BFA", fontWeight: 600 }}>Brightwave Digital Products LLP</span></p>
          </div>
        </div>
      </footer>
    </>
  );
}
