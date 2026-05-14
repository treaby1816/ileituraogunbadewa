import { createServiceClient } from "@/lib/supabase-server";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { formatNaira } from "@/lib/utils";
import { CalendarCheck, DollarSign, MessageSquare } from "lucide-react";

async function getDashboardData() {
  try {
    const supabase = await createServiceClient();

    // Fetch bookings
    const { data: bookings } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });

    // Fetch inquiries
    const { data: inquiries } = await supabase
      .from("inquiries")
      .select("*")
      .order("created_at", { ascending: false });

    // Calculate totals
    const totalBookings = bookings?.length || 0;
    const totalInquiries = inquiries?.length || 0;
    
    // Calculate revenue based on room types (Standard: 15k, Deluxe: 22k, Suite: 35k, Hall: 500k)
    let totalRevenue = 0;
    const prices: Record<string, number> = { 
      standard: 15000, 
      deluxe: 22000, 
      suite: 35000,
      hall: 500000
    };
    
    bookings?.forEach((b) => {
      // For room bookings, we estimate 1 night if dates are missing, or calculate properly
      const roomType = b.room_type?.toLowerCase();
      totalRevenue += prices[roomType] || 0;
    });

    return { bookings: bookings || [], inquiries: inquiries || [], totalBookings, totalInquiries, totalRevenue };
  } catch (error) {
    console.error("Dashboard data fetch error:", error);
    return { bookings: [], inquiries: [], totalBookings: 0, totalInquiries: 0, totalRevenue: 0 };
  }
}

export const dynamic = "force-dynamic";

export default async function DashboardOverview() {
  const { bookings, inquiries, totalBookings, totalInquiries, totalRevenue } = await getDashboardData();

  const STATS = [
    { label: "Total Revenue", value: formatNaira(totalRevenue), icon: DollarSign },
    { label: "Total Bookings", value: totalBookings.toString(), icon: CalendarCheck },
    { label: "Total Inquiries", value: totalInquiries.toString(), icon: MessageSquare },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-playfair text-3xl text-cream mb-1">Dashboard Overview</h1>
        <p className="text-cream-muted text-[14px]">Welcome back. Here is what&apos;s happening with your hotel today.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {STATS.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="bg-forest-dark border border-gold-primary/10 rounded-2xl p-6 relative overflow-hidden hover:-translate-y-1 hover:border-gold-primary/25 hover:shadow-[0_16px_40px_rgba(201,168,76,0.08)] transition-all duration-300 group">
              <div className="absolute -top-4 -right-4 text-gold-primary/5 group-hover:text-gold-primary/10 transition-colors duration-300">
                <Icon size={120} />
              </div>
              <div className="relative z-10">
                <p className="font-cinzel text-[11px] tracking-widest text-gold-primary uppercase mb-2">{s.label}</p>
                <p className="font-playfair text-4xl text-cream">{s.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-forest-dark border border-gold-primary/10 rounded-2xl p-6 hover:border-gold-primary/20 transition-all duration-300">
          <h2 className="font-playfair text-xl text-cream mb-6">Revenue & Bookings Trend</h2>
          <RevenueChart bookings={bookings} />
        </div>

        {/* Recent Activity */}
        <div className="bg-forest-dark border border-gold-primary/10 rounded-2xl p-6 hover:border-gold-primary/20 transition-all duration-300">
          <h2 className="font-playfair text-xl text-cream mb-6">Recent Inquiries</h2>
          <div className="space-y-4">
            {inquiries.slice(0, 5).map((inq) => (
              <div key={inq.id} className="border-b border-white/5 pb-4 last:border-0 last:pb-0">
                <div className="flex justify-between items-start mb-1">
                  <p className="font-dm-sans font-medium text-cream text-[14px]">{inq.name}</p>
                  <span className="text-[10px] bg-gold-primary/10 text-gold-primary px-2 py-0.5 rounded-full">
                    {inq.inquiry_type}
                  </span>
                </div>
                <p className="text-cream-muted text-[12px] line-clamp-2">{inq.message}</p>
              </div>
            ))}
            {inquiries.length === 0 && (
              <p className="text-cream-faint text-[13px] text-center py-4">No recent inquiries.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
