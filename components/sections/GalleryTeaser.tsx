"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/Button";

const GALLERY_IMAGES = [
  { src: "/images/hero-1.jpg", alt: "Hotel front view", span: "col-span-2 row-span-2" },
  { src: "/images/hero-3.jpg", alt: "Serene environment", span: "" },
  { src: "/images/hero-4.jpg", alt: "Bar & Lounge", span: "" },
  { src: "/images/hero-5.jpg", alt: "Spacious car park", span: "col-span-2" },
  { src: "/images/hero-2.png", alt: "Hotel lobby", span: "" },
];

export function GalleryTeaser() {
  return (
    <section className="py-24 px-4 md:px-8 bg-forest-black">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="font-cinzel text-[10px] tracking-[0.2em] text-gold-primary uppercase">Gallery</span>
          <h2 className="font-playfair text-4xl md:text-5xl text-cream mt-3 mb-4">A Glimpse Inside</h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 auto-rows-[180px] md:auto-rows-[200px]">
          {GALLERY_IMAGES.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={`relative rounded-xl overflow-hidden group cursor-pointer ${img.span}`}
            >
              <Image unoptimized={true} src={img.src} alt={img.alt} fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width:768px) 50vw, 25vw" />
              <div className="absolute inset-0 bg-gold-primary/0 group-hover:bg-gold-primary/20 transition-colors duration-300 flex items-center justify-center">
                <span className="text-white text-2xl opacity-0 group-hover:opacity-100 transition-opacity">🔍</span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Button href="/gallery" variant="ghost" size="md">View Full Gallery →</Button>
        </div>
      </div>
    </section>
  );
}
