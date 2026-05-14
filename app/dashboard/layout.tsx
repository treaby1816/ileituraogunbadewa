"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { 
  LayoutDashboard, 
  CalendarCheck, 
  MessageSquare, 
  LogOut,
  Menu,
  Receipt,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/bookings", label: "Bookings", icon: CalendarCheck },
  { href: "/dashboard/expenses", label: "Expenses", icon: Receipt },
  { href: "/dashboard/inquiries", label: "Inquiries", icon: MessageSquare },
];


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // If we are on the login page, don't show the dashboard sidebar
  if (pathname === "/dashboard/login") {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/dashboard/login");
    router.refresh();
  };

  const SidebarContent = () => (
    <>
      <div className="p-6 mb-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden shadow-[0_0_16px_rgba(201,168,76,0.35)]">
            <Image src="/images/logo.png" alt="Logo" width={40} height={40} className="object-cover" />
          </div>
          <div>
            <p className="font-playfair text-[15px] text-cream leading-tight">Admin Portal</p>
            <p className="font-cinzel text-[9px] text-gold-primary tracking-widest uppercase">Ilé Ìtura</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive 
                  ? "bg-gold-primary/10 text-gold-primary border border-gold-primary/20" 
                  : "text-cream-muted hover:bg-white/5 hover:text-cream border border-transparent"
              }`}
            >
              <Icon size={18} className={isActive ? "text-gold-primary" : "text-cream-muted"} />
              <span className="font-dm-sans text-[14px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto space-y-2">
        <Link 
          href="/"
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-cream-muted hover:bg-white/5 hover:text-cream transition-colors border border-transparent"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
          <span className="font-dm-sans text-[14px] font-medium">Main Website</span>
        </Link>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-400 hover:bg-red-400/10 transition-colors border border-transparent hover:border-red-400/20"
        >
          <LogOut size={18} />
          <span className="font-dm-sans text-[14px] font-medium">Sign Out</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-forest-black flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-gold-primary/10 bg-forest-dark/50 shrink-0 sticky top-0 h-screen">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden flex">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <aside className="relative flex flex-col w-64 bg-forest-dark border-r border-gold-primary/20 h-full">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between p-4 border-b border-gold-primary/10 bg-forest-dark/50 sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full overflow-hidden">
              <Image src="/images/logo.png" alt="Logo" width={32} height={32} className="object-cover" />
            </div>
            <span className="font-playfair text-cream text-[15px]">Admin Portal</span>
          </div>
          <button 
            onClick={() => setMobileMenuOpen(true)}
            className="w-10 h-10 flex items-center justify-center text-gold-primary border border-gold-primary/20 rounded-lg hover:bg-gold-primary/10"
          >
            <Menu size={20} />
          </button>
        </header>

        <div className="flex-1 p-4 md:p-8 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
