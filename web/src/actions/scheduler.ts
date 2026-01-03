'use server';

import { createClient } from '@/lib/supabase/server';
import type { ActionResult } from './types';
import type {
  AvailabilitySchedule,
  BlockedSlot,
  Booking,
  BookingRequest,
  BookingSettings,
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
  } catch (_err) {
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
  } catch (_err) {
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
  } catch (_err) {
    return { success: false, error: 'Failed to fetch bookings' };
  }
}

/**
 * Create a new booking request
 * If paymentKey is provided, verifies payment with Toss before creating booking
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

    // If payment info is provided, verify with Toss first
    let paymentVerified = false;
    let paymentAmount = 0;
    // Determine payment type from request: 'deposit' | 'full' | 'none'
    const paymentType = request.paymentType || 'none';

    if (request.paymentKey && request.orderId && request.amount) {
      // Verify payment with Toss Payments API
      const tossSecretKey = process.env.TOSS_SECRET_KEY;
      if (!tossSecretKey) {
        return { success: false, error: '결제 시스템 설정 오류' };
      }

      const response = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${Buffer.from(`${tossSecretKey}:`).toString('base64')}`,
        },
        body: JSON.stringify({
          paymentKey: request.paymentKey,
          orderId: request.orderId,
          amount: request.amount,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        return {
          success: false,
          error: error.message || '결제 검증에 실패했습니다.',
        };
      }

      paymentVerified = true;
      paymentAmount = request.amount;
    }

    // Determine payment_status based on payment type
    const getPaymentStatus = () => {
      if (!paymentVerified) return 'unpaid';
      if (paymentType === 'full') return 'paid';
      return 'deposit_paid';
    };

    // Create booking with appropriate status
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
        // 결제 완료 시 바로 confirmed, 아니면 pending
        status: paymentVerified ? 'confirmed' : 'pending',
        payment_status: getPaymentStatus(),
        payment_type: paymentType,
        payment_key: request.paymentKey || null,
        order_id: request.orderId || null,
        price_amount: paymentType === 'full' ? paymentAmount : null,
        deposit_amount: paymentType === 'deposit' ? paymentAmount : 0,
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
  } catch (_err) {
    console.error('createBooking error:', _err);
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
  } catch (_err) {
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
  } catch (_err) {
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
  } catch (_err) {
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
  } catch (_err) {
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
  } catch (_err) {
    return { success: false, error: 'Failed to cancel booking' };
  }
}

/**
 * Get booking settings for a pro (via their site)
 * Returns deposit and trial lesson settings
 */
export async function getBookingSettingsByProId(
  proId: string
): Promise<ActionResult<BookingSettings>> {
  const defaultSettings: BookingSettings = {
    deposit_enabled: false,
    deposit_amount: 30000,
    trial_lesson_enabled: false,
    trial_lesson_price: undefined,
  };

  try {
    const supabase = await createClient();

    // 1. Get the pro's user_id from pro_profiles
    const { data: proProfile, error: proError } = await supabase
      .from('pro_profiles')
      .select('user_id')
      .eq('id', proId)
      .single();

    if (proError || !proProfile) {
      // Return default settings if pro not found
      return { success: true, data: defaultSettings };
    }

    // 2. Get the site's booking_settings by owner_id
    const { data: site, error: siteError } = await supabase
      .from('sites')
      .select('booking_settings')
      .eq('owner_id', proProfile.user_id)
      .single();

    if (siteError || !site) {
      // Return default settings if site not found
      return { success: true, data: defaultSettings };
    }

    // Parse booking_settings JSONB (with defaults)
    const settings = site.booking_settings as BookingSettings | null;
    return {
      success: true,
      data: {
        deposit_enabled: settings?.deposit_enabled ?? false,
        deposit_amount: settings?.deposit_amount ?? 30000,
        trial_lesson_enabled: settings?.trial_lesson_enabled ?? false,
        trial_lesson_price: settings?.trial_lesson_price,
      },
    };
  } catch (_err) {
    console.error('getBookingSettingsByProId error:', _err);
    return { success: true, data: defaultSettings };
  }
}
