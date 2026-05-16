import { forwardRef } from "react";
import { formatNaira, calcNights } from "@/lib/utils";

// This component is designed specifically for printing
// react-to-print renders it as a real print document
// Styles use inline CSS for maximum print compatibility

export const RoomReceipt = forwardRef<HTMLDivElement, { booking: any }>(
  ({ booking }, ref) => {
    const nights = calcNights(booking.check_in, booking.check_out);
    const now    = new Date();

    return (
      <div
        ref={ref}
        style={{
          fontFamily: "Arial, sans-serif",
          width: "148mm",       // A5 width
          minHeight: "210mm",   // A5 height
          padding: "10mm",
          backgroundColor: "#ffffff",
          color: "#1A2B1A",
          margin: "0 auto",
          boxSizing: "border-box",
        }}
      >
        {/* Hotel Header */}
        <div style={{ textAlign: "center", borderBottom: "3px solid #C9A84C",
          paddingBottom: "6mm", marginBottom: "5mm" }}>
          <img src="/images/logo.png" alt="Logo" style={{ height: "45px", marginBottom: "3mm", objectFit: "contain" }} />
          <h1 style={{ fontSize: "16pt", fontWeight: "bold", color: "#1A2B1A",
            margin: 0, letterSpacing: "1px" }}>
            ILÉ ÌTURAÒGÚNBÁDÉWÀ
          </h1>
          <p style={{ fontSize: "8pt", color: "#555", margin: "2mm 0 0",
            fontStyle: "italic" }}>
            Hotel & Relaxation Centre · Ikorodu, Lagos
          </p>
          <p style={{ fontSize: "7.5pt", color: "#777", margin: "1.5mm 0 0" }}>
            08129041015 · 08060721283 · ileituraogunbadewa@yahoo.com
          </p>
        </div>

        {/* Receipt Label */}
        <div style={{ textAlign: "center", marginBottom: "5mm" }}>
          <div style={{ display: "inline-block", background: "#C9A84C",
            color: "#1A2B1A", padding: "2mm 8mm", borderRadius: "4mm",
            fontSize: "9pt", fontWeight: "bold", letterSpacing: "2px" }}>
            BOOKING RECEIPT
          </div>
        </div>

        {/* Receipt Meta */}
        <table style={{ width: "100%", fontSize: "8pt", marginBottom: "4mm",
          borderCollapse: "collapse" }}>
          <tbody>
            {[
              ["Receipt No.",   booking.receipt_number],
              ["Booking Ref",   booking.booking_ref],
              ["Date Issued",   now.toLocaleDateString("en-NG", {
                day: "numeric", month: "long", year: "numeric"
              })],
              ["Time",          now.toLocaleTimeString("en-NG", {
                hour: "2-digit", minute: "2-digit"
              })],
              ["Issued by",     booking.booked_by],
            ].map(([label, value]) => (
              <tr key={label}>
                <td style={{ padding: "1mm 0", color: "#777", width: "40%" }}>{label}</td>
                <td style={{ padding: "1mm 0", fontWeight: "bold", color: "#1A2B1A" }}>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Divider */}
        <div style={{ borderTop: "1px dashed #C9A84C", margin: "4mm 0" }} />

        {/* Guest Details */}
        <h3 style={{ fontSize: "9pt", color: "#C9A84C", marginBottom: "3mm",
          fontWeight: "bold", letterSpacing: "1px" }}>
          GUEST DETAILS
        </h3>
        <table style={{ width: "100%", fontSize: "8pt", marginBottom: "4mm",
          borderCollapse: "collapse" }}>
          <tbody>
            {[
              ["Name",     booking.guest_name],
              ["Phone",    booking.guest_phone],
              ["Guests",   `${booking.num_guests} person${booking.num_guests > 1 ? "s" : ""}`],
              ["ID Type",  booking.guest_id_type?.replace("_", " ").toUpperCase()],
              ["ID No.",   booking.guest_id_number],
            ].map(([label, value]) => (
              <tr key={label}>
                <td style={{ padding: "1mm 0", color: "#777", width: "40%" }}>{label}</td>
                <td style={{ padding: "1mm 0", fontWeight: "bold" }}>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ borderTop: "1px dashed #C9A84C", margin: "4mm 0" }} />

        {/* Stay Details */}
        <h3 style={{ fontSize: "9pt", color: "#C9A84C", marginBottom: "3mm",
          fontWeight: "bold", letterSpacing: "1px" }}>
          STAY DETAILS
        </h3>
        <table style={{ width: "100%", fontSize: "8pt", marginBottom: "4mm",
          borderCollapse: "collapse" }}>
          <tbody>
            {[
              ["Room",       booking.room?.name],
              ["Check-in",   booking.check_in],
              ["Check-out",  booking.check_out],
              ["Nights",     `${nights} night${nights > 1 ? "s" : ""}`],
            ].map(([label, value]) => (
              <tr key={label}>
                <td style={{ padding: "1.5mm 0", color: "#777", width: "40%" }}>{label}</td>
                <td style={{ padding: "1.5mm 0", fontWeight: "bold" }}>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ borderTop: "1px dashed #C9A84C", margin: "4mm 0" }} />

        {/* Payment Summary */}
        <h3 style={{ fontSize: "9pt", color: "#C9A84C", marginBottom: "3mm",
          fontWeight: "bold", letterSpacing: "1px" }}>
          PAYMENT SUMMARY
        </h3>
        <table style={{ width: "100%", fontSize: "8.5pt",
          borderCollapse: "collapse", marginBottom: "4mm" }}>
          <tbody>
            <tr>
              <td style={{ padding: "1.5mm 0", color: "#555" }}>
                {formatNaira(booking.room?.price_per_night)} × {nights} night{nights > 1 ? "s" : ""}
              </td>
              <td style={{ padding: "1.5mm 0", textAlign: "right", fontWeight: "bold" }}>
                {formatNaira(booking.totalCost)}
              </td>
            </tr>
            <tr style={{ borderTop: "1px solid #eee" }}>
              <td style={{ padding: "1.5mm 0", color: "#555" }}>
                Amount Paid ({booking.payment_method?.replace("_", " ").toUpperCase()})
              </td>
              <td style={{ padding: "1.5mm 0", textAlign: "right",
                fontWeight: "bold", color: "#1A6B2A" }}>
                {formatNaira(booking.amount_paid)}
              </td>
            </tr>
            <tr style={{ borderTop: "2px solid #C9A84C",
              background: booking.balance > 0 ? "#FFF8E7" : "#EBF5EE" }}>
              <td style={{ padding: "2mm 0", fontWeight: "bold", fontSize: "9.5pt" }}>
                {booking.balance > 0 ? "Balance Due on Arrival" : "FULLY PAID"}
              </td>
              <td style={{ padding: "2mm 0", textAlign: "right",
                fontWeight: "bold", fontSize: "10pt",
                color: booking.balance > 0 ? "#B45309" : "#1A6B2A" }}>
                {formatNaira(Math.max(0, booking.balance))}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Notes */}
        {booking.notes && (
          <div style={{ padding: "3mm", background: "#f9f9f9",
            borderRadius: "3mm", marginBottom: "4mm", fontSize: "7.5pt" }}>
            <strong>Notes:</strong> {booking.notes}
          </div>
        )}

        {/* Footer */}
        <div style={{ borderTop: "2px solid #C9A84C", paddingTop: "4mm",
          textAlign: "center", marginTop: "5mm" }}>
          <p style={{ fontSize: "7.5pt", color: "#555", marginBottom: "2mm" }}>
            Thank you for choosing Ilé ÌturaÒgúnbádéwà!
          </p>
          <p style={{ fontSize: "7pt", color: "#888", fontStyle: "italic", margin: 0 }}>
            "…Embrace Comfort, Enjoy Luxury"
          </p>
          <p style={{ fontSize: "7pt", color: "#aaa", marginTop: "3mm" }}>
            This receipt is your proof of booking. Please present at check-in.
          </p>
          <p style={{ fontSize: "6.5pt", color: "#ccc", marginTop: "2mm" }}>
            Saheed Anibaba Street, Off Awolowo Way, Ikorodu, Lagos State
          </p>
        </div>
      </div>
    );
  }
);

RoomReceipt.displayName = "RoomReceipt";
