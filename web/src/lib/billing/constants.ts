/**
 * Billing Constants
 *
 * 모든 가격, 구독 티어, 리드 제한 관련 상수를 중앙에서 관리합니다.
 *
 * @description
 * MONETIZATION PIVOT (PRD v1.2):
 * - 모든 플랜에서 리드 캡처는 무제한
 * - 가격은 편의 기능 기반 (자동 리마인더, 노쇼 관리, 결제 연동 등)
 * - 기존 리드 제한 모델은 deprecated
 */

// ============================================
// Subscription Tiers
// ============================================

/**
 * 현재 사용 중인 Feature-Gated 플랜 티어
 * PRD v1.2 "무료 홍보 페이지 중심" 전략 기반
 */
export type PlanTier = 'free' | 'pro' | 'premium' | 'enterprise';

/**
 * @deprecated 레거시 구독 티어 (호환성용)
 * DB의 pro_profiles.subscription_tier와 매핑
 */
export type LegacySubscriptionTier = 'free' | 'basic' | 'pro';

/**
 * 멤버십 테이블의 plan_tier
 */
export type MembershipTier = 'free' | 'prestige';

// ============================================
// Pricing Constants
// ============================================

/**
 * 가격 정보 (KRW)
 */
export const PRICING = {
  free: {
    monthly: 0,
    yearly: 0,
  },
  pro: {
    monthly: 49000,
    yearly: 490000, // ~17% 할인
  },
  premium: {
    monthly: 99000,
    yearly: 990000, // ~17% 할인
  },
  enterprise: {
    monthly: -1, // 별도 문의
    yearly: -1,
  },
} as const;

/**
 * 연간 결제 할인율
 */
export const YEARLY_DISCOUNT_PERCENT = 17;

// ============================================
// Lead Limits (Legacy)
// ============================================

/**
 * @deprecated PRD v1.2 이후 모든 플랜에서 리드는 무제한
 * 기존 코드 호환성을 위해 유지
 */
export const LEGACY_FREE_LEADS_PER_MONTH = 3;

/**
 * 무제한 리드를 나타내는 값
 */
export const UNLIMITED_LEADS = -1;

/**
 * 현재 리드 정책: 모든 플랜에서 무제한
 */
export const LEADS_ARE_UNLIMITED = true;

// ============================================
// Feature Definitions
// ============================================

/**
 * 티어별 기능 목록
 */
export const TIER_FEATURES: Record<PlanTier, string[]> = {
  free: [
    '프로필 페이지 1개',
    '무제한 리드 캡처',
    '기본 템플릿',
    '예약 요청 받기',
    '카카오 오픈채팅 연동',
    'TEE:UP 브랜딩 표시',
  ],
  pro: [
    '프로필 페이지 1개',
    '무제한 리드 캡처',
    '모든 프리미엄 템플릿',
    '예약 요청 받기',
    '자동 리마인더 알림',
    '노쇼 관리',
    '예약 캘린더',
    '커스텀 도메인 연결',
    'TEE:UP 브랜딩 제거',
    '기본 방문자 분석',
  ],
  premium: [
    '프로필 페이지 3개',
    '무제한 리드 캡처',
    '모든 프리미엄 템플릿',
    '예약 요청 받기',
    '자동 리마인더 알림',
    '노쇼 관리',
    '예약 캘린더',
    '커스텀 도메인 연결',
    'TEE:UP 브랜딩 제거',
    '고급 방문자 분석',
    '결제 연동',
    '정산 리포트',
    '우선 고객 지원',
  ],
  enterprise: [
    '무제한 프로필 페이지',
    '무제한 리드 캡처',
    '화이트라벨 (완전 브랜딩 제거)',
    '다중 커스텀 도메인',
    'API 접근',
    'CRM 연동',
    '전담 계정 매니저',
    '맞춤 온보딩',
    'SLA 보장',
  ],
};

/**
 * 티어별 하이라이트 (핵심 차별점)
 */
export const TIER_HIGHLIGHTS: Record<PlanTier, string[]> = {
  free: ['무료', '무제한 리드', '예약 요청'],
  pro: ['자동 리마인더', '노쇼 관리', '예약 캘린더'],
  premium: ['결제 연동', '정산 리포트', '우선 지원'],
  enterprise: ['화이트라벨', 'API', '전담 매니저'],
};

/**
 * 기능별 최소 필요 티어
 */
export const FEATURE_REQUIRED_TIER: Record<string, PlanTier> = {
  // Pro 티어 기능
  auto_reminder: 'pro',
  noshow_management: 'pro',
  booking_calendar: 'pro',
  custom_domain: 'pro',
  branding_removal: 'pro',
  basic_analytics: 'pro',
  // Premium 티어 기능
  advanced_analytics: 'premium',
  payment_integration: 'premium',
  settlement_report: 'premium',
  priority_support: 'premium',
  // Enterprise 티어 기능
  whitelabel: 'enterprise',
  api_access: 'enterprise',
  crm_integration: 'enterprise',
  dedicated_manager: 'enterprise',
};

// ============================================
// Plan Display Info
// ============================================

/**
 * 플랜 표시 정보
 */
export const PLAN_DISPLAY: Record<PlanTier, {
  name: string;
  nameKo: string;
  description: string;
  isPopular: boolean;
}> = {
  free: {
    name: 'Free',
    nameKo: '무료',
    description: '시작하기 좋은 무료 플랜',
    isPopular: false,
  },
  pro: {
    name: 'Pro',
    nameKo: '프로',
    description: '예약 관리가 필요한 프로를 위한 플랜',
    isPopular: true,
  },
  premium: {
    name: 'Premium',
    nameKo: '프리미엄',
    description: '결제까지 한 번에 관리하는 올인원 플랜',
    isPopular: false,
  },
  enterprise: {
    name: 'Enterprise',
    nameKo: '엔터프라이즈',
    description: '아카데미 및 대형 스튜디오를 위한 맞춤 플랜',
    isPopular: false,
  },
};

// ============================================
// Deposit Settings
// ============================================

/**
 * 기본 예약금 설정 (KRW)
 */
export const DEFAULT_DEPOSIT_AMOUNT = 30000;

/**
 * 예약금 활성화 기본값
 */
export const DEFAULT_DEPOSIT_ENABLED = false;

// ============================================
// Cancellation Policy
// ============================================

/**
 * 취소 정책 (환불 비율)
 */
export const CANCELLATION_POLICY = {
  /** 24시간 전 취소: 100% 환불 */
  BEFORE_24H: 1.0,
  /** 12시간 전 취소: 50% 환불 */
  BEFORE_12H: 0.5,
  /** 12시간 이내 취소: 환불 불가 */
  WITHIN_12H: 0,
} as const;
