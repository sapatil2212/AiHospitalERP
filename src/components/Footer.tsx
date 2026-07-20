"use client";

import Link from "next/link";
import { MapPin, Phone, Mail, ArrowRight } from "lucide-react";
import styles from "./Footer.module.css";

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

export default function Footer() {
  return (
    <footer id="contact" className={styles.footer}>
      {/* Footer Content */}
      <div className={`container ${styles.footerContent} ${styles.footerNoNewsletter}`}>
        {/* Brand Column */}
        <div className={styles.footerCol}>
          <Link href="/" className={styles.footerLogo} style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
            <img src="/logo/aihospitalerp-logo.png" alt="PrimeInbox" style={{ height: 40, width: "auto", objectFit: "contain" }} />
          </Link>
          <p className={styles.footerAbout}>
            Smarter healthcare connecting doctors and patients. The multi-tenant HMS SaaS platform
            for modern healthcare providers.
          </p>
        </div>

        {/* Company Links */}
        <div className={styles.footerCol}>
          <h4 className={styles.colTitle}>Company</h4>
          <ul className={styles.linkList}>
            {companyLinks.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className={styles.footerLink}>
                  <ArrowRight size={14} />
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Features */}
        <div className={styles.footerCol}>
          <h4 className={styles.colTitle}>Features</h4>
          <ul className={styles.linkList}>
            {featureLinks.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className={styles.footerLink}>
                  <ArrowRight size={14} />
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div className={styles.footerCol}>
          <h4 className={styles.colTitle}>Contact</h4>
          <div className={styles.contactList}>
            <a href="tel:+919168081355" className={styles.contactItem} style={{ textDecoration: "none", color: "inherit" }}>
              <Phone size={18} className={styles.contactIcon} />
              <span>+91 9168 08 1355</span>
            </a>
            <a href="mailto:aihospitalerp@gmail.com" className={styles.contactItem} style={{ textDecoration: "none", color: "inherit" }}>
              <Mail size={18} className={styles.contactIcon} />
              <span>aihospitalerp@gmail.com</span>
            </a>
            <div className={styles.contactItem}>
              <MapPin size={18} className={styles.contactIcon} />
              <span>Pune, Maharashtra, India</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className={styles.bottomBar}>
        <div className={`container ${styles.bottomInner}`} style={{ justifyContent: "center" }}>
          <p className={styles.copyright} style={{ textAlign: "center" }}>
            Copyright © {new Date().getFullYear()} PrimeInbox All rights reserved. | A product of <span style={{ color: "inherit", fontWeight: 600 }}>Brightwave Digital Products LLP</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
