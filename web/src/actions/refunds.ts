'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { ActionResult } from './types';
import {
  requestRefund as tossRequestRefund,
  canRefund as tossCanRefund,
} from '@/lib/payments';

/**
 * Dispute status types
 */
export type DisputeStatus =
  | 'opened'
  | 'pro_responded'
  | 'resolved_pro'
  | 'resolved_customer'
  | 'escalated';

/**
 * Refund request type
 */
export interface RefundRequest {
  bookingId: string;
  reason: string;
}

/**
 * Dispute log entry
 */
export interface DisputeLog {
  id: string;
  booking_id: string;
  actor_id: string | null;
  actor_role: 'customer' | 'pro' | 'admin';
  action: string;
  message: string | null;
  evidence_urls: string[] | null;
  created_at: string;
}

/**
 * Booking with refund details
 */
export interface BookingWithRefund {
  id: string;
  pro_id: string;
  user_id: string | null;
  guest_name: string | null;
  start_at: string;
  end_at: string;
  status: string;
  payment_status: string;
  price_amount: number | null;
  refund_amount: number;
  refund_reason: string | null;
  refund_requested_at: string | null;
  refund_processed_at: string | null;
  dispute_status: DisputeStatus | null;
  dispute_opened_at: string | null;
  dispute_resolved_at: string | null;
  dispute_resolution: string | null;
}

/**
 * Calculate expected refund amount based on cancellation policy
 * 24h before: 100%, 12h before: 50%, <12h: 0%
 */
export async function calculateRefundAmount(
  bookingId: string
): Promise<ActionResult<{ refundAmount: number; refundPercentage: number }>> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase.rpc('calculate_refund_amount', {
      p_booking_id: bookingId,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    // Get booking to calculate percentage
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select('price_amount, start_at')
      .eq('id', bookingId)
      .single();

    if (bookingError) {
      return { success: false, error: bookingError.message };
    }

    const refundAmount = data as number;
    const priceAmount = booking.price_amount || 0;
    const refundPercentage = priceAmount > 0 ? (refundAmount / priceAmount) * 100 : 0;

    return {
      success: true,
      data: { refundAmount, refundPercentage },
    };
  } catch {
    return { success: false, error: '환불 금액 계산에 실패했습니다.' };
  }
}

/**
 * Request a refund for a booking
 */
export async function requestRefund(
  request: RefundRequest
): Promise<ActionResult<BookingWithRefund>> {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: '로그인이 필요합니다.' };
    }

    // Get booking and verify ownership
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', request.bookingId)
      .single();

    if (bookingError || !booking) {
      return { success: false, error: '예약을 찾을 수 없습니다.' };
    }

    // Verify user owns this booking
    if (booking.user_id !== user.id) {
      return { success: false, error: '이 예약에 대한 권한이 없습니다.' };
    }

    // Check if already refunded or refund requested
    if (booking.payment_status === 'refunded') {
      return { success: false, error: '이미 환불이 완료된 예약입니다.' };
    }

    if (booking.refund_requested_at) {
      return { success: false, error: '이미 환불이 요청된 예약입니다.' };
    }

    // Calculate refund amount
    const refundResult = await calculateRefundAmount(request.bookingId);
    if (!refundResult.success) {
      return { success: false, error: refundResult.error };
    }

    const { refundAmount } = refundResult.data;

    // Update booking with refund request
    const { data: updated, error: updateError } = await supabase
      .from('bookings')
      .update({
        refund_amount: refundAmount,
        refund_reason: request.reason,
        refund_requested_at: new Date().toISOString(),
        status: 'cancelled',
      })
      .eq('id', request.bookingId)
      .select()
      .single();

    if (updateError) {
      return { success: false, error: updateError.message };
    }

    revalidatePath('/dashboard/bookings');
    return { success: true, data: updated as BookingWithRefund };
  } catch {
    return { success: false, error: '환불 요청에 실패했습니다.' };
  }
}

