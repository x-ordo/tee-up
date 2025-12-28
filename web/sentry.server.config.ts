/**
 * Sentry Server-side Configuration
 *
 * This file configures Sentry for server-side error tracking.
 * It runs on the Node.js server and captures backend errors,
 * Server Actions failures, and API route issues.
 *
 * @see https://docs.sentry.io/platforms/javascript/guides/nextjs/
 */
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Environment configuration
  environment: process.env.NODE_ENV,

  // Performance Monitoring - lower rate for server
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Only enable in production or when DSN is set
  enabled: !!(process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN),

  // Set sampling rate for profiling
  profilesSampleRate: 0.1,

  // Filter out noisy errors
  ignoreErrors: [
    // Supabase session refresh (expected behavior)
    'Auth session missing',
    'Invalid Refresh Token',
    // Network issues (transient)
    'ECONNREFUSED',
    'ETIMEDOUT',
  ],

  // Add server-specific context
  beforeSend(event, hint) {
    // Don't send events for expected authentication failures
    const originalException = hint.originalException;
    if (
      originalException instanceof Error &&
      originalException.message.includes('Not authenticated')
    ) {
      return null;
    }

    // Scrub sensitive data
    if (event.extra) {
      delete event.extra.password;
      delete event.extra.token;
      delete event.extra.apiKey;
    }

    return event;
  },
});
