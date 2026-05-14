"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, X, Loader2, Download } from "lucide-react";
import { calcNights } from "@/lib/utils";

interface BookingActionsProps {
  booking: any;
}

const ROOM_PRICES: Record<string, number> = {
  standard: 15000,
  deluxe: 22000,
  suite: 35000,
  hall: 500000,
};

export function BookingActions({ booking }: BookingActionsProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();

  const handleUpdate = async (status: string) => {
    setLoading(status);
    try {
      const res = await fetch("/api/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: booking.id, status }),
      });

      if (res.ok) {
        toast.success(`Booking ${status} successfully`);
        router.refresh();
      } else {
        toast.error("Failed to update booking status");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  const handleDownloadPDF = async () => {
    const { generateBookingPDF } = await import("@/lib/pdf-gen");
    const nights = calcNights(booking.check_in, booking.check_out);
    const roomType = booking.room_type.toLowerCase();
    const price = ROOM_PRICES[roomType] || 15000;
    const total = roomType.includes("hall") ? price : price * nights;
    
    generateBookingPDF({
      bookingRef: booking.booking_ref,
      guestName: booking.guest_name,
      roomName: booking.room_type,
      checkIn: booking.check_in,
      checkOut: booking.check_out,
      totalAmount: total,
      depositPaid: total * 0.5,
      isHall: roomType.includes("hall")
    });
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleDownloadPDF}
        className="p-1.5 rounded-lg bg-gold-primary/10 text-gold-primary border border-gold-primary/20 hover:bg-gold-primary/20 transition-all cursor-pointer"
        title="Download PDF Voucher"
      >
        <Download size={14} />
      </button>

      {booking.status === "pending" && (
        <>
          <button
            onClick={() => handleUpdate("confirmed")}
            disabled={!!loading}
            className="p-1.5 rounded-lg bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 transition-all cursor-pointer disabled:opacity-50"
            title="Confirm Booking"
          >
            {loading === "confirmed" ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
          </button>
          <button
            onClick={() => handleUpdate("cancelled")}
            disabled={!!loading}
            className="p-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all cursor-pointer disabled:opacity-50"
            title="Cancel Booking"
          >
            {loading === "cancelled" ? <Loader2 size={14} className="animate-spin" /> : <X size={14} />}
          </button>
        </>
      )}
    </div>
  );
}

