import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase-server";

function generateRef(): string {
  return "IIO-" + Math.random().toString(36).slice(2, 10).toUpperCase();
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { room_type, check_in, check_out, num_guests, guest_name, guest_phone, guest_email, special_requests, paystack_ref } = body;

    if (!room_type || !check_in || !check_out || !guest_name || !guest_phone) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    // Calculate 30 days grace period
    const gracePeriodExpiresAt = new Date();
    gracePeriodExpiresAt.setDate(gracePeriodExpiresAt.getDate() + 30);

    const booking_ref = generateRef();
    const supabase = await createServiceClient();

    const { data, error } = await supabase
      .from("bookings")
      .insert({
        booking_ref,
        room_type,
        guest_name,
        guest_phone,
        guest_email: guest_email || null,
        check_in,
        check_out,
        num_guests: num_guests || 1,
        special_requests: special_requests || null,
        status: "pending",
        paystack_ref: paystack_ref || null,
        grace_period_expires_at: gracePeriodExpiresAt.toISOString(),
      })
      .select("id, booking_ref")
      .single();

    if (error) {
      console.error("Booking insert error:", error);
      return NextResponse.json({ error: error.message || "Failed to create booking. Please try again." }, { status: 500 });
    }

    // Send email notification asynchronously
    const { sendBookingConfirmation } = await import("@/lib/email-service");
    sendBookingConfirmation({
      booking_ref: data.booking_ref,
      room_type,
      guest_name,
      guest_phone,
      guest_email,
      check_in,
      check_out,
      special_requests
    }).catch(console.error);

    return NextResponse.json({ success: true, booking_ref: data.booking_ref, id: data.id });
  } catch (err: any) {
    console.error("Booking API catch error:", err);
    return NextResponse.json({ error: `Invalid request: ${err.message || "Unknown error"}` }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "Missing ID or status" }, { status: 400 });
    }

    const supabase = await createServiceClient();
    const { error } = await supabase
      .from("bookings")
      .update({ status })
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Booking PATCH error:", err);
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 });
  }
}
