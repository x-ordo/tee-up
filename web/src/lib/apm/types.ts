/**
 * APM (Application Performance Monitoring) Types
 *
 * Type definitions for performance monitoring, tracing, and metrics.
 */

// ============================================
// METRIC TYPES
// ============================================

export type MetricCategory =
  | 'action'      // Server Action metrics
  | 'query'       // Database query metrics
  | 'api'         // External API call metrics
  | 'render'      // Component render metrics
  | 'navigation'  // Page navigation metrics
  | 'web-vital'   // Core Web Vitals
  | 'custom';     // Custom metrics

export type MetricUnit =
  | 'ms'          // Milliseconds
  | 'bytes'       // Bytes
  | 'count'       // Count/number
  | 'percent';    // Percentage

export interface PerformanceMetric {
  name: string;
  value: number;
  unit: MetricUnit;
  category: MetricCategory;
  timestamp: number;
  tags?: Record<string, string>;
  extra?: Record<string, unknown>;
}

// ============================================
// SPAN TYPES
// ============================================

export type SpanStatus = 'ok' | 'error' | 'cancelled' | 'unknown';

export interface SpanContext {
  traceId: string;
  spanId: string;
  parentSpanId?: string;
}

export interface Span {
  name: string;
  operation: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  status: SpanStatus;
  context: SpanContext;
  tags: Record<string, string>;
  data: Record<string, unknown>;
}

export interface SpanOptions {
  operation?: string;
  description?: string;
  tags?: Record<string, string>;
  data?: Record<string, unknown>;
  parentSpan?: Span;
}

// ============================================
// ACTION MEASUREMENT TYPES
// ============================================

export interface ActionMetadata {
  name: string;
  module?: string;
  userId?: string;
  tags?: Record<string, string>;
}

export interface ActionResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  duration?: number;
}

export interface MeasuredActionResult<T> extends ActionResult<T> {
  metrics: {
    duration: number;
    startTime: number;
    endTime: number;
  };
}

// ============================================
// WEB VITALS TYPES
// ============================================

// Note: FID is deprecated in Core Web Vitals, replaced by INP
export type WebVitalName = 'CLS' | 'FCP' | 'INP' | 'LCP' | 'TTFB';

export interface WebVitalMetric {
  name: WebVitalName;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
  navigationType: string;
}

// ============================================
// CONFIG TYPES
// ============================================

export interface APMConfig {
  enabled: boolean;
  sampleRate: number;
  debug: boolean;
  flushInterval: number;
  maxBatchSize: number;
  endpoints: {
    metrics?: string;
    traces?: string;
  };
}

export const DEFAULT_APM_CONFIG: APMConfig = {
  enabled: process.env.NODE_ENV === 'production',
  sampleRate: 1.0,
  debug: process.env.NODE_ENV === 'development',
  flushInterval: 10000, // 10 seconds
  maxBatchSize: 100,
  endpoints: {},
};
