import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase-server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, email, inquiry_type, message } = body;

    if (!name || !message || !inquiry_type) {
      return NextResponse.json({ error: "Name, inquiry type, and message are required." }, { status: 400 });
    }

    const supabase = await createServiceClient();
    const { data, error } = await supabase
      .from("inquiries")
      .insert({ name, phone, email, inquiry_type, message })
      .select("id")
      .single();

    if (error) {
      console.error("Inquiry insert error:", error);
      return NextResponse.json({ error: "Failed to submit inquiry. Please try again." }, { status: 500 });
    }

    // Send email notification asynchronously
    const { sendInquiryNotification } = await import("@/lib/email-service");
    sendInquiryNotification({ name, phone, email, inquiry_type, message }).catch(console.error);

    return NextResponse.json({ success: true, id: data.id });
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}
