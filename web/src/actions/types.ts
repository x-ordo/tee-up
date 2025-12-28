import type { ErrorCode } from '@/lib/errors/codes';

/**
 * Standard action result type for consistent error handling
 *
 * @example Success case:
 * ```ts
 * return { success: true, data: profile };
 * ```
 *
 * @example Error case with code:
 * ```ts
 * return { success: false, error: 'PROFILE_NOT_FOUND' };
 * ```
 *
 * @example Error case with legacy string (backward compatible):
 * ```ts
 * return { success: false, error: 'Profile not found' };
 * ```
 */
export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: ErrorCode | string };

/**
 * Theme types for portfolio templates
 */
export type ThemeType = 'visual' | 'curriculum' | 'social';

/**
 * Contact methods for lead tracking
 */
export type ContactMethod = 'kakao' | 'phone' | 'email' | 'form';

/**
 * Subscription tiers
 */
export type SubscriptionTier = 'free' | 'basic' | 'pro';

/**
 * Subscription status
 */
export type SubscriptionStatus = 'active' | 'cancelled' | 'expired' | 'past_due';
