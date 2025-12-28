'use client';

/**
 * React Hook for Feature Flags
 *
 * Usage in client components:
 *
 * ```tsx
 * const isNewEditorEnabled = useFeatureFlag('PORTFOLIO_NEW_EDITOR');
 *
 * if (isNewEditorEnabled) {
 *   return <NewEditor />;
 * }
 * return <LegacyEditor />;
 * ```
 */

import { useMemo } from 'react';
import { FLAGS, type FlagKey } from './flags';
import { evaluateFlag, isEnabled } from './provider';
import type { FlagContext, FlagValue } from './types';

// ============================================
// HOOKS
// ============================================

/**
 * Get the current user context for flag evaluation
 * Override this in your app to provide user context
 */
let globalContext: FlagContext = {};

export function setFlagContext(context: FlagContext): void {
  globalContext = context;
}

export function getFlagContext(): FlagContext {
  return globalContext;
}

/**
 * Hook to check if a feature flag is enabled
 *
 * @param flagKey - The flag key to check
 * @param context - Optional context override
 * @returns boolean indicating if the flag is enabled
 */
export function useFeatureFlag(
  flagKey: FlagKey,
  context?: FlagContext
): boolean {
  const effectiveContext = useMemo(
    () => ({ ...globalContext, ...context }),
    [context]
  );

  return useMemo(
    () => isEnabled(flagKey, effectiveContext),
    [flagKey, effectiveContext]
  );
}

/**
 * Hook to get a feature flag value (for non-boolean flags)
 *
 * @param flagKey - The flag key to get
 * @param context - Optional context override
 * @returns The flag value
 */
export function useFeatureFlagValue<K extends FlagKey>(
  flagKey: K,
  context?: FlagContext
): (typeof FLAGS)[K]['defaultValue'] {
  const effectiveContext = useMemo(
    () => ({ ...globalContext, ...context }),
    [context]
  );

  return useMemo(
    () => evaluateFlag(flagKey, effectiveContext).value,
    [flagKey, effectiveContext]
  );
}

/**
 * Hook to get multiple feature flags at once
 *
 * @param flagKeys - Array of flag keys to evaluate
 * @param context - Optional context override
 * @returns Record of flag values
 */
export function useFeatureFlags(
  flagKeys: FlagKey[],
  context?: FlagContext
): Record<FlagKey, FlagValue> {
  const effectiveContext = useMemo(
    () => ({ ...globalContext, ...context }),
    [context]
  );

  return useMemo(() => {
    const result: Partial<Record<FlagKey, FlagValue>> = {};
    for (const key of flagKeys) {
      result[key] = evaluateFlag(key, effectiveContext).value;
    }
    return result as Record<FlagKey, FlagValue>;
  }, [flagKeys, effectiveContext]);
}

// ============================================
// CONDITIONAL RENDERING COMPONENT
// ============================================

type FeatureProps = {
  flag: FlagKey;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  context?: FlagContext;
};

/**
 * Component for conditional rendering based on feature flags
 *
 * @example
 * ```tsx
 * <Feature flag="PORTFOLIO_NEW_EDITOR">
 *   <NewEditor />
 * </Feature>
 *
 * <Feature flag="BETA_FEATURE" fallback={<LegacyComponent />}>
 *   <BetaComponent />
 * </Feature>
 * ```
 */
export function Feature({
  flag,
  children,
  fallback = null,
  context,
}: FeatureProps): React.ReactNode {
  const isActive = useFeatureFlag(flag, context);
  return isActive ? children : fallback;
}
