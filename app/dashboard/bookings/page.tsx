import { createServiceClient } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export default async function BookingsPage() {
  const supabase = await createServiceClient();
  const { data: bookings } = await supabase
    .from("bookings")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-playfair text-3xl text-cream mb-1">Bookings</h1>
        <p className="text-cream/50 text-[14px]">Manage all room reservations.</p>
      </div>

      <div className="bg-forest-dark border border-gold-primary/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-cream/70">
            <thead className="bg-white/5 text-gold-primary font-cinzel text-[10px] tracking-widest uppercase">
              <tr>
                <th className="px-6 py-4 font-medium">Ref</th>
                <th className="px-6 py-4 font-medium">Guest</th>
                <th className="px-6 py-4 font-medium">Room</th>
                <th className="px-6 py-4 font-medium">Check In</th>
                <th className="px-6 py-4 font-medium">Check Out</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {bookings?.map((b) => (
                <tr key={b.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 font-mono text-gold-primary/70">{b.booking_ref}</td>
                  <td className="px-6 py-4">
                    <p className="text-cream">{b.guest_name}</p>
                    <p className="text-[11px] text-cream/40">{b.guest_phone}</p>
                  </td>
                  <td className="px-6 py-4 capitalize">{b.room_type}</td>
                  <td className="px-6 py-4">{new Date(b.check_in).toLocaleDateString()}</td>
                  <td className="px-6 py-4">{new Date(b.check_out).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider ${
                      b.status === "confirmed" ? "bg-green-500/10 text-green-400 border border-green-500/20" :
                      b.status === "cancelled" ? "bg-red-500/10 text-red-400 border border-red-500/20" :
                      "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                    }`}>
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
              {!bookings?.length && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-cream/40">
                    No bookings found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
