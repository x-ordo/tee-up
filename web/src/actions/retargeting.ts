'use server';

/**
 * Retargeting Server Actions
 * TEE:UP Portfolio SaaS
 *
 * Handles user activity tracking and retargeting logic
 */

import { createClient } from '@/lib/supabase/server';
import type { ActionResult } from './types';

// ============================================================
// Types
// ============================================================

export type ActivityEventType =
  | 'quiz_start'
  | 'quiz_abandon'
  | 'quiz_complete'
  | 'form_start'
  | 'form_abandon'
  | 'form_submit'
  | 'profile_view'
  | 'signup_start'
  | 'signup_abandon'
  | 'signup_complete'
  | 'consultation_start'
  | 'consultation_abandon';

export interface ActivityEvent {
  id: string;
  user_id: string | null;
  session_id: string | null;
  email: string | null;
  phone: string | null;
  event_type: ActivityEventType;
  pro_id: string | null;
  page_url: string | null;
  referrer: string | null;
  metadata: Record<string, unknown>;
  retarget_eligible: boolean;
  retarget_sent_at: string | null;
  retarget_count: number;
  created_at: string;
}

export interface NotificationPreferences {
  id: string;
  user_id: string;
  email_marketing: boolean;
  email_transactional: boolean;
  email_retargeting: boolean;
  push_enabled: boolean;
  push_marketing: boolean;
  unsubscribed_at: string | null;
  unsubscribe_reason: string | null;
  created_at: string;
  updated_at: string;
}

export interface PendingRetarget {
  event_id: string;
  campaign_id: string;
  event_type: string;
  user_id: string | null;
  email: string | null;
  phone: string | null;
  pro_id: string | null;
  metadata: Record<string, unknown>;
  campaign_name: string;
  channel: string;
  subject: string;
  content_template: string;
}

// ============================================================
// Activity Tracking
// ============================================================

/**
 * Track a user activity event for retargeting purposes
 */
export async function trackActivityEvent(params: {
  eventType: ActivityEventType;
  sessionId?: string;
  email?: string;
  phone?: string;
  proId?: string;
  pageUrl?: string;
  referrer?: string;
  metadata?: Record<string, unknown>;
}): Promise<ActionResult<ActivityEvent>> {
  const supabase = await createClient();

  // Get current user if authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('user_activity_events')
    .insert({
      user_id: user?.id || null,
      session_id: params.sessionId || null,
      email: params.email || user?.email || null,
      phone: params.phone || null,
      event_type: params.eventType,
      pro_id: params.proId || null,
      page_url: params.pageUrl || null,
      referrer: params.referrer || null,
      metadata: params.metadata || {},
      retarget_eligible: true,
    })
    .select()
    .single();

  if (error) {
    console.error('[Retargeting] Failed to track event:', error);
    return { success: false, error: error.message };
  }

  return { success: true, data };
}

/**
 * Mark an event as completed (e.g., quiz_complete after quiz_start)
 * This makes the previous abandon event ineligible for retargeting
 */
export async function markEventCompleted(params: {
  sessionId?: string;
  eventType: ActivityEventType;
}): Promise<ActionResult<void>> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Find the corresponding start/abandon event and mark as not eligible
  const abandonType = params.eventType.replace('_complete', '_abandon').replace('_submit', '_abandon');

  const { error } = await supabase
    .from('user_activity_events')
    .update({ retarget_eligible: false })
    .or(
      user?.id
        ? `user_id.eq.${user.id}`
        : params.sessionId
          ? `session_id.eq.${params.sessionId}`
          : 'id.eq.never'
    )
    .eq('event_type', abandonType)
    .is('retarget_sent_at', null);

  if (error) {
    console.error('[Retargeting] Failed to mark event completed:', error);
    return { success: false, error: error.message };
  }

  return { success: true, data: undefined };
}

// ============================================================
// Notification Preferences
// ============================================================

/**
 * Get user's notification preferences
 */
export async function getNotificationPreferences(): Promise<ActionResult<NotificationPreferences | null>> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Not authenticated' };
  }

  const { data, error } = await supabase
    .from('notification_preferences')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data };
}

/**
 * Update user's notification preferences
 */
