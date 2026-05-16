"use client";
import { useState, useEffect } from "react";
import { createBrowserClient } from "@/lib/supabase-browser";
import Link from "next/link";
import { formatNaira } from "@/lib/utils";

export default function FrontDeskPage() {
  const [roomStatus, setRoomStatus] = useState<any[]>([]);
  const [todayBookings, setTodayBookings] = useState<{ checkins: any[], checkouts: any[] }>({ checkins: [], checkouts: [] });
  const [todayHallEvents, setTodayHallEvents] = useState<any[]>([]);
  const [shiftLog, setShiftLog] = useState<any[]>([]);
  
  const supabase = createBrowserClient();
  const today = new Date().toISOString().split("T")[0];

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchDashboardData() {
      setIsLoading(true);
      try {
        const [roomRes, checkinsRes, checkoutsRes, receiptsRes, hallRes] = await Promise.allSettled([
          supabase.from("room_status_today").select("*"),
          supabase.from("bookings").select("*, room:rooms(name,type)").eq("check_in", today).eq("status", "confirmed"),
          supabase.from("bookings").select("*, room:rooms(name,type)").eq("check_out", today).eq("status", "confirmed"),
          supabase.from("receipts").select("*").gte("created_at", today + "T00:00:00").order("created_at", { ascending: false }),
          supabase.from("hall_bookings").select("*").eq("event_date", today).eq("status", "confirmed")
        ]);

        if (!isMounted) return;

        if (roomRes.status === "fulfilled" && !roomRes.value.error) {
          setRoomStatus(roomRes.value.data ?? [] as any);
        }

        const newBookingsState = { checkins: [] as any[], checkouts: [] as any[] };
        if (checkinsRes.status === "fulfilled" && !checkinsRes.value.error) {
          newBookingsState.checkins = checkinsRes.value.data ?? [];
        }
        if (checkoutsRes.status === "fulfilled" && !checkoutsRes.value.error) {
          newBookingsState.checkouts = checkoutsRes.value.data ?? [];
        }
        setTodayBookings(newBookingsState);

        if (receiptsRes.status === "fulfilled" && !receiptsRes.value.error) {
          setShiftLog(receiptsRes.value.data ?? [] as any);
        }

        if (hallRes.status === "fulfilled" && !hallRes.value.error) {
          setTodayHallEvents(hallRes.value.data ?? [] as any);
        }

      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchDashboardData();

    // Setup live clock for header
    const clockInterval = setInterval(() => {
      const el = document.getElementById("shift-clock");
      if (el) el.innerText = new Date().toLocaleTimeString('en-NG');
    }, 1000);

    return () => { 
      isMounted = false; 
      clearInterval(clockInterval);
    };
  }, [today, supabase]);

  const STATUS_COLORS: Record<string, { bg: string, border: string, text: string, label: string }> = {
    available:           { bg: "bg-green-500/15", border: "border-green-500/40", text: "text-green-400", label: "Available" },
    occupied:            { bg: "bg-red-500/15",   border: "border-red-500/40",   text: "text-red-400",   label: "Occupied" },
    checking_in_today:   { bg: "bg-blue-500/15",  border: "border-blue-500/40",  text: "text-blue-400",  label: "Checking In Today" },
    checking_out_today:  { bg: "bg-amber-500/15", border: "border-amber-500/40", text: "text-amber-400", label: "Checking Out" },
    maintenance:         { bg: "bg-gray-500/15",  border: "border-gray-500/30",  text: "text-gray-400",  label: "Maintenance" },
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="font-cinzel text-[10px] tracking-[0.2em] text-gold-primary uppercase">
            Front Desk Terminal
          </p>
          <h1 className="font-playfair text-3xl text-cream mt-1">
            {new Date().toLocaleDateString("en-NG", {
              weekday: "long", day: "numeric", month: "long", year: "numeric"
            })}
          </h1>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-cream/40 text-xs">Current Time</p>
          <p className="text-gold-primary font-bold text-lg font-mono" id="shift-clock">
             {new Date().toLocaleTimeString('en-NG')}
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-4">
          <div className="w-8 h-8 rounded-full border-2 border-gold-primary border-t-transparent animate-spin"></div>
          <p className="text-cream/60 text-sm animate-pulse font-cinzel">Syncing Front Desk...</p>
        </div>
      ) : (
        <>


          {/* Quick Action Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { href: "/dashboard/front-desk/room", icon: "🛏️", label: "Book a Room",      sub: "Walk-in guest" },
              { href: "/dashboard/front-desk/hall", icon: "🏛️", label: "Book Event Hall",  sub: "Event client" },
              { href: "/dashboard/receipts",        icon: "🖨️", label: "Print Receipt",    sub: "Reprint / archive" },
              { href: "/dashboard/rooms-board",     icon: "📋", label: "Room Status",      sub: "Full board view" },
            ].map(card => (
              <Link
                key={card.href}
                href={card.href}
                className="p-5 rounded-2xl border transition-all hover:-translate-y-1 hover:shadow-lg
                           bg-gradient-to-br from-forest/60 to-forest-dark
                           border-gold-primary/20 hover:border-gold-primary/50
                           flex flex-col items-center text-center gap-2 group"
              >
                <span className="text-4xl">{card.icon}</span>
                <p className="font-cinzel text-[11px] tracking-wide text-cream uppercase font-bold mt-2">
                  {card.label}
                </p>
                <p className="text-cream/40 text-xs">{card.sub}</p>
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Room Status Board */}
            <div className="lg:col-span-2 bg-gradient-to-br from-forest/60 to-forest-dark
                            rounded-2xl border border-gold-primary/15 overflow-hidden flex flex-col h-[500px]">
              <div className="px-5 py-4 border-b border-gold-primary/10 flex justify-between shrink-0">
                <p className="font-cinzel text-[11px] tracking-wide text-gold-primary uppercase">
                  Room Status Board
                </p>
                <span className="text-cream/40 text-xs">{roomStatus.length} rooms total</span>
              </div>
              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-y-auto">
                {roomStatus.map((room: any) => {
                  const s = STATUS_COLORS[room.room_status] || STATUS_COLORS.available;
                  return (
                    <div key={room.id}
                      className={`p-4 rounded-xl border ${s.bg} ${s.border} flex gap-3 items-start`}>
                      <div className="flex-1 min-w-0">
                        <p className="text-cream font-medium text-sm truncate">{room.room_name}</p>
                        <p className="text-cream/50 text-xs capitalize">{room.type}</p>
                        {room.guest_name && (
                          <p className="text-cream/70 text-xs mt-1 truncate">
                            👤 {room.guest_name}
                          </p>
                        )}
                        {room.check_out && (
                          <p className="text-cream/50 text-xs">
                            Out: {room.check_out}
                          </p>
                        )}
                      </div>
                      <span className={`text-xs font-bold ${s.text} flex-shrink-0`}>
                        {s.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Today's Activity Sidebar */}
            <div className="space-y-4 h-[500px] overflow-y-auto pr-2 custom-scrollbar">

              {/* Hall Events Today */}
              <div className="bg-gradient-to-br from-forest/60 to-forest-dark
                              rounded-2xl border border-blue-500/20 overflow-hidden">
                <div className="px-4 py-3 border-b border-blue-500/15 flex justify-between">
                  <p className="font-cinzel text-[10px] tracking-wide text-blue-400 uppercase">
                    Hall Events Today
                  </p>
                  <span className="text-blue-400 font-bold">{todayHallEvents.length}</span>
                </div>
                <div className="p-3 space-y-2">
                  {todayHallEvents.length === 0
                    ? <p className="text-cream/30 text-xs text-center py-2">No events today</p>
                    : todayHallEvents.map((h: any) => (
                      <div key={h.id} className="flex justify-between items-center border-b border-white/5 pb-2 last:border-0 last:pb-0">
                        <div>
                          <p className="text-cream text-xs font-medium">{h.client_name}</p>
                          <p className="text-cream/40 text-[10px]">{h.hall_name} • {h.event_type}</p>
                        </div>
                        <span className="text-blue-400 text-[10px] font-bold">{h.event_start_time || 'TBD'}</span>
                      </div>
                    ))
                  }
                </div>
              </div>

              {/* Check-ins today */}
              <div className="bg-gradient-to-br from-forest/60 to-forest-dark
                              rounded-2xl border border-green-500/20 overflow-hidden">
                <div className="px-4 py-3 border-b border-green-500/15 flex justify-between">
                  <p className="font-cinzel text-[10px] tracking-wide text-green-400 uppercase">
                    Check-ins Today
                  </p>
                  <span className="text-green-400 font-bold">{todayBookings.checkins.length}</span>
                </div>
                <div className="p-3 space-y-2">
                  {todayBookings.checkins.length === 0
                    ? <p className="text-cream/30 text-xs text-center py-2">None scheduled</p>
                    : todayBookings.checkins.map((b: any) => (
                      <div key={b.id} className="flex justify-between items-center border-b border-white/5 pb-2 last:border-0 last:pb-0">
                        <div>
                          <p className="text-cream text-xs font-medium">{b.guest_name}</p>
                          <p className="text-cream/40 text-[10px]">{b.room?.name}</p>
                        </div>
                        <span className="text-green-400 text-[10px] font-mono">{b.booking_ref}</span>
                      </div>
                    ))
                  }
                </div>
              </div>

              {/* Check-outs today */}
              <div className="bg-gradient-to-br from-forest/60 to-forest-dark
                              rounded-2xl border border-amber-500/20 overflow-hidden">
                <div className="px-4 py-3 border-b border-amber-500/15 flex justify-between">
                  <p className="font-cinzel text-[10px] tracking-wide text-amber-400 uppercase">
                    Check-outs Today
                  </p>
                  <span className="text-amber-400 font-bold">{todayBookings.checkouts.length}</span>
                </div>
                <div className="p-3 space-y-2">
                  {todayBookings.checkouts.length === 0
                    ? <p className="text-cream/30 text-xs text-center py-2">None scheduled</p>
                    : todayBookings.checkouts.map((b: any) => (
                      <div key={b.id} className="flex justify-between items-center border-b border-white/5 pb-2 last:border-0 last:pb-0">
                        <div>
                          <p className="text-cream text-xs font-medium">{b.guest_name}</p>
                          <p className="text-cream/40 text-[10px]">{b.room?.name}</p>
                        </div>
                        <span className="text-amber-400 text-[10px] font-mono">{b.booking_ref}</span>
                      </div>
                    ))
                  }
                </div>
              </div>

            </div>
          </div>
        </>
      )}
    </div>
  );
}
