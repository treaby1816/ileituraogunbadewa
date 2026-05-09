"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const VALUES = [
  { icon: "🤝", title: "Hospitality", desc: "We treat every guest like family — warm, welcoming, and personal." },
  { icon: "🛏️", title: "Comfort", desc: "Every detail is designed with your relaxation and peace of mind in focus." },
  { icon: "🔒", title: "Trust", desc: "Security, integrity, and reliability are the bedrock of everything we do." },
  { icon: "⭐", title: "Excellence", desc: "We continuously raise the standard to deliver outstanding experiences." },
];

const TIMELINE = [
  { year: "2025", event: "Construction began with a vision to build a modern, premium relaxation center in Ikorodu." },
  { year: "May 2026", event: "Official opening! Fully functioning services including luxury rooms, bar, lounge, and event hall." },
  { year: "Present", event: "Come and enjoy! Be part of our journey as we redefine hospitality in Lagos State." },
];

export default function AboutPage() {
  return (
    <main className="pt-24">
      {/* Hero */}
      <section className="py-16 px-4 md:px-8 text-center bg-linear-to-b from-forest-dark to-forest-black">
        <span className="font-cinzel text-[10px] tracking-[0.2em] text-gold-primary uppercase">Our Story</span>
        <h1 className="font-playfair text-4xl md:text-5xl text-cream mt-3 mb-4">About Us</h1>
        <p className="text-cream/50 max-w-2xl mx-auto">
          The story of Ilé Ìtura Ògúnbádéwà — a name rooted in Yoruba heritage, meaning &ldquo;a place of rest and comfort.&rdquo;
        </p>
      </section>

      {/* Brand Story */}
      <section className="py-20 px-4 md:px-8 bg-forest-black">
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="relative h-[380px] rounded-2xl overflow-hidden border border-gold-primary/15 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
              <Image src="/images/hero-1.png" alt="Ilé Ìtura Ògúnbádéwà" fill className="object-cover" sizes="50vw" />
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="font-playfair text-3xl text-cream mb-6">Our Beginning</h2>
            <p className="text-cream/60 text-[14px] leading-relaxed mb-4">
              <strong className="text-gold-primary">Ilé Ìtura Ògúnbádéwà</strong> — in Yoruba, this name embodies our mission: to create a sanctuary of rest and exceptional Nigerian hospitality. Founded in Ikorodu, Lagos State, we set out to prove that world-class comfort and warmth can thrive in every community.
            </p>
            <p className="text-cream/60 text-[14px] leading-relaxed">
              Today, we proudly serve hundreds of guests each year with air-conditioned rooms, a vibrant bar & lounge, recreation spaces, and a spacious event hall — all delivered with the warmth and care that defines true Nigerian hospitality.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 px-4 md:px-8 bg-linear-to-b from-forest-dark to-forest-black">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { label: "Our Mission", text: "To provide every guest a sanctuary of rest, comfort, and exceptional Nigerian hospitality — right here in Ikorodu." },
            { label: "Our Vision", text: "To become Ikorodu's premier relaxation destination, setting the standard for comfort, service, and community hospitality." },
          ].map((item, i) => (
            <motion.div key={item.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
              className="p-8 rounded-2xl border border-gold-primary/15 bg-linear-to-br from-forest/50 to-forest-dark"
            >
              <span className="font-cinzel text-[10px] tracking-[0.15em] text-gold-primary uppercase">{item.label}</span>
              <p className="text-cream/65 text-[14px] leading-relaxed mt-4 font-cormorant italic text-lg">&ldquo;{item.text}&rdquo;</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 px-4 md:px-8 bg-forest-black">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="font-cinzel text-[10px] tracking-[0.2em] text-gold-primary uppercase">What We Stand For</span>
            <h2 className="font-playfair text-3xl md:text-4xl text-cream mt-3">Our Core Values</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((v, i) => (
              <motion.div key={v.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl border border-gold-primary/12 bg-linear-to-br from-forest/50 to-forest-dark text-center hover:border-gold-primary/30 transition-all"
              >
                <div className="text-3xl mb-3">{v.icon}</div>
                <h3 className="font-playfair text-lg text-cream mb-2">{v.title}</h3>
                <p className="text-cream/50 text-[13px]">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 px-4 md:px-8 bg-linear-to-b from-forest-dark to-forest-black">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <span className="font-cinzel text-[10px] tracking-[0.2em] text-gold-primary uppercase">Our Journey</span>
            <h2 className="font-playfair text-3xl md:text-4xl text-cream mt-3">Timeline</h2>
          </div>
          <div className="relative border-l-2 border-gold-primary/20 pl-8 space-y-10">
            {TIMELINE.map((t, i) => (
              <motion.div key={t.year} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="relative">
                <div className="absolute -left-[42px] top-1 w-4 h-4 rounded-full bg-gold-primary border-4 border-forest-dark" />
                <span className="font-cinzel text-gold-primary text-[13px] tracking-widest">{t.year}</span>
                <p className="text-cream/60 text-[14px] mt-1 leading-relaxed">{t.event}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