/**
 * Process a refund (admin/system function)
 * This integrates with Toss Payments for actual refund processing
 */
export async function processRefund(
  bookingId: string,
  amount?: number
): Promise<ActionResult<BookingWithRefund>> {
  try {
    const supabase = await createClient();

    // Get current user and verify admin role
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: '로그인이 필요합니다.' };
    }

    // Check admin role
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || profile?.role !== 'admin') {
      return { success: false, error: '관리자 권한이 필요합니다.' };
    }

    // Get booking
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .single();

    if (bookingError || !booking) {
      return { success: false, error: '예약을 찾을 수 없습니다.' };
    }

    // Determine refund amount
    const refundAmount = amount ?? booking.refund_amount ?? 0;

    // Process refund with Toss Payments if payment_key exists
    if (booking.payment_key && refundAmount > 0) {
      // Check if refund is possible
      const canRefundResult = await tossCanRefund(booking.payment_key, refundAmount);
      if (!canRefundResult.canRefund) {
        return {
          success: false,
          error: canRefundResult.reason || '환불 처리가 불가능합니다.',
        };
      }

      // Request refund from Toss
      const tossResult = await tossRequestRefund({
        paymentKey: booking.payment_key,
        cancelReason: booking.refund_reason || '고객 요청에 의한 환불',
        cancelAmount: refundAmount,
      });

      if (!tossResult.success) {
        return {
          success: false,
          error: tossResult.error || 'Toss 환불 처리에 실패했습니다.',
        };
      }
    }

    // Update booking as refunded
    const { data: updated, error: updateError } = await supabase
      .from('bookings')
      .update({
        payment_status: 'refunded',
        refund_amount: refundAmount,
        refund_processed_at: new Date().toISOString(),
      })
      .eq('id', bookingId)
      .select()
      .single();

    if (updateError) {
      return { success: false, error: updateError.message };
    }

    revalidatePath('/admin/disputes');
    revalidatePath('/dashboard/bookings');
    return { success: true, data: updated as BookingWithRefund };
  } catch {
    return { success: false, error: '환불 처리에 실패했습니다.' };
  }
}

/**
 * Open a dispute for a booking
 */
export async function openDispute(
  bookingId: string,
  message: string
): Promise<ActionResult<BookingWithRefund>> {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: '로그인이 필요합니다.' };
    }

    // Get booking and verify ownership
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select('*, pro_profiles!inner(user_id)')
      .eq('id', bookingId)
      .single();

    if (bookingError || !booking) {
      return { success: false, error: '예약을 찾을 수 없습니다.' };
    }

    // Determine if user is customer or pro
    const isCustomer = booking.user_id === user.id;
    const isPro = booking.pro_profiles?.user_id === user.id;

    if (!isCustomer && !isPro) {
      return { success: false, error: '이 예약에 대한 권한이 없습니다.' };
    }

    // Check if dispute already exists
    if (booking.dispute_status) {
      return { success: false, error: '이미 분쟁이 진행 중입니다.' };
    }

    // Update booking with dispute status
    const { data: updated, error: updateError } = await supabase
      .from('bookings')
      .update({
        dispute_status: 'opened',
        dispute_opened_at: new Date().toISOString(),
      })
      .eq('id', bookingId)
      .select()
      .single();

    if (updateError) {
      return { success: false, error: updateError.message };
    }

    // Create dispute log
    await supabase.from('dispute_logs').insert({
      booking_id: bookingId,
      actor_id: user.id,
      actor_role: isCustomer ? 'customer' : 'pro',
      action: 'opened',
      message,
    });

    revalidatePath('/dashboard/bookings');
    revalidatePath('/admin/disputes');
    return { success: true, data: updated as BookingWithRefund };
  } catch {
    return { success: false, error: '분쟁 접수에 실패했습니다.' };
  }
}

/**
 * Respond to a dispute (pro response)
 */
