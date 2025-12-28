/**
 * Database Abstraction Layer
 *
 * Provides interfaces and utilities for database operations,
 * reducing direct coupling to Supabase throughout the codebase.
 *
 * Current implementation: Supabase
 * This layer enables future migration to alternatives (Prisma, Drizzle, etc.)
 */

// Types and interfaces
export * from './types';

// Auth helpers
export {
  checkAuth,
  requireAuth,
  getCurrentUserId,
  isAuthenticated,
  requireAdmin,
  requirePro,
  AuthenticationError,
  type AuthSuccess,
  type AuthFailure,
  type AuthResult,
} from './auth-helper';

// Re-export Supabase client for gradual migration
// Eventually, this will be replaced by a DatabaseProvider implementation
export { createClient } from '@/lib/supabase/server';
