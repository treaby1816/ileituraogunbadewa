"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";

const HERO_IMAGES = [
  { src: "/images/hero-1.jpg", alt: "Ilé Ìtura Ògúnbádéwà front view" },
  { src: "/images/hero-2.png", alt: "Hotel lobby and reception" },
  { src: "/images/hero-3.jpg", alt: "Serene environment aerial view" },
  { src: "/images/hero-4.jpg", alt: "Bar and Lounge area" },
  { src: "/images/hero-5.jpg", alt: "Spacious car park" },
  { src: "/images/hall-1.jpg", alt: "Elegant Event Hall" },
];

export function HeroSection() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % HERO_IMAGES.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section className="relative w-full h-[85svh] md:h-[100svh] min-h-[540px] md:min-h-[640px] flex flex-col items-center justify-center overflow-hidden">
      {/* Background carousel images */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <Image
            src={HERO_IMAGES[current].src}
            alt={HERO_IMAGES[current].alt}
            fill
            priority={current === 0}
            className="object-cover object-[center_30%] md:object-center animate-kenburns"
            sizes="100vw"
          />
        </motion.div>
      </AnimatePresence>

      {/* Dark overlay - always dark to ensure text contrast over photos */}
      <div className="absolute inset-0 bg-linear-to-b from-[#070E07]/80 via-[#0D1A0D]/70 to-[#070E07]/90" />
      {/* Gold vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(13,26,13,0.7) 100%)",
        }}
      />

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Eyebrow label */}
        <motion.p
          initial={{ opacity: 0, letterSpacing: "0.5em" }}
          animate={{ opacity: 1, letterSpacing: "0.2em" }}
          transition={{ duration: 1, delay: 0.2 }}
          className="font-cinzel text-[10px] text-gold-primary tracking-[0.2em] uppercase mb-6"
        >
          Ikorodu · Lagos State · Nigeria
        </motion.p>

        {/* Main title — staggered word reveal */}
        <h1 className="font-playfair text-5xl sm:text-6xl md:text-7xl text-[#F8F4E8] leading-tight mb-6">
          {["Ilé", "Ìtura", "Ògúnbádéwà"].map((word, i) => (
            <motion.span
              key={word}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                delay: 0.5 + i * 0.18,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="inline-block mr-4 last:mr-0"
            >
              {word}
            </motion.span>
          ))}
        </h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="font-cormorant italic text-xl md:text-2xl text-[#F8F4E8]/70 mb-10"
        >
          …Embrace Comfort, Enjoy Luxury
        </motion.p>

        {/* Gold divider line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="w-16 h-[1px] bg-gold-primary mx-auto mb-10"
        />

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button href="/booking" variant="primary" size="lg">
            Book Your Stay
          </Button>
          <Button href="/rooms" variant="ghost" size="lg">
            Explore Rooms
          </Button>
        </motion.div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {HERO_IMAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
              i === current
                ? "bg-gold-primary w-6"
                : "bg-cream/30 hover:bg-cream/50"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="font-cinzel text-[9px] tracking-[0.15em] text-gold-primary/50 uppercase">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-[1px] h-8 bg-linear-to-b from-gold-primary/50 to-transparent"
        />
      </motion.div>
    </section>
  );
}
