"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bed, 
  Beer, 
  PartyPopper, 
  Trees, 
  Gamepad2 
} from 'lucide-react';

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
  
  const handleOptionClick = (index: number) => {
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  };

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

      {/* Options Container */}
      <div className="flex w-full max-w-[1000px] min-w-[320px] h-[500px] items-stretch overflow-hidden relative px-4 md:px-0">
        {OPTIONS.map((option, index) => (
          <div
            key={index}
            className={`
              relative flex flex-col justify-end overflow-hidden transition-all duration-700 ease-in-out
              ${activeIndex === index ? 'flex-[7] border-white' : 'flex-[1] border-gold-primary/20'}
              min-w-[60px] cursor-pointer bg-forest border-2
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
            {/* Shadow effect */}
            <div 
              className={`absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-700 ${
                activeIndex === index ? 'opacity-100' : 'opacity-40'
              }`}
            />
            
            {/* Label with icon and info */}
            <div className="absolute left-0 right-0 bottom-5 flex items-center justify-start h-12 z-10 pointer-events-none px-4 gap-3 w-full">
              <div className="min-w-[44px] max-w-[44px] h-[44px] flex items-center justify-center rounded-full bg-forest-dark/80 backdrop-blur-md shadow-lg border border-gold-primary/30 flex-shrink-0 transition-all duration-200">
                {option.icon}
              </div>
              <div className="text-white whitespace-nowrap relative overflow-hidden">
                <div 
                  className="font-playfair text-xl transition-all duration-700 ease-in-out"
                  style={{
                    opacity: activeIndex === index ? 1 : 0,
                    transform: activeIndex === index ? 'translateX(0)' : 'translateX(25px)'
                  }}
                >
                  {option.title}
                </div>
                <div 
                  className="text-sm text-cream-muted transition-all duration-700 ease-in-out"
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
    </div>
  );
};

export default InteractiveSelector;
