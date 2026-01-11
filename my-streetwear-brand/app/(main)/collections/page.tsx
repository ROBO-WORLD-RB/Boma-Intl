"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const collections = [
  {
    id: 1,
    name: "BOMA 2025",
    description: "The flagship collection. Bold statements for the culture definers.",
    image: "/lookbook/Konu_pixels - ALL RIGHTS RESERVED-BOMA 2025_1.jpg",
    itemCount: 24,
  },
  {
    id: 2,
    name: "Essentials",
    description: "Timeless basics with premium quality. The foundation of every wardrobe.",
    image: "/lookbook/Konu_pixels - ALL RIGHTS RESERVED-BOMA 2025_3.jpg",
    itemCount: 18,
  },
  {
    id: 3,
    name: "Accra Nights",
    description: "Inspired by the vibrant nightlife of Ghana's capital city.",
    image: "/lookbook/Konu_pixels - ALL RIGHTS RESERVED-BOMA 2025_4.jpg",
    itemCount: 12,
  },
  {
    id: 4,
    name: "Street Culture",
    description: "Raw, unfiltered expression. For those who live the culture.",
    image: "/lookbook/Konu_pixels - ALL RIGHTS RESERVED-BOMA 2025_6.jpg",
    itemCount: 16,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

export default function CollectionsPage() {
  return (
    <main className="min-h-screen bg-black pt-24 pb-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1
            className="text-white uppercase font-bold tracking-tight mb-4"
            style={{
              fontFamily: "var(--font-heading), sans-serif",
              fontSize: "clamp(2.5rem, 8vw, 5rem)",
            }}
          >
            Collections
          </h1>
          <p className="text-white/60 text-lg max-w-xl mx-auto">
            Explore our curated collections, each telling a unique story.
          </p>
        </motion.div>

        {/* Collections Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {collections.map((collection, index) => (
            <motion.div
              key={collection.id}
              variants={itemVariants}
              className={`grid md:grid-cols-2 gap-8 items-center ${
                index % 2 === 1 ? "md:flex-row-reverse" : ""
              }`}
            >
              <div className={`${index % 2 === 1 ? "md:order-2" : ""}`}>
                <div className="relative overflow-hidden aspect-[4/3] group cursor-pointer">
                  <img
                    src={collection.image}
                    alt={collection.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-all duration-300" />
                </div>
              </div>
              <div className={`space-y-6 ${index % 2 === 1 ? "md:order-1" : ""}`}>
                <div>
                  <p className="text-white/50 text-sm uppercase tracking-widest mb-2">
                    {collection.itemCount} Items
                  </p>
                  <h2
                    className="text-white uppercase font-bold tracking-tight"
                    style={{
                      fontFamily: "var(--font-heading), sans-serif",
                      fontSize: "clamp(2rem, 5vw, 3.5rem)",
                    }}
                  >
                    {collection.name}
                  </h2>
                </div>
                <p className="text-white/70 text-lg leading-relaxed">
                  {collection.description}
                </p>
                <Link
                  href="/shop"
                  className="inline-block px-8 py-3 bg-white text-black uppercase text-sm font-bold tracking-widest hover:bg-transparent hover:text-white border-2 border-white transition-all duration-300"
                >
                  Explore Collection
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Back to Home */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-16"
        >
          <Link
            href="/"
            className="inline-block text-white/60 hover:text-white transition-colors uppercase text-sm tracking-widest"
          >
            ← Back to Home
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
