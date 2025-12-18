'use server';

import { createClient } from '@/lib/supabase/server';
import type { ActionResult, ContactMethod } from './types';

/**
 * Lead type from database
 */
export type Lead = {
  id: string;
  pro_id: string;
  contact_name: string | null;
  contact_method: ContactMethod;
  source_url: string | null;
  referrer: string | null;
  is_billable: boolean;
  billed_at: string | null;
  created_at: string;
};

/**
 * Lead statistics
 */
export type LeadStats = {
  total_leads: number;
  monthly_leads: number;
  free_leads_remaining: number;
  is_premium: boolean;
};

const FREE_LEADS_PER_MONTH = 3;

/**
 * Track a new lead (called when contact action is taken)
 * This triggers the billing counter
 */
export async function trackLead(
  proId: string,
  leadData: {
    contact_name?: string;
    contact_method: ContactMethod;
    source_url?: string;
    referrer?: string;
  }
): Promise<ActionResult<Lead>> {
  try {
    const supabase = await createClient();

    // Insert lead record - this triggers the billing function via DB trigger
    const { data, error } = await supabase
      .from('leads')
      .insert({
        pro_id: proId,
        contact_name: leadData.contact_name || null,
        contact_method: leadData.contact_method,
        source_url: leadData.source_url || null,
        referrer: leadData.referrer || null,
        is_billable: true,
      })
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err) {
    return { success: false, error: 'Failed to track lead' };
  }
}

/**
 * Get lead statistics for current pro user
 */
export async function getLeadStats(): Promise<ActionResult<LeadStats>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Get pro profile with lead counts
    const { data, error } = await supabase
      .from('pro_profiles')
      .select('total_leads, monthly_lead_count, subscription_tier')
      .eq('user_id', user.id)
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    const isPremium = data.subscription_tier !== 'free';
    const freeRemaining = isPremium
      ? 999 // Unlimited for paid tier
      : Math.max(0, FREE_LEADS_PER_MONTH - data.monthly_lead_count);

    return {
      success: true,
      data: {
        total_leads: data.total_leads,
        monthly_leads: data.monthly_lead_count,
        free_leads_remaining: freeRemaining,
        is_premium: isPremium,
      },
    };
  } catch (err) {
    return { success: false, error: 'Failed to get lead stats' };
  }
}

/**
 * Get leads for current pro user
 */
export async function getMyLeads(options?: {
  limit?: number;
  offset?: number;
}): Promise<ActionResult<Lead[]>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    // First get the pro profile id
    const { data: profile, error: profileError } = await supabase
      .from('pro_profiles')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (profileError || !profile) {
      return { success: false, error: 'Pro profile not found' };
    }

    let query = supabase
      .from('leads')
      .select('*')
      .eq('pro_id', profile.id)
      .order('created_at', { ascending: false });

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    }

    const { data, error } = await query;

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: data || [] };
  } catch (err) {
    return { success: false, error: 'Failed to fetch leads' };
  }
}

/**
 * Check if pro can receive leads
 *
 * MONETIZATION PIVOT: Always allow leads.
 * - Old model: Block after 3 free leads/month
 * - New model: Unlimited leads, billing via subscription + deposit
 *
 * Background counting continues via DB trigger (handle_new_lead)
 * for analytics purposes.
 */
export async function checkLeadLimit(proId: string): Promise<ActionResult<{
  can_receive_leads: boolean;
  reason?: string;
}>> {
  try {
    const supabase = await createClient();

    // Keep query for analytics/monitoring (optional future use)
    const { data, error } = await supabase
      .from('pro_profiles')
      .select('monthly_lead_count, subscription_tier')
      .eq('id', proId)
      .single();

    if (error) {
      // Fail-open: allow leads even on error (business priority)
      return { success: true, data: { can_receive_leads: true } };
    }

    // MONETIZATION PIVOT: Always allow leads
    // Counting continues via handle_new_lead trigger in 003_add_leads.sql
    return {
      success: true,
      data: { can_receive_leads: true },
    };
  } catch (err) {
    // Fail-open: allow leads even on error
    return { success: true, data: { can_receive_leads: true } };
  }
}
