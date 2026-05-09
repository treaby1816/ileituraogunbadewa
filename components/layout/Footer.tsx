import Link from "next/link";
import Image from "next/image";

const QUICK_LINKS = [
  { href: "/", label: "Home" },
  { href: "/rooms", label: "Rooms & Suites" },
  { href: "/amenities", label: "Amenities" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
  { href: "/booking", label: "Book a Room" },
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
              <div className="w-12 h-12 rounded-full overflow-hidden shadow-[0_0_16px_rgba(201,168,76,0.35)] group-hover:shadow-[0_0_24px_rgba(201,168,76,0.6)] transition-shadow">
                <Image unoptimized={true}
                  src="/images/logo.png"
                  alt="Ilé Ìtura Ògúnbádéwà Logo"
                  width={48}
                  height={48}
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
                { icon: "f", label: "Facebook", href: "#" },
                { icon: "ig", label: "Instagram", href: "#" },
                { icon: "x", label: "X / Twitter", href: "#" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-9 h-9 rounded-full border border-gold-primary/25 flex items-center justify-center text-gold-primary/60 text-[11px] hover:border-gold-primary hover:text-gold-primary hover:bg-gold-primary/10 transition-all"
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
                  Off Awolowo Way,
                  <br />
                  Ikorodu, Lagos State
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
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-cream-faint">
          <p>© {new Date().getFullYear()} Ilé Ìtura Ògúnbádéwà. All rights reserved.</p>
          <div className="flex gap-4">
            <p>Developed by Treabyn Inc.</p>
            <Link href="/dashboard" className="hover:text-gold-primary transition-colors">Admin Dashboard</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
