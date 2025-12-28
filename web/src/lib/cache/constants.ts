/**
 * Cache TTL Constants (in seconds)
 *
 * Strategy:
 * - Public content: longer TTL (5-30 min), low change frequency
 * - User-specific: shorter TTL (5 min), per-user cache key
 * - Real-time data: no caching (leads stats, bookings)
 */

// Public content (high traffic, low change frequency)
export const CACHE_TTL = {
  /** Public profile page - 5 minutes */
  PUBLIC_PROFILE: 60 * 5,

  /** Public studio page - 10 minutes */
  PUBLIC_STUDIO: 60 * 10,

  /** Directory listing (approved pros) - 30 minutes */
  APPROVED_PROFILES: 60 * 30,

  /** Public site page - 10 minutes */
  PUBLIC_SITE: 60 * 10,

  /** User profile (per-user) - 5 minutes */
  USER_PROFILE: 60 * 5,

  /** Portfolio sections (per-profile) - 5 minutes */
  PORTFOLIO_SECTIONS: 60 * 5,

  /** Studio list (per-user) - 10 minutes */
  USER_STUDIOS: 60 * 10,
} as const;

export type CacheTTLKey = keyof typeof CACHE_TTL;
