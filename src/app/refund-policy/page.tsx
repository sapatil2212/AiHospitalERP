import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { RefreshCcw, Calendar } from "lucide-react";
import styles from "../policy.module.css";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy | AiHospitalERP",
  description:
    "Understand how subscription cancellations and refunds work for the AiHospitalERP Hospital Management SaaS platform.",
};

export default function RefundPolicyPage() {
  return (
    <>
      <Navbar />
      <main className={styles.page}>
        {/* Hero */}
        <section className={styles.hero}>
          <div className="container">
            <div className={styles.heroInner}>
              <div className={styles.heroBadge}>
                <RefreshCcw size={16} />
                Refund &amp; Cancellation Policy
              </div>
              <h1 className={styles.heroTitle}>Refund &amp; Cancellation Policy</h1>
              <p className={styles.heroSubtitle}>
                This policy explains how subscription cancellations, billing cycles, and
                refunds are handled for the AiHospitalERP SaaS platform.
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
                  <li className={styles.tocItem}><a href="#overview" className={styles.tocLink}>Overview</a></li>
                  <li className={styles.tocItem}><a href="#subscriptions" className={styles.tocLink}>Subscription Model</a></li>
                  <li className={styles.tocItem}><a href="#cancellation" className={styles.tocLink}>Cancellation</a></li>
                  <li className={styles.tocItem}><a href="#refunds" className={styles.tocLink}>Refund Eligibility</a></li>
                  <li className={styles.tocItem}><a href="#non-refundable" className={styles.tocLink}>Non-Refundable Items</a></li>
                  <li className={styles.tocItem}><a href="#process" className={styles.tocLink}>How to Request a Refund</a></li>
                  <li className={styles.tocItem}><a href="#timeline" className={styles.tocLink}>Refund Timeline</a></li>
                  <li className={styles.tocItem}><a href="#contact" className={styles.tocLink}>Contact Us</a></li>
                </ul>
              </div>

              {/* 1. Overview */}
              <div id="overview" className={styles.section}>
                <h2 className={styles.sectionTitle}>1. Overview</h2>
                <p className={styles.sectionText}>
                  AiHospitalERP is a subscription-based Software-as-a-Service (SaaS) platform.
                  This Refund &amp; Cancellation Policy applies to all paid subscriptions and
                  should be read together with our{" "}
                  <a href="/terms-of-service" className={styles.contactLink}>Terms of Service</a>.
                </p>
              </div>

              {/* 2. Subscription Model */}
              <div id="subscriptions" className={styles.section}>
                <h2 className={styles.sectionTitle}>2. Subscription Model</h2>
                <ul className={styles.list}>
                  <li className={styles.listItem}>Subscriptions are offered on recurring monthly or annual billing cycles.</li>
                  <li className={styles.listItem}>Your subscription renews automatically at the end of each billing cycle unless cancelled.</li>
                  <li className={styles.listItem}>A free 14-day trial is available so you can evaluate the platform before any charge.</li>
                </ul>
              </div>

              {/* 3. Cancellation */}
              <div id="cancellation" className={styles.section}>
                <h2 className={styles.sectionTitle}>3. Cancellation</h2>
                <ul className={styles.list}>
                  <li className={styles.listItem}>You may cancel your subscription at any time from your account dashboard or by contacting support.</li>
                  <li className={styles.listItem}>Upon cancellation, your account remains active until the end of the current paid billing period.</li>
                  <li className={styles.listItem}>After the billing period ends, your workspace is downgraded and access to paid features is disabled.</li>
                  <li className={styles.listItem}>You can export your data before your subscription lapses. See our Privacy Policy for data retention details.</li>
                </ul>
              </div>

              {/* 4. Refund Eligibility */}
              <div id="refunds" className={styles.section}>
                <h2 className={styles.sectionTitle}>4. Refund Eligibility</h2>
                <p className={styles.sectionText}>
                  Because subscription fees are billed in advance for the upcoming period, they are
                  generally non-refundable. However, we may issue a refund in the following cases:
                </p>
                <ul className={styles.list}>
                  <li className={styles.listItem}>A duplicate or accidental charge caused by a billing error on our side.</li>
                  <li className={styles.listItem}>A verified failure of core platform functionality that we are unable to resolve within a reasonable time.</li>
                  <li className={styles.listItem}>A refund request for a newly started annual plan made within 7 days of the initial charge, provided the platform was not substantially used.</li>
                </ul>
                <div className={styles.callout}>
                  <p className={styles.calloutText}>
                    Refunds, where approved, are prorated at our discretion and issued to the original
                    payment method used for the subscription.
                  </p>
                </div>
              </div>

              {/* 5. Non-Refundable Items */}
              <div id="non-refundable" className={styles.section}>
                <h2 className={styles.sectionTitle}>5. Non-Refundable Items</h2>
                <ul className={styles.list}>
                  <li className={styles.listItem}>Fees for billing periods that have already elapsed.</li>
                  <li className={styles.listItem}>One-time onboarding, data migration, training, or customization fees.</li>
                  <li className={styles.listItem}>Charges for add-ons or usage-based services already consumed.</li>
                  <li className={styles.listItem}>Renewals where cancellation was not made before the renewal date.</li>
                </ul>
              </div>

              {/* 6. How to Request a Refund */}
              <div id="process" className={styles.section}>
                <h2 className={styles.sectionTitle}>6. How to Request a Refund</h2>
                <p className={styles.sectionText}>
                  To request a refund, email our billing team with your account details, invoice
                  number, and the reason for the request:
                </p>
                <ul className={styles.list}>
                  <li className={styles.listItem}><strong>Email:</strong>{" "}
                    <a href="mailto:aihospitalerp@gmail.com" className={styles.contactLink}>aihospitalerp@gmail.com</a>
                  </li>
                  <li className={styles.listItem}>Include your registered hospital name and the email associated with the account.</li>
                  <li className={styles.listItem}>Our team will review your request and respond within 5 business days.</li>
                </ul>
              </div>

              {/* 7. Refund Timeline */}
              <div id="timeline" className={styles.section}>
                <h2 className={styles.sectionTitle}>7. Refund Timeline</h2>
                <p className={styles.sectionText}>
                  Once a refund is approved, it is processed to your original payment method. Depending
                  on your bank or payment provider, it may take 7 to 14 business days for the amount to
                  reflect in your account.
                </p>
              </div>

              {/* 8. Contact Us */}
              <div id="contact" className={styles.section}>
                <h2 className={styles.sectionTitle}>8. Contact Us</h2>
                <p className={styles.sectionText}>
                  For any questions about cancellations or refunds, please reach out to us:
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
