/**
 * Sentry Client-side Configuration
 *
 * This file configures Sentry for client-side error tracking.
 * It runs in the browser and captures frontend errors, performance data,
 * and user interactions.
 *
 * @see https://docs.sentry.io/platforms/javascript/guides/nextjs/
 */
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Environment configuration
  environment: process.env.NODE_ENV,

  // Performance Monitoring
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Session Replay for debugging user sessions
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  // Only enable in production or when DSN is set
  enabled: !!process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Integrations
  integrations: [
    Sentry.replayIntegration({
      // Mask all text content for privacy
      maskAllText: false,
      // Block all media elements
      blockAllMedia: false,
    }),
  ],

  // Filter out noisy errors
  ignoreErrors: [
    // Browser extensions
    'top.GLOBALS',
    // Network errors
    'Network request failed',
    'Failed to fetch',
    'Load failed',
    // User aborted requests
    'AbortError',
    // Benign browser errors
    'ResizeObserver loop',
  ],

  // Scrub sensitive data before sending
  beforeSend(event) {
    // Remove sensitive URL parameters
    if (event.request?.url) {
      const url = new URL(event.request.url);
      url.searchParams.delete('token');
      url.searchParams.delete('key');
      url.searchParams.delete('password');
      event.request.url = url.toString();
    }
    return event;
  },
});
