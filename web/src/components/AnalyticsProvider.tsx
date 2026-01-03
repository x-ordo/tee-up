'use client';

/**
 * Analytics Provider Component
 * TEE:UP Portfolio SaaS
 *
 * Initializes analytics on app load and provides global error tracking.
 */

import { useEffect, type ReactNode } from 'react';
import { initAnalytics, identifyUser } from '@/lib/analytics';
import {
  createGA4Provider,
  createConsoleProvider,
  createNoopProvider,
} from '@/lib/analytics/providers';

// ============================================================
// Types
// ============================================================

interface AnalyticsProviderProps {
  children: ReactNode;
  /**
   * Google Analytics 4 Measurement ID
   */
  ga4MeasurementId?: string;
  /**
   * Enable debug logging in production
   */
  debug?: boolean;
  /**
   * User information for identification
   */
  user?: {
    id: string;
    email?: string;
    role?: string;
    name?: string;
  };
}

// ============================================================
// Component
// ============================================================

export function AnalyticsProvider({
  children,
  ga4MeasurementId,
  debug = false,
  user,
}: AnalyticsProviderProps) {
  // Initialize analytics on mount
  useEffect(() => {
    const isDev = process.env.NODE_ENV === 'development';
    const isServer = typeof window === 'undefined';

    if (isServer) return;

    // Build providers list
    const providers = [];

    // GA4 in production if measurement ID provided
    if (ga4MeasurementId && !isDev) {
      providers.push(createGA4Provider(ga4MeasurementId));
    }

    // Console provider in development or when debug enabled
    if (isDev || debug) {
      providers.push(createConsoleProvider());
    }

    // Noop provider if no providers configured
    if (providers.length === 0) {
      providers.push(createNoopProvider());
    }

    initAnalytics({
      enabled: true,
      debug: isDev || debug,
      providers,
    });
  }, [ga4MeasurementId, debug]);

  // Identify user when available
  useEffect(() => {
    if (user?.id) {
      identifyUser(user.id, {
        email: user.email,
        role: user.role,
        name: user.name,
      });
    }
  }, [user]);

  // Global error tracking
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleError = (event: ErrorEvent) => {
      // Import dynamically to avoid circular dependency
      import('@/lib/analytics').then(({ trackError }) => {
        trackError(event.message, event.error?.stack, {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        });
      });
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      import('@/lib/analytics').then(({ trackError }) => {
        trackError(
          event.reason?.message || 'Unhandled Promise Rejection',
          event.reason?.stack,
          { type: 'unhandled_rejection' }
        );
      });
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return <>{children}</>;
}

// ============================================================
// Export with displayName
// ============================================================

AnalyticsProvider.displayName = 'AnalyticsProvider';
