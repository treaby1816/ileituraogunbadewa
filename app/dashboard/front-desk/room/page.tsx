"use client";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
// @ts-ignore
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createBrowserClient } from "@/lib/supabase-browser";
import { formatNaira, calcNights } from "@/lib/utils";
import { RoomReceipt } from "@/components/dashboard/RoomReceipt";
import { useReactToPrint } from "react-to-print";

// npm install react-to-print

const WalkInSchema = z.object({
  room_id:        z.string().min(1, "Select a room"),
  guest_name:     z.string().min(2, "Guest name required"),
  guest_phone:    z.string().min(10, "Valid Nigerian number required"),
  guest_id_type:  z.enum(["nin", "drivers_licence", "passport", "voters_card"]),
  guest_id_number:z.string().min(3, "ID number required"),
  check_in:       z.string().min(1, "Check-in date required"),
  check_out:      z.string().min(1, "Check-out date required"),
  num_guests:     z.number().min(1).max(5),
  amount_paid:    z.number().min(0),
  payment_method: z.enum(["cash", "transfer", "pos"]),
  booked_by:      z.string().min(2, "Enter your name"),
  notes:          z.string().optional(),
});

type WalkInForm = z.infer<typeof WalkInSchema>;

export default function WalkInRoomPage() {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [booking, setBooking] = useState<any>(null);
  const [step, setStep] = useState<"form" | "confirm" | "receipt">("form");
  const [loading, setLoading] = useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);
  const supabase = createBrowserClient();
  const today = new Date().toISOString().split("T")[0];

  const { register, handleSubmit, watch, formState: { errors } } = useForm<WalkInForm>({
    // @ts-ignore
    resolver: zodResolver(WalkInSchema),
    defaultValues: { num_guests: 1, payment_method: "cash", amount_paid: 0 }
  });

  const watchCheckIn  = watch("check_in");
  const watchCheckOut = watch("check_out");
  const watchPaid     = watch("amount_paid");
  const watchRoomId   = watch("room_id");

  const nights = watchCheckIn && watchCheckOut
    ? calcNights(watchCheckIn, watchCheckOut) : 0;
  const totalCost = selectedRoom ? selectedRoom.price * nights : 0;
  const balance   = totalCost - (watchPaid || 0);

  const [loadingRooms, setLoadingRooms] = useState(true);

  // Fetch available rooms on mount
  useEffect(() => {
    supabase.from("rooms").select("*").eq("available", true)
      .then(({ data, error }: { data: any, error: any }) => {
        if (error) {
          toast.error("Failed to fetch rooms");
          console.error(error);
        } else {
          setRooms(data ?? [] as any);
        }
      })
      .catch((err: any) => toast.error("Error loading rooms"))
      .finally(() => setLoadingRooms(false));
  }, [supabase]);

  const handlePrint = useReactToPrint({
    contentRef: receiptRef,
    documentTitle: `Receipt-${booking?.booking_ref}`,
    pageStyle: `
      @page { size: A5 portrait; margin: 10mm; }
      @media print {
        body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      }
    `,
  });

  const onSubmit = async (data: WalkInForm) => {
    setLoading(true);
    
    try {
      const room = rooms.find((r: any) => r.id === data.room_id);
      if (!room) {
        toast.error("Selected room not found");
        setLoading(false);
        return;
      }

      const payment_status = data.amount_paid >= totalCost ? "fully_paid" : "deposit_paid";

      // 1. Create Booking
      const { data: result, error } = await supabase
        .from("bookings")
        .insert({
          room_id:        data.room_id,
          guest_name:     data.guest_name,
          guest_phone:    data.guest_phone,
          check_in:       data.check_in,
          check_out:      data.check_out,
          num_guests:     data.num_guests,
          status:         "confirmed",
          payment_status,
          amount_paid:    data.amount_paid,
          payment_method: data.payment_method,
          booking_source: "walk_in",
          booked_by:      data.booked_by,
          notes:          data.notes,
        })
        .select("booking_ref, receipt_number")
        .single();

      if (error || !result) {
        toast.error("Failed to create booking");
        throw error;
      }

      // 2. Create Receipt
      const { error: receiptError } = await supabase.from("receipts").insert({
        receipt_number: result.receipt_number,
        receipt_type:   "room_booking",
        booking_ref:    result.booking_ref,
        guest_name:     data.guest_name,
        amount:         data.amount_paid,
        payment_method: data.payment_method,
        issued_by:      data.booked_by,
        receipt_data:   { ...data, totalCost, balance, room: selectedRoom },
      });

      if (receiptError) {
        toast.error("Booking saved, but receipt failed. See logs.");
        console.error(receiptError);
      }

      // 3. Log income
      if (data.amount_paid > 0) {
        const { error: txError } = await supabase.from("transactions").insert({
          type:             "income",
          category:         "room_booking",
          description:      `Walk-in room booking — ${result.booking_ref} — ${data.guest_name}`,
          amount:           data.amount_paid,
          booking_ref:      result.booking_ref,
          recorded_by:      data.booked_by,
          transaction_date: today,
        });
        if (txError) {
          toast.error("Booking saved, but failed to log transaction.");
          console.error(txError);
        }
      }

      toast.success("Room booked successfully!");
      setBooking({ ...data, ...result, totalCost, balance, room: selectedRoom });
      setStep("receipt");
    } catch (error) {
      console.error("Booking transaction failed:", error);
    } finally {
      setLoading(false);
    }
  };

  // ── RECEIPT SCREEN ──────────────────────────────────────────────────────────
  if (step === "receipt" && booking) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-playfair text-2xl text-cream">Booking Complete</h1>
          <div className="flex gap-3">
            <button onClick={() => handlePrint()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl
                         bg-gradient-to-r from-gold-primary to-gold-deep
                         text-forest-dark font-bold text-sm font-cinzel">
              🖨️ Print Receipt
            </button>
            <button onClick={() => setStep("form")}
              className="px-5 py-2.5 rounded-xl border border-gold-primary/30
                         text-cream/70 text-sm hover:border-gold-primary/60">
              + New Booking
            </button>
          </div>
        </div>

        {/* Receipt preview */}
        <div className="border border-gold-primary/20 rounded-2xl overflow-hidden">
          <RoomReceipt ref={receiptRef} booking={booking} />
        </div>
      </div>
    );
  }

  // ── BOOKING FORM ────────────────────────────────────────────────────────────
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <p className="font-cinzel text-[10px] tracking-[0.2em] text-gold-primary uppercase">
          Front Desk · Walk-in
        </p>
        <h1 className="font-playfair text-2xl text-cream mt-1">Book a Room</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-5">

        {/* Room selection */}
        <div className="p-5 rounded-2xl border border-gold-primary/20 bg-forest/40">
          <label className="block font-cinzel text-[10px] tracking-[0.15em]
                            text-gold-primary uppercase mb-3">Select Room</label>
          <select
            {...register("room_id")}
            onChange={(e) => {
              const room = rooms.find((r: any) => r.id === e.target.value);
              setSelectedRoom(room || null);
            }}
            disabled={loadingRooms}
            className="w-full bg-white/5 border border-gold-primary/20 rounded-xl
                       px-4 py-3 text-cream text-sm outline-none focus:border-gold-primary/60
                       transition-colors disabled:opacity-50"
          >
            <option value="" style={{ background: "#0D1A0D" }}>
              {loadingRooms ? "Loading available rooms..." : "— Select a Room —"}
            </option>
            {rooms.map((room: any) => (
              <option key={room.id} value={room.id} style={{ background: "#0D1A0D" }}>
                {room.name} ({room.type}) — {formatNaira(room.price)}/night — Max {room.max_guests} guests
              </option>
            ))}
          </select>

          {/* Show selected room details */}
          {selectedRoom && (
            <div className="mt-3 p-3 rounded-xl bg-gold-primary/10 border border-gold-primary/25 flex justify-between items-center">
              <div>
                <p className="text-cream font-medium text-sm">{selectedRoom.name}</p>
                <p className="text-cream/50 text-xs mt-0.5">{selectedRoom.type} · Max {selectedRoom.max_guests} guests</p>
              </div>
              <p className="text-gold-primary font-bold text-lg">{formatNaira(selectedRoom.price)}<span className="text-cream/40 text-xs">/night</span></p>
            </div>
          )}

          {errors.room_id && <p className="text-red-400 text-xs mt-2">{errors.room_id.message}</p>}
        </div>

        {/* Guest details */}
        <div className="p-5 rounded-2xl border border-gold-primary/20 bg-forest/40">
          <p className="font-cinzel text-[10px] tracking-[0.15em] text-gold-primary uppercase mb-4">
            Guest Information
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "Full Name *",         name: "guest_name",   type: "text",   placeholder: "e.g. Adewale Olusegun" },
              { label: "Phone Number *",       name: "guest_phone",  type: "tel",    placeholder: "e.g. 08012345678" },
            ].map(f => (
              <div key={f.name}>
                <label className="block text-cream/60 text-xs mb-1.5">{f.label}</label>
                <input {...register(f.name as any)} type={f.type} placeholder={f.placeholder}
                  className="w-full bg-white/5 border border-gold-primary/20 rounded-xl
                             px-4 py-2.5 text-cream text-sm outline-none
                             focus:border-gold-primary/60 transition-colors" />
                {errors[f.name as keyof WalkInForm] && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors[f.name as keyof WalkInForm]?.message}
                  </p>
                )}
              </div>
            ))}

            <div>
              <label className="block text-cream/60 text-xs mb-1.5">ID Type *</label>
              <select {...register("guest_id_type")}
                className="w-full bg-white/5 border border-gold-primary/20 rounded-xl
                           px-4 py-2.5 text-cream text-sm outline-none focus:border-gold-primary/60">
                <option value="nin" style={{ background:"#0D1A0D" }}>NIN</option>
                <option value="drivers_licence" style={{ background:"#0D1A0D" }}>Driver's Licence</option>
                <option value="passport" style={{ background:"#0D1A0D" }}>Passport</option>
                <option value="voters_card" style={{ background:"#0D1A0D" }}>Voter's Card</option>
              </select>
            </div>

            <div>
              <label className="block text-cream/60 text-xs mb-1.5">ID Number *</label>
              <input {...register("guest_id_number")} type="text" placeholder="Enter ID number"
                className="w-full bg-white/5 border border-gold-primary/20 rounded-xl
                           px-4 py-2.5 text-cream text-sm outline-none focus:border-gold-primary/60" />
            </div>
          </div>
        </div>

        {/* Dates & Guests */}
        <div className="p-5 rounded-2xl border border-gold-primary/20 bg-forest/40">
          <p className="font-cinzel text-[10px] tracking-[0.15em] text-gold-primary uppercase mb-4">
            Stay Details
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-cream/60 text-xs mb-1.5">Check-in *</label>
              <input {...register("check_in")} type="date" min={today}
                className="w-full bg-white/5 border border-gold-primary/20 rounded-xl
                           px-3 py-2.5 text-cream text-sm outline-none focus:border-gold-primary/60" />
            </div>
            <div>
              <label className="block text-cream/60 text-xs mb-1.5">Check-out *</label>
              <input {...register("check_out")} type="date" min={watchCheckIn || today}
                className="w-full bg-white/5 border border-gold-primary/20 rounded-xl
                           px-3 py-2.5 text-cream text-sm outline-none focus:border-gold-primary/60" />
            </div>
            <div>
              <label className="block text-cream/60 text-xs mb-1.5">Guests</label>
              <input {...register("num_guests", { valueAsNumber: true })} type="number" min={1} max={5}
                className="w-full bg-white/5 border border-gold-primary/20 rounded-xl
                           px-3 py-2.5 text-cream text-sm outline-none focus:border-gold-primary/60" />
            </div>
          </div>

          {/* Live price calculation */}
          {nights > 0 && selectedRoom && (
            <div className="mt-4 p-4 rounded-xl bg-gold-primary/10 border border-gold-primary/25">
              <div className="flex justify-between text-sm">
                <span className="text-cream/60">{formatNaira(selectedRoom.price)} × {nights} night{nights > 1 ? "s" : ""}</span>
                <span className="text-gold-primary font-bold text-base">{formatNaira(totalCost)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Payment */}
        <div className="p-5 rounded-2xl border border-gold-primary/20 bg-forest/40">
          <p className="font-cinzel text-[10px] tracking-[0.15em] text-gold-primary uppercase mb-4">
            Payment
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-cream/60 text-xs mb-1.5">Payment Method</label>
              <select {...register("payment_method")}
                className="w-full bg-white/5 border border-gold-primary/20 rounded-xl
                           px-4 py-2.5 text-cream text-sm outline-none focus:border-gold-primary/60">
                <option value="cash" style={{ background:"#0D1A0D" }}>💵 Cash</option>
                <option value="transfer" style={{ background:"#0D1A0D" }}>🏦 Bank Transfer</option>
                <option value="pos" style={{ background:"#0D1A0D" }}>💳 POS Machine</option>
              </select>
            </div>
            <div>
              <label className="block text-cream/60 text-xs mb-1.5">Amount Paid (₦) *</label>
              <input {...register("amount_paid", { valueAsNumber: true })} type="number" min={0}
                placeholder="Enter amount received"
                className="w-full bg-white/5 border border-gold-primary/20 rounded-xl
                           px-4 py-2.5 text-cream text-sm outline-none focus:border-gold-primary/60" />
            </div>
          </div>

          {/* Balance calculation */}
          {totalCost > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-3">
              {[
                { label: "Total Cost",   value: formatNaira(totalCost),  color: "text-cream" },
                { label: "Amount Paid",  value: formatNaira(watchPaid || 0), color: "text-green-400" },
                { label: "Balance Due",  value: formatNaira(Math.max(0, balance)), color: balance > 0 ? "text-amber-400" : "text-green-400" },
              ].map(s => (
                <div key={s.label} className="text-center p-3 rounded-xl bg-white/5">
                  <p className="text-cream/40 text-[10px] uppercase tracking-wide">{s.label}</p>
                  <p className={`font-bold text-sm mt-1 ${s.color}`}>{s.value}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Staff & Notes */}
        <div className="p-5 rounded-2xl border border-gold-primary/20 bg-forest/40">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-cream/60 text-xs mb-1.5">Booked by (Your Name) *</label>
              <input {...register("booked_by")} type="text" placeholder="Front desk officer name"
                className="w-full bg-white/5 border border-gold-primary/20 rounded-xl
                           px-4 py-2.5 text-cream text-sm outline-none focus:border-gold-primary/60" />
            </div>
            <div>
              <label className="block text-cream/60 text-xs mb-1.5">Notes (optional)</label>
              <input {...register("notes")} type="text" placeholder="Any special notes"
                className="w-full bg-white/5 border border-gold-primary/20 rounded-xl
                           px-4 py-2.5 text-cream text-sm outline-none focus:border-gold-primary/60" />
            </div>
          </div>
        </div>

        <button type="submit" disabled={loading}
          className="w-full py-4 rounded-2xl font-bold text-forest-dark font-cinzel
                     tracking-wide uppercase text-sm transition-all active:scale-95
                     disabled:opacity-50"
          style={{ background: "linear-gradient(135deg, #C9A84C, #9A7228)" }}>
          {loading ? "Saving Booking..." : "Confirm Booking & Generate Receipt →"}
        </button>
      </form>
    </div>
  );
}
