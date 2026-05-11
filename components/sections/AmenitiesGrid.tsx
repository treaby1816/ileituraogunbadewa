"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const AMENITIES = [
  { icon: "🛏️", title: "Relaxation & Comfort", desc: "Our curated selection of rooms, featuring premium furnishings and amenities tailored for your ultimate rest.", image: "/images/room-bedroom.jpg" },
  { icon: "🍹", title: "Bar & Lounge", desc: "A comprehensive selection of beverages in a refined, private setting.", image: "/images/hero-4.jpg" },
  { icon: "🏛️", title: "Spacious Hall", desc: "The perfect venue for your exclusive events and celebrations.", image: "/images/hall-1.jpg" },
  { icon: "🅿️", title: "Spacious Car Park", desc: "Ample, secure parking facilities for you and your esteemed guests.", image: "/images/hero-5.jpg" },
];

export function AmenitiesGrid() {
  return (
    <section className="py-24 px-4 md:px-8 bg-cream-light text-forest-black">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-playfair text-4xl md:text-5xl text-forest-black mt-3 mb-4 font-semibold">
            Curated Amenities
          </h2>
          <p className="text-forest-dark max-w-xl mx-auto text-[15px]">
            Indulge in a suite of services designed to provide the ultimate relaxation and convenience during your stay at our private estate.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {AMENITIES.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group relative h-[300px] rounded-sm overflow-hidden flex flex-col justify-end p-6 md:p-8 cursor-default border border-gold-primary/20 hover:border-gold-primary/50 transition-all duration-300 shadow-xl"
            >
              <Image unoptimized={true} 
                src={item.image} 
                alt={item.title} 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent z-0" />
              
              <div className="relative z-10">
                <div className="text-3xl mb-2 text-gold-primary">{item.icon}</div>
                <h3 className="font-playfair text-2xl text-white mb-2">{item.title}</h3>
                <p className="text-gray-200 text-[13px] leading-relaxed max-w-[80%]">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

