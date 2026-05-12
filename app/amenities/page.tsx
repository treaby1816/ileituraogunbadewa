"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const AMENITIES = [
  {
    title: "Relaxation & Comfort",
    desc: "Our rooms are designed with your ultimate comfort in mind. Each room is fully air-conditioned, equipped with plush bedding, and maintained to the highest standards. Whether you're visiting for business or leisure, you'll find a peaceful retreat waiting for you.",
    features: ["Full air conditioning", "Premium mattresses & bedding", "Blackout curtains", "24/7 uninterrupted power supply"],
    image: "/images/room-bedroom.jpg",
  },
  {
    title: "Bar & Lounge",
    desc: "Unwind after a long day at our inviting bar and lounge. Enjoy a curated selection of drinks and cocktails in a warm, ambient setting with great music and comfortable seating.",
    features: ["Wide beverage selection", "Ambient mood lighting", "Comfortable seating", "Open daily: 4 PM – 12 AM"],
    image: "/images/hero-4.jpg",
  },
  {
    title: "Recreation Area",
    desc: "Challenge your friends to a game of table tennis or simply enjoy the outdoor space. Our recreation area is perfect for families and groups looking to have a fun time.",
    features: ["Table tennis", "Outdoor relaxation space", "Family-friendly", "Free for all guests"],
    image: "/images/recreation.jpg",
  },
  {
    title: "Spacious Event Hall",
    desc: "Host your events in style at our elegant and spacious event hall. From birthday celebrations to corporate gatherings, our hall is fully equipped and can be configured to suit your occasion.",
    features: ["Flexible configurations", "Event lighting & sound", "Catering available", "Contact us for hire details"],
    image: "/images/hall-1.jpg",
  },
  {
    title: "Secure Car Park",
    desc: "Drive in with peace of mind. Our car park is spacious, well-lit, and monitored around the clock. Parking is complimentary for all guests staying at the hotel.",
    features: ["24/7 CCTV monitoring", "Well-lit at night", "Ample capacity", "Free for hotel guests"],
    image: "/images/hero-1.jpg",
  },
  {
    title: "24/7 Security",
    desc: "Your safety is our top priority. The entire property is under constant CCTV surveillance with trained security personnel on duty at all times, day and night.",
    features: ["CCTV coverage", "Trained security staff", "Controlled entry gate", "Emergency response ready"],
    image: "/images/hero-1.jpg",
  },
];

export default function AmenitiesPage() {
  return (
    <main className="pt-24">
      <section className="py-16 px-4 md:px-8 text-center bg-linear-to-b from-forest-dark to-forest-black">
        <span className="font-cinzel text-[10px] tracking-[0.2em] text-gold-primary uppercase">What We Offer</span>
        <h1 className="font-playfair text-4xl md:text-5xl text-cream mt-3 mb-4">Our Amenities</h1>
        <p className="text-cream-muted max-w-xl mx-auto">
          Everything you need for a comfortable, enjoyable, and unforgettable stay.
        </p>
      </section>

      <section className="py-16 px-4 md:px-8 bg-forest-black">
        <div className="max-w-6xl mx-auto space-y-24">
          {AMENITIES.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6 }}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-10 items-center ${i % 2 === 1 ? "lg:direction-rtl" : ""}`}
            >
              <div className={`${i % 2 === 1 ? "lg:order-2" : ""}`}>
                <div className="relative h-[320px] rounded-2xl overflow-hidden border border-gold-primary/15 shadow-[0_16px_48px_rgba(0,0,0,0.5)]">
                  <Image src={item.image} alt={item.title} fill className="object-cover" sizes="(max-width:1024px) 100vw, 50vw" />
                </div>
              </div>
              <div className={`${i % 2 === 1 ? "lg:order-1" : ""}`}>
                <h2 className="font-playfair text-2xl md:text-3xl text-cream mb-4">{item.title}</h2>
                <p className="text-cream-muted text-[14px] leading-relaxed mb-6">{item.desc}</p>
                <ul className="space-y-2">
                  {item.features.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-[13px] text-cream-muted">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold-primary shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}
