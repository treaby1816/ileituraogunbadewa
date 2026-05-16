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
    
    // 2. Dates
    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];
    
    const oneWeekAgoDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneWeekAgoStr = oneWeekAgoDate.toISOString().split("T")[0];
    
    const oneMonthAgoDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const oneMonthAgoStr = oneMonthAgoDate.toISOString().split("T")[0];

    // Fetch Transactions
    const { data: txs } = await supabase.from("transactions").select("*").gte("transaction_date", oneMonthAgoStr);
    
    // Fetch Bookings count for today
    const { data: newRooms } = await supabase.from("bookings").select("id").eq("status", "confirmed").gte("created_at", todayStr + "T00:00:00");
    const { data: newHalls } = await supabase.from("hall_bookings").select("id").eq("status", "confirmed").gte("created_at", todayStr + "T00:00:00");
    const todayBookingsCount = (newRooms?.length || 0) + (newHalls?.length || 0);

    const { data: inquiries } = await supabase.from("inquiries").select("id").gte("created_at", todayStr + "T00:00:00");

    // 3. Calculate Financials
    const calculateTotals = (transactions: any[] | null, startDate: string) => {
      const filtered = transactions?.filter(t => t.transaction_date >= startDate) || [];
      const income = filtered.filter(t => t.type === 'income').reduce((acc, t) => acc + Number(t.amount), 0);
      const expense = filtered.filter(t => t.type === 'expense').reduce((acc, t) => acc + Number(t.amount), 0);
      return { income, expense, profit: income - expense };
    };

    const daily = calculateTotals(txs, todayStr);
    const weekly = calculateTotals(txs, oneWeekAgoStr);
    const monthly = calculateTotals(txs, oneMonthAgoStr);

    const formatNaira = (amount: number) => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount);

    // 4. Construct Email HTML
    const html = `
      <div style="font-family: serif; color: #0D1A0D; padding: 30px; border: 1px solid #C9A84C; max-width: 600px; margin: auto;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #C9A84C; margin: 0;">Ilé Ìtura Ògúnbádéwà</h1>
          <p style="font-size: 14px; text-transform: uppercase; letter-spacing: 2px;">Business Intelligence Report</p>
        </div>

        <div style="background: #F8F4E8; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
          <h2 style="font-size: 18px; border-bottom: 1px solid #C9A84C30; padding-bottom: 10px; margin-top: 0;">Daily Performance (Today)</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 5px 0;">New Bookings (Rooms & Halls):</td><td style="text-align: right; font-weight: bold;">${todayBookingsCount}</td></tr>
            <tr><td style="padding: 5px 0;">Daily Revenue Collected:</td><td style="text-align: right; font-weight: bold; color: #166534;">${formatNaira(daily.income)}</td></tr>
            <tr><td style="padding: 5px 0;">Daily Expenses:</td><td style="text-align: right; font-weight: bold; color: #991b1b;">${formatNaira(daily.expense)}</td></tr>
            <tr style="border-top: 1px solid #C9A84C30;"><td style="padding: 10px 0; font-size: 16px;"><strong>Net Profit:</strong></td><td style="text-align: right; font-size: 16px; font-weight: bold;">${formatNaira(daily.profit)}</td></tr>
          </table>
          <p style="font-size: 12px; color: #666; margin-top: 10px;">New Inquiries: ${inquiries?.length || 0}</p>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
          <div style="background: #f4f4f4; padding: 15px; border-radius: 8px;">
            <p style="font-size: 11px; color: #666; text-transform: uppercase; margin: 0;">Weekly Net Profit</p>
            <p style="font-size: 20px; font-weight: bold; margin: 5px 0; color: #0D1A0D;">${formatNaira(weekly.profit)}</p>
            <p style="font-size: 10px; margin: 0; color: #888;">Rev: ${formatNaira(weekly.income)} | Exp: ${formatNaira(weekly.expense)}</p>
          </div>
          <div style="background: #f4f4f4; padding: 15px; border-radius: 8px;">
            <p style="font-size: 11px; color: #666; text-transform: uppercase; margin: 0;">Monthly Net Profit</p>
            <p style="font-size: 20px; font-weight: bold; margin: 5px 0; color: #0D1A0D;">${formatNaira(monthly.profit)}</p>
            <p style="font-size: 10px; margin: 0; color: #888;">Rev: ${formatNaira(monthly.income)} | Exp: ${formatNaira(monthly.expense)}</p>
          </div>
        </div>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="background: #0D1A0D; color: #C9A84C; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
            Access Full Bookkeeping
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
      subject: `Hotel Performance & Bookkeeping - ${now.toLocaleDateString()}`,
      html: html,
    });

    return NextResponse.json({ success: true, message: "Bookkeeping report generated and sent." });


  } catch (err: any) {
    console.error("Report generation error:", err);
    return NextResponse.json({ error: "Failed to generate report" }, { status: 500 });
  }
}
