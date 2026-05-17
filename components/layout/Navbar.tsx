"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useScrollPosition } from "@/hooks/useScrollPosition";
import { Button } from "@/components/ui/Button";
import { useTheme } from "@/components/ThemeProvider";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/rooms", label: "Rooms" },
  { href: "/event-hall", label: "Event Hall" },
  { href: "/amenities", label: "Amenities" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const scrollY = useScrollPosition();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const isScrolled = scrollY > 60;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Hide navbar on dashboard pages
  if (pathname?.startsWith("/dashboard")) return null;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled || menuOpen
            ? "bg-forest-dark/95 backdrop-blur-md shadow-lg shadow-black/30 border-b border-gold-primary/10"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-10 h-[88px] md:h-24 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full overflow-hidden shadow-[0_0_16px_rgba(201,168,76,0.4)] group-hover:shadow-[0_0_24px_rgba(201,168,76,0.6)] transition-shadow bg-forest-black">
              <Image
                src="/images/logo.png"
                alt="Ilé Ìtura Ògúnbádéwà Logo"
                width={40}
                height={40}
                className="object-cover"
                priority
              />
            </div>
            <div className="hidden sm:block">
              <p className="font-cinzel text-[9px] tracking-[0.2em] text-gold-primary uppercase leading-none">
                Ikorodu · Lagos
              </p>
              <p className="font-playfair text-[15px] text-cream leading-tight">
                Ilé Ìtura Ògúnbádéwà
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`px-4 py-2 rounded-lg font-cinzel text-[11px] font-bold tracking-[0.08em] uppercase transition-all duration-200 ${
                  pathname === href
                    ? "text-gold-primary bg-gold-primary/10"
                    : "text-cream-muted hover:text-cream hover:bg-white/5"
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-4">

            {/* Theme Toggle */}
            {mounted && (
              <button
                onClick={toggleTheme}
                className="w-9 h-9 rounded-full border border-gold-primary/25 flex items-center justify-center
                           text-gold-primary hover:bg-gold-primary/10 hover:border-gold-primary/50
                           transition-all duration-300 cursor-pointer"
                aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              >
                {theme === "dark" ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                    <circle cx="12" cy="12" r="5" />
                    <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                    <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                )}
              </button>
            )}

            <Button href="/booking" variant="primary" size="sm" className="hidden md:flex">
              Book Your Stay
            </Button>
            {/* Hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden w-10 h-10 -mr-2 flex flex-col items-center justify-center gap-[5.5px] rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
              aria-label="Toggle menu"
            >
              <span
                className={`block w-6 h-[1.5px] bg-gold-primary transition-all duration-300 ${
                  menuOpen ? "rotate-45 translate-y-[7px]" : ""
                }`}
              />
              <span
                className={`block w-6 h-[1.5px] bg-gold-primary transition-all duration-300 ${
                  menuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block w-6 h-[1.5px] bg-gold-primary transition-all duration-300 ${
                  menuOpen ? "-rotate-45 -translate-y-[7px]" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-[88px] z-40 bg-forest-dark/98 backdrop-blur-xl border-b border-gold-primary/15 lg:hidden"
          >
            <nav className="flex flex-col p-6 gap-2">
              {NAV_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className={`py-3 px-4 rounded-xl font-cinzel text-[12px] tracking-[0.1em] uppercase transition-all ${
                    pathname === href
                      ? "text-gold-primary bg-gold-primary/10 border border-gold-primary/20"
                      : "text-cream-muted hover:text-cream hover:bg-white/5"
                  }`}
                >
                  {label}
                </Link>
              ))}
              <Button
                href="/booking"
                variant="primary"
                className="mt-4 w-full justify-center"
                onClick={() => setMenuOpen(false)}
              >
                Book Your Stay
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
