"use client";

import { motion } from "framer-motion";

const marqueeText = "WORLDWIDE SHIPPING • ACCRA TO THE WORLD • NEW DROP FRIDAY •";

export default function Marquee() {
  return (
    <section className="bg-black py-6 overflow-hidden border-y border-white/10">
      <div className="relative flex">
        {/* Duplicate content for seamless loop */}
        <motion.div
          className="flex whitespace-nowrap"
          animate={{
            x: ["0%", "-50%"],
          }}
          transition={{
            x: {
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            },
          }}
        >
          {/* First copy */}
          <span
            className="text-white uppercase font-medium tracking-wider px-4"
            style={{
              fontFamily: "var(--font-heading), sans-serif",
              fontSize: "1.5rem",
            }}
          >
            {marqueeText}
          </span>
          {/* Second copy for seamless loop */}
          <span
            className="text-white uppercase font-medium tracking-wider px-4"
            style={{
              fontFamily: "var(--font-heading), sans-serif",
              fontSize: "1.5rem",
            }}
          >
            {marqueeText}
          </span>
          {/* Third copy for extra coverage */}
          <span
            className="text-white uppercase font-medium tracking-wider px-4"
            style={{
              fontFamily: "var(--font-heading), sans-serif",
              fontSize: "1.5rem",
            }}
          >
            {marqueeText}
          </span>
          {/* Fourth copy for wider screens */}
          <span
            className="text-white uppercase font-medium tracking-wider px-4"
            style={{
              fontFamily: "var(--font-heading), sans-serif",
              fontSize: "1.5rem",
            }}
          >
            {marqueeText}
          </span>
        </motion.div>
      </div>
    </section>
  );
}