export async function updateNotificationPreferences(params: {
  emailMarketing?: boolean;
  emailTransactional?: boolean;
  emailRetargeting?: boolean;
  pushEnabled?: boolean;
  pushMarketing?: boolean;
}): Promise<ActionResult<NotificationPreferences>> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Not authenticated' };
  }

  const updates: Record<string, boolean | string> = {};
  if (params.emailMarketing !== undefined) updates.email_marketing = params.emailMarketing;
  if (params.emailTransactional !== undefined) updates.email_transactional = params.emailTransactional;
  if (params.emailRetargeting !== undefined) updates.email_retargeting = params.emailRetargeting;
  if (params.pushEnabled !== undefined) updates.push_enabled = params.pushEnabled;
  if (params.pushMarketing !== undefined) updates.push_marketing = params.pushMarketing;

  const { data, error } = await supabase
    .from('notification_preferences')
    .upsert(
      {
        user_id: user.id,
        ...updates,
      },
      { onConflict: 'user_id' }
    )
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data };
}

/**
 * Unsubscribe from retargeting emails (can be called without auth via token)
 */
export async function unsubscribeFromRetargeting(params: {
  email: string;
  reason?: string;
}): Promise<ActionResult<void>> {
  const supabase = await createClient();

  // Find user by email
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', params.email)
    .maybeSingle();

  if (profile) {
    // Update preferences for registered user
    await supabase
      .from('notification_preferences')
      .upsert(
        {
          user_id: profile.id,
          email_retargeting: false,
          unsubscribed_at: new Date().toISOString(),
          unsubscribe_reason: params.reason || 'User requested unsubscribe',
        },
        { onConflict: 'user_id' }
      );
  }

  // Also mark all pending events for this email as ineligible
  await supabase
    .from('user_activity_events')
    .update({ retarget_eligible: false })
    .eq('email', params.email)
    .is('retarget_sent_at', null);

  return { success: true, data: undefined };
}

// ============================================================
// Retargeting Processing (Admin/Cron)
// ============================================================

/**
 * Get pending retargeting events (for cron job)
 */
export async function getPendingRetargets(limit: number = 100): Promise<ActionResult<PendingRetarget[]>> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc('get_pending_retargets', { p_limit: limit });

  if (error) {
    console.error('[Retargeting] Failed to get pending retargets:', error);
    return { success: false, error: error.message };
  }

  return { success: true, data: data || [] };
}

/**
 * Mark an event as retargeted after sending notification
 */
export async function markEventRetargeted(eventId: string): Promise<ActionResult<void>> {
  const supabase = await createClient();

  const { error } = await supabase.rpc('mark_event_retargeted', { p_event_id: eventId });

  if (error) {
    console.error('[Retargeting] Failed to mark event retargeted:', error);
    return { success: false, error: error.message };
  }

  return { success: true, data: undefined };
}

/**
 * Log a sent notification
 */
export async function logRetargetingNotification(params: {
  campaignId: string;
  activityEventId: string;
  userId?: string;
  recipientEmail?: string;
  recipientPhone?: string;
  status: 'pending' | 'sent' | 'failed';
  errorMessage?: string;
}): Promise<ActionResult<void>> {
  const supabase = await createClient();

  const { error } = await supabase.from('retargeting_notifications').insert({
    campaign_id: params.campaignId,
    activity_event_id: params.activityEventId,
    user_id: params.userId || null,
    recipient_email: params.recipientEmail || null,
    recipient_phone: params.recipientPhone || null,
    status: params.status,
    sent_at: params.status === 'sent' ? new Date().toISOString() : null,
    error_message: params.errorMessage || null,
  });

  if (error) {
    console.error('[Retargeting] Failed to log notification:', error);
    return { success: false, error: error.message };
  }

  return { success: true, data: undefined };
}

/**
 * Update notification status (for tracking opens/clicks)
 */
export async function updateNotificationStatus(params: {
  notificationId: string;
  status: 'delivered' | 'opened' | 'clicked';
}): Promise<ActionResult<void>> {
  const supabase = await createClient();

  const updates: Record<string, string> = {
    status: params.status,
  };

  if (params.status === 'delivered') {
    updates.delivered_at = new Date().toISOString();
  } else if (params.status === 'opened') {
    updates.opened_at = new Date().toISOString();
  } else if (params.status === 'clicked') {
    updates.clicked_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from('retargeting_notifications')
    .update(updates)
    .eq('id', params.notificationId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data: undefined };
}
