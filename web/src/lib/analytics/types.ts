/**
 * Analytics Event Types
 * TEE:UP Portfolio SaaS
 *
 * Defines all trackable events for conversion funnel analysis
 */

// ============================================================
// Core Event Types
// ============================================================

export type AnalyticsEventCategory =
  | 'page_view'
  | 'user_action'
  | 'conversion'
  | 'engagement'
  | 'error';

// ============================================================
// Page View Events
// ============================================================

export interface PageViewEvent {
  page_path: string;
  page_title: string;
  page_referrer?: string;
  user_id?: string;
  session_id?: string;
  [key: string]: unknown;
}

// ============================================================
// Consumer Funnel Events
// ============================================================

export type ConsumerFunnelEvent =
  | 'consumer_landing_view'
  | 'consumer_scroll_depth'
  | 'consumer_cta_click'
  | 'consumer_quiz_start'
  | 'consumer_quiz_complete'
  | 'consumer_explore_search'
  | 'consumer_pro_view'
  | 'consumer_consultation_start'
  | 'consumer_consultation_submit'
  | 'consumer_kakao_chat_click'
  | 'consumer_phone_click';

export interface ConsumerEventProperties {
  // Landing page
  scroll_depth?: number; // 0-100
  cta_type?: string;

  // Quiz
  quiz_step?: number;
  quiz_answers?: Record<string, string>;
  matched_pros?: number;

  // Explore
  search_query?: string;
  filters?: Record<string, string>;
  results_count?: number;

  // Pro view
  pro_id?: string;
  pro_slug?: string;
  pro_name?: string;

  // Consultation
  contact_method?: string;
  lesson_interest?: string;
  source_url?: string;

  [key: string]: unknown;
}

// ============================================================
// Pro Funnel Events
// ============================================================

export type ProFunnelEvent =
  | 'pro_landing_view'
  | 'pro_scroll_depth'
  | 'pro_earnings_calculator'
  | 'pro_signup_click'
  | 'pro_signup_start'
  | 'pro_signup_complete'
  | 'pro_onboarding_start'
  | 'pro_onboarding_step'
  | 'pro_onboarding_complete'
  | 'pro_profile_publish'
  | 'pro_lead_received'
  | 'pro_lead_responded';

export interface ProEventProperties {
  // Signup
  signup_source?: string;
  role?: string;

  // Onboarding
  onboarding_step?: number;
  onboarding_total_steps?: number;
  theme_type?: string;

  // Earnings calculator
  weekly_lessons?: number;
  lesson_price?: number;
  estimated_revenue?: number;

  // Profile
  profile_completeness?: number;
  sections_count?: number;

  // Leads
  lead_id?: string;
  response_time_minutes?: number;

  [key: string]: unknown;
}

// ============================================================
// Engagement Events
// ============================================================

export type EngagementEvent =
  | 'button_click'
  | 'link_click'
  | 'form_focus'
  | 'form_submit'
  | 'scroll'
  | 'time_on_page'
  | 'video_play'
  | 'video_complete'
  | 'share';

export interface EngagementEventProperties {
  element_id?: string;
  element_text?: string;
  element_class?: string;
  target_url?: string;
  form_name?: string;
  scroll_depth?: number;
  time_seconds?: number;
  video_id?: string;
  share_platform?: string;

  [key: string]: unknown;
}

// ============================================================
// Unified Event Type
// ============================================================

export type AnalyticsEventName =
  | ConsumerFunnelEvent
  | ProFunnelEvent
  | EngagementEvent
  | 'page_view'
  | 'error';

export type AnalyticsEventProperties =
  | PageViewEvent
  | ConsumerEventProperties
  | ProEventProperties
  | EngagementEventProperties;

export interface AnalyticsEvent {
  name: AnalyticsEventName;
  category: AnalyticsEventCategory;
  properties?: AnalyticsEventProperties & {
    // Common properties
    timestamp?: number;
    session_id?: string;
    user_id?: string;
    device_type?: 'mobile' | 'tablet' | 'desktop';
    [key: string]: unknown;
  };
}

// ============================================================
// Analytics Provider Interface
// ============================================================

export interface AnalyticsProvider {
  name: string;
  init: () => void;
  track: (event: AnalyticsEvent) => void;
  identify: (userId: string, traits?: Record<string, unknown>) => void;
  page: (properties: PageViewEvent) => void;
  reset: () => void;
}

// ============================================================
// Analytics Configuration
// ============================================================

export interface AnalyticsConfig {
  enabled: boolean;
  debug: boolean;
  providers: AnalyticsProvider[];
  defaultProperties?: Record<string, unknown>;
}
