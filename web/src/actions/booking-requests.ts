'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { ActionResult } from './types';
import { notifyProNewBookingRequest, isSolapiConfigured } from '@/lib/notifications';

/**
 * Booking Request status
 */
export type BookingRequestStatus = 'pending' | 'contacted' | 'confirmed' | 'cancelled' | 'completed';

/**
 * Booking Request type from database
 */
export type BookingRequest = {
  id: string;
  pro_id: string;
  requester_name: string;
  requester_phone: string;
  requester_email: string | null;
  preferred_time_text: string | null;
  message: string | null;
  status: BookingRequestStatus;
  notification_sent_at: string | null;
  notification_type: string | null;
  pro_notes: string | null;
  responded_at: string | null;
  created_at: string;
  updated_at: string;
};

/**
 * Input for creating a booking request (public form)
 */
export interface CreateBookingRequestInput {
  proId: string;
  name: string;
  phone: string;
  email?: string;
  preferredTime?: string;
  message?: string;
}

/**
 * Create a booking request (public - no auth required)
 */
export async function createBookingRequest(
  input: CreateBookingRequestInput
): Promise<ActionResult<{ id: string }>> {
  try {
    const supabase = await createClient();

    // Validate phone format (Korean phone numbers)
    const phoneRegex = /^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/;
    if (!phoneRegex.test(input.phone.replace(/-/g, ''))) {
      return { success: false, error: '올바른 휴대폰 번호를 입력해주세요.' };
    }

    // Check if pro exists and get their phone number
    const { data: pro, error: proError } = await supabase
      .from('pro_profiles')
      .select('id, title, user_id, kakao_talk_id')
      .eq('id', input.proId)
      .single();

    if (proError || !pro) {
      return { success: false, error: '프로를 찾을 수 없습니다.' };
    }

    // Get pro's phone from profiles table
    const { data: proUser } = await supabase
      .from('profiles')
      .select('phone')
      .eq('id', pro.user_id)
      .single();

    // Create booking request
    const { data, error } = await supabase
      .from('booking_requests')
      .insert({
        pro_id: input.proId,
        requester_name: input.name,
        requester_phone: input.phone.replace(/-/g, ''), // Store without dashes
        requester_email: input.email || null,
        preferred_time_text: input.preferredTime || null,
        message: input.message || null,
        status: 'pending',
      })
      .select('id')
      .single();

    if (error) {
      console.error('createBookingRequest error:', error);
      return { success: false, error: '요청 생성에 실패했습니다.' };
    }

    // Send notification to pro (if configured)
    const proPhone = proUser?.phone || pro.kakao_talk_id;
    if (proPhone && isSolapiConfigured()) {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://teeup.kr';
      const notifyResult = await notifyProNewBookingRequest(proPhone, {
        proName: pro.title,
        requesterName: input.name,
        requesterPhone: input.phone,
        preferredTime: input.preferredTime,
        message: input.message,
        dashboardUrl: `${baseUrl}/dashboard/requests`,
      });

      // Update notification status
      if (notifyResult.success) {
        await markNotificationSent(data.id, notifyResult.channel === 'kakao' ? 'kakao' : 'sms');
      }
    }

    return { success: true, data: { id: data.id } };
  } catch (err) {
    console.error('createBookingRequest error:', err);
    return { success: false, error: '요청 처리 중 오류가 발생했습니다.' };
  }
}

/**
 * Get booking requests for the current pro (auth required)
 */
export async function getMyBookingRequests(
  status?: BookingRequestStatus
): Promise<ActionResult<BookingRequest[]>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Get pro profile
    const { data: profile } = await supabase
      .from('pro_profiles')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!profile) {
      return { success: false, error: 'Pro profile not found' };
    }

    // Build query
    let query = supabase
      .from('booking_requests')
      .select('*')
      .eq('pro_id', profile.id)
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: data || [] };
  } catch (_err) {
    return { success: false, error: 'Failed to fetch booking requests' };
  }
}

/**
 * Get a single booking request by ID (auth required)
 */
export async function getBookingRequest(
  id: string
): Promise<ActionResult<BookingRequest>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    const { data, error } = await supabase
      .from('booking_requests')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (_err) {
    return { success: false, error: 'Failed to fetch booking request' };
  }
}

/**
 * Update booking request status (auth required)
 */
export async function updateBookingRequestStatus(
  id: string,
  status: BookingRequestStatus,
  notes?: string
): Promise<ActionResult<BookingRequest>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    const updates: Partial<BookingRequest> = {
      status,
      responded_at: new Date().toISOString(),
    };

    if (notes !== undefined) {
      updates.pro_notes = notes;
    }

    const { data, error } = await supabase
      .from('booking_requests')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/dashboard/requests');
    return { success: true, data };
  } catch (_err) {
    return { success: false, error: 'Failed to update booking request' };
  }
}

/**
 * Get booking request counts by status (for dashboard)
 */
export async function getBookingRequestCounts(): Promise<
  ActionResult<Record<BookingRequestStatus | 'total', number>>
> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Get pro profile
    const { data: profile } = await supabase
      .from('pro_profiles')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!profile) {
      return { success: false, error: 'Pro profile not found' };
    }

    const { data, error } = await supabase
      .from('booking_requests')
      .select('status')
      .eq('pro_id', profile.id);

    if (error) {
      return { success: false, error: error.message };
    }

    const counts: Record<BookingRequestStatus | 'total', number> = {
      pending: 0,
      contacted: 0,
      confirmed: 0,
      cancelled: 0,
      completed: 0,
      total: data?.length || 0,
    };

    data?.forEach((request) => {
      const status = request.status as BookingRequestStatus;
      if (counts[status] !== undefined) {
        counts[status]++;
      }
    });

    return { success: true, data: counts };
  } catch (_err) {
    return { success: false, error: 'Failed to fetch counts' };
  }
}

/**
 * Mark notification as sent
 */
export async function markNotificationSent(
  id: string,
  notificationType: 'kakao' | 'sms' | 'email'
): Promise<ActionResult<void>> {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from('booking_requests')
      .update({
        notification_sent_at: new Date().toISOString(),
        notification_type: notificationType,
      })
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: undefined };
  } catch (_err) {
    return { success: false, error: 'Failed to mark notification sent' };
  }
}
