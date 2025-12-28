'use client';

/**
 * APM Client-Side Utilities
 *
 * Performance monitoring for client-side operations including
 * Web Vitals, navigation timing, and user interactions.
 */

import * as Sentry from '@sentry/nextjs';
import type { WebVitalMetric, WebVitalName } from './types';

// ============================================
// WEB VITALS
// ============================================

type WebVitalsCallback = (metric: WebVitalMetric) => void;

const webVitalsCallbacks: WebVitalsCallback[] = [];

/**
 * Initialize Web Vitals collection
 *
 * Call this in your root layout or app component:
 *
 * @example
 * ```tsx
 * // app/layout.tsx
 * 'use client';
 * import { initWebVitals } from '@/lib/apm/client';
 *
 * useEffect(() => {
 *   initWebVitals();
 * }, []);
 * ```
 */
export async function initWebVitals(): Promise<void> {
  if (typeof window === 'undefined') return;

  try {
    // Note: FID is deprecated in web-vitals v4, replaced by INP
    const { onCLS, onFCP, onINP, onLCP, onTTFB } = await import('web-vitals');

    const handleMetric = (metric: {
      name: string;
      value: number;
      rating: 'good' | 'needs-improvement' | 'poor';
      delta: number;
      id: string;
      navigationType: string;
    }) => {
      const webVitalMetric: WebVitalMetric = {
        name: metric.name as WebVitalName,
        value: metric.value,
        rating: metric.rating,
        delta: metric.delta,
        id: metric.id,
        navigationType: metric.navigationType,
      };

      // Send to Sentry
      Sentry.setMeasurement(
        metric.name,
        metric.value,
        metric.name === 'CLS' ? 'none' : 'millisecond'
      );

      // Add breadcrumb for debugging
      Sentry.addBreadcrumb({
        category: 'web-vital',
        message: `${metric.name}: ${metric.value.toFixed(2)} (${metric.rating})`,
        level: metric.rating === 'poor' ? 'warning' : 'info',
        data: {
          value: metric.value,
          rating: metric.rating,
          delta: metric.delta,
        },
      });

      // Log in development
      if (process.env.NODE_ENV === 'development') {
        console.debug(`[Web Vital] ${metric.name}:`, {
          value: metric.value.toFixed(2),
          rating: metric.rating,
        });
      }

      // Notify callbacks
      webVitalsCallbacks.forEach((cb) => cb(webVitalMetric));
    };

    onCLS(handleMetric);
    onFCP(handleMetric);
    onINP(handleMetric);
    onLCP(handleMetric);
    onTTFB(handleMetric);
  } catch (error) {
    console.warn('[APM] Failed to initialize Web Vitals:', error);
  }
}

/**
 * Subscribe to Web Vitals updates
 */
export function onWebVital(callback: WebVitalsCallback): () => void {
  webVitalsCallbacks.push(callback);
  return () => {
    const index = webVitalsCallbacks.indexOf(callback);
    if (index > -1) {
      webVitalsCallbacks.splice(index, 1);
    }
  };
}

// ============================================
// NAVIGATION TIMING
// ============================================

/**
 * Get navigation timing metrics
 */
export function getNavigationTiming(): Record<string, number> | null {
  if (typeof window === 'undefined' || !window.performance) return null;

  const timing = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  if (!timing) return null;

  return {
    // DNS lookup time
    dnsLookup: timing.domainLookupEnd - timing.domainLookupStart,
    // TCP connection time
    tcpConnect: timing.connectEnd - timing.connectStart,
    // Time to first byte
    ttfb: timing.responseStart - timing.requestStart,
    // Content download time
    contentDownload: timing.responseEnd - timing.responseStart,
    // DOM processing time
    domProcessing: timing.domComplete - timing.responseEnd,
    // Total page load time
    pageLoad: timing.loadEventEnd - timing.startTime,
    // DOM interactive time
    domInteractive: timing.domInteractive - timing.startTime,
    // DOM content loaded
    domContentLoaded: timing.domContentLoadedEventEnd - timing.startTime,
  };
}

/**
 * Report navigation timing to APM
 */
export function reportNavigationTiming(): void {
  const timing = getNavigationTiming();
  if (!timing) return;

  Object.entries(timing).forEach(([name, value]) => {
    Sentry.setMeasurement(`navigation.${name}`, value, 'millisecond');
  });

  Sentry.addBreadcrumb({
    category: 'navigation',
    message: 'Page navigation complete',
    level: 'info',
    data: timing,
  });
}

// ============================================
// USER INTERACTION TRACKING
// ============================================

/**
 * Track a user interaction
 */
export function trackInteraction(
  name: string,
  data?: Record<string, unknown>
): void {
  Sentry.addBreadcrumb({
    category: 'ui.interaction',
    message: name,
    level: 'info',
    data,
  });
}

/**
 * Track a button click
 */
export function trackClick(
  buttonName: string,
  data?: Record<string, unknown>
): void {
  trackInteraction(`click:${buttonName}`, data);
}

/**
 * Track a form submission
 */
export function trackFormSubmit(
  formName: string,
  data?: Record<string, unknown>
): void {
  trackInteraction(`submit:${formName}`, data);
}

// ============================================
// ERROR TRACKING
// ============================================

/**
 * Report a client-side error
 */
export function reportError(
  error: Error,
  context?: {
    component?: string;
    action?: string;
    extra?: Record<string, unknown>;
  }
): void {
  Sentry.captureException(error, {
    tags: {
      'error.component': context?.component,
      'error.action': context?.action,
    },
    extra: context?.extra,
  });
}

/**
 * Report a warning (non-fatal issue)
 */
export function reportWarning(
  message: string,
  context?: Record<string, unknown>
): void {
  Sentry.captureMessage(message, {
    level: 'warning',
    extra: context,
  });
}

// ============================================
// PERFORMANCE OBSERVER
// ============================================

/**
 * Observe long tasks (tasks > 50ms)
 */
export function observeLongTasks(
  callback?: (duration: number, startTime: number) => void
): () => void {
  if (typeof window === 'undefined' || !window.PerformanceObserver) {
    return () => {};
  }

  const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      const duration = entry.duration;

      Sentry.addBreadcrumb({
        category: 'performance',
        message: `Long task detected: ${duration.toFixed(2)}ms`,
        level: duration > 100 ? 'warning' : 'info',
        data: {
          duration,
          startTime: entry.startTime,
        },
      });

      callback?.(duration, entry.startTime);
    });
  });

  try {
    observer.observe({ entryTypes: ['longtask'] });
  } catch {
    // Long task observation not supported
  }

  return () => observer.disconnect();
}

/**
 * Observe layout shifts
 */
export function observeLayoutShifts(
  callback?: (value: number) => void
): () => void {
  if (typeof window === 'undefined' || !window.PerformanceObserver) {
    return () => {};
  }

  let clsValue = 0;

  const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      // Only count if not after user input
      if (!(entry as PerformanceEntry & { hadRecentInput?: boolean }).hadRecentInput) {
        clsValue += (entry as PerformanceEntry & { value?: number }).value ?? 0;
        callback?.(clsValue);
      }
    });
  });

  try {
    observer.observe({ entryTypes: ['layout-shift'] });
  } catch {
    // Layout shift observation not supported
  }

  return () => observer.disconnect();
}
