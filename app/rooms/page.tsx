"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { formatNaira } from "@/lib/utils";
import type { RoomType } from "@/lib/types";

const ROOMS = [
  {
    id: "standard-1",
    name: "Classic Standard Room",
    type: "standard" as RoomType,
    price: 15000,
    maxGuests: 2,
    features: ["Air Conditioning", "Flat-Screen TV", "Private Bathroom", "High-Speed WiFi", "Wardrobe", "24/7 Power"],
    desc: "A cozy, well-appointed room perfect for solo travelers or couples seeking a comfortable stay.",
    images: ["/images/hero-3.jpg"],
  },
  {
    id: "deluxe-1",
    name: "Deluxe Comfort Room",
    type: "deluxe" as RoomType,
    price: 22000,
    maxGuests: 2,
    features: ["King Bed", "Mini Fridge", "Smart TV", "High-Speed WiFi", "Work Desk", "En-suite Bathroom", "24/7 Power"],
    desc: "Elevated comfort with premium bedding, a spacious layout, and modern amenities for the discerning guest.",
    images: ["/images/hero-3.jpg"],
  },
  {
    id: "suite-1",
    name: "Executive Suite",
    type: "suite" as RoomType,
    price: 35000,
    maxGuests: 3,
    features: ["King Bed", "Sitting Area", "Mini Bar", "Smart TV", "High-Speed WiFi", "Premium Toiletries", "Bathrobes", "24/7 Power"],
    desc: "Our finest accommodation — spacious, luxurious, and designed for guests who appreciate the very best.",
    images: ["/images/hero-3.jpg"],
  },
];

const FILTERS: { label: string; value: RoomType | "all" }[] = [
  { label: "All Rooms", value: "all" },
  { label: "Standard", value: "standard" },
  { label: "Deluxe", value: "deluxe" },
  { label: "Suite", value: "suite" },
];

export default function RoomsPage() {
  const [filter, setFilter] = useState<RoomType | "all">("all");
  const filtered = filter === "all" ? ROOMS : ROOMS.filter((r) => r.type === filter);

  return (
    <main className="pt-24">
      {/* Hero */}
      <section className="py-16 px-4 md:px-8 text-center bg-linear-to-b from-forest-dark to-forest-black">
        <span className="font-cinzel text-[10px] tracking-[0.2em] text-gold-primary uppercase">Accommodation</span>
        <h1 className="font-playfair text-4xl md:text-5xl text-cream mt-3 mb-4">Our Rooms & Suites</h1>
        <p className="text-cream-muted max-w-xl mx-auto">
          Every room at Ilé Ìtura Ògúnbádéwà is designed for maximum comfort and relaxation.
        </p>
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

      {/* Room cards */}
      <section className="py-12 px-4 md:px-8 bg-forest-black">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((room, i) => (
            <motion.div
              key={room.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group rounded-2xl overflow-hidden border border-gold-primary/12 bg-linear-to-br from-forest/50 to-forest-dark hover:border-gold-primary/30 transition-all duration-300"
            >
              <div className="relative h-60 overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                  style={{ backgroundImage: `url(${room.images[0]})` }}
                />
                <div className="absolute inset-0 bg-linear-to-t from-forest-dark/90 to-transparent" />
                <div className="absolute top-4 right-4 bg-forest-dark/80 backdrop-blur-sm border border-gold-primary/25 rounded-xl px-3 py-1.5">
                  <span className="font-playfair text-gold-primary text-lg font-semibold">{formatNaira(room.price)}</span>
                  <span className="text-cream-faint text-[11px]"> /night</span>
                </div>
                <div className="absolute top-4 left-4 bg-gold-primary/20 border border-gold-primary/30 rounded-lg px-2.5 py-1">
                  <span className="font-cinzel text-[9px] tracking-widest text-gold-primary uppercase">{room.type}</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-playfair text-xl text-cream mb-2">{room.name}</h3>
                <p className="text-cream-muted text-[13px] mb-4 leading-relaxed">{room.desc}</p>
                <div className="flex flex-wrap gap-2 mb-5">
                  {room.features.map((f) => (
                    <span key={f} className="text-[10px] px-2.5 py-1 rounded-full border border-gold-primary/20 text-gold-primary/70">{f}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gold-primary/10">
                  <span className="text-cream-faint text-[12px]">Max {room.maxGuests} guests</span>
                  <Button href={`/booking?room=${room.type}`} variant="primary" size="sm">Book This Room</Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}
