"use client";

import { useRef } from "react";
import { motion } from "framer-motion";

const TESTIMONIALS = [
  { name: "Adewale Olusegun", stars: 5, date: "April 2025", text: "One of the best stays I've had in Ikorodu. The room was spotless, staff were welcoming, and the bar lounge is a vibe. Highly recommend!" },
  { name: "Chioma Nwachukwu", stars: 5, date: "March 2025", text: "Came for a weekend getaway and didn't want to leave. The Executive Suite is absolutely worth it — so spacious and luxurious." },
  { name: "Ibrahim Lawal", stars: 4, date: "March 2025", text: "Great value for money in Lagos. The security is top-notch and I slept better than I have in months. Will definitely be back." },
  { name: "Funke Adeyemi", stars: 5, date: "February 2025", text: "We hired the hall for a family event and it was perfect. Enough space, great ambiance, and the team was so supportive throughout." },
  { name: "Emeka Obi", stars: 5, date: "January 2025", text: "Exactly what the name promises — a place of rest. Quiet, clean, comfortable. The table tennis area is a fun bonus!" },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5 mb-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= count ? "text-gold-primary" : "text-cream/20"}>★</span>
      ))}
    </div>
  );
}

export function Testimonials() {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section className="py-24 px-4 md:px-8 bg-linear-to-b from-forest-dark to-forest-black overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="font-cinzel text-[10px] tracking-[0.2em] text-gold-primary uppercase">Guest Reviews</span>
          <h2 className="font-playfair text-4xl md:text-5xl text-cream mt-3">What Our Guests Say</h2>
        </motion.div>

        <div className="relative w-full overflow-hidden flex group">
          {/* Fading Edges */}
          <div className="absolute inset-y-0 left-0 w-20 md:w-32 bg-linear-to-r from-forest-dark to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-20 md:w-32 bg-linear-to-l from-forest-dark to-transparent z-10 pointer-events-none" />

          {/* Scrolling Track */}
          <div className="flex gap-5 w-max animate-[scrollX_35s_linear_infinite] group-hover:[animation-play-state:paused] pb-4">
            {[...TESTIMONIALS, ...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
              <div key={i} className="flex-shrink-0 w-[300px] md:w-[340px] p-7 rounded-2xl border border-gold-primary/15 bg-linear-to-br from-forest/70 to-forest-dark hover:border-gold-primary/35 transition-all duration-300">
                <StarRating count={t.stars} />
                <p className="text-cream/65 leading-relaxed mb-6 font-cormorant italic text-[15px]">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3 pt-4 border-t border-gold-primary/10">
                  <div className="w-9 h-9 rounded-full bg-gold-primary/20 border border-gold-primary/30 flex items-center justify-center text-gold-primary font-playfair font-bold text-[14px]">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-cream text-[13px] font-semibold">{t.name}</p>
                    <p className="text-gold-primary/50 text-[11px]">{t.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
