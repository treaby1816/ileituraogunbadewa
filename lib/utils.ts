import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Tailwind class merger */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format Naira currency */
export function formatNaira(amount: number): string {
  return `₦${amount.toLocaleString("en-NG")}`;
}

/** Calculate nights between two date strings */
export function calcNights(checkIn: string, checkOut: string): number {
  const diff =
    new Date(checkOut).getTime() - new Date(checkIn).getTime();
  return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

/** Format relative time ("2 min ago") */
export function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} hr ago`;
  return `${Math.floor(h / 24)}d ago`;
}

/** Generate WhatsApp booking link */
export function buildWABookingLink(params: {
  guestName: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  ref: string;
}): string {
  const msg = encodeURIComponent(
    `Hello! I have just made a booking at Ilé Ìtura Ògúnbádéwà.\n\n` +
    `Booking Ref: ${params.ref}\n` +
    `Name: ${params.guestName}\n` +
    `Room: ${params.roomName}\n` +
    `Check-in: ${params.checkIn}\n` +
    `Check-out: ${params.checkOut}\n\n` +
    `Please confirm my reservation. Thank you!`
  );
  return `https://wa.me/2348129041015?text=${msg}`;
}

/** Nigerian phone validator (basic) */
export function isValidNGPhone(phone: string): boolean {
  return /^(0[789]\d{9}|(\+?234)[789]\d{9})$/.test(phone.replace(/\s/g, ""));
}

/** Generate a short booking reference (client-side fallback) */
export function generateRef(): string {
  return "IIO-" + Math.random().toString(36).slice(2, 10).toUpperCase();
}
