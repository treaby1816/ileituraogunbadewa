"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import type { GalleryCategory } from "@/lib/types";

const IMAGES = [
  { src: "/images/hero-1.jpg", category: "exterior" as GalleryCategory, caption: "Hotel Front View" },
  { src: "/images/hero-2.png", category: "rooms" as GalleryCategory, caption: "Reception & Lobby" },
  { src: "/images/hero-3.jpg", category: "exterior" as GalleryCategory, caption: "Aerial Sunset View" },
  { src: "/images/hero-4.jpg", category: "bar" as GalleryCategory, caption: "Bar & Lounge" },
  { src: "/images/hero-5.jpg", category: "exterior" as GalleryCategory, caption: "Car Park" },
  { src: "/images/hall-1.jpg", category: "events" as GalleryCategory, caption: "Event Hall — Grand Setup" },
  { src: "/images/hall-2.jpg", category: "events" as GalleryCategory, caption: "Event Hall — Chandelier View" },
  { src: "/images/room-bedroom.jpg", category: "rooms" as GalleryCategory, caption: "Deluxe Room" },
  { src: "/images/room-entrance.jpg", category: "rooms" as GalleryCategory, caption: "Room 202 Entrance" },
  { src: "/images/room-bathroom.jpg", category: "rooms" as GalleryCategory, caption: "En-suite Bathroom" },
  { src: "/images/recreation.jpg", category: "recreation" as GalleryCategory, caption: "Game & Gathering Yard" },
  { src: "/images/compound.jpg", category: "exterior" as GalleryCategory, caption: "Compound & Bar Area" },
];

const FILTERS: { label: string; value: GalleryCategory | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Rooms", value: "rooms" },
  { label: "Bar", value: "bar" },
  { label: "Recreation", value: "recreation" },
  { label: "Exterior", value: "exterior" },
  { label: "Events", value: "events" },
];

export default function GalleryPage() {
  const [filter, setFilter] = useState<GalleryCategory | "all">("all");
  const [lightbox, setLightbox] = useState<number | null>(null);
  const filtered = filter === "all" ? IMAGES : IMAGES.filter((img) => img.category === filter);

  const closeLightbox = useCallback(() => setLightbox(null), []);
  const prevImage = useCallback(() => setLightbox((prev) => (prev !== null && prev > 0 ? prev - 1 : filtered.length - 1)), [filtered.length]);
  const nextImage = useCallback(() => setLightbox((prev) => (prev !== null ? (prev + 1) % filtered.length : null)), [filtered.length]);

  return (
    <main className="pt-24">
      <section className="py-16 px-4 md:px-8 text-center bg-linear-to-b from-forest-dark to-forest-black">
        <span className="font-cinzel text-[10px] tracking-[0.2em] text-gold-primary uppercase">Photo Gallery</span>
        <h1 className="font-playfair text-4xl md:text-5xl text-cream mt-3 mb-4">Gallery</h1>
        <p className="text-cream-muted max-w-xl mx-auto">Explore our hotel through photos.</p>
      </section>

      {/* Filters */}
      <section className="py-8 px-4 md:px-8 bg-forest-black">
        <div className="max-w-7xl mx-auto flex justify-center gap-2 flex-wrap">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-5 py-2 rounded-xl font-cinzel text-[11px] tracking-[0.08em] uppercase transition-all cursor-pointer ${
                filter === f.value
                  ? "bg-gold-primary/15 text-gold-primary border border-gold-primary/30"
                  : "text-cream-muted border border-transparent hover:text-cream hover:bg-white/5"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </section>

      {/* Grid */}
      <section className="py-8 px-4 md:px-8 pb-24 bg-forest-black">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {filtered.map((img, i) => (
            <motion.div
              key={`${img.src}-${i}`}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              onClick={() => setLightbox(i)}
              className="relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer group"
            >
              <Image unoptimized={true} src={img.src} alt={img.caption} fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width:768px) 50vw, 25vw" />
              <div className="absolute inset-0 bg-forest-black/0 group-hover:bg-forest-black/40 transition-colors flex items-center justify-center">
                <span className="text-white text-xl opacity-0 group-hover:opacity-100 transition-opacity">🔍</span>
              </div>
              <div className="absolute bottom-0 inset-x-0 p-3 bg-linear-to-t from-forest-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-cream text-[12px]">{img.caption}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onKeyDown={(e) => { if (e.key === "ArrowLeft") prevImage(); if (e.key === "ArrowRight") nextImage(); if (e.key === "Escape") closeLightbox(); }}
            tabIndex={0}
          >
            {/* Close */}
            <button onClick={closeLightbox} className="absolute top-6 right-6 text-cream-muted hover:text-cream text-2xl cursor-pointer z-10">✕</button>
            {/* Counter */}
            <div className="absolute top-6 left-6 text-cream-faint text-[13px] font-cinzel">{lightbox + 1} / {filtered.length}</div>
            {/* Prev */}
            <button onClick={(e) => { e.stopPropagation(); prevImage(); }} className="absolute left-4 top-1/2 -translate-y-1/2 text-cream-muted hover:text-gold-primary text-3xl cursor-pointer z-10">‹</button>
            {/* Image */}
            <motion.div
              key={lightbox}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative w-full max-w-4xl aspect-video rounded-xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <Image unoptimized={true} src={filtered[lightbox].src} alt={filtered[lightbox].caption} fill className="object-contain" sizes="100vw" />
            </motion.div>
            {/* Next */}
            <button onClick={(e) => { e.stopPropagation(); nextImage(); }} className="absolute right-4 top-1/2 -translate-y-1/2 text-cream-muted hover:text-gold-primary text-3xl cursor-pointer z-10">›</button>
            {/* Caption */}
            <p className="absolute bottom-8 text-cream-muted text-[14px] font-cormorant italic">{filtered[lightbox].caption}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
