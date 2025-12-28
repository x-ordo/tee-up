/**
 * Error Handling Module
 *
 * Provides structured error codes, logging, and Sentry integration.
 *
 * @example
 * ```ts
 * import { logError, ErrorCode, AUTH_NOT_AUTHENTICATED } from '@/lib/errors';
 *
 * // Log an error
 * const code = logError(error, { action: 'createProfile', userId });
 *
 * // Use error codes
 * if (!user) {
 *   return { success: false, error: AUTH_NOT_AUTHENTICATED };
 * }
 * ```
 */
export * from './codes';
export * from './logger';
