"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import Image from "next/image";

// ============================================
// HERO SLIDESHOW IMAGES & TEXT
// ============================================
// Add your images to: public/hero-slides/
// Name them: slide-1.jpg, slide-2.jpg, slide-3.jpg, etc.
// Update the arrays below with matching content:
const heroImages = [
  "/hero-slides/slide-1.jpg",
  "/hero-slides/slide-2.jpg",
  "/hero-slides/slide-3.jpg",
  "/hero-slides/slide-4.jpg",
  // Add more slides as needed
];

const heroTexts = [
  "Culture Has No Borders",
  "Voice Of The Streets",
  "Accra To The World",
  "Define The Culture",
  // Add more text to match images
];

// Slideshow timing (in milliseconds)
const SLIDE_DURATION = 5000; // 5 seconds per slide

// ============================================

// Slideshow image animation
const slideVariants: Variants = {
  enter: {
    opacity: 0,
    scale: 1.05,
  },
  center: {
    opacity: 1,
    scale: 1,
    transition: {
      opacity: { duration: 0.4 },
      scale: { duration: 4, ease: "linear" },
    },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.4 },
  },
};

// Text transition animation
const textVariants: Variants = {
  enter: {
    opacity: 0,
    y: 20,
  },
  center: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.4,
    },
  },
};

// Minimum swipe distance to trigger slide change (in pixels)
const SWIPE_THRESHOLD = 50;

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Navigate to next slide
  const goToNextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % heroImages.length);
  }, []);

  // Navigate to previous slide
  const goToPrevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  }, []);

  // Handle touch start
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = null;
  }, []);

  // Handle touch move
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  }, []);

  // Handle touch end - determine swipe direction
  const handleTouchEnd = useCallback(() => {
    if (touchStartX.current === null || touchEndX.current === null) {
      return;
    }

    const swipeDistance = touchStartX.current - touchEndX.current;

    if (Math.abs(swipeDistance) >= SWIPE_THRESHOLD) {
      if (swipeDistance > 0) {
        // Swiped left - go to next slide
        goToNextSlide();
      } else {
        // Swiped right - go to previous slide
        goToPrevSlide();
      }
    }

    // Reset touch positions
    touchStartX.current = null;
    touchEndX.current = null;
  }, [goToNextSlide, goToPrevSlide]);

  // Auto-advance slideshow
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, SLIDE_DURATION);

    return () => clearInterval(timer);
  }, []);

  return (
    <section 
      className="relative h-screen w-full bg-black flex items-center justify-center overflow-hidden touch-pan-y"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Slideshow */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="sync">
          <motion.div
            key={currentSlide}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0"
          >
            <Image
              src={heroImages[currentSlide]}
              alt={`Hero slide ${currentSlide + 1}`}
              fill
              priority={currentSlide === 0}
              sizes="100vw"
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/50 z-10" />

      {/* Slide indicators - with 44x44px touch targets */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-1">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label={`Go to slide ${index + 1}`}
          >
            <span
              className={`block h-2 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "bg-white w-8"
                  : "bg-white/40 hover:bg-white/60 w-2"
              }`}
            />
          </button>
        ))}
      </div>

      {/* Content container */}
      <div className="relative z-20 text-center px-6">
        {/* Animated Headline */}
        <AnimatePresence mode="wait">
          <motion.h1
            key={currentSlide}
            className="text-white uppercase font-bold tracking-tight leading-none"
            style={{
              fontFamily: "var(--font-heading), sans-serif",
              fontSize: "clamp(2.5rem, 8vw, 6rem)",
            }}
            variants={textVariants}
            initial="enter"
            animate="center"
            exit="exit"
          >
            {heroTexts[currentSlide]}
            <br />
            <span className="text-white/80">BOMA 2025</span>
          </motion.h1>
        </AnimatePresence>

        {/* CTA Button with delayed animation */}
        <motion.div
          className="mt-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <a
            href="/shop"
            className="inline-block px-12 py-4 bg-white text-black uppercase text-sm font-bold tracking-widest hover:bg-transparent hover:text-white border-2 border-white transition-all duration-300"
          >
            Shop Now
          </a>
        </motion.div>
      </div>
    </section>
  );
}
