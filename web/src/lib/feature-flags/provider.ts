/**
 * Feature Flag Provider
 *
 * Evaluates feature flags based on context.
 * Supports static (env-based), percentage (gradual rollout), and dynamic flags.
 */

import { FLAGS, type FlagKey } from './flags';
import type { FlagContext, FlagValue, EvaluatedFlag, FlagDefinition } from './types';

// ============================================
// HASH UTILITIES
// ============================================

/**
 * Simple hash function for consistent percentage rollout
 * Uses the user ID to determine if they're in the rollout percentage
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * Check if a user ID falls within a percentage rollout
 */
function isInPercentage(userId: string, flagKey: string, percentage: number): boolean {
  if (percentage <= 0) return false;
  if (percentage >= 100) return true;

  // Combine user ID and flag key for unique distribution per flag
  const hash = hashString(`${userId}:${flagKey}`);
  const bucket = hash % 100;

  return bucket < percentage;
}

// ============================================
// FLAG EVALUATION
// ============================================

/**
 * Evaluate a static flag (environment-based)
 */
function evaluateStaticFlag(
  flag: FlagDefinition & { type: 'static' },
  _context: FlagContext
): FlagValue {
  if (flag.envVar) {
    const envValue = process.env[flag.envVar];

    if (envValue !== undefined) {
      // Parse boolean strings
      if (envValue === 'true') return true;
      if (envValue === 'false') return false;

      // Parse numbers
      const numValue = Number(envValue);
      if (!isNaN(numValue)) return numValue;

      // Return as string
      return envValue;
    }
  }

  return flag.defaultValue;
}

/**
 * Evaluate a percentage rollout flag
 */
function evaluatePercentageFlag(
  flag: FlagDefinition & { type: 'percentage' },
  context: FlagContext
): boolean {
  // If no user ID, use default value
  if (!context.userId) {
    return flag.defaultValue;
  }

  return isInPercentage(context.userId, flag.key, flag.percentage);
}

/**
 * Evaluate a dynamic flag (placeholder for database-backed flags)
 * TODO: Implement database lookup when needed
 */
function evaluateDynamicFlag(
  flag: FlagDefinition & { type: 'dynamic' },
  _context: FlagContext
): FlagValue {
  // For now, return default value
  // Future: Look up in database or cache
  return flag.defaultValue;
}

/**
 * Evaluate a single flag
 */
export function evaluateFlag<K extends FlagKey>(
  flagKey: K,
  context: FlagContext = {}
): EvaluatedFlag<(typeof FLAGS)[K]['defaultValue']> {
  const flag = FLAGS[flagKey] as FlagDefinition;

  let value: FlagValue;
  let source: EvaluatedFlag['source'] = 'default';

  switch (flag.type) {
    case 'static':
      value = evaluateStaticFlag(flag as FlagDefinition & { type: 'static' }, context);
      source = 'static';
      break;

    case 'percentage':
      value = evaluatePercentageFlag(flag as FlagDefinition & { type: 'percentage' }, context);
      source = context.userId ? 'percentage' : 'default';
      break;

    case 'dynamic':
      value = evaluateDynamicFlag(flag as FlagDefinition & { type: 'dynamic' }, context);
      source = 'dynamic';
      break;

    default: {
      // Fallback to default value for any unhandled flag types
      const defaultFlag = flag as { defaultValue: FlagValue };
      value = defaultFlag.defaultValue;
    }
  }

  return {
    key: flagKey,
    value: value as (typeof FLAGS)[K]['defaultValue'],
    source,
    context,
  };
}

// ============================================
// CONVENIENCE FUNCTIONS
// ============================================

/**
 * Check if a flag is enabled (boolean check)
 */
export function isEnabled(flagKey: FlagKey, context: FlagContext = {}): boolean {
  const result = evaluateFlag(flagKey, context);
  return Boolean(result.value);
}

/**
 * Get flag value with type safety
 */
export function getFlag<K extends FlagKey>(
  flagKey: K,
  context: FlagContext = {}
): (typeof FLAGS)[K]['defaultValue'] {
  return evaluateFlag(flagKey, context).value;
}

/**
 * Evaluate multiple flags at once
 */
export function evaluateFlags(
  flagKeys: FlagKey[],
  context: FlagContext = {}
): Record<FlagKey, FlagValue> {
  const result: Partial<Record<FlagKey, FlagValue>> = {};

  for (const key of flagKeys) {
    result[key] = evaluateFlag(key, context).value;
  }

  return result as Record<FlagKey, FlagValue>;
}

/**
 * Get all flags for a context
 */
export function getAllFlags(context: FlagContext = {}): Record<FlagKey, FlagValue> {
  const keys = Object.keys(FLAGS) as FlagKey[];
  return evaluateFlags(keys, context);
}

// ============================================
// SERVER-SIDE HELPERS
// ============================================

/**
 * Create a flag context from server-side data
 */
export function createServerContext(options: {
  userId?: string;
  userTier?: FlagContext['userTier'];
}): FlagContext {
  return {
    userId: options.userId,
    userTier: options.userTier,
    environment: (process.env.NODE_ENV === 'production'
      ? 'production'
      : process.env.NODE_ENV === 'test'
      ? 'staging'
      : 'development') as FlagContext['environment'],
  };
}
