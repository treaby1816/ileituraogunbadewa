"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { 
  Bed, 
  Beer, 
  PartyPopper, 
  Trees, 
  Gamepad2 
} from 'lucide-react';
import { ImageSwiper } from "@/components/ui/image-swiper";

const OPTIONS = [
  {
    title: "Executive Suites",
    description: "Premium comfort for your stay",
    image: "/images/room-bedroom.jpg",
    icon: <Bed size={24} className="text-white" />
  },
  {
    title: "Bar & Lounge",
    description: "Curated drinks & warm ambiance",
    image: "/images/hero-4.jpg",
    icon: <Beer size={24} className="text-white" />
  },
  {
    title: "Event Hall",
    description: "Grand spaces for celebrations",
    image: "/images/hall-1.jpg",
    icon: <PartyPopper size={24} className="text-white" />
  },
  {
    title: "Serene Grounds",
    description: "Tranquil outdoor environments",
    image: "/images/compound.jpg",
    icon: <Trees size={24} className="text-white" />
  },
  {
    title: "Recreation Yard",
    description: "Fun & games for everyone",
    image: "/images/recreation.jpg",
    icon: <Gamepad2 size={24} className="text-white" />
  }
];

export const InteractiveSelector = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [animatedOptions, setAnimatedOptions] = useState<number[]>([]);
  const [lightbox, setLightbox] = useState<number | null>(null);
  
  const handleOptionClick = (index: number) => {
    if (window.innerWidth < 768) {
      setLightbox(index);
    } else {
      if (index !== activeIndex) {
        setActiveIndex(index);
      } else {
        setLightbox(index);
      }
    }
  };

  const closeLightbox = useCallback(() => setLightbox(null), []);
  const prevImage = useCallback(() => setLightbox((prev) => (prev !== null && prev > 0 ? prev - 1 : OPTIONS.length - 1)), []);
  const nextImage = useCallback(() => setLightbox((prev) => (prev !== null ? (prev + 1) % OPTIONS.length : null)), []);

  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 320);
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    
    OPTIONS.forEach((_, i) => {
      const timer = setTimeout(() => {
        setAnimatedOptions(prev => [...prev, i]);
      }, 180 * i);
      timers.push(timer);
    });
    
    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center bg-forest-black font-sans text-white py-12"> 
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="w-full max-w-2xl px-6 mb-12 text-center"
      >
        <span className="font-cinzel text-[10px] tracking-[0.2em] text-gold-primary uppercase mb-3 block">
          A Glimpse Inside
        </span>
        <h2 className="text-4xl md:text-5xl font-playfair text-cream mb-4 tracking-tight drop-shadow-lg">
          Experience Ilé Ìtura
        </h2>
        <p className="text-lg text-cream-muted max-w-xl mx-auto">
          Discover the perfect blend of luxury and comfort in every corner of our estate.
        </p>
      </motion.div>

      {/* Options Container (Desktop Accordion) */}
      <div className="hidden md:flex md:max-w-[1000px] md:min-w-[320px] md:h-[500px] md:items-stretch md:overflow-hidden md:relative md:px-0 md:gap-0">
        {OPTIONS.map((option, index) => (
          <div
            key={index}
            className={`
              relative flex flex-col justify-end overflow-hidden transition-all duration-700 ease-in-out
              ${activeIndex === index ? 'md:flex-[7] md:border-white' : 'md:flex-[1] md:border-gold-primary/20'}
              min-w-0 md:min-w-[60px] cursor-pointer bg-forest border-2 border-gold-primary/20 rounded-none h-auto
            `}
            style={{
              backgroundImage: `url('${option.image}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: animatedOptions.includes(index) ? 1 : 0,
              transform: animatedOptions.includes(index) ? 'translateX(0)' : 'translateX(-60px)',
              boxShadow: activeIndex === index 
                ? '0 20px 60px rgba(0,0,0,0.50)' 
                : '0 10px 30px rgba(0,0,0,0.30)',
            }}
            onClick={() => handleOptionClick(index)}
          >
            <div 
              className={`absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-700 ${
                activeIndex === index ? 'opacity-100' : 'opacity-40'
              }`}
            />
            
            <div className="absolute left-0 right-0 bottom-5 flex flex-row items-center justify-start z-10 pointer-events-none px-4 gap-3 w-full">
              <div className="min-w-[44px] max-w-[44px] h-[44px] flex items-center justify-center rounded-full bg-forest-dark/80 backdrop-blur-md shadow-lg border border-gold-primary/30 flex-shrink-0 transition-all duration-200">
                {React.cloneElement(option.icon as React.ReactElement<any>, { className: "text-white w-6 h-6" })}
              </div>
              <div className="text-white whitespace-nowrap relative overflow-hidden">
                <div 
                  className="font-playfair text-xl transition-all duration-700 ease-in-out opacity-0 translate-x-6"
                  style={{
                    opacity: activeIndex === index ? 1 : 0,
                    transform: activeIndex === index ? 'translateX(0)' : 'translateX(25px)'
                  }}
                >
                  {option.title}
                </div>
                <div 
                  className="text-sm text-cream-muted transition-all duration-700 ease-in-out opacity-0 translate-x-6"
                  style={{
                    opacity: activeIndex === index ? 1 : 0,
                    transform: activeIndex === index ? 'translateX(0)' : 'translateX(25px)'
                  }}
                >
                  {option.description}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile Card Swiper (Android/Mobile devices) */}
      <div className="md:hidden flex w-full justify-center px-4">
        <ImageSwiper 
          images={OPTIONS.map(opt => opt.image).join(',')} 
          cardWidth={windowWidth * 0.8}
          cardHeight={windowWidth * 1.1}
          className="my-8"
        />
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onKeyDown={(e: React.KeyboardEvent) => { if (e.key === "ArrowLeft") prevImage(); if (e.key === "ArrowRight") nextImage(); if (e.key === "Escape") closeLightbox(); }}
            tabIndex={0}
          >
            {/* Close */}
            <button onClick={closeLightbox} className="absolute top-6 right-6 text-cream-muted hover:text-cream text-2xl cursor-pointer z-10">✕</button>
            {/* Counter */}
            <div className="absolute top-6 left-6 text-cream-faint text-[13px] font-cinzel">{lightbox + 1} / {OPTIONS.length}</div>
            {/* Prev */}
            <button onClick={(e: React.MouseEvent) => { e.stopPropagation(); prevImage(); }} className="absolute left-4 top-1/2 -translate-y-1/2 text-cream-muted hover:text-gold-primary text-3xl cursor-pointer z-10">‹</button>
            {/* Image */}
            <motion.div
              key={lightbox}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative w-full max-w-4xl aspect-video rounded-xl overflow-hidden"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              <Image src={OPTIONS[lightbox].image} alt={OPTIONS[lightbox].title} fill className="object-contain" sizes="100vw" />
            </motion.div>
            {/* Next */}
            <button onClick={(e: React.MouseEvent) => { e.stopPropagation(); nextImage(); }} className="absolute right-4 top-1/2 -translate-y-1/2 text-cream-muted hover:text-gold-primary text-3xl cursor-pointer z-10">›</button>
            {/* Caption */}
            <p className="absolute bottom-8 text-cream-muted text-[14px] font-cormorant italic">{OPTIONS[lightbox].title}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InteractiveSelector;
