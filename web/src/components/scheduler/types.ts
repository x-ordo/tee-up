/**
 * Scheduler Types
 * TEE:UP Portfolio SaaS - Pro scheduling and booking feature
 */

// Database ENUM types
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';
export type PaymentStatus = 'unpaid' | 'paid' | 'deposit_paid' | 'refunded';

/**
 * Booking settings from sites table
 */
export interface BookingSettings {
  deposit_enabled: boolean;
  deposit_amount: number; // in KRW
}

/**
 * Availability schedule from database
 */
export interface AvailabilitySchedule {
  id: string;
  pro_id: string;
  day_of_week: number; // 0 = Sunday, 6 = Saturday
  start_time: string; // HH:MM:SS format
  end_time: string;
  is_recurring: boolean;
  specific_date: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Blocked slot from database
 */
export interface BlockedSlot {
  id: string;
  pro_id: string;
  start_at: string; // ISO datetime
  end_at: string;
  reason: string | null;
  created_at: string;
}

/**
 * Booking from database
 */
export interface Booking {
  id: string;
  pro_id: string;
  user_id: string | null;
  guest_name: string | null;
  guest_phone: string | null;
  guest_email: string | null;
  start_at: string;
  end_at: string;
  status: BookingStatus;
  payment_status: PaymentStatus;
  price_amount: number | null;
  price_currency: string;
  deposit_amount: number; // 예약금 금액 (0이면 예약금 없음)
  customer_notes: string | null;
  pro_notes: string | null;
  cancelled_at: string | null;
  cancellation_reason: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Time slot for display
 */
export interface TimeSlot {
  start: Date;
  end: Date;
  isAvailable: boolean;
  isSelected?: boolean;
}

/**
 * Day with slots for WeekView
 */
export interface DayWithSlots {
  date: Date;
  dayOfWeek: number;
  slots: TimeSlot[];
  hasAvailability: boolean;
}

/**
 * Booking request input
 */
export interface BookingRequest {
  pro_id: string;
  start_at: string;
  end_at: string;
  guest_name: string;
  guest_phone?: string;
  guest_email?: string;
  customer_notes?: string;
  // Payment fields (for deposit booking)
  paymentKey?: string;
  orderId?: string;
  amount?: number;
}

/**
 * Pro schedule settings
 */
export interface ProScheduleSettings {
  slot_duration_minutes: number;
  buffer_minutes: number;
  max_advance_days: number;
  min_advance_hours: number;
}

/**
 * Default schedule settings
 */
export const DEFAULT_SCHEDULE_SETTINGS: ProScheduleSettings = {
  slot_duration_minutes: 60,
  buffer_minutes: 0,
  max_advance_days: 30,
  min_advance_hours: 24,
};
