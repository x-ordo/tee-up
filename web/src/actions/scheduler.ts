'use server';

import { createClient } from '@/lib/supabase/server';
import type { ActionResult } from './types';
import type {
  AvailabilitySchedule,
  BlockedSlot,
  Booking,
  BookingRequest,
} from '@/components/scheduler/types';
import { getCalendarBlockedSlots } from './calendar';

/**
 * Get availability schedules for a pro
 */
export async function getProAvailability(
  proId: string
): Promise<ActionResult<AvailabilitySchedule[]>> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('availability_schedules')
      .select('*')
      .eq('pro_id', proId)
      .order('day_of_week', { ascending: true });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: data || [] };
  } catch (err) {
    return { success: false, error: 'Failed to fetch availability' };
  }
}

/**
 * Get blocked slots for a pro within a date range
 */
export async function getBlockedSlots(
  proId: string,
  startDate: string,
  endDate: string
): Promise<ActionResult<BlockedSlot[]>> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('blocked_slots')
      .select('*')
      .eq('pro_id', proId)
      .gte('end_at', startDate)
      .lte('start_at', endDate);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: data || [] };
  } catch (err) {
    return { success: false, error: 'Failed to fetch blocked slots' };
  }
}

/**
 * Get existing bookings for a pro within a date range
 */
export async function getProBookings(
  proId: string,
  startDate: string,
  endDate: string
): Promise<ActionResult<Booking[]>> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('pro_id', proId)
      .neq('status', 'cancelled')
      .gte('end_at', startDate)
      .lte('start_at', endDate);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: data || [] };
  } catch (err) {
    return { success: false, error: 'Failed to fetch bookings' };
  }
}

/**
 * Create a new booking request
 */
export async function createBooking(
  request: BookingRequest
): Promise<ActionResult<Booking>> {
  try {
    const supabase = await createClient();

    // Get current user if logged in
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from('bookings')
      .insert({
        pro_id: request.pro_id,
        user_id: user?.id || null,
        guest_name: request.guest_name,
        guest_phone: request.guest_phone || null,
        guest_email: request.guest_email || null,
        start_at: request.start_at,
        end_at: request.end_at,
        customer_notes: request.customer_notes || null,
        status: 'pending',
        payment_status: 'unpaid',
      })
      .select()
      .single();

    if (error) {
      // Handle double-booking constraint violation
      if (error.code === '23P01') {
        return { success: false, error: '선택하신 시간은 이미 예약되었습니다.' };
      }
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err) {
    return { success: false, error: 'Failed to create booking' };
  }
}

/**
 * Get available time slots for a specific date
 * Combines availability schedules, blocked slots, and existing bookings
 */
export async function getAvailableSlots(
  proId: string,
  date: string, // YYYY-MM-DD format
  slotDurationMinutes: number = 60
): Promise<ActionResult<{ start: string; end: string }[]>> {
  try {
    const supabase = await createClient();

    // Call the database function for efficient slot calculation
    const { data, error } = await supabase.rpc('get_available_slots', {
      p_pro_id: proId,
      p_date: date,
      p_slot_duration_minutes: slotDurationMinutes,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    // Transform the result
    const slots = (data || []).map(
      (slot: { slot_start: string; slot_end: string }) => ({
        start: slot.slot_start,
        end: slot.slot_end,
      })
    );

    return { success: true, data: slots };
  } catch (err) {
    return { success: false, error: 'Failed to fetch available slots' };
  }
}

/**
 * Get available time slots with Google Calendar integration
 * Filters out slots that conflict with Google Calendar events
 */
export async function getAvailableSlotsWithCalendar(
  proId: string,
  date: string,
  slotDurationMinutes: number = 60
): Promise<ActionResult<{ start: string; end: string }[]>> {
  try {
    // 1. Get base available slots from database
    const baseResult = await getAvailableSlots(proId, date, slotDurationMinutes);
    if (!baseResult.success) {
      return baseResult;
    }

    // 2. Get Google Calendar blocked slots for the pro
    // First check if pro has calendar enabled
    const supabase = await createClient();
    const { data: proProfile } = await supabase
      .from('pro_profiles')
      .select('google_calendar_enabled, user_id')
      .eq('id', proId)
      .single();

    if (!proProfile?.google_calendar_enabled) {
      // Calendar not enabled, return base slots
      return baseResult;
    }

    // 3. Get calendar blocked slots
    const startOfDay = `${date}T00:00:00+09:00`;
    const endOfDay = `${date}T23:59:59+09:00`;
    const calendarResult = await getCalendarBlockedSlots(startOfDay, endOfDay);

    if (!calendarResult.success || calendarResult.data.length === 0) {
      return baseResult;
    }

    // 4. Filter out slots that conflict with Google Calendar
    const filteredSlots = baseResult.data.filter((slot) => {
      const slotStart = new Date(slot.start);
      const slotEnd = new Date(slot.end);

      // Check if this slot conflicts with any calendar event
      const hasConflict = calendarResult.data.some((blocked) => {
        const blockedStart = new Date(blocked.start);
        const blockedEnd = new Date(blocked.end);
        return slotStart < blockedEnd && slotEnd > blockedStart;
      });

      return !hasConflict;
    });

    return { success: true, data: filteredSlots };
  } catch (err) {
    return { success: false, error: 'Failed to fetch available slots' };
  }
}

/**
 * Check if a specific slot is available
 */
export async function checkSlotAvailability(
  proId: string,
  startAt: string,
  endAt: string
): Promise<ActionResult<boolean>> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase.rpc('is_slot_available', {
      p_pro_id: proId,
      p_start_at: startAt,
      p_end_at: endAt,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: data as boolean };
  } catch (err) {
    return { success: false, error: 'Failed to check slot availability' };
  }
}

/**
 * Get user's own bookings
 */
export async function getMyBookings(): Promise<ActionResult<Booking[]>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('user_id', user.id)
      .order('start_at', { ascending: true });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: data || [] };
  } catch (err) {
    return { success: false, error: 'Failed to fetch bookings' };
  }
}

/**
 * Cancel a booking (by user)
 */
export async function cancelBooking(
  bookingId: string,
  reason?: string
): Promise<ActionResult<Booking>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    const { data, error } = await supabase
      .from('bookings')
      .update({
        status: 'cancelled',
        cancelled_at: new Date().toISOString(),
        cancellation_reason: reason || null,
      })
      .eq('id', bookingId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err) {
    return { success: false, error: 'Failed to cancel booking' };
  }
}
