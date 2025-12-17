/**
 * Supabase Auth Helpers
 * TEE:UP Portfolio SaaS
 *
 * This module provides authentication helpers including
 * Google OAuth with Calendar scope for pro scheduling.
 */

import { createClient } from './client';

/**
 * Sign in with Google including Calendar access
 * Use this for pros who want to sync their schedule
 *
 * @param redirectTo - URL to redirect after authentication
 * @returns OAuth sign-in result
 *
 * @example
 * ```tsx
 * 'use client';
 * import { signInWithGoogleCalendar } from '@/lib/supabase/auth';
 *
 * function ConnectCalendarButton() {
 *   const handleConnect = async () => {
 *     const { error } = await signInWithGoogleCalendar();
 *     if (error) console.error(error);
 *   };
 *   return <button onClick={handleConnect}>Google Calendar 연동</button>;
 * }
 * ```
 */
export async function signInWithGoogleCalendar(redirectTo?: string) {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      // Request calendar scope for event creation/reading
      scopes: 'https://www.googleapis.com/auth/calendar.events',
      queryParams: {
        // Required for refresh token
        access_type: 'offline',
        // Force consent screen to ensure we get refresh token
        prompt: 'consent',
      },
      redirectTo: redirectTo || `${getBaseUrl()}/auth/callback`,
    },
  });

  return { data, error };
}

/**
 * Sign in with Google (basic, no calendar access)
 * Use this for regular users who just want to log in
 */
export async function signInWithGoogle(redirectTo?: string) {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectTo || `${getBaseUrl()}/auth/callback`,
    },
  });

  return { data, error };
}

/**
 * Sign out current user
 */
export async function signOut() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  return { error };
}

/**
 * Get current session
 */
export async function getSession() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getSession();
  return { session: data.session, error };
}

/**
 * Check if user has Google Calendar connected
 * (has provider_token in session)
 */
export async function hasCalendarAccess(): Promise<boolean> {
  const supabase = createClient();
  const { data } = await supabase.auth.getSession();
  return !!data.session?.provider_token;
}

/**
 * Get base URL for redirects
 */
function getBaseUrl(): string {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  // Server-side fallback
  return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
}
