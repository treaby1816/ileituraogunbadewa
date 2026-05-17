"use client";

import { useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export function RevenueChart({ bookings }: { bookings: any[] }) {
  // Aggregate mock data by date
  const data = useMemo(() => {
    const prices: Record<string, number> = { standard: 15000, deluxe: 22000, suite: 35000, hall: 500000 };
    const grouped: Record<string, { date: string; revenue: number; bookings: number }> = {};

    bookings.forEach((b) => {
      // Use created_at or check_in date
      const dateObj = new Date(b.created_at);
      const dateStr = dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      
      if (!grouped[dateStr]) {
        grouped[dateStr] = { date: dateStr, revenue: 0, bookings: 0 };
      }
      
      grouped[dateStr].bookings += 1;
      grouped[dateStr].revenue += prices[b.room_type] || 0;
    });

    const sortedData = Object.values(grouped).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    // If no data, return some dummy layout points
    if (sortedData.length === 0) {
      return [
        { date: "May 1", revenue: 0, bookings: 0 },
        { date: "May 2", revenue: 0, bookings: 0 },
        { date: "May 3", revenue: 0, bookings: 0 },
      ];
    }
    
    return sortedData;
  }, [bookings]);

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#C9A84C" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#C9A84C" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--theme-cream-faint)" vertical={false} />
          <XAxis 
            dataKey="date" 
            stroke="var(--theme-charcoal)" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false}
          />
          <YAxis 
            stroke="var(--theme-charcoal)" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false}
            tickFormatter={(value) => `₦${(value / 1000)}k`}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: "var(--theme-forest-dark)", borderColor: "var(--theme-gold-primary)", borderRadius: "12px", color: "var(--theme-cream)" }}
            itemStyle={{ color: "var(--theme-gold-primary)" }}
          />
          <Area 
            type="monotone" 
            dataKey="revenue" 
            stroke="#C9A84C" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorRevenue)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
