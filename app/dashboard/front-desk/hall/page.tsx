"use client";
import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
// @ts-ignore
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createBrowserClient } from "@/lib/supabase-browser";
import { formatNaira } from "@/lib/utils";
import { HallReceipt } from "@/components/dashboard/HallReceipt";
import { useReactToPrint } from "react-to-print";

// Hall booking form fields:
const HallBookingSchema = z.object({
  hall_name:        z.string().min(1, "Hall name is required"),              // "Main Hall" / "Hall 2" etc
  client_name:      z.string().min(2, "Client name is required"),
  client_phone:     z.string().min(10, "Valid phone number is required"),
  client_email:     z.string().email().optional().or(z.literal("")),
  event_type:       z.enum(["birthday","wedding","corporate","naming_ceremony",
                             "burial","church_programme","seminar","product_launch","other"]),
  event_date:       z.string().min(1, "Event date is required"),
  event_start_time: z.string().min(1, "Start time is required"),
  event_end_time:   z.string().min(1, "End time is required"),
  expected_guests:  z.number().min(1, "Expected guests is required"),
  setup_required:   z.boolean().default(false),
  setup_notes:      z.string().optional(),
  total_amount:     z.number().min(1, "Total amount is required"),              // negotiated hall price
  amount_paid:      z.number().min(0, "Amount paid cannot be negative"),              // deposit or full amount
  payment_method:   z.enum(["cash","transfer","pos"]),
  booked_by:        z.string().min(2, "Your name is required"),
  special_requests: z.string().optional(),
});

type HallBookingForm = z.infer<typeof HallBookingSchema>;

