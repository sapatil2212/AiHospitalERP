import type { Metadata } from "next";
import SaasNavbar from "@/components/SaasNavbar";
import SaasFooter from "@/components/SaasFooter";
import { Truck, Calendar } from "lucide-react";
import styles from "../policy.module.css";

export const metadata: Metadata = {
  title: "Shipping & Delivery Policy | AiHospitalERP",
  description:
    "How AiHospitalERP delivers and provisions its cloud-based Hospital Management SaaS platform to subscribed hospitals.",
};

export default function ShippingDeliveryPolicyPage() {
  return (
    <>
      <SaasNavbar />
      <main className={styles.page}>
        {/* Hero */}
        <section className={styles.hero} style={{ paddingTop: "120px" }}>
          <div className="container">
            <div className={styles.heroInner}>
              <div className={styles.heroBadge}>
                <Truck size={16} />
                Shipping &amp; Delivery Policy
              </div>
              <h1 className={styles.heroTitle}>Shipping &amp; Delivery Policy</h1>
              <p className={styles.heroSubtitle}>
                AiHospitalERP is a cloud-based SaaS product. This policy explains how our
                digital services are provisioned and delivered to your hospital.
              </p>
              <div className={styles.lastUpdated}>
                <Calendar size={14} />
                Last updated: July 3, 2026
              </div>
              <span className={styles.companyBadge}>A product of Brightwave Digital Products LLP.</span>
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
                  <li className={styles.tocItem}><a href="#nature" className={styles.tocLink}>Nature of Our Service</a></li>
                  <li className={styles.tocItem}><a href="#provisioning" className={styles.tocLink}>Account Provisioning</a></li>
                  <li className={styles.tocItem}><a href="#delivery-time" className={styles.tocLink}>Delivery Timeline</a></li>
                  <li className={styles.tocItem}><a href="#access" className={styles.tocLink}>Accessing the Platform</a></li>
                  <li className={styles.tocItem}><a href="#onboarding" className={styles.tocLink}>Onboarding &amp; Support</a></li>
                  <li className={styles.tocItem}><a href="#no-physical" className={styles.tocLink}>No Physical Shipment</a></li>
                  <li className={styles.tocItem}><a href="#contact" className={styles.tocLink}>Contact Us</a></li>
                </ul>
              </div>

              {/* 1. Nature of Our Service */}
              <div id="nature" className={styles.section}>
                <h2 className={styles.sectionTitle}>1. Nature of Our Service</h2>
                <p className={styles.sectionText}>
                  AiHospitalERP is a fully cloud-hosted Hospital Management Software delivered as a
                  Software-as-a-Service (SaaS). There are no physical goods to ship. All services are
                  delivered electronically over the internet.
                </p>
              </div>

              {/* 2. Account Provisioning */}
              <div id="provisioning" className={styles.section}>
                <h2 className={styles.sectionTitle}>2. Account Provisioning</h2>
                <ul className={styles.list}>
                  <li className={styles.listItem}>Once you sign up and your subscription is confirmed, a dedicated multi-tenant workspace is provisioned for your hospital.</li>
                  <li className={styles.listItem}>Login credentials and an activation link are sent to the registered administrator email.</li>
                  <li className={styles.listItem}>Your free 14-day trial workspace is activated immediately upon successful signup.</li>
                </ul>
              </div>

              {/* 3. Delivery Timeline */}
              <div id="delivery-time" className={styles.section}>
                <h2 className={styles.sectionTitle}>3. Delivery Timeline</h2>
                <ul className={styles.list}>
                  <li className={styles.listItem}><strong>Trial &amp; standard plans:</strong> Access is granted instantly, typically within a few minutes of successful registration.</li>
                  <li className={styles.listItem}><strong>Enterprise plans:</strong> Provisioning of custom configurations, data migration, and integrations may take 3 to 10 business days depending on scope.</li>
                  <li className={styles.listItem}>If activation is delayed, please check your spam folder or contact support.</li>
                </ul>
              </div>

              {/* 4. Accessing the Platform */}
              <div id="access" className={styles.section}>
                <h2 className={styles.sectionTitle}>4. Accessing the Platform</h2>
                <p className={styles.sectionText}>
                  The platform is accessible from any modern web browser at your assigned URL. No
                  installation, CD, or hardware is required. A stable internet connection is
                  recommended for the best experience.
                </p>
              </div>

              {/* 5. Onboarding & Support */}
              <div id="onboarding" className={styles.section}>
                <h2 className={styles.sectionTitle}>5. Onboarding &amp; Support</h2>
                <ul className={styles.list}>
                  <li className={styles.listItem}>Self-serve documentation and guided setup are available inside your dashboard.</li>
                  <li className={styles.listItem}>Enterprise customers receive dedicated onboarding assistance and training sessions.</li>
                  <li className={styles.listItem}>Our support team is available to help you configure departments, staff, and modules.</li>
                </ul>
              </div>

              {/* 6. No Physical Shipment */}
              <div id="no-physical" className={styles.section}>
                <h2 className={styles.sectionTitle}>6. No Physical Shipment</h2>
                <div className={styles.callout}>
                  <p className={styles.calloutText}>
                    As AiHospitalERP is a digital SaaS product, no physical products are shipped and
                    no shipping charges apply. All deliverables are provided electronically.
                  </p>
                </div>
              </div>

              {/* 7. Contact Us */}
              <div id="contact" className={styles.section}>
                <h2 className={styles.sectionTitle}>7. Contact Us</h2>
                <p className={styles.sectionText}>
                  For questions about account provisioning or platform access, please contact us:
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
      <SaasFooter />
    </>
  );
}
