import Link from "next/link";
import Image from "next/image";

const QUICK_LINKS = [
  { href: "/", label: "Home" },
  { href: "/rooms", label: "Rooms & Suites" },
  { href: "/event-hall", label: "Event Hall" },
  { href: "/amenities", label: "Amenities" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
  { href: "/booking", label: "Book a Room/Hall" },
];

export function Footer() {
  return (
    <footer className="bg-forest-black border-t border-gold-primary/12">
      {/* Top gold divider */}
      <div className="h-[2px] bg-linear-to-r from-transparent via-gold-primary to-transparent opacity-40" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand col */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-5 group cursor-pointer block w-max">
              <div className="w-12 h-12 rounded-full overflow-hidden shadow-[0_0_16px_rgba(201,168,76,0.35)] group-hover:shadow-[0_0_24px_rgba(201,168,76,0.6)] transition-shadow bg-forest-black">
                <Image
                  src="/images/logo.png"
                  alt="Ilé Ìtura Ògúnbádéwà Logo"
                  width={60}
                  height={60}
                  className="object-cover"
                />
              </div>
              <div>
                <p className="font-playfair text-[16px] text-cream leading-tight">
                  Ilé Ìtura
                </p>
                <p className="font-playfair text-[13px] text-cream-muted leading-tight">
                  Ògúnbádéwà
                </p>
              </div>
            </Link>
            <p className="font-cormorant italic text-cream-muted text-[15px] leading-relaxed mb-6">
              &ldquo;…Embrace Comfort,
              <br />
              Enjoy Luxury&rdquo;
            </p>
            {/* Socials */}
            <div className="flex gap-3">
              {[
                { 
                  icon: (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  ), 
                  label: "Facebook", 
                  href: "#" 
                },
                { 
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                  ), 
                  label: "Instagram", 
                  href: "https://instagram.com/ileituraogunbadewa" 
                },
                { 
                  icon: (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.6-4.13-1.47-.23-.16-.44-.34-.64-.53v6.34c0 2.1-.55 4.3-2.12 5.73-1.57 1.44-3.87 1.95-5.89 1.43-2.02-.52-3.72-2.14-4.24-4.11-.53-1.98-.01-4.28 1.43-5.85 1.44-1.57 3.64-2.12 5.73-1.57.16.04.31.09.46.15v4.11c-.51-.23-1.08-.34-1.64-.34-1.65 0-3 1.35-3 3s1.35 3 3 3 3-1.35 3-3V0z"/>
                    </svg>
                  ), 
                  label: "TikTok", 
                  href: "https://www.tiktok.com/@ileituraogunbadewa" 
                },
                { 
                  icon: (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  ), 
                  label: "Twitter", 
                  href: "https://twitter.com/ileiturahotel" 
                },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="w-9 h-9 rounded-full border border-gold-primary/25 flex items-center justify-center text-gold-primary/60 hover:border-gold-primary hover:text-gold-primary hover:bg-gold-primary/10 transition-all"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-cinzel text-[10px] tracking-[0.18em] uppercase text-gold-primary mb-5">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {QUICK_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-cream-muted text-[13px] hover:text-gold-primary transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-3 h-[1px] bg-gold-primary/40 group-hover:w-4 group-hover:bg-gold-primary transition-all" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-cinzel text-[10px] tracking-[0.18em] uppercase text-gold-primary mb-5">
              Contact Us
            </h4>
            <ul className="space-y-4 text-[13px]">
              <li className="flex gap-3">
                <span className="text-gold-primary mt-0.5 text-base">📍</span>
                <span className="text-cream-muted leading-relaxed">
                  Saheed Anibaba Street,
                  <br />
                  Off Obafemi Awolowo Way
                  <br />
                  (Near Grammar School / Baba Ijebu),
                  <br />
                  Ikorodu, Lagos State, Nigeria
                </span>
              </li>
              <li>
                <a
                  href="tel:08129041015"
                  className="flex gap-3 text-cream-muted hover:text-gold-primary transition-colors"
                >
                  <span className="text-gold-primary text-base">📞</span>
                  08129041015
                </a>
              </li>
              <li>
                <a
                  href="tel:08060721283"
                  className="flex gap-3 text-cream-muted hover:text-gold-primary transition-colors"
                >
                  <span className="text-gold-primary text-base">📞</span>
                  08060721283
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/2348129041015"
                  target="_blank"
                  rel="noreferrer"
                  className="flex gap-3 text-cream-muted hover:text-gold-primary transition-colors"
                >
                  <span className="text-base">💬</span>
                  WhatsApp Us
                </a>
              </li>
              <li>
                <a
                  href="mailto:ileitura.hotel@gmail.com"
                  className="flex gap-3 text-cream-muted hover:text-gold-primary transition-colors"
                >
                  <span className="text-gold-primary text-base">✉️</span>
                  ileitura.hotel@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* Hours & Policies */}
          <div>
            <h4 className="font-cinzel text-[10px] tracking-[0.18em] uppercase text-gold-primary mb-5">
              Hours & Policy
            </h4>
            <ul className="space-y-3 text-[13px] text-cream-muted">
              <li className="flex gap-2">
                <span className="text-gold-primary">⏰</span> Front Desk: 24/7
              </li>
              <li className="flex gap-2">
                <span className="text-gold-primary">🏨</span> Check-in: 2:00 PM
              </li>
              <li className="flex gap-2">
                <span className="text-gold-primary">🚪</span> Check-out: 12:00 PM
              </li>
              <li className="flex gap-2">
                <span className="text-gold-primary">💳</span> Pay on Arrival
              </li>
              <li className="flex gap-2">
                <span className="text-gold-primary">🔒</span> 24/7 Security & CCTV
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gold-primary/8 px-4 md:px-8 py-5">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-4 text-[11px] text-cream-faint">
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
            <p>© {new Date().getFullYear()} Ilé Ìtura Ògúnbádéwà. All rights reserved.</p>
            <div className="hidden sm:block w-[1px] h-3 bg-gold-primary/30" />
            <Link href="/privacy" className="hover:text-gold-primary transition-colors">Privacy Policy</Link>
            <div className="hidden sm:block w-[1px] h-3 bg-gold-primary/30" />
            <Link href="/terms" className="hover:text-gold-primary transition-colors">Terms & Conditions</Link>
          </div>
          <div className="flex gap-4">
            <p>Developed by Treabyn Inc.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
