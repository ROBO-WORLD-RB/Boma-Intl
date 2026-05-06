"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  const lastUpdated = "April 29, 2025";

  const sections = [
    {
      title: "1. Introduction",
      content: "BOMA (\"we\", \"our\", \"us\") is committed to protecting your personal information. This Privacy Policy explains what data we collect, how we use it, and your rights regarding that data when you use the BOMA mobile application. By using the App, you consent to the practices described in this policy.",
    },
    {
      title: "2. Data We Collect",
      subsections: [
        {
          subtitle: "Account Information",
          text: "When you create an account, we collect your name, email address, and password (stored securely via Firebase Authentication).",
        },
        {
          subtitle: "Order Information",
          text: "When you place an order, we collect your delivery address, selected items, payment method, and transaction reference. Payment card details are processed by Paystack and are never stored by BOMA.",
        },
        {
          subtitle: "Device and Usage Data",
          text: "We may collect device identifiers, app usage statistics, and push notification tokens (via OneSignal) to improve your experience and deliver relevant notifications.",
        },
        {
          subtitle: "Communications",
          text: "If you contact us via email, we retain that correspondence to resolve your query and improve our service.",
        },
      ],
    },
    {
      title: "3. How We Use Your Data",
      content: "We use the information we collect to:",
      list: [
        "Process and fulfil your orders",
        "Send order confirmations, shipping updates, and delivery notifications",
        "Send promotional notifications about new drops, promo codes, and offers (only if you have not opted out)",
        "Improve the performance, security, and features of the App",
        "Detect and prevent fraud or misuse of the platform",
        "Comply with legal obligations under Ghanaian law",
      ],
    },
    {
      title: "4. Data Storage and Security",
      content: "Your data is stored securely in Google Firebase (Firestore and Firebase Authentication), hosted on Google Cloud infrastructure. We implement industry-standard security measures including encrypted connections, access controls, and regular security reviews.\n\nNo method of transmission or storage is 100% secure. While we strive to protect your data, we cannot guarantee absolute security.",
    },
    {
      title: "5. Sharing Your Data",
      content: "We do not sell your personal data to third parties. We may share your data with:",
      list: [
        "Paystack — to process payments securely",
        "OneSignal — to deliver push notifications",
        "Delivery partners — solely to fulfil your order (name and delivery address only)",
        "Law enforcement or regulatory bodies — if required by Ghanaian law",
      ],
      footer: "All third-party partners are contractually required to handle your data in accordance with applicable privacy laws.",
    },
    {
      title: "6. Push Notifications",
      content: "The BOMA App uses OneSignal to send push notifications. We tag your device with your user role (customer or admin) to send relevant notifications. You can opt out of push notifications at any time through your device settings.",
    },
    {
      title: "7. Your Rights",
      content: "Under applicable Ghanaian data protection principles, you have the right to:",
      list: [
        "Access the personal data we hold about you",
        "Request correction of inaccurate or incomplete data",
        "Request deletion of your account and associated data",
        "Withdraw consent to marketing communications at any time",
      ],
      footer: "To exercise any of these rights, contact us at hello@bomadrops.com. We will respond within 30 days.",
    },
    {
      title: "8. Data Retention",
      content: "We retain your account and order data for as long as your account is active, or as required by law. If you request deletion of your account, we will remove your personal data within 30 days, except where retention is required for legal or financial compliance purposes.",
    },
    {
      title: "9. Children's Privacy",
      content: "The BOMA App is not intended for users under the age of 18. We do not knowingly collect personal data from minors. If we become aware that a user under 18 has registered, we will delete their account and associated data promptly.",
    },
    {
      title: "10. Changes to This Policy",
      content: "We may update this Privacy Policy from time to time to reflect changes in our practices or applicable law. We will notify you of material changes via the App or email. Your continued use of the App after updates take effect constitutes your acceptance of the revised policy.",
    },
    {
      title: "11. Contact Us",
      content: "If you have any questions, concerns, or requests regarding this Privacy Policy, please reach out to us:",
      footer: "BOMA · Accra, Ghana · hello@bomadrops.com",
    },
  ];

  return (
    <main className="min-h-screen bg-black pt-24 pb-16 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 border-b border-white/10 pb-8"
        >
          <h1
            className="text-white uppercase font-bold tracking-tight mb-4"
            style={{
              fontFamily: "var(--font-heading), sans-serif",
              fontSize: "clamp(2rem, 6vw, 4rem)",
            }}
          >
            Privacy Policy
          </h1>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="text-white/50 uppercase tracking-widest text-sm">
              BOMA · Last updated: {lastUpdated}
            </p>
            <Link
              href="/"
              className="text-white/70 hover:text-white text-sm uppercase tracking-widest flex items-center gap-2 transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Home
            </Link>
          </div>
        </motion.div>

        <div className="space-y-12">
          {sections.map((section, index) => (
            <motion.section
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.05 }}
              className="space-y-4"
            >
              <h2
                className="text-white uppercase font-bold tracking-tight text-xl"
                style={{ fontFamily: "var(--font-heading), sans-serif" }}
              >
                {section.title}
              </h2>
              
              {section.content && (
                <p className="text-white/70 leading-relaxed whitespace-pre-wrap">
                  {section.content}
                </p>
              )}

              {section.subsections && (
                <div className="space-y-6 pl-4 border-l border-white/10">
                  {section.subsections.map((sub) => (
                    <div key={sub.subtitle} className="space-y-1">
                      <h3 className="text-white font-semibold text-lg">
                        {sub.subtitle}
                      </h3>
                      <p className="text-white/60 leading-relaxed">
                        {sub.text}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {section.list && (
                <ul className="list-disc list-outside ml-6 space-y-2 text-white/70">
                  {section.list.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              )}

              {section.footer && (
                <p className="text-white/70 leading-relaxed pt-2">
                  {section.footer}
                </p>
              )}
            </motion.section>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="mt-20 pt-8 border-t border-white/10 text-center"
        >
          <p className="text-white/40 text-sm">
            © 2026 BOMA. All rights reserved.
          </p>
        </motion.div>
      </div>
    </main>
  );
}
