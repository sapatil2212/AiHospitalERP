"use client";

import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";
import { usePathname } from "next/navigation";
import styles from "./Footer.module.css";

const companyLinks = [
  { label: "Company", href: "/about" },
  { label: "Pricing", href: "/#pricing" },
  { label: "Contact", href: "/contact" },
];

const featureLinks = [
  { label: "Appointment Scheduling", href: "/#features" },
  { label: "Patient Management", href: "/#features" },
  { label: "Revenue Tracking", href: "/#features" },
  { label: "Doctor Portal", href: "/#features" },
  { label: "Analytics Dashboard", href: "/#features" },
  { label: "Multi-Clinic Support", href: "/#features" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms", href: "/terms-of-service" },
  { label: "Refund Policy", href: "/refund-policy" },
];

const quickLinks = [
  { label: "Contact Us", href: "/contact" },
];

const socialLinks = [
  { icon: <Facebook size={18} />, label: "Facebook", href: "#" },
  { icon: <Twitter size={18} />, label: "Twitter", href: "#" },
  { icon: <Instagram size={18} />, label: "Instagram", href: "#" },
  { icon: <Linkedin size={18} />, label: "LinkedIn", href: "#" },
];

export default function Footer() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <footer id="contact" className={styles.footer}>
      {/* Footer Content */}
      <div className={`container ${styles.footerContent} ${!isHomePage ? styles.footerNoNewsletter : ""}`}>
        {/* About Column */}
        <div className={styles.footerCol}>
          <Link href="/" className={styles.footerLogo} style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
            <img src="/logo/aihospitalerp-logo.png" alt="AiHospitalERP" style={{ height: 40, width: "auto", objectFit: "contain" }} />
          </Link>
          <h5 className={styles.footerTagline}>Smarter Healthcare Platform</h5>
          <p className={styles.footerAbout}>
            Our comprehensive clinic management platform with revenue tracking capabilities for healthcare operations.
          </p>
          <div className={styles.socialLinks}>
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                className={styles.socialLink}
                aria-label={social.label}
              >
                {social.icon}
              </a>
            ))}
          </div>
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

        {/* Legal Links */}
        <div className={styles.footerCol}>
          <h4 className={styles.colTitle}>Legal</h4>
          <ul className={styles.linkList}>
            {legalLinks.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className={styles.footerLink}>
                  <ArrowRight size={14} />
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Us */}
        <div className={styles.footerCol}>
          <h4 className={styles.colTitle}>Contact Us</h4>
          <ul className={styles.linkList}>
            {quickLinks.map((link) => (
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
          <h4 className={styles.colTitle}>Get In Touch</h4>
          <div className={styles.contactList}>
            <div className={styles.contactItem}>
              <Mail size={18} className={styles.contactIcon} />
              <span>bookmytime1355@gmail.com</span>
            </div>
            <div className={styles.contactItem}>
              <Phone size={18} className={styles.contactIcon} />
              <span>+91 9168 08 1355</span>
            </div>
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
            © {new Date().getFullYear()} BookMyTime Systems Inc. All rights reserved. | A product of <a href="https://brightwavedigital.com/" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>Brightwave Digital Products</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
