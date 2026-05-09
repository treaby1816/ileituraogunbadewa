import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const REPORT_EMAIL_TO = process.env.REPORT_EMAIL_TO || "ileitura.hotel@gmail.com";

export async function sendBookingConfirmation(booking: any) {
  if (!resend) return;

  try {
    // Send to Admin
    await resend.emails.send({
      from: "Ilé Ìtura <notifications@ileitura.com>",
      to: REPORT_EMAIL_TO,
      subject: `New Booking: ${booking.booking_ref} - ${booking.guest_name}`,
      html: `
        <div style="font-family: sans-serif; color: #333;">
          <h2>New Room Reservation</h2>
          <p><strong>Reference:</strong> ${booking.booking_ref}</p>
          <p><strong>Guest:</strong> ${booking.guest_name}</p>
          <p><strong>Room:</strong> ${booking.room_type}</p>
          <p><strong>Dates:</strong> ${booking.check_in} to ${booking.check_out}</p>
          <p><strong>Phone:</strong> ${booking.guest_phone}</p>
          <p><strong>Requests:</strong> ${booking.special_requests || "None"}</p>
        </div>
      `,
    });

    // Send to Guest if email provided
    if (booking.guest_email) {
      await resend.emails.send({
        from: "Ilé Ìtura Ògúnbádéwà <booking@ileitura.com>",
        to: booking.guest_email,
        subject: `Your Booking Confirmation - ${booking.booking_ref}`,
        html: `
          <div style="font-family: serif; color: #0D1A0D; padding: 20px; border: 1px solid #C9A84C;">
            <h1 style="color: #C9A84C;">Ilé Ìtura Ògúnbádéwà</h1>
            <p>Dear ${booking.guest_name},</p>
            <p>Thank you for choosing Ilé Ìtura Ògúnbádéwà. Your reservation has been received.</p>
            <div style="background: #F8F4E8; padding: 15px; border-radius: 8px;">
              <p><strong>Booking Ref:</strong> ${booking.booking_ref}</p>
              <p><strong>Room:</strong> ${booking.room_type.toUpperCase()}</p>
              <p><strong>Check-in:</strong> ${booking.check_in}</p>
              <p><strong>Check-out:</strong> ${booking.check_out}</p>
            </div>
            <p style="font-style: italic;">"Embrace Comfort, Enjoy Luxury"</p>
            <hr />
            <p style="font-size: 12px; color: #666;">Address: Saheed Anibaba Street, Ikorodu, Lagos.</p>
          </div>
        `,
      });
    }
  } catch (err) {
    console.error("Email send error:", err);
  }
}

export async function sendInquiryNotification(inquiry: any) {
  if (!resend) return;

  try {
    await resend.emails.send({
      from: "Ilé Ìtura <contact@ileitura.com>",
      to: REPORT_EMAIL_TO,
      subject: `New Inquiry: ${inquiry.inquiry_type} from ${inquiry.name}`,
      html: `
        <div style="font-family: sans-serif; color: #333;">
          <h2>New Customer Inquiry</h2>
          <p><strong>From:</strong> ${inquiry.name}</p>
          <p><strong>Type:</strong> ${inquiry.inquiry_type}</p>
          <p><strong>Phone:</strong> ${inquiry.phone || "Not provided"}</p>
          <p><strong>Email:</strong> ${inquiry.email || "Not provided"}</p>
          <p><strong>Message:</strong></p>
          <p style="background: #f4f4f4; padding: 10px; border-left: 4px solid #C9A84C;">${inquiry.message}</p>
        </div>
      `,
    });
  } catch (err) {
    console.error("Email inquiry error:", err);
  }
}
