/**
 * Feature Flag Definitions
 *
 * All feature flags for the TEE:UP application.
 * Add new flags here with proper documentation.
 *
 * Naming convention:
 * - Use SCREAMING_SNAKE_CASE for flag keys
 * - Prefix with feature category (e.g., PORTFOLIO_, BILLING_, ADMIN_)
 */

import type { FlagDefinition } from './types';

// ============================================
// FEATURE FLAGS REGISTRY
// ============================================

export const FLAGS = {
  // ----------------------------------------
  // Portfolio Features
  // ----------------------------------------
  PORTFOLIO_NEW_EDITOR: {
    type: 'percentage',
    key: 'PORTFOLIO_NEW_EDITOR',
    defaultValue: false,
    description: 'Enable new portfolio editor UI',
    percentage: 0, // Start with 0%, gradually increase
  },

  PORTFOLIO_AI_BIO: {
    type: 'static',
    key: 'PORTFOLIO_AI_BIO',
    defaultValue: false,
    description: 'Enable AI-generated bio suggestions',
    envVar: 'NEXT_PUBLIC_ENABLE_AI_BIO',
  },

  // ----------------------------------------
  // Billing & Monetization
  // ----------------------------------------
  BILLING_NEW_PRICING: {
    type: 'percentage',
    key: 'BILLING_NEW_PRICING',
    defaultValue: false,
    description: 'Enable new pricing tiers (2025 Q1)',
    percentage: 0,
  },

  BILLING_TOSS_PAYMENTS: {
    type: 'static',
    key: 'BILLING_TOSS_PAYMENTS',
    defaultValue: true,
    description: 'Enable Toss Payments integration',
    envVar: 'NEXT_PUBLIC_ENABLE_TOSS',
  },

  // ----------------------------------------
  // Booking & Scheduler
  // ----------------------------------------
  SCHEDULER_V2: {
    type: 'percentage',
    key: 'SCHEDULER_V2',
    defaultValue: false,
    description: 'Enable new scheduler with calendar sync',
    percentage: 0,
  },

  BOOKING_DEPOSITS: {
    type: 'static',
    key: 'BOOKING_DEPOSITS',
    defaultValue: true,
    description: 'Enable deposit-based bookings',
    envVar: 'NEXT_PUBLIC_ENABLE_DEPOSITS',
  },

  // ----------------------------------------
  // Studio Features
  // ----------------------------------------
  STUDIO_ANALYTICS: {
    type: 'static',
    key: 'STUDIO_ANALYTICS',
    defaultValue: false,
    description: 'Enable studio analytics dashboard',
    envVar: 'NEXT_PUBLIC_ENABLE_STUDIO_ANALYTICS',
  },

  STUDIO_MULTI_TENANT: {
    type: 'percentage',
    key: 'STUDIO_MULTI_TENANT',
    defaultValue: false,
    description: 'Enable multi-tenant studio support',
    percentage: 0,
  },

  // ----------------------------------------
  // Admin Features
  // ----------------------------------------
  ADMIN_BULK_ACTIONS: {
    type: 'static',
    key: 'ADMIN_BULK_ACTIONS',
    defaultValue: false,
    description: 'Enable bulk actions in admin panel',
    envVar: 'NEXT_PUBLIC_ENABLE_ADMIN_BULK',
  },

  // ----------------------------------------
  // Experimental / Beta
  // ----------------------------------------
  BETA_REAL_TIME_CHAT: {
    type: 'percentage',
    key: 'BETA_REAL_TIME_CHAT',
    defaultValue: false,
    description: 'Enable real-time chat (Supabase Realtime)',
    percentage: 0,
  },

  BETA_PUSH_NOTIFICATIONS: {
    type: 'percentage',
    key: 'BETA_PUSH_NOTIFICATIONS',
    defaultValue: false,
    description: 'Enable push notifications',
    percentage: 0,
  },

  // ----------------------------------------
  // Debug / Development
  // ----------------------------------------
  DEBUG_QUERY_LOGS: {
    type: 'static',
    key: 'DEBUG_QUERY_LOGS',
    defaultValue: false,
    description: 'Log all database queries (dev only)',
    envVar: 'NEXT_PUBLIC_DEBUG_QUERIES',
  },

  DEBUG_PERFORMANCE: {
    type: 'static',
    key: 'DEBUG_PERFORMANCE',
    defaultValue: false,
    description: 'Enable performance overlay (dev only)',
    envVar: 'NEXT_PUBLIC_DEBUG_PERF',
  },
} as const satisfies Record<string, FlagDefinition>;

// ============================================
// TYPE EXPORTS
// ============================================

export type FlagKey = keyof typeof FLAGS;
export type FlagConfig = (typeof FLAGS)[FlagKey];
