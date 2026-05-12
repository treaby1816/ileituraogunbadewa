"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { BackButton } from "@/components/ui/BackButton";
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
    image: "/images/room-bedroom.jpg",
    gallery: ["/images/room-bedroom.jpg", "/images/room-entrance.jpg", "/images/room-bathroom.jpg"],
  },
  {
    id: "deluxe-1",
    name: "Deluxe Comfort Room",
    type: "deluxe" as RoomType,
    price: 22000,
    maxGuests: 2,
    features: ["King Bed", "Mini Fridge", "Smart TV", "High-Speed WiFi", "Work Desk", "En-suite Bathroom", "24/7 Power"],
    desc: "Elevated comfort with premium bedding, a spacious layout, and modern amenities for the discerning guest.",
    image: "/images/room-bedroom.jpg",
    gallery: ["/images/room-bedroom.jpg", "/images/room-entrance.jpg", "/images/room-bathroom.jpg"],
  },
  {
    id: "suite-1",
    name: "Executive Suite",
    type: "suite" as RoomType,
    price: 35000,
    maxGuests: 3,
    features: ["King Bed", "Sitting Area", "Mini Bar", "Smart TV", "High-Speed WiFi", "Premium Toiletries", "Bathrobes", "24/7 Power"],
    desc: "Our finest accommodation — spacious, luxurious, and designed for guests who appreciate the very best.",
    image: "/images/room-bedroom.jpg",
    gallery: ["/images/room-bedroom.jpg", "/images/room-entrance.jpg", "/images/room-bathroom.jpg"],
  },
];

const FILTERS: { label: string; value: RoomType | "all" }[] = [
  { label: "All Rooms", value: "all" },
  { label: "Standard", value: "standard" },
  { label: "Deluxe", value: "deluxe" },
  { label: "Suite", value: "suite" },
];

const GALLERY_LABELS = ["Bedroom", "Room Entrance", "En-suite Bathroom"];

export default function RoomsPage() {
  const [filter, setFilter] = useState<RoomType | "all">("all");
  const [expandedRoom, setExpandedRoom] = useState<string | null>(null);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState<Record<string, number>>({});
  const filtered = filter === "all" ? ROOMS : ROOMS.filter((r) => r.type === filter);

  const getGalleryIndex = (roomId: string) => activeGalleryIndex[roomId] ?? 0;

  return (
    <main className="pt-24">
      {/* Hero */}
      <section className="py-16 px-4 md:px-8 text-center bg-linear-to-b from-forest-dark to-forest-black">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <BackButton />
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
          {filtered.map((room, i) => {
            const isExpanded = expandedRoom === room.id;
            const galleryIdx = getGalleryIndex(room.id);

            return (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group rounded-2xl overflow-hidden border border-gold-primary/12 bg-linear-to-br from-forest/50 to-forest-dark hover:border-gold-primary/30 transition-all duration-300"
              >
                {/* Main image */}
                <div className="relative h-60 overflow-hidden cursor-pointer" onClick={() => setExpandedRoom(isExpanded ? null : room.id)}>
                  <div
                    className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                    style={{ backgroundImage: `url(${room.image})` }}
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-forest-dark/90 to-transparent" />
                  <div className="absolute top-4 right-4 bg-forest-dark/80 backdrop-blur-sm border border-gold-primary/25 rounded-xl px-3 py-1.5">
                    <span className="font-playfair text-gold-primary text-lg font-semibold">{formatNaira(room.price)}</span>
                    <span className="text-cream-faint text-[11px]"> /night</span>
                  </div>
                  <div className="absolute top-4 left-4 bg-gold-primary/20 border border-gold-primary/30 rounded-lg px-2.5 py-1">
                    <span className="font-cinzel text-[9px] tracking-widest text-gold-primary uppercase">{room.type}</span>
                  </div>
                  {/* View more hint */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-forest-dark/70 backdrop-blur-sm border border-gold-primary/20 rounded-full px-4 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-gold-primary text-[11px] font-cinzel tracking-wider">{isExpanded ? "Hide Details" : "View Room Details"}</span>
                  </div>
                </div>

                {/* Expanded gallery */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      {/* Image gallery */}
                      <div className="px-4 pt-4">
                        <div className="relative h-48 rounded-xl overflow-hidden">
                          <Image
                            src={room.gallery[galleryIdx]}
                            alt={`${room.name} — ${GALLERY_LABELS[galleryIdx]}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 33vw"
                          />
                          <div className="absolute bottom-3 left-3 bg-forest-dark/80 backdrop-blur-sm rounded-lg px-3 py-1">
                            <span className="text-gold-primary text-[11px] font-cinzel tracking-wider">{GALLERY_LABELS[galleryIdx]}</span>
                          </div>
                        </div>
                        {/* Thumbnail navigation */}
                        <div className="flex gap-2 mt-3">
                          {room.gallery.map((img, idx) => (
                            <button
                              key={idx}
                              onClick={() => setActiveGalleryIndex((prev) => ({ ...prev, [room.id]: idx }))}
                              className={`relative h-14 flex-1 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                                galleryIdx === idx ? "border-gold-primary" : "border-transparent opacity-60 hover:opacity-100"
                              }`}
                            >
                              <Image src={img} alt={GALLERY_LABELS[idx]} fill className="object-cover" sizes="100px" />
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

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
            );
          })}
        </div>
      </section>
    </main>
  );
}
