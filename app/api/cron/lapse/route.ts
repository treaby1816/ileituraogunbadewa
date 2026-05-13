import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase-server";
import { sendLapseNotification } from "@/lib/email-service";

export async function POST(request: Request) {
  try {
    // 1. Verify Authorization
    const authHeader = request.headers.get("Authorization");
    const cronSecret = process.env.CRON_SECRET;
    
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = await createServiceClient();

    // 2. Find lapsed bookings
    const { data: lapsedBookings, error: fetchError } = await supabase
      .from("bookings")
      .select("*")
      .lt("grace_period_expires_at", new Date().toISOString())
      .eq("status", "pending");

    if (fetchError) {
      console.error("Failed to fetch lapsed bookings:", fetchError);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    if (!lapsedBookings || lapsedBookings.length === 0) {
      return NextResponse.json({ success: true, message: "No lapsed bookings found." });
    }

    const processed: string[] = [];
    const failed: string[] = [];

    // 3. Process each lapsed booking concurrently for better scalability
    await Promise.allSettled(
      lapsedBookings.map(async (booking) => {
        try {
          // Update status
          const { error: updateError } = await supabase
            .from("bookings")
            .update({ status: "cancelled" })
            .eq("id", booking.id);

          if (updateError) throw updateError;

          const notificationPromises = [];

          // Send Email
          if (booking.guest_email) {
            notificationPromises.push(sendLapseNotification(booking));
          }

          // Send WhatsApp (Meta API)
          if (process.env.WHATSAPP_PHONE_ID && process.env.WHATSAPP_ACCESS_TOKEN && booking.guest_phone) {
            const phoneClean = booking.guest_phone.replace(/\D/g, ""); 
            notificationPromises.push(
              fetch(`https://graph.facebook.com/v19.0/${process.env.WHATSAPP_PHONE_ID}/messages`, {
                method: "POST",
                headers: {
                  "Authorization": `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  messaging_product: "whatsapp",
                  to: phoneClean,
                  type: "template",
                  template: {
                    name: "booking_lapsed", 
                    language: { code: "en" },
                  },
                }),
              }).catch((waError) => console.error("WhatsApp API error:", waError))
            );
          }

          await Promise.allSettled(notificationPromises);
          processed.push(booking.booking_ref);
        } catch (err) {
          console.error(`Error processing booking ${booking.booking_ref}:`, err);
          failed.push(booking.booking_ref);
        }
      })
    );

    return NextResponse.json({ 
      success: true, 
      processed_count: processed.length, 
      processed_refs: processed,
      failed_count: failed.length,
      failed_refs: failed
    });

  } catch (err: any) {
    console.error("Cron Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
