/**
 * Theme utility functions
 * @module lib/theme
 */

/** Supported theme values */
export type Theme = 'light' | 'dark';

/** Theme preference including system option */
export type ThemePreference = 'light' | 'dark' | 'system';

/** Animation duration values in milliseconds */
export const TRANSITION_DURATION = {
  fast: 150,
  normal: 200,
  slow: 300,
} as const;

/** Check if we're in a browser environment */
export const isBrowser = typeof window !== 'undefined';

/**
 * Get the system theme preference
 * @returns 'dark' if system prefers dark mode, 'light' otherwise
 */
export function getSystemTheme(): Theme {
  if (!isBrowser) return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * Check if user prefers reduced motion
 * @returns true if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (!isBrowser) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Get animation duration respecting user preference
 * @param duration - Duration key from TRANSITION_DURATION
 * @returns 0 if user prefers reduced motion, otherwise the duration value
 */
export function getAnimationDuration(duration: keyof typeof TRANSITION_DURATION): number {
  if (prefersReducedMotion()) return 0;
  return TRANSITION_DURATION[duration];
}
