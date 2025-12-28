/**
 * APM Server-Side Utilities
 *
 * Performance monitoring utilities for Server Actions, API routes,
 * and server-side operations.
 */

import * as Sentry from '@sentry/nextjs';
import { createSpan, endSpan, recordMetric, recordTiming } from './metrics';
import type { ActionMetadata } from './types';

// ============================================
// SERVER ACTION WRAPPER
// ============================================

/**
 * Wrap a Server Action with performance monitoring
 *
 * @example
 * ```ts
 * // actions/profiles.ts
 * import { measureAction } from '@/lib/apm/server';
 *
 * async function updateProfileImpl(id: string, data: UpdateData) {
 *   // ... actual implementation
 * }
 *
 * export const updateProfile = measureAction(
 *   'updateProfile',
 *   updateProfileImpl,
 *   { module: 'profiles' }
 * );
 * ```
 */
export function measureAction<TArgs extends unknown[], TResult>(
  name: string,
  action: (...args: TArgs) => Promise<TResult>,
  metadata?: Omit<ActionMetadata, 'name'>
): (...args: TArgs) => Promise<TResult> {
  return async (...args: TArgs): Promise<TResult> => {
    const startTime = performance.now();
    const span = createSpan(name, {
      operation: 'action',
      tags: {
        'action.name': name,
        'action.module': metadata?.module ?? 'unknown',
        ...(metadata?.tags ?? {}),
      },
    });

    try {
      const result = await Sentry.withActiveSpan(
        Sentry.startInactiveSpan({
          name: `action.${name}`,
          op: 'function.server_action',
        }),
        async () => action(...args)
      );

      endSpan(span, 'ok');

      // Record success metric
      recordMetric({
        name: `action.${name}.duration`,
        value: performance.now() - startTime,
        unit: 'ms',
        category: 'action',
        timestamp: Date.now(),
        tags: {
          status: 'success',
          module: metadata?.module ?? 'unknown',
        },
      });

      return result;
    } catch (error) {
      endSpan(span, 'error');

      // Capture exception in Sentry
      Sentry.captureException(error, {
        tags: {
          'action.name': name,
          'action.module': metadata?.module ?? 'unknown',
        },
        extra: {
          args: args.length > 0 ? JSON.stringify(args[0]).slice(0, 500) : undefined,
        },
      });

      // Record error metric
      recordMetric({
        name: `action.${name}.error`,
        value: 1,
        unit: 'count',
        category: 'action',
        timestamp: Date.now(),
        tags: {
          status: 'error',
          module: metadata?.module ?? 'unknown',
          errorType: error instanceof Error ? error.name : 'Unknown',
        },
      });

      throw error;
    }
  };
}

// ============================================
// DATABASE QUERY WRAPPER
// ============================================

/**
 * Wrap a database query with performance monitoring
 *
 * @example
 * ```ts
 * const result = await measureQuery('getProProfile', async () => {
 *   return supabase.from('pro_profiles').select('*').eq('id', id).single();
 * });
 * ```
 */
export async function measureQuery<T>(
  name: string,
  query: () => Promise<T>,
  tags?: Record<string, string>
): Promise<T> {
  const startTime = performance.now();
  const span = createSpan(name, {
    operation: 'db.query',
    tags: {
      'db.operation': name,
      ...tags,
    },
  });

  try {
    const result = await query();
    const duration = performance.now() - startTime;

    endSpan(span, 'ok');

    // Record query timing
    recordTiming(`db.${name}`, duration, 'query', {
      status: 'success',
      ...tags,
    });

    // Warn on slow queries (> 500ms)
    if (duration > 500) {
      console.warn(`[APM] Slow query detected: ${name} took ${duration.toFixed(2)}ms`);
      Sentry.addBreadcrumb({
        category: 'db',
        message: `Slow query: ${name}`,
        level: 'warning',
        data: { duration, query: name },
      });
    }

    return result;
  } catch (error) {
    endSpan(span, 'error');

    recordMetric({
      name: `db.${name}.error`,
      value: 1,
      unit: 'count',
      category: 'query',
      timestamp: Date.now(),
      tags: {
        status: 'error',
        errorType: error instanceof Error ? error.name : 'Unknown',
        ...tags,
      },
    });

    throw error;
  }
}

// ============================================
// EXTERNAL API WRAPPER
// ============================================

/**
 * Wrap an external API call with performance monitoring
 *
 * @example
 * ```ts
 * const response = await measureAPI('stripe.createPayment', async () => {
 *   return stripe.paymentIntents.create({ ... });
 * });
 * ```
 */
export async function measureAPI<T>(
  name: string,
  apiCall: () => Promise<T>,
  options?: {
    service?: string;
    endpoint?: string;
    method?: string;
  }
): Promise<T> {
  const startTime = performance.now();
  const span = createSpan(name, {
    operation: 'http.client',
    tags: {
      'http.service': options?.service ?? 'external',
      'http.endpoint': options?.endpoint ?? name,
      'http.method': options?.method ?? 'UNKNOWN',
    },
  });

  try {
    const result = await apiCall();
    const duration = performance.now() - startTime;

    endSpan(span, 'ok');

    recordTiming(`api.${name}`, duration, 'api', {
      service: options?.service ?? 'external',
      status: 'success',
    });

    return result;
  } catch (error) {
    endSpan(span, 'error');

    recordMetric({
      name: `api.${name}.error`,
      value: 1,
      unit: 'count',
      category: 'api',
      timestamp: Date.now(),
      tags: {
        service: options?.service ?? 'external',
        status: 'error',
        errorType: error instanceof Error ? error.name : 'Unknown',
      },
    });

    throw error;
  }
}

// ============================================
// TRANSACTION HELPERS
// ============================================

/**
 * Start a new transaction for a complex operation
 */
export function startTransaction(
  name: string,
  operation: string = 'task'
): ReturnType<typeof createSpan> {
  return createSpan(name, { operation });
}

/**
 * Finish a transaction
 */
export function finishTransaction(
  span: ReturnType<typeof createSpan>,
  status: 'ok' | 'error' = 'ok'
): void {
  endSpan(span, status);
}

// ============================================
// REQUEST CONTEXT
// ============================================

/**
 * Set request context for better debugging
 */
export function setRequestContext(context: {
  requestId?: string;
  userId?: string;
  path?: string;
  method?: string;
}): void {
  Sentry.setContext('request', context);

  if (context.userId) {
    Sentry.setUser({ id: context.userId });
  }

  if (context.requestId) {
    Sentry.setTag('request_id', context.requestId);
  }
}

/**
 * Add breadcrumb for debugging
 */
export function addBreadcrumb(
  message: string,
  category: string = 'custom',
  level: 'debug' | 'info' | 'warning' | 'error' = 'info',
  data?: Record<string, unknown>
): void {
  Sentry.addBreadcrumb({
    message,
    category,
    level,
    data,
  });
}
