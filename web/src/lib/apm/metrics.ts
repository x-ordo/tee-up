/**
 * APM Core Metrics
 *
 * Core utilities for creating spans, recording metrics, and performance tracking.
 * Integrates with Sentry for distributed tracing.
 */

import * as Sentry from '@sentry/nextjs';
import type {
  PerformanceMetric,
  Span,
  SpanOptions,
  SpanStatus,
  MetricCategory,
} from './types';

// ============================================
// UTILITIES
// ============================================

/**
 * Generate a unique ID for traces/spans
 */
function generateId(): string {
  return Math.random().toString(36).substring(2, 15) +
         Math.random().toString(36).substring(2, 15);
}

/**
 * Get high-resolution timestamp
 */
function now(): number {
  if (typeof performance !== 'undefined') {
    return performance.now();
  }
  return Date.now();
}

// ============================================
// SPAN MANAGEMENT
// ============================================

const activeSpans = new Map<string, Span>();

/**
 * Create a new performance span
 */
export function createSpan(name: string, options: SpanOptions = {}): Span {
  const spanId = generateId();
  const traceId = options.parentSpan?.context.traceId ?? generateId();

  const span: Span = {
    name,
    operation: options.operation ?? 'function',
    startTime: now(),
    status: 'unknown',
    context: {
      traceId,
      spanId,
      parentSpanId: options.parentSpan?.context.spanId,
    },
    tags: options.tags ?? {},
    data: options.data ?? {},
  };

  activeSpans.set(spanId, span);

  // Create Sentry span for distributed tracing
  const sentrySpan = Sentry.startInactiveSpan({
    name,
    op: options.operation,
    attributes: {
      ...options.tags,
      'span.id': spanId,
      'trace.id': traceId,
    },
  });

  // Store Sentry span reference
  (span as Span & { _sentrySpan?: unknown })._sentrySpan = sentrySpan;

  return span;
}

/**
 * End a span and record its duration
 */
export function endSpan(span: Span, status: SpanStatus = 'ok'): Span {
  span.endTime = now();
  span.duration = span.endTime - span.startTime;
  span.status = status;

  // End Sentry span
  const sentrySpan = (span as Span & { _sentrySpan?: { end: () => void } })._sentrySpan;
  if (sentrySpan?.end) {
    sentrySpan.end();
  }

  activeSpans.delete(span.context.spanId);

  // Record as metric
  recordMetric({
    name: `span.${span.name}`,
    value: span.duration,
    unit: 'ms',
    category: 'custom',
    timestamp: Date.now(),
    tags: {
      operation: span.operation,
      status: span.status,
      ...span.tags,
    },
  });

  return span;
}

/**
 * Get an active span by ID
 */
export function getSpan(spanId: string): Span | undefined {
  return activeSpans.get(spanId);
}

// ============================================
// METRIC RECORDING
// ============================================

const metricsBuffer: PerformanceMetric[] = [];
// Note: flushTimeout reserved for future batch flush implementation
const _flushTimeout: ReturnType<typeof setTimeout> | null = null;

/**
 * Record a performance metric
 */
export function recordMetric(metric: PerformanceMetric): void {
  // Add to buffer
  metricsBuffer.push(metric);

  // Send to Sentry as custom measurement
  Sentry.setMeasurement(
    metric.name,
    metric.value,
    metric.unit === 'ms' ? 'millisecond' : metric.unit === 'bytes' ? 'byte' : 'none'
  );

  // Log in debug mode
  if (process.env.NODE_ENV === 'development') {
    console.debug('[APM Metric]', {
      name: metric.name,
      value: `${metric.value}${metric.unit}`,
      category: metric.category,
    });
  }
}

/**
 * Create and record a timing metric
 */
export function recordTiming(
  name: string,
  durationMs: number,
  category: MetricCategory = 'custom',
  tags?: Record<string, string>
): void {
  recordMetric({
    name,
    value: durationMs,
    unit: 'ms',
    category,
    timestamp: Date.now(),
    tags,
  });
}

/**
 * Create and record a counter metric
 */
export function recordCount(
  name: string,
  count: number = 1,
  category: MetricCategory = 'custom',
  tags?: Record<string, string>
): void {
  recordMetric({
    name,
    value: count,
    unit: 'count',
    category,
    timestamp: Date.now(),
    tags,
  });
}

// ============================================
// TIMING HELPERS
// ============================================

/**
 * Measure the duration of a synchronous function
 */
export function measure<T>(name: string, fn: () => T, options?: SpanOptions): T {
  const span = createSpan(name, options);
  try {
    const result = fn();
    endSpan(span, 'ok');
    return result;
  } catch (error) {
    endSpan(span, 'error');
    throw error;
  }
}

/**
 * Measure the duration of an async function
 */
export async function measureAsync<T>(
  name: string,
  fn: () => Promise<T>,
  options?: SpanOptions
): Promise<T> {
  const span = createSpan(name, options);
  try {
    const result = await fn();
    endSpan(span, 'ok');
    return result;
  } catch (error) {
    endSpan(span, 'error');
    throw error;
  }
}

/**
 * Create a simple timer for manual timing
 */
export function startTimer(): { stop: () => number } {
  const start = now();
  return {
    stop: () => now() - start,
  };
}

// ============================================
// CONTEXT HELPERS
// ============================================

/**
 * Add tags to the current Sentry scope
 */
export function setAPMTags(tags: Record<string, string>): void {
  Sentry.setTags(tags);
}

/**
 * Add extra context to the current Sentry scope
 */
export function setAPMContext(name: string, data: Record<string, unknown>): void {
  Sentry.setContext(name, data);
}

/**
 * Set the current user for APM tracking
 */
export function setAPMUser(user: { id: string; email?: string; username?: string }): void {
  Sentry.setUser(user);
}
