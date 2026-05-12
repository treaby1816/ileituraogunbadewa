"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export function BackButton() {
  const router = useRouter();

  return (
    <motion.button
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      onClick={() => router.back()}
      className="flex items-center gap-2 text-gold-primary/70 hover:text-gold-primary transition-colors group mb-6"
    >
      <div className="w-8 h-8 rounded-full border border-gold-primary/20 flex items-center justify-center group-hover:border-gold-primary/50 transition-all">
        <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
      </div>
      <span className="font-cinzel text-[10px] tracking-[0.2em] uppercase">Back</span>
    </motion.button>
  );
}