export async function respondToDispute(
  bookingId: string,
  response: string,
  evidenceUrls?: string[]
): Promise<ActionResult<BookingWithRefund>> {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: '로그인이 필요합니다.' };
    }

    // Get booking and verify pro ownership
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select('*, pro_profiles!inner(user_id)')
      .eq('id', bookingId)
      .single();

    if (bookingError || !booking) {
      return { success: false, error: '예약을 찾을 수 없습니다.' };
    }

    if (booking.pro_profiles?.user_id !== user.id) {
      return { success: false, error: '프로만 분쟁에 응답할 수 있습니다.' };
    }

    // Check dispute status
    if (booking.dispute_status !== 'opened') {
      return { success: false, error: '응답할 수 있는 분쟁 상태가 아닙니다.' };
    }

    // Update booking with pro response
    const { data: updated, error: updateError } = await supabase
      .from('bookings')
      .update({
        dispute_status: 'pro_responded',
      })
      .eq('id', bookingId)
      .select()
      .single();

    if (updateError) {
      return { success: false, error: updateError.message };
    }

    // Create dispute log
    await supabase.from('dispute_logs').insert({
      booking_id: bookingId,
      actor_id: user.id,
      actor_role: 'pro',
      action: 'responded',
      message: response,
      evidence_urls: evidenceUrls || null,
    });

    revalidatePath('/dashboard/bookings');
    revalidatePath('/admin/disputes');
    return { success: true, data: updated as BookingWithRefund };
  } catch {
    return { success: false, error: '분쟁 응답에 실패했습니다.' };
  }
}

/**
 * Resolve a dispute (admin function)
 */
export async function resolveDispute(
  bookingId: string,
  resolution: 'resolved_pro' | 'resolved_customer',
  notes: string,
  refundAmount?: number
): Promise<ActionResult<BookingWithRefund>> {
  try {
    const supabase = await createClient();

    // Get current user and verify admin role
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: '로그인이 필요합니다.' };
    }

    // Check admin role
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || profile?.role !== 'admin') {
      return { success: false, error: '관리자 권한이 필요합니다.' };
    }

    // Get booking to check for payment_key
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .single();

    if (bookingError || !booking) {
      return { success: false, error: '예약을 찾을 수 없습니다.' };
    }

    // Update booking with resolution
    const updateData: Record<string, unknown> = {
      dispute_status: resolution,
      dispute_resolved_at: new Date().toISOString(),
      dispute_resolution: notes,
    };

    // If resolved in favor of customer and refund amount specified, process refund
    if (resolution === 'resolved_customer' && refundAmount !== undefined && refundAmount > 0) {
      // Process refund with Toss Payments if payment_key exists
      if (booking.payment_key) {
        const canRefundResult = await tossCanRefund(booking.payment_key, refundAmount);
        if (!canRefundResult.canRefund) {
          return {
            success: false,
            error: canRefundResult.reason || '환불 처리가 불가능합니다.',
          };
        }

        const tossResult = await tossRequestRefund({
          paymentKey: booking.payment_key,
          cancelReason: `분쟁 해결: ${notes}`,
          cancelAmount: refundAmount,
        });

        if (!tossResult.success) {
          return {
            success: false,
            error: tossResult.error || 'Toss 환불 처리에 실패했습니다.',
          };
        }
      }

      updateData.refund_amount = refundAmount;
      updateData.payment_status = 'refunded';
      updateData.refund_processed_at = new Date().toISOString();
    }

    const { data: updated, error: updateError } = await supabase
      .from('bookings')
      .update(updateData)
      .eq('id', bookingId)
      .select()
      .single();

    if (updateError) {
      return { success: false, error: updateError.message };
    }

    // Create dispute log
    await supabase.from('dispute_logs').insert({
      booking_id: bookingId,
      actor_id: user.id,
      actor_role: 'admin',
      action: 'resolved',
      message: notes,
    });

    revalidatePath('/admin/disputes');
    revalidatePath('/dashboard/bookings');
    return { success: true, data: updated as BookingWithRefund };
  } catch {
    return { success: false, error: '분쟁 해결에 실패했습니다.' };
  }
}

