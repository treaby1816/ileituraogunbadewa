"use client";

import React from "react";
import { usePaystackPayment } from 'react-paystack';
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";

export interface PaystackProps {
  form: any;
  setStatus: React.Dispatch<React.SetStateAction<"idle" | "loading" | "success" | "error">>;
  setBookingRef: React.Dispatch<React.SetStateAction<string>>;
  selectedRoom: any;
  status: "idle" | "loading" | "success" | "error";
}

export default function PaystackButtonWrapper({ form, setStatus, setBookingRef, selectedRoom, status }: PaystackProps) {
  const config = {
    reference: (new Date()).getTime().toString(),
    email: form.guest_email || 'guest@ileitura.com.ng',
    amount: 5000 * 100, // 5000 NGN in kobo
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || 'pk_test_placeholder',
  };

  const initializePayment = usePaystackPayment(config);

  const onSuccess = async (reference: any) => {
    setStatus("loading");
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, paystack_ref: reference.reference }),
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

  const onClose = () => {
    toast.error("Payment was cancelled.");
  };

  return (
    <Button 
      variant="primary" 
      className="flex-1 justify-center" 
      onClick={() => initializePayment({ onSuccess, onClose })}
      disabled={status === "loading"}
    >
      {status === "loading" ? "Processing…" : "Pay Booking Token ✓"}
    </Button>
  );
}
