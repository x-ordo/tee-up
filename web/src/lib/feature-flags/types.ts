/**
 * Feature Flag Types
 *
 * Supports three types of flags:
 * 1. Static flags - Environment-based, compile-time
 * 2. Dynamic flags - Database-backed, runtime
 * 3. Percentage flags - Gradual rollout based on user ID hash
 */

// ============================================
// FLAG DEFINITION TYPES
// ============================================

/**
 * Flag value types
 */
export type FlagValue = boolean | string | number;

/**
 * Static flag definition (environment-based)
 */
export type StaticFlag = {
  type: 'static';
  key: string;
  defaultValue: FlagValue;
  description: string;
  envVar?: string;
};

/**
 * Percentage rollout flag definition
 */
export type PercentageFlag = {
  type: 'percentage';
  key: string;
  defaultValue: boolean;
  description: string;
  percentage: number; // 0-100
};

/**
 * Dynamic flag definition (database-backed)
 */
export type DynamicFlag = {
  type: 'dynamic';
  key: string;
  defaultValue: FlagValue;
  description: string;
};

export type FlagDefinition = StaticFlag | PercentageFlag | DynamicFlag;

// ============================================
// FLAG CONTEXT TYPES
// ============================================

/**
 * Context for evaluating flags
 */
export type FlagContext = {
  userId?: string;
  userTier?: 'free' | 'pro' | 'premium' | 'enterprise';
  environment?: 'development' | 'staging' | 'production';
  requestId?: string;
};

/**
 * Evaluated flag result
 */
export type EvaluatedFlag<T extends FlagValue = FlagValue> = {
  key: string;
  value: T;
  source: 'static' | 'percentage' | 'dynamic' | 'default';
  context?: FlagContext;
};

// ============================================
// FLAG REGISTRY TYPES
// ============================================

/**
 * Flag registry mapping
 */
export type FlagRegistry = {
  [key: string]: FlagDefinition;
};

/**
 * Typed flag values based on registry
 */
export type FlagValues<T extends FlagRegistry> = {
  [K in keyof T]: T[K]['defaultValue'];
};