/**
 * Escalate a dispute (requires admin intervention)
 */
export async function escalateDispute(
  bookingId: string,
  reason: string
): Promise<ActionResult<BookingWithRefund>> {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: '로그인이 필요합니다.' };
    }

    // Get booking
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select('*, pro_profiles!inner(user_id)')
      .eq('id', bookingId)
      .single();

    if (bookingError || !booking) {
      return { success: false, error: '예약을 찾을 수 없습니다.' };
    }

    // Verify user is involved in the booking
    const isCustomer = booking.user_id === user.id;
    const isPro = booking.pro_profiles?.user_id === user.id;

    if (!isCustomer && !isPro) {
      return { success: false, error: '이 예약에 대한 권한이 없습니다.' };
    }

    // Check if dispute is in a state that can be escalated
    if (!booking.dispute_status || booking.dispute_status === 'escalated') {
      return { success: false, error: '에스컬레이션할 수 있는 분쟁 상태가 아닙니다.' };
    }

    // Update booking
    const { data: updated, error: updateError } = await supabase
      .from('bookings')
      .update({
        dispute_status: 'escalated',
      })
      .eq('id', bookingId)
      .select()
      .single();

    if (updateError) {
      return { success: false, error: updateError.message };
    }

    // Create dispute log
    await supabase.from('dispute_logs').insert({
      booking_id: bookingId,
      actor_id: user.id,
      actor_role: isCustomer ? 'customer' : 'pro',
      action: 'escalated',
      message: reason,
    });

    revalidatePath('/dashboard/bookings');
    revalidatePath('/admin/disputes');
    return { success: true, data: updated as BookingWithRefund };
  } catch {
    return { success: false, error: '에스컬레이션에 실패했습니다.' };
  }
}

/**
 * Get dispute logs for a booking
 */
export async function getDisputeLogs(
  bookingId: string
): Promise<ActionResult<DisputeLog[]>> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('dispute_logs')
      .select('*')
      .eq('booking_id', bookingId)
      .order('created_at', { ascending: true });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: data as DisputeLog[] };
  } catch {
    return { success: false, error: '분쟁 로그 조회에 실패했습니다.' };
  }
}

/**
 * Get all disputes (admin function)
 */
export async function getAllDisputes(
  status?: DisputeStatus
): Promise<ActionResult<BookingWithRefund[]>> {
  try {
    const supabase = await createClient();

    // Get current user and verify admin role
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: '로그인이 필요합니다.' };
    }

    // Check admin role
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || profile?.role !== 'admin') {
      return { success: false, error: '관리자 권한이 필요합니다.' };
    }

    let query = supabase
      .from('bookings')
      .select('*')
      .not('dispute_status', 'is', null);

    if (status) {
      query = query.eq('dispute_status', status);
    }

    const { data, error } = await query.order('dispute_opened_at', { ascending: false });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: data as BookingWithRefund[] };
  } catch {
    return { success: false, error: '분쟁 목록 조회에 실패했습니다.' };
  }
}

/**
 * Get pending refund requests (admin function)
 */
export async function getPendingRefunds(): Promise<ActionResult<BookingWithRefund[]>> {
  try {
    const supabase = await createClient();

    // Get current user and verify admin role
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: '로그인이 필요합니다.' };
    }

    // Check admin role
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || profile?.role !== 'admin') {
      return { success: false, error: '관리자 권한이 필요합니다.' };
    }

    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .not('refund_requested_at', 'is', null)
      .is('refund_processed_at', null)
      .order('refund_requested_at', { ascending: true });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: data as BookingWithRefund[] };
  } catch {
    return { success: false, error: '환불 요청 목록 조회에 실패했습니다.' };
  }
}
