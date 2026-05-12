"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { BackButton } from "@/components/ui/BackButton";
import { formatNaira, calcNights, buildWABookingLink } from "@/lib/utils";
import { toast } from "sonner";

const ROOMS = [
  { type: "standard", name: "Classic Standard Room", price: 15000, maxGuests: 2, isHall: false },
  { type: "deluxe", name: "Deluxe Comfort Room", price: 22000, maxGuests: 2, isHall: false },
  { type: "suite", name: "Executive Suite", price: 35000, maxGuests: 3, isHall: false },
  { type: "hall", name: "Spacious Event Hall", price: 500000, maxGuests: 150, isHall: true },
];

function BookingForm() {
  const searchParams = useSearchParams();
  const preselected = searchParams.get("room") || "standard";

  const [step, setStep] = useState(1);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [bookingRef, setBookingRef] = useState("");
  const [form, setForm] = useState<{
    room_type: string;
    check_in: string;
    check_out: string;
    num_guests: number;
    guest_name: string;
    guest_phone: string;
    guest_email: string;
    special_requests: string;
  }>({
    room_type: preselected,
    check_in: "",
    check_out: "",
    num_guests: 1,
    guest_name: "",
    guest_phone: "",
    guest_email: "",
    special_requests: "",
  });

  const selectedRoom = ROOMS.find((r) => r.type === form.room_type) || ROOMS[0];
  const nights = form.check_in && form.check_out ? calcNights(form.check_in, form.check_out) : 0;
  const total = nights * selectedRoom.price;
  const today = new Date().toISOString().split("T")[0];

  const update = (field: keyof typeof form, value: string | number) => 
    setForm((prev) => ({ ...prev, [field]: value }));

  const inputClass = "w-full bg-white/8 border border-gold-primary/20 rounded-xl px-4 py-3 text-cream text-[13px] outline-none focus:border-gold-primary/60 transition-colors placeholder:text-cream-faint";

  const handleSubmit = async () => {
    setStatus("loading");
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok && data.booking_ref) {
        setBookingRef(data.booking_ref);
        setStatus("success");
        toast.success(selectedRoom.isHall ? "Hall booked successfully!" : "Room booked successfully!");
      } else {
        console.error("Booking failed:", data.error);
        setStatus("error");
        toast.error(data.error || "Failed to book. Please try again.");
      }
    } catch {
      setStatus("error");
      toast.error("Network error. Please try again later.");
    }
  };

  if (status === "success") {
    const waLink = buildWABookingLink({
      guestName: form.guest_name,
      roomName: selectedRoom.name,
      checkIn: form.check_in,
      checkOut: form.check_out,
      ref: bookingRef,
    });
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-lg mx-auto text-center py-16">
        <div className="text-5xl mb-4">🎉</div>
        <h2 className="font-playfair text-3xl text-cream mb-3">Booking Confirmed!</h2>
        <div className="bg-forest/60 border border-gold-primary/20 rounded-2xl p-6 mb-6">
          <p className="font-cinzel text-[10px] tracking-widest text-gold-primary/60 uppercase mb-2">Booking Reference</p>
          <p className="font-playfair text-3xl text-gold-primary font-bold">{bookingRef}</p>
        </div>
        <div className="text-cream-muted text-[13px] space-y-1 mb-8">
          <p>{selectedRoom.name}{!selectedRoom.isHall && ` · ${nights} night${nights !== 1 ? "s" : ""}`}</p>
          <p>{form.check_in} → {form.check_out}</p>
          <p className="text-gold-primary font-semibold text-lg mt-2">{formatNaira(total)}</p>
          <p className="text-cream-faint text-[11px] mt-1">💳 Pay on Arrival — No deposit required</p>
        </div>
        <Button href={waLink} variant="primary" size="md" target="_blank" rel="noreferrer">
          Confirm via WhatsApp
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      <div className="flex items-center justify-center gap-2 mb-10">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-semibold transition-all ${
              step >= s ? "bg-gold-primary text-forest-dark" : "bg-white/5 text-cream-faint border border-gold-primary/15"
            }`}>{s}</div>
            {s < 3 && <div className={`w-10 h-[1px] ${step > s ? "bg-gold-primary" : "bg-gold-primary/15"}`} />}
          </div>
        ))}
      </div>

      <div className="p-5 sm:p-8 rounded-2xl border border-gold-primary/15 bg-linear-to-br from-forest/60 to-forest-dark shadow-xl">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h3 className="font-playfair text-xl text-cream mb-6">1. Select Your Space</h3>
              <div className="space-y-3 mb-6">
                {ROOMS.map((room) => (
                  <button key={room.type} onClick={() => update("room_type", room.type)}
                    className={`w-full p-4 rounded-xl text-left transition-all cursor-pointer ${
                      form.room_type === room.type ? "bg-gold-primary/15 border-2 border-gold-primary/40" : "bg-white/3 border border-gold-primary/10 hover:border-gold-primary/25"
                    }`}>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-cream font-semibold text-[14px]">{room.name}</p>
                        <p className="text-cream-faint text-[11px]">Max {room.maxGuests} guests</p>
                      </div>
                      <p className="font-playfair text-gold-primary text-lg">
                        {formatNaira(room.price)}
                        {!room.isHall && <span className="text-cream-faint text-[11px]">/night</span>}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block font-cinzel text-[9px] tracking-widest text-gold-primary/60 uppercase mb-2">Check-in</label>
                  <input type="date" className={inputClass} value={form.check_in} min={today} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const val = e.target.value;
                    update("check_in", val);
                    if (selectedRoom.isHall && !form.check_out) update("check_out", val);
                  }} required />
                </div>
                <div>
                  <label className="block font-cinzel text-[9px] tracking-widest text-gold-primary/60 uppercase mb-2">Check-out</label>
                  <input type="date" className={inputClass} value={form.check_out} min={form.check_in || today} onChange={(e: React.ChangeEvent<HTMLInputElement>) => update("check_out", e.target.value)} required />
                </div>
              </div>
              <div className="mb-6">
                <label className="block font-cinzel text-[9px] tracking-widest text-gold-primary/60 uppercase mb-2">Guests</label>
                {selectedRoom.isHall ? (
                  <input 
                    type="number" 
                    min="1" 
                    max={selectedRoom.maxGuests}
                    className={inputClass}
                    value={form.num_guests}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => update("num_guests", parseInt(e.target.value) || 1)}
                    placeholder={`Max ${selectedRoom.maxGuests} guests`}
                  />
                ) : (
                  <select className={inputClass} value={form.num_guests} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => update("num_guests", parseInt(e.target.value))}>
                    {[1, 2, 3].filter((n) => n <= selectedRoom.maxGuests).map((n) => (
                      <option key={n} value={n} style={{ background: "#0D1A0D" }}>{n} Guest{n > 1 ? "s" : ""}</option>
                    ))}
                  </select>
                )}
              </div>
              {nights > 0 && (
                <div className="bg-white/3 border border-gold-primary/10 rounded-xl p-4 mb-6 text-[13px]">
                  <div className="flex justify-between text-cream-muted">
                    <span>
                      {selectedRoom.isHall 
                        ? `${selectedRoom.name} Booking` 
                        : `${formatNaira(selectedRoom.price)} × ${nights} night${nights !== 1 ? "s" : ""}`
                      }
                    </span>
                    <span className="text-gold-primary font-semibold">{formatNaira(total)}</span>
                  </div>
                </div>
              )}
              <Button variant="primary" className="w-full justify-center" onClick={() => { 
                if (!form.check_in || !form.check_out) {
                  toast.error("Please select check-in and check-out dates");
                  return;
                }
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setStep(2); 
              }}>
                Next: Guest Details →
              </Button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h3 className="font-playfair text-xl text-cream mb-6">2. Guest Details</h3>
              <div className="space-y-4 mb-6">
                <input className={inputClass} placeholder="Full Name *" value={form.guest_name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => update("guest_name", e.target.value)} required />
                <input className={inputClass} placeholder="Phone Number *" value={form.guest_phone} onChange={(e: React.ChangeEvent<HTMLInputElement>) => update("guest_phone", e.target.value)} required />
                <input className={inputClass} type="email" placeholder="Email (optional)" value={form.guest_email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => update("guest_email", e.target.value)} />
                <textarea className={`${inputClass} min-h-[100px] resize-none`} placeholder="Special Requests (optional)" value={form.special_requests} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => update("special_requests", e.target.value)} />
              </div>
              <div className="flex gap-3">
                <Button variant="ghost" className="flex-1 justify-center" onClick={() => setStep(1)}>← Back</Button>
                <Button variant="primary" className="flex-1 justify-center" onClick={() => { 
                  if (!form.guest_name || !form.guest_phone) {
                    toast.error("Name and Phone Number are required");
                    return;
                  }
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setStep(3); 
                }}>
                  Next: Review →
                </Button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h3 className="font-playfair text-xl text-cream mb-6">3. Review & Confirm</h3>
              <div className="space-y-4 mb-6">
                {[
                  { label: "Room", value: selectedRoom.name },
                  { label: "Dates", value: selectedRoom.isHall ? `${form.check_in} → ${form.check_out}` : `${form.check_in} → ${form.check_out} (${nights} night${nights !== 1 ? "s" : ""})` },
                  { label: "Guests", value: `${form.num_guests}` },
                  { label: "Guest Name", value: form.guest_name },
                  { label: "Phone", value: form.guest_phone },
                  ...(form.guest_email ? [{ label: "Email", value: form.guest_email }] : []),
                  ...(form.special_requests ? [{ label: "Requests", value: form.special_requests }] : []),
                ].map((item) => (
                  <div key={item.label} className="flex justify-between py-2 border-b border-gold-primary/8">
                    <span className="text-cream-faint text-[12px]">{item.label}</span>
                    <span className="text-cream text-[13px] text-right max-w-[60%]">{item.value}</span>
                  </div>
                ))}
                <div className="flex justify-between pt-3">
                  <span className="text-cream-muted font-semibold">Total</span>
                  <span className="font-playfair text-gold-primary text-2xl font-bold">{formatNaira(total)}</span>
                </div>
              </div>
              <div className="bg-gold-primary/8 border border-gold-primary/15 rounded-xl p-4 text-center mb-6">
                <p className="text-gold-primary text-[12px]">💳 Pay on Arrival — No deposit required</p>
              </div>
              <div className="flex gap-3">
                <Button variant="ghost" className="flex-1 justify-center" onClick={() => setStep(2)}>← Back</Button>
                <Button variant="primary" className="flex-1 justify-center" onClick={handleSubmit} disabled={status === "loading"}>
                  {status === "loading" ? "Booking…" : "Confirm Booking ✓"}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <main className="pt-24">
      <section className="py-16 px-4 md:px-8 text-center bg-linear-to-b from-forest-dark to-forest-black">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <BackButton />
          <span className="font-cinzel text-[10px] tracking-[0.2em] text-gold-primary uppercase">Reservation</span>
          <h1 className="font-playfair text-4xl md:text-5xl text-gold-primary mt-3 mb-4">Book Your Stay or Event</h1>
        <p className="text-cream-muted max-w-xl mx-auto">Reserve your room or event hall in 3 simple steps. Pay on arrival.</p>
      </section>
      <section className="py-16 px-4 md:px-8 pb-24 bg-forest-black">
        <Suspense fallback={<div className="text-center text-cream-faint py-20">Loading...</div>}>
          <BookingForm />
        </Suspense>
      </section>
    </main>
  );
}
