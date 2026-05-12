"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import InteractiveSelector from "@/components/ui/interactive-selector";

export function GalleryTeaser() {
  return (
    <section className="py-24 px-4 md:px-8 bg-forest-black overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <InteractiveSelector />

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <Button href="/gallery" variant="ghost" size="md">View Full Gallery →</Button>
        </motion.div>
      </div>
    </section>
  );
}
