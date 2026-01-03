/**
 * Analytics Core Module
 * TEE:UP Portfolio SaaS
 *
 * Provides a unified interface for tracking user events across multiple providers.
 * Supports GA4, custom Supabase logging, and other analytics providers.
 */

import type {
  AnalyticsEvent,
  AnalyticsEventName,
  AnalyticsEventProperties,
  AnalyticsConfig,
  AnalyticsProvider,
  PageViewEvent,
  AnalyticsEventCategory,
} from './types';

// ============================================================
// Global State
// ============================================================

let config: AnalyticsConfig = {
  enabled: true,
  debug: process.env.NODE_ENV === 'development',
  providers: [],
};

let sessionId: string | null = null;
let userId: string | null = null;

// ============================================================
// Session Management
// ============================================================

function getSessionId(): string {
  if (sessionId) return sessionId;

  if (typeof window === 'undefined') return 'ssr-session';

  // Try to get from sessionStorage
  const stored = sessionStorage.getItem('teeup_session_id');
  if (stored) {
    sessionId = stored;
    return sessionId;
  }

  // Generate new session ID
  sessionId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  sessionStorage.setItem('teeup_session_id', sessionId);
  return sessionId;
}

function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  if (typeof window === 'undefined') return 'desktop';

  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

// ============================================================
// Core Functions
// ============================================================

/**
 * Initialize analytics with configuration
 */
export function initAnalytics(userConfig: Partial<AnalyticsConfig> = {}): void {
  config = {
    ...config,
    ...userConfig,
    providers: [...config.providers, ...(userConfig.providers || [])],
  };

  // Initialize all providers
  config.providers.forEach((provider) => {
    try {
      provider.init();
      if (config.debug) {
        console.log(`[Analytics] Initialized provider: ${provider.name}`);
      }
    } catch (error) {
      console.error(`[Analytics] Failed to init provider ${provider.name}:`, error);
    }
  });
}

/**
 * Track a custom event
 */
export function trackEvent(
  name: AnalyticsEventName,
  category: AnalyticsEventCategory = 'user_action',
  properties?: AnalyticsEventProperties
): void {
  if (!config.enabled) return;

  const event: AnalyticsEvent = {
    name,
    category,
    properties: {
      ...config.defaultProperties,
      ...properties,
      timestamp: Date.now(),
      session_id: getSessionId(),
      user_id: userId || undefined,
      device_type: getDeviceType(),
    },
  };

  // Debug logging
  if (config.debug) {
    console.log('[Analytics] Track:', event);
  }

  // Send to all providers
  config.providers.forEach((provider) => {
    try {
      provider.track(event);
    } catch (error) {
      console.error(`[Analytics] Failed to track with ${provider.name}:`, error);
    }
  });
}

/**
 * Track page view
 */
export function trackPageView(properties?: Partial<PageViewEvent>): void {
  if (!config.enabled) return;
  if (typeof window === 'undefined') return;

  const pageView: PageViewEvent = {
    page_path: window.location.pathname,
    page_title: document.title,
    page_referrer: document.referrer,
    session_id: getSessionId(),
    user_id: userId || undefined,
    ...properties,
  };

  // Debug logging
  if (config.debug) {
    console.log('[Analytics] Page view:', pageView);
  }

  // Send to all providers
  config.providers.forEach((provider) => {
    try {
      provider.page(pageView);
    } catch (error) {
      console.error(`[Analytics] Failed to track page with ${provider.name}:`, error);
    }
  });
}

/**
 * Identify a user
 */
export function identifyUser(
  id: string,
  traits?: Record<string, unknown>
): void {
  if (!config.enabled) return;

  userId = id;

  if (config.debug) {
    console.log('[Analytics] Identify:', id, traits);
  }

  config.providers.forEach((provider) => {
    try {
      provider.identify(id, traits);
    } catch (error) {
      console.error(`[Analytics] Failed to identify with ${provider.name}:`, error);
    }
  });
}

/**
 * Reset user session (on logout)
 */
export function resetAnalytics(): void {
  userId = null;
  sessionId = null;

  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('teeup_session_id');
  }

  config.providers.forEach((provider) => {
    try {
      provider.reset();
    } catch (error) {
      console.error(`[Analytics] Failed to reset ${provider.name}:`, error);
    }
  });
}

/**
 * Add a new analytics provider
 */
export function addProvider(provider: AnalyticsProvider): void {
  config.providers.push(provider);
  provider.init();
}

// ============================================================
// Convenience Functions for Common Events
// ============================================================

