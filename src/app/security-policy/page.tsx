import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ShieldCheck, Calendar } from "lucide-react";
import styles from "../policy.module.css";

export const metadata: Metadata = {
  title: "Security Policy | AiHospitalERP",
  description:
    "Learn how AiHospitalERP protects healthcare data with enterprise-grade encryption, access controls, and compliance practices.",
};

export default function SecurityPolicyPage() {
  return (
    <>
      <Navbar />
      <main className={styles.page}>
        {/* Hero */}
        <section className={styles.hero}>
          <div className="container">
            <div className={styles.heroInner}>
              <div className={styles.heroBadge}>
                <ShieldCheck size={16} />
                Security Policy
              </div>
              <h1 className={styles.heroTitle}>Security Policy</h1>
              <p className={styles.heroSubtitle}>
                Protecting sensitive healthcare data is at the core of AiHospitalERP. This policy
                outlines the technical and organizational measures we use to keep your data safe.
              </p>
              <div className={styles.lastUpdated}>
                <Calendar size={14} />
                Last updated: July 3, 2026
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className={styles.content}>
          <div className="container">
            <div className={styles.contentInner}>
              {/* Table of Contents */}
              <div className={styles.toc}>
                <h3 className={styles.tocTitle}>Table of Contents</h3>
                <ul className={styles.tocList}>
                  <li className={styles.tocItem}><a href="#commitment" className={styles.tocLink}>Our Commitment</a></li>
                  <li className={styles.tocItem}><a href="#encryption" className={styles.tocLink}>Data Encryption</a></li>
                  <li className={styles.tocItem}><a href="#access-control" className={styles.tocLink}>Access Control</a></li>
                  <li className={styles.tocItem}><a href="#infrastructure" className={styles.tocLink}>Infrastructure Security</a></li>
                  <li className={styles.tocItem}><a href="#compliance" className={styles.tocLink}>Compliance</a></li>
                  <li className={styles.tocItem}><a href="#monitoring" className={styles.tocLink}>Monitoring &amp; Auditing</a></li>
                  <li className={styles.tocItem}><a href="#incident" className={styles.tocLink}>Incident Response</a></li>
                  <li className={styles.tocItem}><a href="#reporting" className={styles.tocLink}>Reporting a Vulnerability</a></li>
                  <li className={styles.tocItem}><a href="#contact" className={styles.tocLink}>Contact Us</a></li>
                </ul>
              </div>

              {/* 1. Our Commitment */}
              <div id="commitment" className={styles.section}>
                <h2 className={styles.sectionTitle}>1. Our Commitment</h2>
                <p className={styles.sectionText}>
                  AiHospitalERP handles some of the most sensitive information that exists: patient
                  health records. We treat security as a foundational responsibility and apply
                  defense-in-depth practices across our people, processes, and technology.
                </p>
              </div>

              {/* 2. Data Encryption */}
              <div id="encryption" className={styles.section}>
                <h2 className={styles.sectionTitle}>2. Data Encryption</h2>
                <ul className={styles.list}>
                  <li className={styles.listItem}>All data at rest is encrypted using AES-256 encryption.</li>
                  <li className={styles.listItem}>All data in transit is protected using TLS 1.2 or higher.</li>
                  <li className={styles.listItem}>Encryption keys are managed securely and rotated on a regular basis.</li>
                </ul>
              </div>

              {/* 3. Access Control */}
              <div id="access-control" className={styles.section}>
                <h2 className={styles.sectionTitle}>3. Access Control</h2>
                <ul className={styles.list}>
                  <li className={styles.listItem}>Role-based access control (RBAC) ensures users only see the data they are authorized to access.</li>
                  <li className={styles.listItem}>Strict tenant isolation keeps each hospital&apos;s data logically separated.</li>
                  <li className={styles.listItem}>Passwords are hashed, and multi-factor authentication is supported for privileged accounts.</li>
                  <li className={styles.listItem}>Internal access to production systems follows the principle of least privilege.</li>
                </ul>
              </div>

              {/* 4. Infrastructure Security */}
              <div id="infrastructure" className={styles.section}>
                <h2 className={styles.sectionTitle}>4. Infrastructure Security</h2>
                <ul className={styles.list}>
                  <li className={styles.listItem}>Our platform is hosted on reputable cloud providers with certified, physically secure data centers.</li>
                  <li className={styles.listItem}>Firewalls, network segmentation, and security groups restrict unauthorized traffic.</li>
                  <li className={styles.listItem}>Automated backups are performed regularly and stored securely to support disaster recovery.</li>
                  <li className={styles.listItem}>Systems are patched and updated to address known vulnerabilities.</li>
                </ul>
              </div>

              {/* 5. Compliance */}
              <div id="compliance" className={styles.section}>
                <h2 className={styles.sectionTitle}>5. Compliance</h2>
                <p className={styles.sectionText}>
                  We align our practices with recognized healthcare and data protection standards.
                  We execute Business Associate Agreements (BAAs) with eligible healthcare entities
                  to support HIPAA compliance, and we follow applicable data protection regulations.
                </p>
              </div>

              {/* 6. Monitoring & Auditing */}
              <div id="monitoring" className={styles.section}>
                <h2 className={styles.sectionTitle}>6. Monitoring &amp; Auditing</h2>
                <ul className={styles.list}>
                  <li className={styles.listItem}>Systems are continuously monitored for suspicious activity and anomalies.</li>
                  <li className={styles.listItem}>Audit logs record access to sensitive data for accountability and traceability.</li>
                  <li className={styles.listItem}>We conduct regular security reviews and third-party penetration testing.</li>
                </ul>
              </div>

              {/* 7. Incident Response */}
              <div id="incident" className={styles.section}>
                <h2 className={styles.sectionTitle}>7. Incident Response</h2>
                <p className={styles.sectionText}>
                  We maintain an incident response plan to detect, contain, and remediate security
                  events. In the event of a data breach affecting your data, we will notify affected
                  clients promptly and in accordance with applicable law.
                </p>
              </div>

              {/* 8. Reporting a Vulnerability */}
              <div id="reporting" className={styles.section}>
                <h2 className={styles.sectionTitle}>8. Reporting a Vulnerability</h2>
                <p className={styles.sectionText}>
                  We welcome responsible disclosure from the security community. If you believe you
                  have found a security vulnerability, please report it to us privately so we can
                  investigate and address it.
                </p>
                <div className={styles.callout}>
                  <p className={styles.calloutText}>
                    Please do not publicly disclose a vulnerability until we have had a reasonable
                    opportunity to resolve it. Email details to{" "}
                    <a href="mailto:aihospitalerp@gmail.com" className={styles.contactLink}>aihospitalerp@gmail.com</a>.
                  </p>
                </div>
              </div>

              {/* 9. Contact Us */}
              <div id="contact" className={styles.section}>
                <h2 className={styles.sectionTitle}>9. Contact Us</h2>
                <p className={styles.sectionText}>
                  For security-related questions or to request our security documentation, contact us:
                </p>
                <ul className={styles.list}>
                  <li className={styles.listItem}><strong>Email:</strong>{" "}
                    <a href="mailto:aihospitalerp@gmail.com" className={styles.contactLink}>aihospitalerp@gmail.com</a>
                  </li>
                  <li className={styles.listItem}><strong>Phone:</strong> +91 9168 08 1355</li>
                  <li className={styles.listItem}>
                    <strong>Address:</strong> Pune, Maharashtra, India
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
