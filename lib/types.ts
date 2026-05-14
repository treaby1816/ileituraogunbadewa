export type RoomType = "standard" | "deluxe" | "suite" | "hall";
export type BookingStatus = "pending" | "confirmed" | "cancelled";
export type GalleryCategory = "rooms" | "bar" | "recreation" | "exterior" | "events";

export interface Room {
  id: string;
  name: string;
  type: RoomType;
  description: string;
  price_per_night: number;
  max_guests: number;
  features: string[];
  images: string[];
  available: boolean;
  created_at: string;
}

export interface Booking {
  id: string;
  booking_ref: string;
  room_id: string | null;
  guest_name: string;
  guest_phone: string;
  guest_email?: string;
  check_in: string;
  check_out: string;
  num_guests: number;
  special_requests?: string;
  status: BookingStatus;
  paystack_ref?: string | null;
  grace_period_expires_at?: string | null;
  created_at: string;
  room?: Room;
}

export interface Inquiry {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  inquiry_type: string;
  message: string;
  read: boolean;
  created_at: string;
}

export interface GalleryItem {
  id: string;
  image_url: string;
  category: GalleryCategory;
  caption?: string;
  sort_order: number;
  created_at: string;
}

export interface ChatMessage {
  id: number;
  role: "user" | "assistant";
  content: string;
  time: string;
  done: boolean;
}

export interface DashboardStats {
  totalBookings: number;
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  avgOccupancy: number;
  pendingCount: number;
  confirmedToday: number;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  created_at: string;
}

