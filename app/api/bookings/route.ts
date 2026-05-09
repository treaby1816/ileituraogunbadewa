import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase-server";

function generateRef(): string {
  return "IIO-" + Math.random().toString(36).slice(2, 10).toUpperCase();
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { room_type, check_in, check_out, num_guests, guest_name, guest_phone, guest_email, special_requests } = body;

    if (!room_type || !check_in || !check_out || !guest_name || !guest_phone) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

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
      })
      .select("id, booking_ref")
      .single();

    if (error) {
      console.error("Booking insert error:", error);
      return NextResponse.json({ error: "Failed to create booking. Please try again." }, { status: 500 });
    }

    return NextResponse.json({ success: true, booking_ref: data.booking_ref, id: data.id });
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}
