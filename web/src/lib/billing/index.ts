/**
 * Billing Module
 *
 * 모든 billing/monetization 관련 로직을 중앙에서 관리합니다.
 *
 * @example
 * ```ts
 * import {
 *   PRICING,
 *   hasFeatureAccess,
 *   getFormattedPrice,
 *   isPremiumTier,
 * } from '@/lib/billing';
 *
 * // 가격 확인
 * const proPrice = PRICING.pro.monthly; // 49000
 *
 * // 기능 접근 확인
 * if (hasFeatureAccess(userTier, 'payment_integration')) {
 *   // Premium 이상만 결제 연동 가능
 * }
 *
 * // 가격 표시
 * const display = getFormattedPrice('pro', 'monthly'); // "₩49,000/월"
 * ```
 */

// Constants
export {
  // Types
  type PlanTier,
  type LegacySubscriptionTier,
  type MembershipTier,
  // Pricing
  PRICING,
  YEARLY_DISCOUNT_PERCENT,
  // Lead limits (legacy)
  LEGACY_FREE_LEADS_PER_MONTH,
  UNLIMITED_LEADS,
  LEADS_ARE_UNLIMITED,
  // Features
  TIER_FEATURES,
  TIER_HIGHLIGHTS,
  FEATURE_REQUIRED_TIER,
  // Plan display
  PLAN_DISPLAY,
  // Deposit
  DEFAULT_DEPOSIT_AMOUNT,
  DEFAULT_DEPOSIT_ENABLED,
  // Cancellation
  CANCELLATION_POLICY,
} from './constants';

// Utilities
export {
  // Tier utilities
  getTierRank,
  isTierAtLeast,
  // Feature access
  hasFeatureAccess,
  getTierFeatures,
  // Pricing helpers
  getMonthlyPrice,
  getYearlyPrice,
  formatKRW,
  getFormattedPrice,
  // Lead limits (legacy)
  getLeadLimit,
  calculateFreeLeadsRemaining,
  isPremiumTier,
  // Plan info
  getPlanName,
  getPlanDescription,
  isPopularPlan,
  // Legacy mapping
  mapLegacyTier,
  mapToLegacyTier,
} from './utils';
