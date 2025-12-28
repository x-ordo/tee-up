/**
 * Auth Helper for Server Actions
 *
 * Centralizes the repeated authentication pattern used across 44+ Server Actions.
 * Provides a single point of abstraction for future auth provider changes.
 *
 * Before (repeated 44 times):
 *   const supabase = await createClient();
 *   const { data: { user }, error } = await supabase.auth.getUser();
 *   if (!user) return { success: false, error: 'Not authenticated' };
 *
 * After:
 *   const { user, supabase } = await requireAuth();
 *   // user is guaranteed to be non-null
 */

import { createClient } from '@/lib/supabase/server';
import { AUTH_NOT_AUTHENTICATED } from '@/lib/errors';
import type { AuthUser } from './types';

// ============================================
// AUTH RESULT TYPES
// ============================================

/**
 * Result of successful authentication
 */
export type AuthSuccess = {
  authenticated: true;
  user: AuthUser;
  supabase: Awaited<ReturnType<typeof createClient>>;
};

/**
 * Result of failed authentication
 */
export type AuthFailure = {
  authenticated: false;
  error: string;
};

export type AuthResult = AuthSuccess | AuthFailure;

// ============================================
// AUTH HELPERS
// ============================================

/**
 * Check authentication and return user + supabase client
 *
 * Use when you need both the user and the client for subsequent operations.
 *
 * @example
 * ```typescript
 * const auth = await checkAuth();
 * if (!auth.authenticated) {
 *   return { success: false, error: auth.error };
 * }
 * const { user, supabase } = auth;
 * // Use supabase client...
 * ```
 */
export async function checkAuth(): Promise<AuthResult> {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return {
      authenticated: false,
      error: AUTH_NOT_AUTHENTICATED,
    };
  }

  return {
    authenticated: true,
    user: {
      id: user.id,
      email: user.email,
      role: user.app_metadata?.role,
      metadata: user.user_metadata,
    },
    supabase,
  };
}

/**
 * Require authentication - throws if not authenticated
 *
 * Use when you want cleaner code with early return.
 *
 * @example
 * ```typescript
 * try {
 *   const { user, supabase } = await requireAuth();
 *   // Guaranteed to have user
 * } catch (e) {
 *   return { success: false, error: 'Not authenticated' };
 * }
 * ```
 */
export async function requireAuth(): Promise<AuthSuccess> {
  const result = await checkAuth();

  if (!result.authenticated) {
    throw new AuthenticationError(result.error);
  }

  return result;
}

/**
 * Get current user ID only (lightweight check)
 *
 * Use when you only need the user ID, not the full user object.
 */
export async function getCurrentUserId(): Promise<string | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user?.id ?? null;
}

/**
 * Check if user is authenticated (boolean check)
 *
 * Use for simple auth checks without needing user data.
 */
export async function isAuthenticated(): Promise<boolean> {
  const userId = await getCurrentUserId();
  return userId !== null;
}

// ============================================
// ERROR CLASS
// ============================================

/**
 * Authentication error for use with requireAuth()
 */
export class AuthenticationError extends Error {
  constructor(message: string = AUTH_NOT_AUTHENTICATED) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

// ============================================
// ROLE-BASED AUTH HELPERS
// ============================================

/**
 * Require admin role
 */
export async function requireAdmin(): Promise<AuthSuccess> {
  const auth = await requireAuth();

  if (auth.user.role !== 'admin') {
    throw new AuthenticationError('Admin access required');
  }

  return auth;
}

/**
 * Require pro role (or admin)
 */
export async function requirePro(): Promise<AuthSuccess> {
  const auth = await requireAuth();

  if (auth.user.role !== 'pro' && auth.user.role !== 'admin') {
    throw new AuthenticationError('Pro access required');
  }

  return auth;
}
