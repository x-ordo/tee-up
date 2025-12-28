'use server';

import { createClient } from '@/lib/supabase/server';
import type { ActionResult, ContactMethod } from './types';
import {
  logError,
  addActionBreadcrumb,
  AUTH_NOT_AUTHENTICATED,
  LEAD_CREATE_FAILED,
  PROFILE_NOT_FOUND,
  DB_QUERY_FAILED,
} from '@/lib/errors';
import { validateInput, validateId, trackLeadInputSchema } from '@/lib/validations';
import {
  calculateFreeLeadsRemaining,
  isPremiumTier,
  mapLegacyTier,
} from '@/lib/billing';

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
  addActionBreadcrumb('trackLead', { proId });

  try {
    // Validate proId
    const idValidation = validateId(proId, 'Pro ID');
    if (!idValidation.success) {
      return { success: false, error: idValidation.error };
    }

    // Validate lead data
    const validation = validateInput(
      trackLeadInputSchema,
      leadData,
      'trackLead'
    );
    if (!validation.success) {
      return { success: false, error: validation.error };
    }
    const validData = validation.data;

    const supabase = await createClient();

    // Insert lead record - this triggers the billing function via DB trigger
    const { data, error } = await supabase
      .from('leads')
      .insert({
        pro_id: proId,
        contact_name: validData.contact_name || null,
        contact_method: validData.contact_method,
        source_url: validData.source_url || null,
        referrer: validData.referrer || null,
        is_billable: true,
      })
      .select()
      .single();

    if (error) {
      logError(error, { action: 'trackLead', metadata: { proId } });
      return { success: false, error: LEAD_CREATE_FAILED };
    }

    return { success: true, data };
  } catch (err) {
    const errorCode = logError(err, { action: 'trackLead' });
    return { success: false, error: errorCode };
  }
}

/**
 * Get lead statistics for current pro user
 */
export async function getLeadStats(): Promise<ActionResult<LeadStats>> {
  addActionBreadcrumb('getLeadStats');

  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: AUTH_NOT_AUTHENTICATED };
    }

    // Get pro profile with lead counts
    const { data, error } = await supabase
      .from('pro_profiles')
      .select('total_leads, monthly_lead_count, subscription_tier')
      .eq('user_id', user.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return { success: false, error: PROFILE_NOT_FOUND };
      }
      logError(error, { action: 'getLeadStats', userId: user.id });
      return { success: false, error: DB_QUERY_FAILED };
    }

    // Use centralized billing utilities
    const tier = mapLegacyTier(data.subscription_tier);
    const premium = isPremiumTier(tier);
    const freeRemaining = calculateFreeLeadsRemaining(tier, data.monthly_lead_count);

    return {
      success: true,
      data: {
        total_leads: data.total_leads,
        monthly_leads: data.monthly_lead_count,
        free_leads_remaining: freeRemaining,
        is_premium: premium,
      },
    };
  } catch (err) {
    const errorCode = logError(err, { action: 'getLeadStats' });
    return { success: false, error: errorCode };
  }
}

/**
 * Get leads for current pro user
 *
 * Uses get_user_leads RPC function to fetch leads in a single query
 * instead of the two-query pattern (profile lookup + leads query).
 */
export async function getMyLeads(options?: {
  limit?: number;
  offset?: number;
}): Promise<ActionResult<Lead[]>> {
  addActionBreadcrumb('getMyLeads', options);

  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: AUTH_NOT_AUTHENTICATED };
    }

    // Use RPC function to get leads in a single query
    // This replaces the two-query pattern (pro_profiles → leads)
    const { data, error } = await supabase.rpc('get_user_leads', {
      p_user_id: user.id,
      p_limit: options?.limit ?? 50,
      p_offset: options?.offset ?? 0,
    });

    if (error) {
      // Handle case where user has no pro profile
      if (error.code === 'PGRST116' || error.message?.includes('not found')) {
        return { success: false, error: PROFILE_NOT_FOUND };
      }
      logError(error, { action: 'getMyLeads', userId: user.id });
      return { success: false, error: DB_QUERY_FAILED };
    }

    return { success: true, data: data || [] };
  } catch (err) {
    const errorCode = logError(err, { action: 'getMyLeads' });
    return { success: false, error: errorCode };
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
    const { data: _data, error } = await supabase
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
  } catch (_err) {
    // Fail-open: allow leads even on error
    return { success: true, data: { can_receive_leads: true } };
  }
}
