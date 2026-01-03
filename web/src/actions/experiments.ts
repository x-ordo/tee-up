'use server';

/**
 * A/B Testing Server Actions
 * TEE:UP Portfolio SaaS
 *
 * Provides server-side functions for experiment management,
 * variant assignment, and conversion tracking.
 */

import { createClient } from '@/lib/supabase/server';
import type { ActionResult } from './types';

// ============================================================
// Types
// ============================================================

export type ExperimentStatus = 'draft' | 'running' | 'paused' | 'completed';

export interface Experiment {
  id: string;
  name: string;
  description: string | null;
  status: ExperimentStatus;
  traffic_percentage: number;
  target_audience: Record<string, unknown>;
  primary_metric: string;
  secondary_metrics: string[] | null;
  min_sample_size: number;
  confidence_level: number;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

export interface ExperimentVariant {
  id: string;
  experiment_id: string;
  name: string;
  description: string | null;
  weight: number;
  config: Record<string, unknown>;
  is_control: boolean;
  created_at: string;
}

export interface ExperimentAssignment {
  experiment_id: string;
  variant_id: string;
  variant_name: string;
  variant_config: Record<string, unknown>;
  is_new_assignment: boolean;
}

export interface ExperimentStats {
  variant_id: string;
  variant_name: string;
  is_control: boolean;
  total_assignments: number;
  total_conversions: number;
  conversion_rate: number;
  total_value: number;
}

export interface CreateExperimentInput {
  name: string;
  description?: string;
  primary_metric: string;
  secondary_metrics?: string[];
  traffic_percentage?: number;
  target_audience?: Record<string, unknown>;
  min_sample_size?: number;
  confidence_level?: number;
  variants: {
    name: string;
    description?: string;
    weight: number;
    config?: Record<string, unknown>;
    is_control?: boolean;
  }[];
}

export interface UpdateExperimentInput {
  description?: string;
  status?: ExperimentStatus;
  traffic_percentage?: number;
  target_audience?: Record<string, unknown>;
  start_date?: string;
  end_date?: string;
}

// ============================================================
// Experiment Management
// ============================================================

/**
 * Create a new experiment with variants
 */
export async function createExperiment(
  input: CreateExperimentInput
): Promise<ActionResult<Experiment>> {
  const supabase = await createClient();

  // Check admin permission
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Not authenticated' };
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    return { success: false, error: 'Admin access required' };
  }

  // Validate variant weights sum to 100
  const totalWeight = input.variants.reduce((sum, v) => sum + v.weight, 0);
  if (totalWeight !== 100) {
    return { success: false, error: 'Variant weights must sum to 100' };
  }

  // Create experiment
  const { data: experiment, error: experimentError } = await supabase
    .from('experiments')
    .insert({
      name: input.name,
      description: input.description,
      primary_metric: input.primary_metric,
      secondary_metrics: input.secondary_metrics,
      traffic_percentage: input.traffic_percentage ?? 100,
      target_audience: input.target_audience ?? {},
      min_sample_size: input.min_sample_size ?? 100,
      confidence_level: input.confidence_level ?? 0.95,
      created_by: user.id,
    })
    .select()
    .single();

  if (experimentError) {
    return { success: false, error: experimentError.message };
  }

  // Create variants
  const variantsToInsert = input.variants.map((v) => ({
    experiment_id: experiment.id,
    name: v.name,
    description: v.description,
    weight: v.weight,
    config: v.config ?? {},
    is_control: v.is_control ?? false,
  }));

  const { error: variantsError } = await supabase
    .from('experiment_variants')
    .insert(variantsToInsert);

  if (variantsError) {
    // Rollback experiment creation
    await supabase.from('experiments').delete().eq('id', experiment.id);
    return { success: false, error: variantsError.message };
  }

  return { success: true, data: experiment };
}

/**
 * Get experiment by ID
 */
export async function getExperiment(
  experimentId: string
): Promise<ActionResult<Experiment & { variants: ExperimentVariant[] }>> {
  const supabase = await createClient();

  const { data: experiment, error } = await supabase
    .from('experiments')
    .select('*, variants:experiment_variants(*)')
    .eq('id', experimentId)
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data: experiment };
}

/**
 * Get experiment by name
 */
export async function getExperimentByName(
  name: string
): Promise<ActionResult<Experiment & { variants: ExperimentVariant[] }>> {
  const supabase = await createClient();

  const { data: experiment, error } = await supabase
    .from('experiments')
    .select('*, variants:experiment_variants(*)')
    .eq('name', name)
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data: experiment };
}

/**
 * List all experiments
 */
export async function listExperiments(params?: {
  status?: ExperimentStatus;
  limit?: number;
  offset?: number;
}): Promise<ActionResult<Experiment[]>> {
  const supabase = await createClient();

  let query = supabase
    .from('experiments')
    .select('*')
    .order('created_at', { ascending: false });

  if (params?.status) {
    query = query.eq('status', params.status);
  }

  if (params?.limit) {
    query = query.limit(params.limit);
  }

  if (params?.offset) {
    query = query.range(params.offset, params.offset + (params.limit ?? 10) - 1);
  }

  const { data, error } = await query;

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data: data ?? [] };
}

/**
 * Update experiment
 */
export async function updateExperiment(
  experimentId: string,
  updates: UpdateExperimentInput
): Promise<ActionResult<Experiment>> {
  const supabase = await createClient();

  // Check admin permission
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Not authenticated' };
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    return { success: false, error: 'Admin access required' };
  }

  const { data, error } = await supabase
    .from('experiments')
    .update(updates)
    .eq('id', experimentId)
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data };
}

