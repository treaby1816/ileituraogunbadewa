import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase-server";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const REPORT_EMAIL_TO = process.env.REPORT_EMAIL_TO || "ileitura.hotel@gmail.com";

export async function GET(request: Request) {
  try {
    // 1. Authorization check
    const authHeader = request.headers.get("Authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!resend) {
      return NextResponse.json({ error: "Resend not configured" }, { status: 500 });
    }

    const supabase = await createServiceClient();
    
    // 2. Fetch data for reports
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

    const { data: dailyBookings } = await supabase.from("bookings").select("*").gt("created_at", oneDayAgo);
    const { data: weeklyBookings } = await supabase.from("bookings").select("*").gt("created_at", oneWeekAgo);
    const { data: monthlyBookings } = await supabase.from("bookings").select("*").gt("created_at", oneMonthAgo);
    const { data: inquiries } = await supabase.from("inquiries").select("*").gt("created_at", oneDayAgo);

    // 3. Calculate Revenue (standard: 15k, deluxe: 22k, suite: 35k, hall: 500k)
    const prices: Record<string, number> = { standard: 15000, deluxe: 22000, suite: 35000, hall: 500000 };
    
    const calculateRevenue = (bookings: any[] | null) => {
      return bookings?.reduce((acc, b) => acc + (prices[b.room_type?.toLowerCase()] || 0), 0) || 0;
    };

    const dailyRev = calculateRevenue(dailyBookings);
    const weeklyRev = calculateRevenue(weeklyBookings);
    const monthlyRev = calculateRevenue(monthlyBookings);

    const formatNaira = (amount: number) => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount);

    // 4. Construct Email HTML
    const html = `
      <div style="font-family: serif; color: #0D1A0D; padding: 30px; border: 1px solid #C9A84C; max-width: 600px; margin: auto;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #C9A84C; margin: 0;">Ilé Ìtura Ògúnbádéwà</h1>
          <p style="font-size: 14px; text-transform: uppercase; letter-spacing: 2px;">Business Intelligence Report</p>
        </div>

        <div style="background: #F8F4E8; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
          <h2 style="font-size: 18px; border-bottom: 1px solid #C9A84C30; padding-bottom: 10px;">Daily Performance (Last 24h)</h2>
          <p><strong>New Bookings:</strong> ${dailyBookings?.length || 0}</p>
          <p><strong>Daily Revenue:</strong> <span style="color: #0D1A0D; font-weight: bold;">${formatNaira(dailyRev)}</span></p>
          <p><strong>New Inquiries:</strong> ${inquiries?.length || 0}</p>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          <div style="background: #f4f4f4; padding: 15px; border-radius: 8px;">
            <p style="font-size: 12px; color: #666; margin: 0;">Weekly Revenue</p>
            <p style="font-size: 20px; font-weight: bold; margin: 5px 0;">${formatNaira(weeklyRev)}</p>
            <p style="font-size: 11px; margin: 0;">${weeklyBookings?.length || 0} bookings</p>
          </div>
          <div style="background: #f4f4f4; padding: 15px; border-radius: 8px;">
            <p style="font-size: 12px; color: #666; margin: 0;">Monthly Revenue</p>
            <p style="font-size: 20px; font-weight: bold; margin: 5px 0;">${formatNaira(monthlyRev)}</p>
            <p style="font-size: 11px; margin: 0;">${monthlyBookings?.length || 0} bookings</p>
          </div>
        </div>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="background: #0D1A0D; color: #C9A84C; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
            Access Admin Portal
          </a>
        </div>
        
        <p style="font-size: 10px; color: #999; text-align: center; margin-top: 40px;">
          This is an automated system report. Generated on ${now.toLocaleString()}
        </p>
      </div>
    `;

    // 5. Send Report
    await resend.emails.send({
      from: "Ilé Ìtura Reports <reports@ileitura.com>",
      to: REPORT_EMAIL_TO,
      subject: `Hotel Performance Report - ${now.toLocaleDateString()}`,
      html: html,
    });

    return NextResponse.json({ success: true, message: "Report generated and sent." });

  } catch (err: any) {
    console.error("Report generation error:", err);
    return NextResponse.json({ error: "Failed to generate report" }, { status: 500 });
  }
}
