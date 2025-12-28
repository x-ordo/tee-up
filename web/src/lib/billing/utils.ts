/**
 * Billing Utility Functions
 *
 * 구독 티어 계산, 기능 접근 권한 확인 등 billing 관련 유틸리티 함수
 */

import {
  type PlanTier,
  type LegacySubscriptionTier,
  PRICING,
  FEATURE_REQUIRED_TIER,
  TIER_FEATURES,
  PLAN_DISPLAY,
  LEADS_ARE_UNLIMITED,
  LEGACY_FREE_LEADS_PER_MONTH,
} from './constants';

// ============================================
// Tier Ordering
// ============================================

/**
 * 티어 우선순위 (낮을수록 상위)
 */
const TIER_ORDER: PlanTier[] = ['free', 'pro', 'premium', 'enterprise'];

/**
 * 티어 순위 반환 (0 = free, 3 = enterprise)
 */
export function getTierRank(tier: PlanTier): number {
  return TIER_ORDER.indexOf(tier);
}

/**
 * 티어 비교 (a >= b 이면 true)
 */
export function isTierAtLeast(currentTier: PlanTier, requiredTier: PlanTier): boolean {
  return getTierRank(currentTier) >= getTierRank(requiredTier);
}

// ============================================
// Feature Access
// ============================================

/**
 * 특정 기능에 대한 접근 권한 확인
 *
 * @param tier - 현재 구독 티어
 * @param feature - 확인할 기능 이름 (FEATURE_REQUIRED_TIER의 키)
 * @returns 기능 사용 가능 여부
 *
 * @example
 * hasFeatureAccess('pro', 'auto_reminder') // true
 * hasFeatureAccess('free', 'payment_integration') // false
 */
export function hasFeatureAccess(tier: PlanTier, feature: string): boolean {
  const requiredTier = FEATURE_REQUIRED_TIER[feature];

  // 정의되지 않은 기능은 모든 티어에서 사용 가능 (free tier feature)
  if (!requiredTier) return true;

  return isTierAtLeast(tier, requiredTier);
}

/**
 * 티어의 모든 기능 목록 반환
 */
export function getTierFeatures(tier: PlanTier): string[] {
  return TIER_FEATURES[tier] || [];
}

// ============================================
// Pricing Helpers
// ============================================

/**
 * 월간 가격 반환 (KRW)
 */
export function getMonthlyPrice(tier: PlanTier): number {
  return PRICING[tier]?.monthly ?? 0;
}

/**
 * 연간 가격 반환 (KRW)
 */
export function getYearlyPrice(tier: PlanTier): number {
  return PRICING[tier]?.yearly ?? 0;
}

/**
 * 가격 포맷팅 (한국 원화)
 */
export function formatKRW(amount: number): string {
  if (amount < 0) return '문의';
  return new Intl.NumberFormat('ko-KR').format(amount);
}

/**
 * 가격 표시 문자열 반환
 * @example
 * getFormattedPrice('pro', 'monthly') // "₩49,000/월"
 * getFormattedPrice('enterprise', 'monthly') // "별도 문의"
 */
export function getFormattedPrice(tier: PlanTier, interval: 'monthly' | 'yearly'): string {
  const price = interval === 'monthly' ? getMonthlyPrice(tier) : getYearlyPrice(tier);

  if (price < 0) return '별도 문의';
  if (price === 0) return '무료';

  const suffix = interval === 'monthly' ? '/월' : '/년';
  return `₩${formatKRW(price)}${suffix}`;
}

// ============================================
// Lead Limits (Legacy Compatibility)
// ============================================

/**
 * 리드 제한 확인
 *
 * @deprecated PRD v1.2 이후 모든 플랜에서 리드는 무제한
 * 레거시 코드 호환성을 위해 유지
 */
export function getLeadLimit(_tier: PlanTier | LegacySubscriptionTier): number {
  // MONETIZATION PIVOT: 모든 티어에서 무제한
  return -1; // -1 = unlimited
}

/**
 * 남은 무료 리드 수 계산
 *
 * @deprecated PRD v1.2 이후 모든 플랜에서 리드는 무제한
 * UI 표시 및 레거시 호환성을 위해 유지
 */
export function calculateFreeLeadsRemaining(
  tier: PlanTier | LegacySubscriptionTier,
  monthlyLeadCount: number
): number {
  // MONETIZATION PIVOT: 무제한 리드 정책
  if (LEADS_ARE_UNLIMITED) {
    return 999; // UI에서 "무제한"으로 표시
  }

  // 레거시 로직 (더 이상 실행되지 않음)
  const isPremium = tier !== 'free';
  if (isPremium) return 999;

  return Math.max(0, LEGACY_FREE_LEADS_PER_MONTH - monthlyLeadCount);
}

/**
 * 프리미엄 티어 여부 확인
 */
export function isPremiumTier(tier: PlanTier | LegacySubscriptionTier): boolean {
  return tier !== 'free';
}

// ============================================
// Plan Info Helpers
// ============================================

/**
 * 플랜 표시명 반환
 */
export function getPlanName(tier: PlanTier, korean = true): string {
  const display = PLAN_DISPLAY[tier];
  return korean ? display.nameKo : display.name;
}

/**
 * 플랜 설명 반환
 */
export function getPlanDescription(tier: PlanTier): string {
  return PLAN_DISPLAY[tier].description;
}

/**
 * 인기 플랜 여부
 */
export function isPopularPlan(tier: PlanTier): boolean {
  return PLAN_DISPLAY[tier].isPopular;
}

// ============================================
// Legacy Tier Mapping
// ============================================

/**
 * 레거시 구독 티어를 새 PlanTier로 매핑
 *
 * DB의 pro_profiles.subscription_tier는 아직 'basic' | 'pro'를 사용
 * 새 시스템의 'free' | 'pro' | 'premium' | 'enterprise'로 변환
 */
export function mapLegacyTier(legacyTier: LegacySubscriptionTier): PlanTier {
  switch (legacyTier) {
    case 'free':
    case 'basic':
      return 'free';
    case 'pro':
      return 'pro';
    default:
      return 'free';
  }
}

/**
 * 새 PlanTier를 레거시 구독 티어로 매핑
 * DB 호환성을 위해 사용
 */
export function mapToLegacyTier(tier: PlanTier): LegacySubscriptionTier {
  switch (tier) {
    case 'free':
      return 'free';
    case 'pro':
    case 'premium':
    case 'enterprise':
      return 'pro';
    default:
      return 'free';
  }
}