/**
 * Start an experiment
 */
export async function startExperiment(
  experimentId: string
): Promise<ActionResult<Experiment>> {
  return updateExperiment(experimentId, {
    status: 'running',
    start_date: new Date().toISOString(),
  });
}

/**
 * Pause an experiment
 */
export async function pauseExperiment(
  experimentId: string
): Promise<ActionResult<Experiment>> {
  return updateExperiment(experimentId, { status: 'paused' });
}

/**
 * Complete an experiment
 */
export async function completeExperiment(
  experimentId: string
): Promise<ActionResult<Experiment>> {
  return updateExperiment(experimentId, {
    status: 'completed',
    end_date: new Date().toISOString(),
  });
}

// ============================================================
// Variant Assignment
// ============================================================

/**
 * Get or create variant assignment for a user/session
 */
export async function getVariantAssignment(params: {
  experimentName: string;
  userId?: string;
  sessionId?: string;
}): Promise<ActionResult<ExperimentAssignment | null>> {
  const supabase = await createClient();

  if (!params.userId && !params.sessionId) {
    return { success: false, error: 'userId or sessionId required' };
  }

  // Use database function for deterministic assignment
  const { data, error } = await supabase.rpc('get_experiment_variant', {
    p_experiment_name: params.experimentName,
    p_user_id: params.userId ?? null,
    p_session_id: params.sessionId ?? null,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  if (!data || data.length === 0) {
    return { success: true, data: null };
  }

  const result = data[0];
  return {
    success: true,
    data: {
      experiment_id: result.experiment_id,
      variant_id: result.variant_id,
      variant_name: result.variant_name,
      variant_config: result.variant_config,
      is_new_assignment: result.is_new_assignment,
    },
  };
}

/**
 * Get all experiment assignments for a user
 */
export async function getUserAssignments(
  userId: string
): Promise<ActionResult<(ExperimentAssignment & { experiment_name: string })[]>> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('experiment_assignments')
    .select(
      `
      experiment_id,
      variant_id,
      experiments!inner(name),
      experiment_variants!inner(name, config)
    `
    )
    .eq('user_id', userId);

  if (error) {
    return { success: false, error: error.message };
  }

  const assignments = (data ?? []).map((d) => {
    // Handle nested relations (could be array or object depending on relationship type)
    const exp = d.experiments as { name: string } | { name: string }[];
    const variant = d.experiment_variants as
      | { name: string; config: Record<string, unknown> }
      | { name: string; config: Record<string, unknown> }[];

    const experimentName = Array.isArray(exp) ? exp[0]?.name : exp?.name;
    const variantData = Array.isArray(variant) ? variant[0] : variant;

    return {
      experiment_id: d.experiment_id,
      variant_id: d.variant_id,
      experiment_name: experimentName ?? '',
      variant_name: variantData?.name ?? '',
      variant_config: variantData?.config ?? {},
      is_new_assignment: false,
    };
  });

  return { success: true, data: assignments };
}

// ============================================================
// Conversion Tracking
// ============================================================

/**
 * Track a conversion event
 */
export async function trackConversion(params: {
  experimentName: string;
  metricName: string;
  userId?: string;
  sessionId?: string;
  value?: number;
  metadata?: Record<string, unknown>;
}): Promise<ActionResult<{ tracked: boolean }>> {
  const supabase = await createClient();

  if (!params.userId && !params.sessionId) {
    return { success: false, error: 'userId or sessionId required' };
  }

  // Get experiment
  const { data: experiment, error: expError } = await supabase
    .from('experiments')
    .select('id')
    .eq('name', params.experimentName)
    .eq('status', 'running')
    .single();

  if (expError || !experiment) {
    return { success: true, data: { tracked: false } };
  }

  // Get assignment
  let assignmentQuery = supabase
    .from('experiment_assignments')
    .select('id, variant_id')
    .eq('experiment_id', experiment.id);

  if (params.userId) {
    assignmentQuery = assignmentQuery.eq('user_id', params.userId);
  } else if (params.sessionId) {
    assignmentQuery = assignmentQuery.eq('session_id', params.sessionId);
  }

  const { data: assignment, error: assignError } = await assignmentQuery.single();

  if (assignError || !assignment) {
    return { success: true, data: { tracked: false } };
  }

  // Check for duplicate conversion
  const { data: existing } = await supabase
    .from('experiment_conversions')
    .select('id')
    .eq('assignment_id', assignment.id)
    .eq('metric_name', params.metricName)
    .single();

  if (existing) {
    return { success: true, data: { tracked: false } };
  }

  // Insert conversion
  const { error: insertError } = await supabase.from('experiment_conversions').insert({
    assignment_id: assignment.id,
    experiment_id: experiment.id,
    variant_id: assignment.variant_id,
    metric_name: params.metricName,
    value: params.value ?? 1,
    metadata: params.metadata ?? {},
  });

  if (insertError) {
    return { success: false, error: insertError.message };
  }

  return { success: true, data: { tracked: true } };
}

// ============================================================
// Statistics
// ============================================================

/**
 * Get experiment statistics
 */
export async function getExperimentStats(
  experimentId: string
): Promise<ActionResult<ExperimentStats[]>> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc('get_experiment_stats', {
    p_experiment_id: experimentId,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data: data ?? [] };
}

// ============================================================
// Statistics Functions (re-exported from lib)
// ============================================================
// Note: Statistical calculation functions are in @/lib/experiments/statistics
// They are pure functions and don't need 'use server'
