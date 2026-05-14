import { jsPDF } from "jspdf";
import { formatNaira } from "./utils";

export function generateBookingPDF(booking: {
  bookingRef: string;
  guestName: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  totalAmount: number;
  depositPaid: number;
  isHall: boolean;
}) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const gold = "#C9A84C";
  const forest = "#0D1A0D";

  // Header Background
  doc.setFillColor(13, 26, 13);
  doc.rect(0, 0, 210, 60, "F");

  // Logo Placeholder / Hotel Name
  doc.setTextColor(201, 168, 76);
  doc.setFont("serif", "bold");
  doc.setFontSize(28);
  doc.text("Ilé Ìtura Ògúnbádéwà", 105, 30, { align: "center" });

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("IKORODU · LAGOS STATE · NIGERIA", 105, 38, { align: "center" });

  // Main Content
  doc.setTextColor(33, 33, 33);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("OFFICIAL BOOKING VOUCHER", 20, 80);

  doc.setDrawColor(201, 168, 76);
  doc.setLineWidth(0.5);
  doc.line(20, 85, 190, 85);

  // Booking Info Grid
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text("BOOKING REFERENCE", 20, 100);
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.text(booking.bookingRef, 20, 108);

  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text("GUEST NAME", 120, 100);
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.text(booking.guestName, 120, 108);

  // Room Details
  doc.setFillColor(248, 244, 232);
  doc.rect(20, 120, 170, 40, "F");
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text("CATEGORY", 30, 130);
  doc.setTextColor(0, 0, 0);
  doc.text(booking.roomName, 30, 138);

  doc.setTextColor(100, 100, 100);
  doc.text("CHECK-IN", 100, 130);
  doc.setTextColor(0, 0, 0);
  doc.text(booking.checkIn, 100, 138);

  doc.setTextColor(100, 100, 100);
  doc.text("CHECK-OUT", 150, 130);
  doc.setTextColor(0, 0, 0);
  doc.text(booking.checkOut, 150, 138);

  // Financial Summary
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("PAYMENT SUMMARY", 20, 180);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Total Amount:", 20, 190);
  doc.text(formatNaira(booking.totalAmount), 190, 190, { align: "right" });

  doc.text("Initial Deposit (50% Paid):", 20, 198);
  doc.text(formatNaira(booking.depositPaid), 190, 198, { align: "right" });

  doc.setFont("helvetica", "bold");
  doc.setTextColor(201, 168, 76);
  doc.text("BALANCE DUE ON ARRIVAL:", 20, 210);
  doc.text(formatNaira(booking.totalAmount - booking.depositPaid), 190, 210, { align: "right" });

  // Policy Notice
  doc.setFillColor(255, 245, 245);
  doc.rect(20, 225, 170, 25, "F");
  doc.setTextColor(200, 0, 0);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  const graceDays = booking.isHall ? 14 : 7;
  doc.text("IMPORTANT POLICY NOTICE:", 25, 232);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(50, 50, 50);
  doc.text(`A ${graceDays}-day grace period applies to this booking. You must finalize payment within this window`, 25, 238);
  doc.text("to avoid cancellation. Tokens are non-refundable after this period.", 25, 243);

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text("Ilé Ìtura Ògúnbádéwà - Saheed Anibaba Street, Off Obafemi Awolowo Way, Ikorodu, Lagos.", 105, 280, { align: "center" });
  doc.text("Contact: +234 812 904 1015 | ileitura.hotel@gmail.com", 105, 285, { align: "center" });

  // Save the PDF
  doc.save(`Ile_Itura_Booking_${booking.bookingRef}.pdf`);
}
