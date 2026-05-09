"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import Image from "next/image";

export function BookingStrip() {
  const handleCheck = () => {
    const msg = encodeURIComponent(
      `Hello! I'd like to inquire about booking a room or the event hall. Please let me know your availability. Thank you!`
    );
    window.open(`https://wa.me/2348129041015?text=${msg}`, "_blank");
  };

  return (
    <section className="py-24 px-4 md:px-8 bg-cream-light text-forest-black">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        
        {/* Left: Text & CTA */}
        <motion.div 
          className="lg:w-1/2"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-playfair text-4xl md:text-5xl text-forest-black mt-3 mb-6 font-semibold">
            Book Your Stay or Event Today!
          </h2>
          <p className="text-forest-dark text-[16px] leading-relaxed mb-8 max-w-md">
            Experience the pinnacle of hospitality. Whether for business or leisure, our gates are open to provide you with an unforgettable experience.
          </p>
          
          <div className="flex items-center gap-4 text-xs font-cinzel tracking-widest text-gold-primary/80 mb-10 uppercase">
            <span>⭐</span>
            <span>⭐</span>
            <span>⭐</span>
            <span>A Premium Destination</span>
          </div>

          <Button variant="primary" size="lg" onClick={handleCheck} className="w-fit text-sm tracking-wider uppercase font-cinzel rounded-sm px-8 py-4">
            Reserve Now →
          </Button>
        </motion.div>

        {/* Right: Image */}
        <motion.div 
          className="lg:w-1/2 w-full"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="relative w-full aspect-square max-w-[500px] mx-auto bg-white p-4 shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100">
            <div className="relative w-full h-full border border-gold-primary/20">
              <Image unoptimized={true} 
                src="/images/hero-1.png" 
                alt="Hotel Reception" 
                fill 
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}

