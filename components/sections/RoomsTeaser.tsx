"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { formatNaira } from "@/lib/utils";

const ROOMS = [
  {
    name: "Classic Standard Room",
    type: "standard",
    price: 15000,
    maxGuests: 2,
    features: ["Air Conditioning", "Flat-Screen TV", "Private Bathroom", "High-Speed WiFi"],
    desc: "A cozy, well-appointed room ideal for solo travelers or couples.",
    image: "/images/hero-3.png",
  },
  {
    name: "Deluxe Comfort Room",
    type: "deluxe",
    price: 22000,
    maxGuests: 2,
    features: ["King Bed", "Mini Fridge", "Smart TV", "WiFi", "Work Desk"],
    desc: "Elevated comfort with premium bedding and a brighter layout.",
    image: "/images/hero-3.png",
  },
  {
    name: "Executive Suite",
    type: "suite",
    price: 35000,
    maxGuests: 3,
    features: ["King Bed", "Sitting Area", "Mini Bar", "Smart TV", "Premium Toiletries"],
    desc: "Our finest accommodation — spacious, luxurious, and unforgettable.",
    image: "/images/hero-3.png",
  },
];

export function RoomsTeaser() {
  return (
    <section className="py-24 px-4 md:px-8 bg-linear-to-b from-forest-black to-forest-dark">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="font-cinzel text-[10px] tracking-[0.2em] text-gold-primary uppercase">
            Accommodation
          </span>
          <h2 className="font-playfair text-4xl md:text-5xl text-cream mt-3 mb-4">
            Our Rooms & Suites
          </h2>
          <p className="text-cream-muted max-w-xl mx-auto text-[15px]">
            Choose the perfect room for your stay — comfort awaits at every level.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ROOMS.map((room, i) => (
            <motion.div
              key={room.type}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              className="group rounded-2xl overflow-hidden border border-gold-primary/12 bg-linear-to-br from-forest/50 to-forest-dark hover:border-gold-primary/40 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(201,168,76,0.15)] transition-all duration-300"
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                  style={{ backgroundImage: `url(${room.image})` }}
                />
                <div className="absolute inset-0 bg-linear-to-t from-forest-dark/90 to-transparent" />
                {/* Price badge */}
                <div className="absolute top-4 right-4 bg-forest-dark/80 backdrop-blur-sm border border-gold-primary/25 rounded-xl px-3 py-1.5">
                  <span className="font-playfair text-gold-primary text-lg font-semibold">
                    {formatNaira(room.price)}
                  </span>
                  <span className="text-cream-faint text-[11px]"> /night</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="font-playfair text-xl text-cream mb-2">{room.name}</h3>
                <p className="text-cream-muted text-[13px] mb-4 leading-relaxed">{room.desc}</p>

                {/* Feature pills */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {room.features.slice(0, 4).map((f) => (
                    <span
                      key={f}
                      className="text-[10px] px-2.5 py-1 rounded-full border border-gold-primary/20 text-gold-primary/70"
                    >
                      {f}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-cream-faint text-[12px]">
                    Max {room.maxGuests} guests
                  </span>
                  <Button
                    href={`/booking?room=${room.type}`}
                    variant="primary"
                    size="sm"
                  >
                    Book Now
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <Button href="/rooms" variant="ghost" size="md">
            View All Rooms →
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
