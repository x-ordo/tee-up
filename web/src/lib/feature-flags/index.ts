/**
 * Feature Flags Module
 *
 * A lightweight feature flag system supporting:
 * - Static flags (environment-based)
 * - Percentage rollout (gradual release)
 * - Dynamic flags (database-backed - future)
 *
 * Usage:
 *
 * Server Components / Server Actions:
 * ```tsx
 * import { isServerFlagEnabled, getServerFlag } from '@/lib/feature-flags/server';
 *
 * const isEnabled = await isServerFlagEnabled('PORTFOLIO_NEW_EDITOR');
 * ```
 *
 * Client Components:
 * ```tsx
 * import { useFeatureFlag, Feature } from '@/lib/feature-flags';
 *
 * const isEnabled = useFeatureFlag('PORTFOLIO_NEW_EDITOR');
 *
 * // Or use the component:
 * <Feature flag="PORTFOLIO_NEW_EDITOR">
 *   <NewFeature />
 * </Feature>
 * ```
 */

// Types
export * from './types';

// Flag definitions
export { FLAGS, type FlagKey, type FlagConfig } from './flags';

// Core provider
export {
  evaluateFlag,
  isEnabled,
  getFlag,
  evaluateFlags,
  getAllFlags,
  createServerContext,
} from './provider';

// Client-side hooks and components
export {
  useFeatureFlag,
  useFeatureFlagValue,
  useFeatureFlags,
  Feature,
  setFlagContext,
  getFlagContext,
} from './use-feature-flag';
