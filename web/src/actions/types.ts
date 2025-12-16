/**
 * Standard action result type for consistent error handling
 */
export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

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
