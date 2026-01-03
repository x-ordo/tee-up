'use client';

/**
 * useAnalytics Hook
 * TEE:UP Portfolio SaaS
 *
 * React hook for easy analytics event tracking in components.
 */

import { useCallback, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import {
  trackEvent,
  trackPageView,
  identifyUser,
  resetAnalytics,
  consumer,
  pro,
  engagement,
  trackError,
} from '@/lib/analytics';
import type { AnalyticsEventName, AnalyticsEventCategory, AnalyticsEventProperties } from '@/lib/analytics';

// ============================================================
// Hook
// ============================================================

interface UseAnalyticsOptions {
  /**
   * Whether to track page views automatically on route changes
   * @default true
   */
  trackPageViews?: boolean;

  /**
   * Whether to track scroll depth automatically
   * @default false
   */
  trackScrollDepth?: boolean;

  /**
   * Whether to track time on page
   * @default false
   */
  trackTimeOnPage?: boolean;
}

export function useAnalytics(options: UseAnalyticsOptions = {}) {
  const {
    trackPageViews = true,
    trackScrollDepth = false,
    trackTimeOnPage = false,
  } = options;

  const pathname = usePathname();
  const pageLoadTime = useRef(Date.now());
  const maxScrollDepth = useRef(0);

  // ============================================================
  // Page View Tracking
  // ============================================================

  useEffect(() => {
    if (!trackPageViews) return;

    // Reset scroll depth on page change
    maxScrollDepth.current = 0;
    pageLoadTime.current = Date.now();

    // Track page view
    trackPageView({
      page_path: pathname,
    });
  }, [pathname, trackPageViews]);

  // ============================================================
  // Scroll Depth Tracking
  // ============================================================

  useEffect(() => {
    if (!trackScrollDepth || typeof window === 'undefined') return;

    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) return;

      const currentDepth = Math.round((window.scrollY / scrollHeight) * 100);

      // Only track when passing thresholds: 25%, 50%, 75%, 100%
      const thresholds = [25, 50, 75, 100];
      for (const threshold of thresholds) {
        if (currentDepth >= threshold && maxScrollDepth.current < threshold) {
          maxScrollDepth.current = threshold;
          engagement.scroll(threshold);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [trackScrollDepth, pathname]);

  // ============================================================
  // Time on Page Tracking
  // ============================================================

  useEffect(() => {
    if (!trackTimeOnPage || typeof window === 'undefined') return;

    // Track time spent when leaving the page
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        const timeSpent = Math.round((Date.now() - pageLoadTime.current) / 1000);
        engagement.timeOnPage(timeSpent);
      }
    };

    const handleBeforeUnload = () => {
      const timeSpent = Math.round((Date.now() - pageLoadTime.current) / 1000);
      engagement.timeOnPage(timeSpent);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [trackTimeOnPage, pathname]);

  // ============================================================
  // Core Functions (memoized)
  // ============================================================

  const track = useCallback(
    (
      name: AnalyticsEventName,
      category?: AnalyticsEventCategory,
      properties?: AnalyticsEventProperties
    ) => {
      trackEvent(name, category, properties);
    },
    []
  );

  const identify = useCallback(
    (userId: string, traits?: Record<string, unknown>) => {
      identifyUser(userId, traits);
    },
    []
  );

  const reset = useCallback(() => {
    resetAnalytics();
  }, []);

  // ============================================================
  // Click Tracking Helper
  // ============================================================

  const trackClick = useCallback(
    (elementId: string, elementText?: string, targetUrl?: string) => {
      engagement.click(elementId, elementText, targetUrl);
    },
    []
  );

  // ============================================================
  // Form Tracking Helpers
  // ============================================================

  const trackFormFocus = useCallback((formName: string) => {
    engagement.formFocus(formName);
  }, []);

  const trackFormSubmit = useCallback((formName: string) => {
    engagement.formSubmit(formName);
  }, []);

  // ============================================================
  // Error Tracking
  // ============================================================

  const trackErrorEvent = useCallback(
    (errorMessage: string, errorStack?: string, context?: Record<string, unknown>) => {
      trackError(errorMessage, errorStack, context);
    },
    []
  );

  return {
    // Core functions
    track,
    identify,
    reset,

    // Convenience helpers
    trackClick,
    trackFormFocus,
    trackFormSubmit,
    trackError: trackErrorEvent,

    // Pre-built funnel trackers
    consumer,
    pro,
    engagement,
  };
}

// ============================================================
// Specialized Hooks
// ============================================================

/**
 * Hook for consumer-specific analytics
 */
export function useConsumerAnalytics() {
  const analytics = useAnalytics({ trackScrollDepth: true });
  return {
    ...consumer,
    trackClick: analytics.trackClick,
    trackError: analytics.trackError,
  };
}

/**
 * Hook for pro-specific analytics
 */
export function useProAnalytics() {
  const analytics = useAnalytics({ trackScrollDepth: true });
  return {
    ...pro,
    trackClick: analytics.trackClick,
    trackError: analytics.trackError,
  };
}
