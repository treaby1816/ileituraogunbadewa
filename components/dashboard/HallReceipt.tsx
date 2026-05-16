import { forwardRef } from "react";
import { formatNaira } from "@/lib/utils";

// This component is designed specifically for printing
// react-to-print renders it as a real print document
// Styles use inline CSS for maximum print compatibility

export const HallReceipt = forwardRef<HTMLDivElement, { booking: any }>(
  ({ booking }, ref) => {
    const now = new Date();

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
            HALL BOOKING RECEIPT
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

        {/* Client Details */}
        <h3 style={{ fontSize: "9pt", color: "#C9A84C", marginBottom: "3mm",
          fontWeight: "bold", letterSpacing: "1px" }}>
          CLIENT DETAILS
        </h3>
        <table style={{ width: "100%", fontSize: "8pt", marginBottom: "4mm",
          borderCollapse: "collapse" }}>
          <tbody>
            {[
              ["Client Name", booking.client_name],
              ["Phone",       booking.client_phone],
              ["Email",       booking.client_email || "N/A"],
            ].map(([label, value]) => (
              <tr key={label}>
                <td style={{ padding: "1mm 0", color: "#777", width: "40%" }}>{label}</td>
                <td style={{ padding: "1mm 0", fontWeight: "bold" }}>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ borderTop: "1px dashed #C9A84C", margin: "4mm 0" }} />

        {/* Event Details */}
        <h3 style={{ fontSize: "9pt", color: "#C9A84C", marginBottom: "3mm",
          fontWeight: "bold", letterSpacing: "1px" }}>
          EVENT DETAILS
        </h3>
        <table style={{ width: "100%", fontSize: "8pt", marginBottom: "4mm",
          borderCollapse: "collapse" }}>
          <tbody>
            {[
              ["Hall",          booking.hall_name],
              ["Event Type",    booking.event_type?.replace("_", " ").toUpperCase()],
              ["Event Date",    booking.event_date],
              ["Time",          `${booking.event_start_time} - ${booking.event_end_time}`],
              ["Guests",        `${booking.expected_guests} persons`],
              ["Setup Needed?", booking.setup_required ? "Yes" : "No"],
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
                Total Agreed Amount
              </td>
              <td style={{ padding: "1.5mm 0", textAlign: "right", fontWeight: "bold" }}>
                {formatNaira(booking.total_amount)}
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
              background: booking.balance_due > 0 ? "#FFF8E7" : "#EBF5EE" }}>
              <td style={{ padding: "2mm 0", fontWeight: "bold", fontSize: "9.5pt" }}>
                {booking.balance_due > 0 ? "Balance Due Before Event" : "FULLY PAID"}
              </td>
              <td style={{ padding: "2mm 0", textAlign: "right",
                fontWeight: "bold", fontSize: "10pt",
                color: booking.balance_due > 0 ? "#B45309" : "#1A6B2A" }}>
                {formatNaira(Math.max(0, booking.balance_due))}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Notes */}
        {(booking.setup_notes || booking.special_requests) && (
          <div style={{ padding: "3mm", background: "#f9f9f9",
            borderRadius: "3mm", marginBottom: "4mm", fontSize: "7.5pt" }}>
            {booking.setup_notes && <div><strong>Setup Notes:</strong> {booking.setup_notes}</div>}
            {booking.special_requests && <div style={{ marginTop: "1mm" }}><strong>Special Requests:</strong> {booking.special_requests}</div>}
          </div>
        )}

        {/* Footer */}
        <div style={{ borderTop: "2px solid #C9A84C", paddingTop: "4mm",
          textAlign: "center", marginTop: "5mm" }}>
          <p style={{ fontSize: "7.5pt", color: "#555", marginBottom: "2mm" }}>
            Thank you for choosing Ilé ÌturaÒgúnbádéwà Event Hall!
          </p>
          <p style={{ fontSize: "7pt", color: "#888", fontStyle: "italic", margin: 0 }}>
            "…Embrace Comfort, Enjoy Luxury"
          </p>
          <p style={{ fontSize: "7pt", color: "#aaa", marginTop: "3mm" }}>
            This receipt is your proof of booking. Please present on event day.
          </p>
          <p style={{ fontSize: "6.5pt", color: "#ccc", marginTop: "2mm" }}>
            Saheed Anibaba Street, Off Awolowo Way, Ikorodu, Lagos State
          </p>
        </div>
      </div>
    );
  }
);

HallReceipt.displayName = "HallReceipt";