export default function WalkInHallPage() {
  const [booking, setBooking] = useState<any>(null);
  const [step, setStep] = useState<"form" | "confirm" | "receipt">("form");
  const [loading, setLoading] = useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);
  const supabase = createBrowserClient();
  const today = new Date().toISOString().split("T")[0];

  const { register, handleSubmit, watch, formState: { errors } } = useForm<HallBookingForm>({
    resolver: zodResolver(HallBookingSchema),
    defaultValues: { 
      hall_name: "Main Hall", 
      event_type: "wedding",
      setup_required: false,
      expected_guests: 50,
      payment_method: "cash", 
      amount_paid: 0,
      total_amount: 500000 
    }
  });

  const watchTotalAmount = watch("total_amount") || 0;
  const watchPaid        = watch("amount_paid") || 0;
  const balanceDue       = Math.max(0, watchTotalAmount - watchPaid);

  const handlePrint = useReactToPrint({
    contentRef: receiptRef,
    documentTitle: `Receipt-${booking?.receipt_number || 'Hall'}`,
    pageStyle: `
      @page { size: A5 portrait; margin: 10mm; }
      @media print {
        body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      }
    `,
  });

  const onSubmit = async (data: HallBookingForm) => {
    setLoading(true);
    
    // Convert empty string to undefined for optional fields
    const formattedData = {
      ...data,
      client_email: data.client_email === "" ? null : data.client_email,
    };

    const payment_status = data.amount_paid >= data.total_amount ? "fully_paid" : 
                           data.amount_paid > 0 ? "deposit_paid" : "unpaid";

    const { data: result, error } = await supabase
      .from("hall_bookings")
      .insert({
        ...formattedData,
        payment_status,
        status: "confirmed",
      })
      .select("booking_ref, receipt_number")
      .single();

    if (!error && result) {
      // Save to receipts archive
      await supabase.from("receipts").insert({
        receipt_number: result.receipt_number,
        receipt_type:   "hall_booking",
        booking_ref:    result.booking_ref,
        guest_name:     data.client_name,
        amount:         data.amount_paid,
        payment_method: data.payment_method,
        issued_by:      data.booked_by,
        receipt_data:   { ...data, balance_due: balanceDue },
      });

      // Log income in transactions
      if (data.amount_paid > 0) {
        await supabase.from("transactions").insert({
          type:             "income",
          category:         "hall_booking",
          description:      `Walk-in hall booking — ${result.booking_ref} — ${data.client_name}`,
          amount:           data.amount_paid,
          booking_ref:      result.booking_ref,
          recorded_by:      data.booked_by,
          transaction_date: today,
        });
      }

      setBooking({ ...data, ...result, balance_due: balanceDue });
      setStep("receipt");
    } else {
        console.error("Booking failed:", error);
    }
    setLoading(false);
  };

  // ── RECEIPT SCREEN ──────────────────────────────────────────────────────────
  if (step === "receipt" && booking) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-playfair text-2xl text-cream">Hall Booking Complete</h1>
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
        <div className="border border-gold-primary/20 rounded-2xl overflow-hidden bg-white">
          <HallReceipt ref={receiptRef} booking={booking} />
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
        <h1 className="font-playfair text-2xl text-cream mt-1">Book Event Hall</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

        {/* Hall details */}
        <div className="p-5 rounded-2xl border border-gold-primary/20 bg-forest/40">
           <p className="font-cinzel text-[10px] tracking-[0.15em] text-gold-primary uppercase mb-4">
            Hall Information
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-cream/60 text-xs mb-1.5">Hall Name *</label>
              <select {...register("hall_name")}
                className="w-full bg-white/5 border border-gold-primary/20 rounded-xl
                           px-4 py-2.5 text-cream text-sm outline-none focus:border-gold-primary/60">
                <option value="Main Hall" style={{ background:"#0D1A0D" }}>Main Hall</option>
                <option value="Hall 2" style={{ background:"#0D1A0D" }}>Hall 2</option>
              </select>
            </div>
            <div>
              <label className="block text-cream/60 text-xs mb-1.5">Event Type *</label>
              <select {...register("event_type")}
                className="w-full bg-white/5 border border-gold-primary/20 rounded-xl
                           px-4 py-2.5 text-cream text-sm outline-none focus:border-gold-primary/60">
                {["birthday","wedding","corporate","naming_ceremony","burial","church_programme","seminar","product_launch","other"].map(opt => (
                    <option key={opt} value={opt} style={{ background:"#0D1A0D" }}>{opt.replace("_", " ").toUpperCase()}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Client details */}
        <div className="p-5 rounded-2xl border border-gold-primary/20 bg-forest/40">
          <p className="font-cinzel text-[10px] tracking-[0.15em] text-gold-primary uppercase mb-4">
            Client Information
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "Client Name *",       name: "client_name",   type: "text",   placeholder: "e.g. Adewale Olusegun" },
              { label: "Phone Number *",      name: "client_phone",  type: "tel",    placeholder: "e.g. 08012345678" },
              { label: "Email Address",       name: "client_email",  type: "email",  placeholder: "Optional" },
            ].map(f => (
              <div key={f.name}>
                <label className="block text-cream/60 text-xs mb-1.5">{f.label}</label>
                <input {...register(f.name as any)} type={f.type} placeholder={f.placeholder}
                  className="w-full bg-white/5 border border-gold-primary/20 rounded-xl
                             px-4 py-2.5 text-cream text-sm outline-none
                             focus:border-gold-primary/60 transition-colors" />
                {errors[f.name as keyof HallBookingForm] && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors[f.name as keyof HallBookingForm]?.message as string}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Dates & Guests */}
        <div className="p-5 rounded-2xl border border-gold-primary/20 bg-forest/40">
          <p className="font-cinzel text-[10px] tracking-[0.15em] text-gold-primary uppercase mb-4">
            Event Details
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="col-span-2">
              <label className="block text-cream/60 text-xs mb-1.5">Event Date *</label>
              <input {...register("event_date")} type="date" min={today}
                className="w-full bg-white/5 border border-gold-primary/20 rounded-xl
                           px-3 py-2.5 text-cream text-sm outline-none focus:border-gold-primary/60" />
              {errors.event_date && <p className="text-red-400 text-xs mt-1">{errors.event_date.message}</p>}
            </div>
            <div>
              <label className="block text-cream/60 text-xs mb-1.5">Start Time *</label>
              <input {...register("event_start_time")} type="time"
                className="w-full bg-white/5 border border-gold-primary/20 rounded-xl
                           px-3 py-2.5 text-cream text-sm outline-none focus:border-gold-primary/60" />
            </div>
             <div>
              <label className="block text-cream/60 text-xs mb-1.5">End Time *</label>
              <input {...register("event_end_time")} type="time"
                className="w-full bg-white/5 border border-gold-primary/20 rounded-xl
                           px-3 py-2.5 text-cream text-sm outline-none focus:border-gold-primary/60" />
            </div>
             <div>
              <label className="block text-cream/60 text-xs mb-1.5">Expected Guests</label>
              <input {...register("expected_guests", { valueAsNumber: true })} type="number" min={1}
                className="w-full bg-white/5 border border-gold-primary/20 rounded-xl
                           px-3 py-2.5 text-cream text-sm outline-none focus:border-gold-primary/60" />
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gold-primary/10">
              <div className="flex items-center gap-3 mb-3">
                 <input {...register("setup_required")} type="checkbox" id="setup_required" className="w-4 h-4 accent-gold-primary" />
                 <label htmlFor="setup_required" className="text-cream text-sm">Setup Required?</label>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-cream/60 text-xs mb-1.5">Setup Notes</label>
                    <input {...register("setup_notes")} type="text" placeholder="e.g. Chairs arrangement, decoration..."
                        className="w-full bg-white/5 border border-gold-primary/20 rounded-xl
                                px-4 py-2.5 text-cream text-sm outline-none focus:border-gold-primary/60" />
                  </div>
                   <div>
                    <label className="block text-cream/60 text-xs mb-1.5">Special Requests</label>
                    <input {...register("special_requests")} type="text" placeholder="Any special needs"
                        className="w-full bg-white/5 border border-gold-primary/20 rounded-xl
                                px-4 py-2.5 text-cream text-sm outline-none focus:border-gold-primary/60" />
                  </div>
              </div>
          </div>
        </div>

        {/* Payment */}
        <div className="p-5 rounded-2xl border border-gold-primary/20 bg-forest/40">
          <p className="font-cinzel text-[10px] tracking-[0.15em] text-gold-primary uppercase mb-4">
            Payment
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-cream/60 text-xs mb-1.5">Total Agreed Amount (₦) *</label>
              <input {...register("total_amount", { valueAsNumber: true })} type="number" min={1}
                className="w-full bg-white/5 border border-gold-primary/20 rounded-xl
                           px-4 py-2.5 text-cream text-sm outline-none focus:border-gold-primary/60" />
            </div>
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
          {watchTotalAmount > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-3">
              {[
                { label: "Total Cost",   value: formatNaira(watchTotalAmount),  color: "text-cream" },
                { label: "Amount Paid",  value: formatNaira(watchPaid || 0), color: "text-green-400" },
                { label: "Balance Due",  value: formatNaira(balanceDue), color: balanceDue > 0 ? "text-amber-400" : "text-green-400" },
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
           <div>
              <label className="block text-cream/60 text-xs mb-1.5">Booked by (Your Name) *</label>
              <input {...register("booked_by")} type="text" placeholder="Front desk officer name"
                className="w-full bg-white/5 border border-gold-primary/20 rounded-xl
                           px-4 py-2.5 text-cream text-sm outline-none focus:border-gold-primary/60" />
                {errors.booked_by && <p className="text-red-400 text-xs mt-1">{errors.booked_by.message}</p>}
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
