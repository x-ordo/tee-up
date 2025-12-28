/**
 * Error Logger Utility
 *
 * Centralized error logging with Sentry integration.
 * Provides structured error capture with context.
 */
import * as Sentry from '@sentry/nextjs';
import {
  type ErrorCode,
  getErrorMessage,
  INTERNAL_UNKNOWN,
  AUTH_NOT_AUTHENTICATED,
} from './codes';

/**
 * Error context for enhanced debugging
 */
export interface ErrorContext {
  /** User ID if authenticated */
  userId?: string;
  /** Action or function name */
  action?: string;
  /** Request-specific data (sanitized) */
  metadata?: Record<string, unknown>;
}

/**
 * Structured error with code
 */
export interface AppError {
  code: ErrorCode;
  message: string;
  originalError?: Error;
}

/**
 * Create a structured app error
 */
export function createAppError(
  code: ErrorCode,
  originalError?: Error | unknown
): AppError {
  return {
    code,
    message: getErrorMessage(code),
    originalError: originalError instanceof Error ? originalError : undefined,
  };
}

/**
 * Log error to Sentry with context
 *
 * @param error - The error or error code to log
 * @param context - Additional context for debugging
 * @returns The error code for response
 */
export function logError(
  error: Error | ErrorCode | unknown,
  context?: ErrorContext
): ErrorCode {
  // Determine error code
  let errorCode: ErrorCode;
  let originalError: Error | undefined;

  if (typeof error === 'string') {
    // It's an error code
    errorCode = error as ErrorCode;
  } else if (error instanceof Error) {
    // Map common errors to codes
    errorCode = mapErrorToCode(error);
    originalError = error;
  } else {
    errorCode = INTERNAL_UNKNOWN;
  }

  // Skip logging for expected auth errors
  if (errorCode === AUTH_NOT_AUTHENTICATED) {
    return errorCode;
  }

  // Set Sentry context
  if (context?.userId) {
    Sentry.setUser({ id: context.userId });
  }

  if (context?.action) {
    Sentry.setTag('action', context.action);
  }

  // Capture the error
  Sentry.withScope((scope) => {
    scope.setLevel(getSeverityLevel(errorCode));
    scope.setTag('error_code', errorCode);

    if (context?.metadata) {
      scope.setExtras(sanitizeMetadata(context.metadata));
    }

    if (originalError) {
      Sentry.captureException(originalError);
    } else {
      Sentry.captureMessage(`[${errorCode}] ${getErrorMessage(errorCode)}`);
    }
  });

  // Also log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error(`[${errorCode}]`, {
      message: getErrorMessage(errorCode),
      context,
      originalError,
    });
  }

  return errorCode;
}

/**
 * Map common Error types to error codes
 */
function mapErrorToCode(error: Error): ErrorCode {
  const message = error.message.toLowerCase();

  // Auth errors
  if (
    message.includes('not authenticated') ||
    message.includes('auth session missing')
  ) {
    return AUTH_NOT_AUTHENTICATED;
  }

  // Database errors
  if (message.includes('timeout') || message.includes('timed out')) {
    return 'DB_TIMEOUT';
  }
  if (message.includes('constraint') || message.includes('duplicate')) {
    return 'DB_CONSTRAINT_VIOLATION';
  }
  if (message.includes('connection')) {
    return 'DB_CONNECTION_FAILED';
  }

  // Default
  return INTERNAL_UNKNOWN;
}

/**
 * Get Sentry severity level based on error code
 */
function getSeverityLevel(code: ErrorCode): Sentry.SeverityLevel {
  // Critical errors
  if (code.startsWith('DB_') || code.startsWith('INTERNAL_')) {
    return 'error';
  }

  // Auth errors are informational (expected)
  if (code.startsWith('AUTH_')) {
    return 'info';
  }

  // Validation errors are warnings
  if (code.startsWith('VALIDATION_')) {
    return 'warning';
  }

  // Default to error
  return 'error';
}

/**
 * Sanitize metadata to remove sensitive data
 */
function sanitizeMetadata(
  metadata: Record<string, unknown>
): Record<string, unknown> {
  const sensitiveKeys = [
    'password',
    'token',
    'apiKey',
    'secret',
    'authorization',
    'cookie',
  ];

  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(metadata)) {
    if (sensitiveKeys.some((sk) => key.toLowerCase().includes(sk))) {
      sanitized[key] = '[REDACTED]';
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

/**
 * Create a breadcrumb for action tracking
 */
export function addActionBreadcrumb(
  action: string,
  data?: Record<string, unknown>
): void {
  Sentry.addBreadcrumb({
    category: 'action',
    message: action,
    data: data ? sanitizeMetadata(data) : undefined,
    level: 'info',
  });
}

/**
 * Helper for Server Action error handling
 *
 * @example
 * ```ts
 * export async function myAction() {
 *   return withErrorHandling('myAction', async () => {
 *     // action logic
 *     return { success: true, data };
 *   });
 * }
 * ```
 */
export async function withErrorHandling<T>(
  actionName: string,
  fn: () => Promise<T>,
  context?: Omit<ErrorContext, 'action'>
): Promise<T> {
  addActionBreadcrumb(actionName);

  try {
    return await fn();
  } catch (error) {
    const errorCode = logError(error, { ...context, action: actionName });
    throw createAppError(errorCode, error);
  }
}
