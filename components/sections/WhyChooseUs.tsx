"use client";

import { motion } from "framer-motion";

const FEATURES = [
  { icon: "🛏️", title: "COMFORTABLE\nROOMS" },
  { icon: "🛡️", title: "24/7 SECURITY &\nCCTV" },
  { icon: "🅿️", title: "AMPLE PARKING" },
  { icon: "🏓", title: "RECREATION AREA" },
  { icon: "🍹", title: "BAR & LOUNGE" },
  { icon: "🛎️", title: "EXCELLENT SERVICE" },
];

export function WhyChooseUs() {
  return (
    <section className="py-16 px-4 md:px-8 bg-forest-black border-y border-gold-primary/10">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-playfair text-3xl md:text-4xl text-gold-primary mb-2 font-semibold">
            Exclusive Features
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-4">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="flex flex-col items-center text-center group hover:-translate-y-1 transition-transform duration-300"
            >
              <div className="w-14 h-14 rounded-sm border border-gold-primary/20 bg-white/5 flex items-center justify-center text-2xl mb-4 group-hover:border-gold-primary/50 group-hover:bg-gold-primary/10 transition-all duration-300">
                {feature.icon}
              </div>
              <h3 className="text-cream text-[11px] font-bold font-cinzel tracking-widest leading-relaxed whitespace-pre-line">
                {feature.title}
              </h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

