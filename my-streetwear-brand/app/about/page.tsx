"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const values = [
  {
    title: "Authenticity",
    description: "Every piece tells a story rooted in African heritage and global street culture.",
  },
  {
    title: "Quality",
    description: "Premium materials and meticulous craftsmanship in every garment.",
  },
  {
    title: "Community",
    description: "Building a global movement of culture definers, one piece at a time.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black pt-24 pb-16 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h1
            className="text-white uppercase font-bold tracking-tight mb-6"
            style={{
              fontFamily: "var(--font-heading), sans-serif",
              fontSize: "clamp(2.5rem, 8vw, 5rem)",
            }}
          >
            About BOMA
          </h1>
          <p className="text-white/60 text-xl max-w-2xl mx-auto leading-relaxed">
            From Accra to the world. We don&apos;t follow trends — we define the culture.
          </p>
        </motion.div>

        {/* Brand Story */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-20"
        >
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-[4/5] overflow-hidden">
              <img
                src="/lookbook/Konu_pixels - ALL RIGHTS RESERVED-BOMA 2025_1.jpg"
                alt="BOMA Brand Story"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
            <div className="space-y-6">
              <h2
                className="text-white uppercase font-bold tracking-tight"
                style={{
                  fontFamily: "var(--font-heading), sans-serif",
                  fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
                }}
              >
                Our Story
              </h2>
              <div className="space-y-4 text-white/70 text-lg leading-relaxed">
                <p>
                  BOMA was born in the vibrant streets of Accra, Ghana — a city where 
                  tradition meets innovation, where the old world collides with the new.
                </p>
                <p>
                  Founded in 2023, we set out with a simple mission: to create streetwear 
                  that speaks to the soul of African youth while resonating with culture 
                  definers worldwide.
                </p>
                <p>
                  Every piece we create is a statement. A declaration that style knows no 
                  borders, that culture is universal, and that the future of fashion is 
                  being written right here, right now.
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Mission Statement */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-20 text-center py-16 border-y border-white/10"
        >
          <p className="text-white/50 uppercase tracking-widest text-sm mb-4">
            Our Mission
          </p>
          <blockquote
            className="text-white font-bold tracking-tight max-w-3xl mx-auto"
            style={{
              fontFamily: "var(--font-heading), sans-serif",
              fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
            }}
          >
            &ldquo;To empower the next generation of culture definers through bold, 
            authentic streetwear that bridges African heritage with global street culture.&rdquo;
          </blockquote>
        </motion.section>

        {/* Values */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-20"
        >
          <h2
            className="text-white uppercase font-bold tracking-tight text-center mb-12"
            style={{
              fontFamily: "var(--font-heading), sans-serif",
              fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
            }}
          >
            Our Values
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                className="text-center p-8 border border-white/10 hover:border-white/30 transition-colors"
              >
                <h3
                  className="text-white uppercase font-bold tracking-tight mb-4"
                  style={{ fontFamily: "var(--font-heading), sans-serif" }}
                >
                  {value.title}
                </h3>
                <p className="text-white/60 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* CTA */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center"
        >
          <h2
            className="text-white uppercase font-bold tracking-tight mb-6"
            style={{
              fontFamily: "var(--font-heading), sans-serif",
              fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
            }}
          >
            Join the Movement
          </h2>
          <p className="text-white/60 text-lg mb-8 max-w-xl mx-auto">
            Be part of a community that&apos;s redefining what streetwear means.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/shop"
              className="inline-block px-10 py-4 bg-white text-black uppercase text-sm font-bold tracking-widest hover:bg-transparent hover:text-white border-2 border-white transition-all duration-300"
            >
              Shop Now
            </Link>
            <Link
              href="/"
              className="inline-block px-10 py-4 bg-transparent text-white uppercase text-sm font-bold tracking-widest hover:bg-white hover:text-black border-2 border-white transition-all duration-300"
            >
              Back to Home
            </Link>
          </div>
        </motion.section>
      </div>
    </main>
  );
}