// Consumer funnel
export const consumer = {
  viewLanding: () => trackEvent('consumer_landing_view', 'page_view'),
  scrollDepth: (depth: number) =>
    trackEvent('consumer_scroll_depth', 'engagement', { scroll_depth: depth }),
  clickCTA: (ctaType: string) =>
    trackEvent('consumer_cta_click', 'user_action', { cta_type: ctaType }),
  startQuiz: () => trackEvent('consumer_quiz_start', 'user_action'),
  completeQuiz: (matchedPros: number) =>
    trackEvent('consumer_quiz_complete', 'conversion', { matched_pros: matchedPros }),
  viewPro: (proId: string, proSlug: string, proName?: string) =>
    trackEvent('consumer_pro_view', 'engagement', { pro_id: proId, pro_slug: proSlug, pro_name: proName }),
  startConsultation: (proId: string) =>
    trackEvent('consumer_consultation_start', 'user_action', { pro_id: proId }),
  submitConsultation: (proId: string, contactMethod: string) =>
    trackEvent('consumer_consultation_submit', 'conversion', { pro_id: proId, contact_method: contactMethod }),
  clickKakao: (proId: string) =>
    trackEvent('consumer_kakao_chat_click', 'conversion', { pro_id: proId }),
  clickPhone: (proId: string) =>
    trackEvent('consumer_phone_click', 'conversion', { pro_id: proId }),
};

// Pro funnel
export const pro = {
  viewLanding: () => trackEvent('pro_landing_view', 'page_view'),
  scrollDepth: (depth: number) =>
    trackEvent('pro_scroll_depth', 'engagement', { scroll_depth: depth }),
  useCalculator: (weeklyLessons: number, lessonPrice: number, estimatedRevenue: number) =>
    trackEvent('pro_earnings_calculator', 'engagement', {
      weekly_lessons: weeklyLessons,
      lesson_price: lessonPrice,
      estimated_revenue: estimatedRevenue,
    }),
  clickSignup: (source: string) =>
    trackEvent('pro_signup_click', 'user_action', { signup_source: source }),
  completeSignup: () => trackEvent('pro_signup_complete', 'conversion'),
  startOnboarding: () => trackEvent('pro_onboarding_start', 'user_action'),
  completeOnboardingStep: (step: number, totalSteps: number) =>
    trackEvent('pro_onboarding_step', 'user_action', {
      onboarding_step: step,
      onboarding_total_steps: totalSteps,
    }),
  completeOnboarding: (themeType: string) =>
    trackEvent('pro_onboarding_complete', 'conversion', { theme_type: themeType }),
  publishProfile: (completeness: number) =>
    trackEvent('pro_profile_publish', 'conversion', { profile_completeness: completeness }),
  receiveLead: (leadId: string) =>
    trackEvent('pro_lead_received', 'conversion', { lead_id: leadId }),
  respondToLead: (leadId: string, responseTimeMinutes: number) =>
    trackEvent('pro_lead_responded', 'engagement', {
      lead_id: leadId,
      response_time_minutes: responseTimeMinutes,
    }),
};

// General engagement
export const engagement = {
  click: (elementId: string, elementText?: string, targetUrl?: string) =>
    trackEvent('button_click', 'engagement', {
      element_id: elementId,
      element_text: elementText,
      target_url: targetUrl,
    }),
  formFocus: (formName: string) =>
    trackEvent('form_focus', 'engagement', { form_name: formName }),
  formSubmit: (formName: string) =>
    trackEvent('form_submit', 'engagement', { form_name: formName }),
  scroll: (depth: number) =>
    trackEvent('scroll', 'engagement', { scroll_depth: depth }),
  timeOnPage: (seconds: number) =>
    trackEvent('time_on_page', 'engagement', { time_seconds: seconds }),
  share: (platform: string, targetUrl?: string) =>
    trackEvent('share', 'engagement', { share_platform: platform, target_url: targetUrl }),
};

// Error tracking
export const trackError = (
  errorMessage: string,
  errorStack?: string,
  context?: Record<string, unknown>
) =>
  trackEvent('error', 'error', {
    error_message: errorMessage,
    error_stack: errorStack,
    ...context,
  } as AnalyticsEventProperties);

// ============================================================
// Exports
// ============================================================

export type {
  AnalyticsEvent,
  AnalyticsEventName,
  AnalyticsEventCategory,
  AnalyticsEventProperties,
  AnalyticsConfig,
  AnalyticsProvider,
  PageViewEvent,
} from './types';
