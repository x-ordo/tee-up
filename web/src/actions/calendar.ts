'use server';

import { createClient } from '@/lib/supabase/server';
import {
  createEvent,
  listEvents,
  deleteEvent,
  getFreeBusy,
  eventsToBlockedSlots,
  GoogleCalendarAuthError,
  type BookingData,
  type GoogleCalendarEvent,
} from '@/lib/google-calendar';
import type { ActionResult } from './types';

// ============================================
// Types
// ============================================

export interface CalendarBlockedSlot {
  start: string; // ISO datetime
  end: string;
  reason: string;
}

export interface CalendarSyncResult {
  eventId: string;
  eventLink?: string;
}

// ============================================
// Helper: Get Google Access Token from Session
// ============================================

/**
 * Securely retrieve Google access token from current user session
 * Only works server-side in Server Actions
 */
async function getGoogleAccessToken(): Promise<ActionResult<string>> {
  const supabase = await createClient();

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session) {
    return { success: false, error: '로그인이 필요합니다.' };
  }

  const providerToken = session.provider_token;

  if (!providerToken) {
    return {
      success: false,
      error: 'Google Calendar 권한이 없습니다. Google 계정으로 다시 로그인해주세요.',
    };
  }

  return { success: true, data: providerToken };
}

// ============================================
// Server Actions
// ============================================

/**
 * Sync a confirmed booking to Google Calendar
 * Called when a pro confirms a booking
 */
export async function syncBookingToCalendar(
  booking: {
    id: string;
    guest_name: string;
    guest_email?: string | null;
    guest_phone?: string | null;
    start_at: string;
    end_at: string;
    customer_notes?: string | null;
  },
  proInfo: {
    name: string;
    location?: string;
  }
): Promise<ActionResult<CalendarSyncResult>> {
  try {
    // Get access token
    const tokenResult = await getGoogleAccessToken();
    if (!tokenResult.success) {
      return { success: false, error: tokenResult.error };
    }

    const bookingData: BookingData = {
      id: booking.id,
      guestName: booking.guest_name,
      guestEmail: booking.guest_email || undefined,
      guestPhone: booking.guest_phone || undefined,
      startAt: booking.start_at,
      endAt: booking.end_at,
      customerNotes: booking.customer_notes || undefined,
      proName: proInfo.name,
      proLocation: proInfo.location,
    };

    const event = await createEvent(tokenResult.data, bookingData);

    // Optionally store Google Calendar event ID in our database
    // for future updates/deletions
    if (event.id) {
      const supabase = await createClient();
      await supabase
        .from('bookings')
        .update({ google_calendar_event_id: event.id })
        .eq('id', booking.id);
    }

    return {
      success: true,
      data: {
        eventId: event.id || '',
        eventLink: `https://calendar.google.com/calendar/event?eid=${event.id}`,
      },
    };
  } catch (error) {
    if (error instanceof GoogleCalendarAuthError) {
      return { success: false, error: error.message };
    }
    console.error('Calendar sync error:', error);
    return { success: false, error: 'Google Calendar 동기화에 실패했습니다.' };
  }
}

/**
 * Remove a booking from Google Calendar
 * Called when a booking is cancelled
 */
export async function removeBookingFromCalendar(
  googleEventId: string
): Promise<ActionResult<void>> {
  try {
    const tokenResult = await getGoogleAccessToken();
    if (!tokenResult.success) {
      return { success: false, error: tokenResult.error };
    }

    await deleteEvent(tokenResult.data, googleEventId);

    return { success: true, data: undefined };
  } catch (error) {
    if (error instanceof GoogleCalendarAuthError) {
      return { success: false, error: error.message };
    }
    console.error('Calendar delete error:', error);
    return { success: false, error: 'Google Calendar 일정 삭제에 실패했습니다.' };
  }
}

/**
 * Get blocked time slots from Google Calendar
 * Returns times that should be marked as unavailable in the scheduler
 */
export async function getCalendarBlockedSlots(
  startDate: string,
  endDate: string
): Promise<ActionResult<CalendarBlockedSlot[]>> {
  try {
    const tokenResult = await getGoogleAccessToken();
    if (!tokenResult.success) {
      // If no Google Calendar connected, return empty (not an error)
      return { success: true, data: [] };
    }

    // Use FreeBusy API for efficiency
    const busySlots = await getFreeBusy(
      tokenResult.data,
      startDate,
      endDate
    );

    const blockedSlots: CalendarBlockedSlot[] = busySlots.map((slot) => ({
      start: slot.start,
      end: slot.end,
      reason: 'Google Calendar',
    }));

    return { success: true, data: blockedSlots };
  } catch (error) {
    if (error instanceof GoogleCalendarAuthError) {
      // Token expired - return empty instead of failing
      console.warn('Google Calendar auth expired, skipping calendar integration');
      return { success: true, data: [] };
    }
    console.error('Calendar fetch error:', error);
    return { success: false, error: 'Google Calendar 일정을 가져오는데 실패했습니다.' };
  }
}

/**
 * Get detailed events from Google Calendar
 * Use when you need event details, not just busy times
 */
export async function getCalendarEvents(
  startDate: string,
  endDate: string
): Promise<ActionResult<GoogleCalendarEvent[]>> {
  try {
    const tokenResult = await getGoogleAccessToken();
    if (!tokenResult.success) {
      return { success: true, data: [] };
    }

    const events = await listEvents(
      tokenResult.data,
      startDate,
      endDate
    );

    return { success: true, data: events };
  } catch (error) {
    if (error instanceof GoogleCalendarAuthError) {
      return { success: true, data: [] };
    }
    console.error('Calendar events fetch error:', error);
    return { success: false, error: 'Google Calendar 일정을 가져오는데 실패했습니다.' };
  }
}

/**
 * Check if user has Google Calendar connected
 */
export async function hasGoogleCalendarConnected(): Promise<ActionResult<boolean>> {
  const tokenResult = await getGoogleAccessToken();
  return { success: true, data: tokenResult.success };
}

/**
 * Get combined availability considering both database and Google Calendar
 * This merges our app's blocked_slots with Google Calendar busy times
 */
export async function getCombinedBlockedSlots(
  proId: string,
  startDate: string,
  endDate: string
): Promise<ActionResult<CalendarBlockedSlot[]>> {
  try {
    const supabase = await createClient();

    // 1. Get blocked slots from our database
    const { data: dbBlockedSlots, error: dbError } = await supabase
      .from('blocked_slots')
      .select('start_at, end_at, reason')
      .eq('pro_id', proId)
      .gte('end_at', startDate)
      .lte('start_at', endDate);

    if (dbError) {
      return { success: false, error: dbError.message };
    }

    // 2. Get blocked slots from Google Calendar
    const calendarResult = await getCalendarBlockedSlots(startDate, endDate);

    // 3. Combine both sources
    const combinedSlots: CalendarBlockedSlot[] = [
      // Database blocked slots
      ...(dbBlockedSlots || []).map((slot) => ({
        start: slot.start_at,
        end: slot.end_at,
        reason: slot.reason || '예약 불가',
      })),
      // Google Calendar blocked slots
      ...(calendarResult.success ? calendarResult.data : []),
    ];

    // Sort by start time
    combinedSlots.sort(
      (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
    );

    return { success: true, data: combinedSlots };
  } catch (error) {
    console.error('Combined blocked slots error:', error);
    return { success: false, error: '예약 불가 시간을 가져오는데 실패했습니다.' };
  }
}
