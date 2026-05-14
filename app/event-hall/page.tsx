"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { BackButton } from "@/components/ui/BackButton";

const FEATURES = [
  {
    title: "200 Guest Capacity",
    desc: "Spacious enough to host up to 200 guests comfortably in a banquet or theatre-style arrangement.",
    icon: "👥",
  },
  {
    title: "Premium Cooling",
    desc: "Full air-conditioning systems complemented by high-performance fans for a cool, pleasant atmosphere.",
    icon: "❄️",
  },
  {
    title: "Solar Backup",
    desc: "Uninterrupted power supply via solar panels and generators ensures your event never goes dark.",
    icon: "☀️",
  },
  {
    title: "Professional Stage",
    desc: "Raised platform/stage available for speakers, celebrants, or live bands and DJs.",
    icon: "🎭",
  },
  {
    title: "Free Suite Included",
    desc: "Every hall booking comes with 1 FREE standard room for the celebrant or guest of honor.",
    icon: "🏨",
  },
  {
    title: "Ample Parking",
    desc: "Spacious, CCTV-monitored car park for all your guests, with dedicated security personnel.",
    icon: "🚗",
  },
];

const GALLERY = [
  { src: "/images/hall-1.jpg", alt: "Event Hall Interior" },
  { src: "/images/hall-2.jpg", alt: "Event Hall Setup" },
  { src: "/images/hero-1.jpg", alt: "Hotel Exterior" },
  { src: "/images/hero-5.jpg", alt: "Spacious Car Park" },
];

export default function EventHallPage() {
  return (
    <main className="pt-24 bg-forest-black">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <Image
          src="/images/hall-1.jpg"
          alt="Elegant Event Hall"
          fill
          className="object-cover brightness-50"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-forest-black/50 to-forest-black" />
        
        <div className="relative z-10 text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <BackButton />
            <span className="font-cinzel text-[10px] tracking-[0.25em] text-gold-primary uppercase mb-4 block">Premier Venue</span>
            <h1 className="font-playfair text-5xl md:text-7xl text-cream mb-6">The Event Hall</h1>
            <p className="font-cormorant italic text-xl md:text-2xl text-cream-muted max-w-2xl mx-auto">
              Where Elegance Meets Celebration. Host your most memorable moments with us.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Info */}
      <section className="py-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-playfair text-3xl md:text-4xl text-cream mb-6">A Space Designed for Excellence</h2>
            <p className="text-cream-muted leading-relaxed mb-8 text-lg">
              Our spacious event hall at Ilé Ìtura Ògúnbádéwà is more than just a venue — it's a canvas for your celebrations. 
              Located in the heart of Ikorodu, we provide a sophisticated atmosphere with five-star support for weddings, 
              birthdays, corporate seminars, and religious gatherings.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-xl border border-gold-primary/10 bg-forest/20">
                <span className="text-2xl">💰</span>
                <div>
                  <p className="font-cinzel text-xs text-gold-primary tracking-widest uppercase">Pricing</p>
                  <p className="text-cream text-lg font-semibold">₦500,000 <span className="text-sm font-normal text-cream-faint">/ Full Day</span></p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-xl border border-gold-primary/10 bg-forest/20">
                <span className="text-2xl">🎁</span>
                <div>
                  <p className="font-cinzel text-xs text-gold-primary tracking-widest uppercase">Special Perk</p>
                  <p className="text-cream text-lg font-semibold">1 FREE Standard Room <span className="text-sm font-normal text-cream-faint">included with hire</span></p>
                </div>
              </div>
            </div>
            <div className="mt-10">
              <Button href="/booking?type=hall" variant="primary" size="lg">
                Request Hall Booking
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative h-[500px] rounded-2xl overflow-hidden border border-gold-primary/20 shadow-2xl"
          >
            <Image
              src="/images/hall-2.jpg"
              alt="Hall Setup"
              fill
              className="object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-forest/30 border-y border-gold-primary/10 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-3xl md:text-4xl text-cream mb-4">Venue Features</h2>
            <div className="w-12 h-[1px] bg-gold-primary mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-2xl border border-gold-primary/10 bg-forest-black/40 hover:border-gold-primary/30 transition-all duration-300"
              >
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="font-cinzel text-sm tracking-widest text-gold-primary mb-3 uppercase">{feature.title}</h3>
                <p className="text-cream-muted text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Visual Gallery */}
      <section className="py-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-3xl md:text-4xl text-cream mb-4">A Glimpse of the Venue</h2>
            <p className="text-cream-muted">Premium aesthetics and spacious layout for your events.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {GALLERY.map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative h-80 rounded-2xl overflow-hidden border border-gold-primary/15 group"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                  <p className="text-cream text-sm font-cinzel tracking-widest uppercase">{img.alt}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4 text-center">
        <div className="max-w-3xl mx-auto p-12 rounded-3xl border border-gold-primary/20 bg-linear-to-br from-forest to-forest-dark shadow-2xl">
          <h2 className="font-playfair text-3xl md:text-4xl text-cream mb-6">Ready to Plan Your Event?</h2>
          <p className="text-cream-muted mb-10 leading-relaxed">
            Our team is ready to help you coordinate every detail. Contact us today for a tour of the facility or to secure your date.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button href="/booking?type=hall" variant="primary" size="lg">
              Book the Hall
            </Button>
            <Button href="tel:08129041015" variant="ghost" size="lg">
              Call for Inquiry
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
