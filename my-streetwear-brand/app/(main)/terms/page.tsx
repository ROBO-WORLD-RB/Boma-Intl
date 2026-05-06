"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function TermsAndConditionsPage() {
  const lastUpdated = "April 29, 2025";

  const sections = [
    {
      title: "1. Acceptance of Terms",
      content: "By downloading, accessing, or using the BOMA mobile application (\"App\"), you agree to be bound by these Terms and Conditions (\"Terms\"). If you do not agree to these Terms, you must not use the App. These Terms constitute a legally binding agreement between you and BOMA, a sole proprietorship registered in Accra, Ghana.",
    },
    {
      title: "2. Use of the App",
      content: "You must be at least 18 years old to create an account and place orders on the BOMA platform. By using the App, you represent and warrant that:",
      list: [
        "All information you provide during registration is accurate and up to date",
        "You will not use the App for any unlawful or unauthorised purpose",
        "You will not attempt to gain unauthorised access to any part of the App or its systems",
        "You will not reproduce, duplicate, or exploit any part of the App without our express written consent",
      ],
    },
    {
      title: "3. Account Registration",
      content: "To access certain features of the App, you must register for an account. You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account. You agree to notify BOMA immediately at hello@bomadrops.com if you suspect any unauthorised use of your account.",
    },
    {
      title: "4. Orders and Payments",
      content: "All orders placed through the BOMA App are subject to availability and acceptance. BOMA reserves the right to refuse or cancel any order at its discretion. Payment is processed securely through Paystack. By placing an order, you agree to pay the full amount indicated at checkout, including any applicable delivery fees.\n\nPrices displayed on the App are in Ghana Cedis (GHS) and are inclusive of applicable taxes unless otherwise stated. BOMA reserves the right to change prices at any time without prior notice.",
    },
    {
      title: "5. Delivery",
      content: "BOMA aims to dispatch orders within 2–5 business days. Delivery timelines are estimates and may vary based on location, demand, and circumstances beyond our control. Risk of loss and title for items purchased pass to you upon delivery.\n\nBOMA is not liable for delays caused by third-party logistics partners, adverse weather conditions, or events outside our reasonable control.",
    },
    {
      title: "6. Returns and Refunds",
      content: "We accept returns on items that are unworn, unwashed, and in their original condition with tags attached, within 7 days of delivery. Items purchased during sales or with promo codes are considered final sale unless the item is defective.\n\nTo initiate a return, contact us at hello@bomadrops.com with your order number and reason for return. Refunds will be processed to the original payment method within 5–10 business days of receiving the returned item.",
    },
    {
      title: "7. Intellectual Property",
      content: "All content on the BOMA App — including logos, product imagery, copy, and design — is the intellectual property of BOMA or its licensors. You may not reproduce, distribute, modify, or create derivative works without our prior written consent.",
    },
    {
      title: "8. Promo Codes and Discounts",
      content: "Promo codes are issued at BOMA's discretion and are subject to individual terms. Unless otherwise stated, promo codes are single-use, non-transferable, and cannot be combined with other offers. BOMA reserves the right to cancel or modify promo codes at any time.",
    },
    {
      title: "9. Limitation of Liability",
      content: "To the fullest extent permitted by law, BOMA shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the App, including but not limited to loss of data, loss of profits, or interruption of service.\n\nBOMA's total liability to you for any claim arising from these Terms shall not exceed the amount paid by you for the order giving rise to the claim.",
    },
    {
      title: "10. Governing Law",
      content: "These Terms are governed by and construed in accordance with the laws of the Republic of Ghana. Any disputes arising under or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts of Ghana.",
    },
    {
      title: "11. Changes to These Terms",
      content: "BOMA reserves the right to update these Terms at any time. We will notify users of significant changes through the App or via email. Your continued use of the App after changes take effect constitutes acceptance of the revised Terms.",
    },
    {
      title: "12. Contact",
      content: "If you have any questions about these Terms, please contact us:",
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
            Terms & Conditions
          </h1>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="text-white/50 uppercase tracking-widest text-sm">
              BOMA · Last updated: {lastUpdated}
            </p>
            <Link
              href="/"
              className="text-white/70 hover:text-white text-sm uppercase tracking-widest flex items-center_gap-2 transition-colors"
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
