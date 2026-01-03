/**
 * Analytics Providers
 * TEE:UP Portfolio SaaS
 *
 * Multiple analytics provider implementations:
 * - Google Analytics 4 (GA4)
 * - Custom Supabase logging
 * - Console (development)
 */

import type { AnalyticsProvider, AnalyticsEvent, PageViewEvent } from './types';

// ============================================================
// Google Analytics 4 Provider
// ============================================================

// Extend window with gtag types
interface GtagWindow {
  gtag?: (command: string, ...args: unknown[]) => void;
  dataLayer?: unknown[];
}

export function createGA4Provider(measurementId: string): AnalyticsProvider {
  // Get window with gtag types
  const getWindow = (): GtagWindow | undefined =>
    typeof window !== 'undefined' ? (window as unknown as GtagWindow) : undefined;

  return {
    name: 'google-analytics-4',

    init() {
      const win = getWindow();
      if (!win) return;
      if (!measurementId) {
        console.warn('[GA4] No measurement ID provided');
        return;
      }

      // Check if already loaded
      if (win.gtag) return;

      // Load Google Analytics script
      const script = document.createElement('script');
      script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
      script.async = true;
      document.head.appendChild(script);

      // Initialize gtag
      win.dataLayer = win.dataLayer || [];
      win.gtag = function gtag(command: string, ...args: unknown[]) {
        win.dataLayer?.push([command, ...args]);
      };
      win.gtag('js', new Date().toISOString());
      win.gtag('config', measurementId, {
        send_page_view: false, // We'll handle page views manually
      });
    },

    track(event: AnalyticsEvent) {
      const win = getWindow();
      if (!win?.gtag) return;

      win.gtag('event', event.name, {
        event_category: event.category,
        ...event.properties,
      });
    },

    identify(userId: string, traits?: Record<string, unknown>) {
      const win = getWindow();
      if (!win?.gtag) return;

      win.gtag('config', measurementId, {
        user_id: userId,
        ...traits,
      });
    },

    page(properties: PageViewEvent) {
      const win = getWindow();
      if (!win?.gtag) return;

      win.gtag('event', 'page_view', {
        page_path: properties.page_path,
        page_title: properties.page_title,
        page_referrer: properties.page_referrer,
      });
    },

    reset() {
      // GA4 doesn't have a built-in reset, but we can clear user_id
      const win = getWindow();
      if (!win?.gtag) return;

      win.gtag('config', measurementId, {
        user_id: null,
      });
    },
  };
}

// ============================================================
// Supabase Analytics Provider (Custom)
// ============================================================

interface SupabaseAnalyticsConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  tableName?: string;
  batchSize?: number;
  flushInterval?: number;
}

export function createSupabaseProvider(config: SupabaseAnalyticsConfig): AnalyticsProvider {
  const {
    supabaseUrl,
    supabaseAnonKey,
    tableName = 'analytics_events',
    batchSize = 10,
    flushInterval = 5000,
  } = config;

  let eventQueue: AnalyticsEvent[] = [];
  let flushTimer: ReturnType<typeof setTimeout> | null = null;

  const flush = async () => {
    if (eventQueue.length === 0) return;

    const eventsToSend = [...eventQueue];
    eventQueue = [];

    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/${tableName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseAnonKey}`,
          Prefer: 'return=minimal',
        },
        body: JSON.stringify(
          eventsToSend.map((event) => ({
            event_name: event.name,
            event_category: event.category,
            properties: event.properties,
            created_at: new Date().toISOString(),
          }))
        ),
      });

      if (!response.ok) {
        console.error('[Supabase Analytics] Failed to send events:', response.status);
        // Re-queue failed events
        eventQueue = [...eventsToSend, ...eventQueue];
      }
    } catch (error) {
      console.error('[Supabase Analytics] Error sending events:', error);
      // Re-queue failed events
      eventQueue = [...eventsToSend, ...eventQueue];
    }
  };

  const scheduleFlush = () => {
    if (flushTimer) return;
    flushTimer = setTimeout(() => {
      flush();
      flushTimer = null;
    }, flushInterval);
  };

  return {
    name: 'supabase',

    init() {
      // Flush on page unload
      if (typeof window !== 'undefined') {
        window.addEventListener('beforeunload', () => {
          if (eventQueue.length > 0) {
            // Use sendBeacon for reliable delivery on unload
            navigator.sendBeacon?.(
              `${supabaseUrl}/rest/v1/${tableName}`,
              JSON.stringify(
                eventQueue.map((event) => ({
                  event_name: event.name,
                  event_category: event.category,
                  properties: event.properties,
                  created_at: new Date().toISOString(),
                }))
              )
            );
          }
        });
      }
    },

    track(event: AnalyticsEvent) {
      eventQueue.push(event);

      if (eventQueue.length >= batchSize) {
        flush();
      } else {
        scheduleFlush();
      }
    },

    identify(userId: string, traits?: Record<string, unknown>) {
      // Store user info in session for future events
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(
          'teeup_user_traits',
          JSON.stringify({ user_id: userId, ...traits })
        );
      }
    },

    page(properties: PageViewEvent) {
      this.track({
        name: 'page_view',
        category: 'page_view',
        properties,
      });
    },

    reset() {
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('teeup_user_traits');
      }
    },
  };
}

// ============================================================
// Console Provider (Development)
// ============================================================

export function createConsoleProvider(): AnalyticsProvider {
  return {
    name: 'console',

    init() {
      console.log('[Analytics Console] Initialized');
    },

    track(event: AnalyticsEvent) {
      console.log(
        `%c[Analytics] ${event.category}/${event.name}`,
        'color: #0ea5e9; font-weight: bold;',
        event.properties
      );
    },

    identify(userId: string, traits?: Record<string, unknown>) {
      console.log(
        '%c[Analytics] Identify',
        'color: #22c55e; font-weight: bold;',
        { userId, traits }
      );
    },

    page(properties: PageViewEvent) {
      console.log(
        '%c[Analytics] Page View',
        'color: #8b5cf6; font-weight: bold;',
        properties
      );
    },

    reset() {
      console.log('%c[Analytics] Reset', 'color: #f59e0b; font-weight: bold;');
    },
  };
}

// ============================================================
// No-op Provider (for SSR or disabled analytics)
// ============================================================

export function createNoopProvider(): AnalyticsProvider {
  return {
    name: 'noop',
    init() {},
    track() {},
    identify() {},
    page() {},
    reset() {},
  };
}
