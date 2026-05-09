"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = Math.ceil(target / 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 24);
    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <span ref={ref} className="font-playfair text-5xl md:text-6xl text-gold-primary">
      {count}
      {suffix}
    </span>
  );
}

export function WelcomeStrip() {
  return (
    <section className="py-24 px-4 md:px-8 bg-linear-to-b from-forest-black via-forest-dark to-forest-black">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-playfair text-3xl md:text-4xl text-cream mb-4">
            A Place of Rest, Relaxation &<br />
            <span className="text-gold-primary">Exceptional Service</span>
          </h2>
          <div className="w-16 h-[1px] bg-gold-primary mx-auto mt-6" />
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 text-center">
          {[
            { target: 20, suffix: "+", label: "Rooms Available" },
            { target: 5, suffix: "+", label: "Years of Excellence" },
            { target: 500, suffix: "+", label: "Happy Guests" },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="flex flex-col items-center gap-2"
            >
              <Counter target={item.target} suffix={item.suffix} />
              <p className="font-cinzel text-[10px] tracking-[0.15em] text-cream/50 uppercase mt-1">
                {item.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
