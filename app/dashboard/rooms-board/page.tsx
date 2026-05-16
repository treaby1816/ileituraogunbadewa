"use client";
import { useState, useEffect } from "react";
import { createBrowserClient } from "@/lib/supabase-browser";

export default function RoomsBoardPage() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  
  const supabase = createBrowserClient();

  useEffect(() => {
    fetchRooms();
  }, [supabase]);

  const fetchRooms = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("room_status_today")
      .select("*")
      .order("room_name", { ascending: true });
    
    setRooms(data ?? []);
    setLoading(false);
  };

  const STATUS_COLORS: Record<string, { bg: string, border: string, text: string, label: string, icon: string }> = {
    available:           { bg: "bg-green-500/10", border: "border-green-500/30", text: "text-green-400", label: "Available", icon: "✨" },
    occupied:            { bg: "bg-red-500/10",   border: "border-red-500/30",   text: "text-red-400",   label: "Occupied", icon: "🛌" },
    checking_in_today:   { bg: "bg-blue-500/10",  border: "border-blue-500/30",  text: "text-blue-400",  label: "Checking In", icon: "📥" },
    checking_out_today:  { bg: "bg-amber-500/10", border: "border-amber-500/30", text: "text-amber-400", label: "Checking Out", icon: "📤" },
    maintenance:         { bg: "bg-gray-500/10",  border: "border-gray-500/30",  text: "text-gray-400",  label: "Maintenance", icon: "🔧" },
  };

  const filteredRooms = rooms.filter(r => filter === "all" || r.room_status === filter);

  // Status counts
  const counts = rooms.reduce((acc, r) => {
    acc[r.room_status] = (acc[r.room_status] || 0) + 1;
    acc.all = acc.all + 1;
    return acc;
  }, { all: 0 } as Record<string, number>);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      <div className="flex justify-between items-end">
        <div>
           <p className="font-cinzel text-[10px] tracking-[0.2em] text-gold-primary uppercase">
            Front Desk Administration
          </p>
          <h1 className="font-playfair text-3xl text-cream mt-1">Live Room Board</h1>
        </div>
        <div className="flex gap-2">
            <button onClick={fetchRooms} className="px-4 py-2 border border-gold-primary/30 rounded-xl text-cream text-sm hover:bg-gold-primary/10 transition-colors">
                🔄 Refresh
            </button>
        </div>
      </div>

      {/* Status Filters */}
      <div className="flex flex-wrap gap-3">
        <button 
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-xl border text-sm transition-colors ${filter === "all" ? "bg-gold-primary/20 border-gold-primary text-gold-primary font-bold" : "bg-forest/40 border-gold-primary/20 text-cream/70 hover:border-gold-primary/50"}`}
        >
          All Rooms ({counts.all || 0})
        </button>
        {Object.entries(STATUS_COLORS).map(([key, info]) => (
          <button 
            key={key}
            onClick={() => setFilter(key)}
            className={`px-4 py-2 rounded-xl border text-sm transition-colors flex items-center gap-2 ${filter === key ? `${info.bg} ${info.border} ${info.text} font-bold` : `bg-forest/40 border-gold-primary/20 text-cream/70 hover:border-gold-primary/50`}`}
          >
            <span>{info.icon}</span> {info.label} ({counts[key] || 0})
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="py-20 text-center text-cream/40">Loading room statuses...</div>
      ) : filteredRooms.length === 0 ? (
        <div className="py-20 text-center text-cream/40">No rooms match the selected filter.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredRooms.map((room) => {
            const s = STATUS_COLORS[room.room_status] || STATUS_COLORS.available;
            return (
              <div key={room.id} className={`p-5 rounded-2xl border ${s.bg} ${s.border} relative overflow-hidden group`}>
                {/* Top header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-cream">{room.room_name}</h3>
                    <p className="text-xs text-cream/50 capitalize mt-0.5">{room.type}</p>
                  </div>
                  <span className={`text-2xl opacity-70`}>{s.icon}</span>
                </div>

                {/* Body Details */}
                <div className="space-y-3 min-h-[80px]">
                   <div className="inline-block px-2.5 py-1 rounded-md bg-black/20 border border-white/5">
                        <span className={`text-xs font-bold tracking-wide uppercase ${s.text}`}>
                            {s.label}
                        </span>
                    </div>

                    {room.guest_name && (
                        <div className="pt-2 border-t border-white/5">
                            <p className="text-xs text-cream/50 mb-0.5">Guest</p>
                            <p className="text-sm font-medium text-cream truncate">{room.guest_name}</p>
                        </div>
                    )}
                </div>

                {/* Footer Details */}
                <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-end">
                    {room.check_in && room.check_out ? (
                        <div className="text-[10px] text-cream/40 space-y-1">
                            <p>In: <span className="text-cream/80">{room.check_in}</span></p>
                            <p>Out: <span className="text-cream/80">{room.check_out}</span></p>
                        </div>
                    ) : (
                        <div className="text-[10px] text-cream/30">No active booking</div>
                    )}
                    
                    {room.booking_ref && (
                         <div className="text-[10px] font-mono text-gold-primary/70 bg-gold-primary/10 px-2 py-0.5 rounded">
                            {room.booking_ref}
                        </div>
                    )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
