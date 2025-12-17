/**
 * Scheduler Components
 * TEE:UP Portfolio SaaS - Pro scheduling and booking feature
 *
 * Usage:
 * ```tsx
 * import { Scheduler } from '@/components/scheduler';
 *
 * // In a pro's portfolio page:
 * <Scheduler proId={pro.id} proName={pro.name} />
 * ```
 *
 * UX Flow (3 clicks to book):
 * 1. Click date in WeekView
 * 2. Click time slot in TimeSlotPicker (opens BookingSheet)
 * 3. Click "예약 요청하기" in BookingSheet
 */

// Main component
export { Scheduler } from './Scheduler';

// Sub-components (for custom layouts)
export { WeekView } from './WeekView';
export { TimeSlotPicker } from './TimeSlotPicker';
export { BookingSheet } from './BookingSheet';

// Types
export type {
  BookingStatus,
  PaymentStatus,
  AvailabilitySchedule,
  BlockedSlot,
  Booking,
  TimeSlot,
  DayWithSlots,
  BookingRequest,
  ProScheduleSettings,
} from './types';

export { DEFAULT_SCHEDULE_SETTINGS } from './types';
