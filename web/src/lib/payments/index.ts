/**
 * Toss Payments 결제 라이브러리
 * @description Toss Payments API를 사용한 결제 및 멤버십 관리
 */

import { createClient } from '@/lib/supabase/client';
// ISubscriptionPlan is kept for the SUBSCRIPTION_PLANS constant structure, but ISubscription and SubscriptionTier are replaced by local types.
import type { ISubscriptionPlan } from '@/types';

// ============================================
// New Types to match `memberships` table schema
// ============================================
export type MembershipPlanTier = 'free' | 'prestige';
export type MembershipStatus = 'active' | 'past_due' | 'cancelled';
export type OldSubscriptionTier = 'basic' | 'pro'; // For mapping legacy values

export interface IMembership {
  id: string;
  user_id: string;
  plan_tier: MembershipPlanTier;
  status: MembershipStatus;
  billing_key: string | null;
  customer_key: string | null;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  cancelled_at: string | null;
  created_at: string;
  updated_at: string;
}

// ============================================
// Constants
// ============================================

export const TOSS_CLIENT_KEY = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || '';
export const TOSS_SECRET_KEY = process.env.TOSS_SECRET_KEY || '';

// ============================================
// PRD v1.2: Feature-Gated Pricing Plans
// "무료 홍보 페이지 중심" 전략
// - Leads are UNLIMITED on all plans
// - Pricing based on convenience features
// ============================================

export type FeatureGatedPlanTier = 'free' | 'pro' | 'premium' | 'enterprise';

export interface IFeatureGatedPlan {
  id: string;
  name: string;
  nameKo: string;
  tier: FeatureGatedPlanTier;
  price: number;           // Monthly price in KRW (-1 for custom)
  priceYearly: number;     // Yearly price in KRW (-1 for custom)
  currency: string;
  features: string[];
  highlights: string[];    // Key differentiators
  is_popular: boolean;
}

export const FEATURE_GATED_PLANS: IFeatureGatedPlan[] = [
  {
    id: 'free',
    name: 'Free',
    nameKo: '무료',
    tier: 'free',
    price: 0,
    priceYearly: 0,
    currency: 'KRW',
    features: [
      '프로필 페이지 1개',
      '무제한 리드 캡처',
      '기본 템플릿',
      '예약 요청 받기',
      '카카오 오픈채팅 연동',
      'TEE:UP 브랜딩 표시',
    ],
    highlights: ['무료', '무제한 리드', '예약 요청'],
    is_popular: false,
  },
  {
    id: 'pro-monthly',
    name: 'Pro',
    nameKo: '프로',
    tier: 'pro',
    price: 49000,
    priceYearly: 490000, // ~17% discount
    currency: 'KRW',
    features: [
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
    highlights: ['자동 리마인더', '노쇼 관리', '예약 캘린더'],
    is_popular: true,
  },
  {
    id: 'premium-monthly',
    name: 'Premium',
    nameKo: '프리미엄',
    tier: 'premium',
    price: 99000,
    priceYearly: 990000, // ~17% discount
    currency: 'KRW',
    features: [
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
    highlights: ['결제 연동', '정산 리포트', '우선 지원'],
    is_popular: false,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    nameKo: '엔터프라이즈',
    tier: 'enterprise',
    price: -1, // Custom pricing
    priceYearly: -1,
    currency: 'KRW',
    features: [
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
    highlights: ['화이트라벨', 'API', '전담 매니저'],
    is_popular: false,
  },
];

// Helper to get plan by ID
export function getFeatureGatedPlan(planId: string): IFeatureGatedPlan | undefined {
  return FEATURE_GATED_PLANS.find(p => p.id === planId);
}

// Helper to check if a feature is available for a tier
export function hasFeature(tier: FeatureGatedPlanTier, feature: string): boolean {
  const tierOrder: FeatureGatedPlanTier[] = ['free', 'pro', 'premium', 'enterprise'];
  const featureTierMap: Record<string, FeatureGatedPlanTier> = {
    // Pro tier features
    'auto_reminder': 'pro',
    'noshow_management': 'pro',
    'booking_calendar': 'pro',
    'custom_domain': 'pro',
    'branding_removal': 'pro',
    'basic_analytics': 'pro',
    // Premium tier features
    'advanced_analytics': 'premium',
    'payment_integration': 'premium',
    'settlement_report': 'premium',
    'priority_support': 'premium',
    // Enterprise tier features
    'whitelabel': 'enterprise',
    'api_access': 'enterprise',
    'crm_integration': 'enterprise',
    'dedicated_manager': 'enterprise',
  };

  const requiredTier = featureTierMap[feature];
  if (!requiredTier) return true; // Feature available to all (free tier)

  return tierOrder.indexOf(tier) >= tierOrder.indexOf(requiredTier);
}

// ============================================
// LEGACY: Old Membership Plans (for backward compatibility)
// @deprecated Use FEATURE_GATED_PLANS instead
// ============================================

export const MEMBERSHIP_PLANS: (Omit<ISubscriptionPlan, 'tier'> & { plan_tier: MembershipPlanTier })[] = [
  {
    id: 'free',
    name: 'Free',
    plan_tier: 'free',
    price: 0,
    currency: 'KRW',
    interval: 'month',
    features: [
      '무제한 리드 캡처', // Updated: leads are now unlimited
      '기본 프로필 페이지',
      '카카오 연동',
    ],
    lead_limit: -1, // Updated: unlimited
    is_popular: false,
  },
  {
    id: 'prestige-monthly',
    name: 'Prestige 월간',
    plan_tier: 'prestige',
    price: 30000, // Updated price
    currency: 'KRW',
    interval: 'month',
    features: [
      '무제한 리드 캡처',
      '커스텀 도메인',
      '브랜딩 제거',
      '방문자 분석',
      '우선 고객 지원',
    ],
    lead_limit: -1,
    is_popular: true,
  },
  {
    id: 'prestige-yearly',
    name: 'Prestige 연간',
    plan_tier: 'prestige',
    price: 300000, // Updated price (17% discount)
    currency: 'KRW',
    interval: 'year',
    features: [
      '무제한 리드 캡처',
      '커스텀 도메인',
      '브랜딩 제거',
      '방문자 분석',
      '우선 고객 지원',
      '2개월 무료 (연 17% 할인)',
    ],
    lead_limit: -1,
    is_popular: false,
  },
];

// ============================================
// Toss Payments SDK Types
// ============================================

declare global {
  interface Window {
    TossPayments?: (clientKey: string) => {
      requestPayment: (
        method: string,
        options: TossPaymentOptions
      ) => Promise<void>;
      requestBillingAuth: (
        method: string,
        options: TossBillingOptions
      ) => Promise<void>;
    };
  }
}

interface TossPaymentOptions {
  amount: number;
  orderId: string;
  orderName: string;
  customerName?: string;
  customerEmail?: string;
  successUrl: string;
  failUrl: string;
}

interface TossBillingOptions {
  customerKey: string;
  successUrl: string;
  failUrl: string;
}

export interface DepositPaymentRequest {
  proId: string;
  proName: string;
  amount: number;
  slotStart: string;
  slotEnd: string;
  guestName: string;
  guestPhone?: string;
  guestEmail?: string;
  customerNotes?: string;
}

// ============================================
// Payment Functions
// ============================================

export async function initTossPayments(): Promise<ReturnType<NonNullable<typeof window.TossPayments>> | null> {
  if (typeof window === 'undefined') return null;

  if (!window.TossPayments) {
    await new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://js.tosspayments.com/v1/payment';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Toss Payments SDK'));
      document.head.appendChild(script);
    });
  }

  if (!window.TossPayments) {
    throw new Error('Toss Payments SDK not available');
  }

  return window.TossPayments(TOSS_CLIENT_KEY);
}

export async function requestMembershipPayment(
  planId: string,
  userId: string,
  userEmail: string,
  userName: string
): Promise<void> {
  const toss = await initTossPayments();
  if (!toss) throw new Error('Toss Payments not initialized');

  const plan = MEMBERSHIP_PLANS.find((p) => p.id === planId);
  if (!plan) throw new Error('Invalid plan');

  const orderId = `sub_${userId}_${Date.now()}`;
  const baseUrl = window.location.origin;

  await toss.requestPayment('카드', {
    amount: plan.price,
    orderId,
    orderName: `TEE:UP ${plan.name} 멤버십`,
    customerName: userName,
    customerEmail: userEmail,
    successUrl: `${baseUrl}/payment/success?planId=${planId}`,
    failUrl: `${baseUrl}/payment/fail`,
  });
}

export async function requestBillingAuth(userId: string): Promise<void> {
  const toss = await initTossPayments();
  if (!toss) throw new Error('Toss Payments not initialized');

  const baseUrl = window.location.origin;

  await toss.requestBillingAuth('카드', {
    customerKey: userId,
    successUrl: `${baseUrl}/payment/billing-success`,
    failUrl: `${baseUrl}/payment/billing-fail`,
  });
}

// ============================================
// Membership Management (Refactored)
// ============================================

/**
 * 멤버십 정보 조회
 */
export async function getMembership(userId: string): Promise<IMembership | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('memberships')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    // It's normal for a user not to have a membership, so don't log this as a critical error.
    if (error.code !== 'PGRST116') { // PGRST116: "exact-one" violation (0 or more than 1 rows)
        console.error('Error fetching membership:', error);
    }
    return null;
  }

  return data;
}

/**
 * 멤버십 생성/업데이트
 */
export async function createOrUpdateMembership(
  userId: string,
  oldTier: OldSubscriptionTier, // 'basic' | 'pro' from old system
  billingKey: string,
  customerKey: string,
  interval: 'month' | 'year'
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  // Map old tier to new plan_tier
  const planTier: MembershipPlanTier = oldTier === 'pro' ? 'prestige' : 'free';

  const now = new Date();
  const periodEnd = new Date(now);
  if (interval === 'month') {
    periodEnd.setMonth(periodEnd.getMonth() + 1);
  } else {
    periodEnd.setFullYear(periodEnd.getFullYear() + 1);
  }

  const membershipData = {
    plan_tier: planTier,
    status: 'active' as MembershipStatus,
    current_period_start: now.toISOString(),
    current_period_end: periodEnd.toISOString(),
    billing_key: billingKey,
    customer_key: customerKey,
    updated_at: now.toISOString(),
  };

  const { data: existingMembership } = await supabase
    .from('memberships')
    .select('id')
    .eq('user_id', userId)
    .single();

  if (existingMembership) {
    // Update
    const { error } = await supabase
      .from('memberships')
      .update(membershipData)
      .eq('id', existingMembership.id);

    if (error) return { success: false, error: error.message };
  } else {
    // Create
    const { error } = await supabase.from('memberships').insert({
      user_id: userId,
      ...membershipData,
    });

    if (error) return { success: false, error: error.message };
  }

  // 프로 프로필 구독 티어 업데이트 (호환성을 위해 oldTier 사용)
  await supabase
    .from('pro_profiles')
    .update({
      subscription_tier: oldTier,
      subscription_expires_at: periodEnd.toISOString(),
    })
    .eq('user_id', userId);

  return { success: true };
}

/**
 * 멤버십 다음 결제 주기에 취소
 */
export async function cancelMembership(
  userId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  const { error } = await supabase
    .from('memberships')
    .update({
      cancel_at_period_end: true,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
    .eq('status', 'active');

  if (error) return { success: false, error: error.message };

  return { success: true };
}

/**
 * 멤버십 즉시 종료
 */
export async function terminateMembership(
  userId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  const { error } = await supabase
    .from('memberships')
    .update({
      status: 'cancelled',
      cancelled_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
    .eq('status', 'active');

  if (error) return { success: false, error: error.message };

  // 프로필 구독 티어 초기화
  await supabase
    .from('pro_profiles')
    .update({
      subscription_tier: 'basic',
      subscription_expires_at: null,
    })
    .eq('user_id', userId);

  return { success: true };
}

// ============================================
// Webhook Handlers (Server-side)
// ============================================

export async function handlePaymentSuccess(
  paymentKey: string,
  orderId: string,
  amount: number
): Promise<{ success: boolean; error?: string }> {
  const response = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${Buffer.from(`${TOSS_SECRET_KEY}:`).toString('base64')}`,
    },
    body: JSON.stringify({
      paymentKey,
      orderId,
      amount,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * 월간 멤버십 갱신 처리
 */
export async function processMembershipRenewal(membershipId: string): Promise<void> {
  const supabase = createClient();

  const { data: membership } = await supabase
    .from('memberships')
    .select('*')
    .eq('id', membershipId)
    .single();

  if (!membership) return;

  if (membership.cancel_at_period_end) {
    await terminateMembership(membership.user_id);
    return;
  }

  // TODO: Toss Payments 빌링 API 호출
  // const { success } = await chargeRecurring(membership.billing_key, ...);
  // if (!success) {
  //   await supabase.from('memberships').update({ status: 'past_due' }).eq('id', membershipId);
  //   return;
  // }

  const newPeriodEnd = new Date(membership.current_period_end);
  newPeriodEnd.setMonth(newPeriodEnd.getMonth() + 1);

  await supabase
    .from('memberships')
    .update({
      current_period_start: membership.current_period_end,
      current_period_end: newPeriodEnd.toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', membershipId);
}

// ============================================
// Deposit Payment (예약금 결제) - 이 부분은 변경 없음
// ============================================

export async function requestDepositPayment(
  request: DepositPaymentRequest
): Promise<{ orderId: string }> {
  const toss = await initTossPayments();
  if (!toss) throw new Error('Toss Payments not initialized');

  const orderId = `dep_${request.proId.slice(0, 8)}_${Date.now()}`;
  const baseUrl = window.location.origin;

  const bookingData = encodeURIComponent(
    JSON.stringify({
      proId: request.proId,
      slotStart: request.slotStart,
      slotEnd: request.slotEnd,
      guestName: request.guestName,
      guestPhone: request.guestPhone,
      guestEmail: request.guestEmail,
      customerNotes: request.customerNotes,
    })
  );

  await toss.requestPayment('카드', {
    amount: request.amount,
    orderId,
    orderName: `${request.proName} 프로 레슨 예약금`,
    customerName: request.guestName,
    customerEmail: request.guestEmail,
    successUrl: `${baseUrl}/booking/success?orderId=${orderId}&data=${bookingData}`,
    failUrl: `${baseUrl}/booking/fail`,
  });

  return { orderId };
}

export async function confirmDepositPayment(
  paymentKey: string,
  orderId: string,
  amount: number
): Promise<{ success: boolean; error?: string; paymentData?: Record<string, unknown> }> {
  try {
    const response = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${Buffer.from(`${TOSS_SECRET_KEY}:`).toString('base64')}`,
      },
      body: JSON.stringify({
        paymentKey,
        orderId,
        amount,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || 'Payment confirmation failed',
      };
    }

    const paymentData = await response.json();
    return { success: true, paymentData };
  } catch (err) {
    console.error('confirmDepositPayment error:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Payment confirmation failed',
    };
  }
}

export function formatKRW(amount: number): string {
  return new Intl.NumberFormat('ko-KR').format(amount);
}

// ============================================
// Refund Functions (환불) - 이 부분은 변경 없음
// ============================================

export interface RefundRequest {
  paymentKey: string;
  cancelReason: string;
  cancelAmount?: number;
  refundReceiveAccount?: {
    bank: string;
    accountNumber: string;
    holderName: string;
  };
}

export interface RefundResult {
  success: boolean;
  error?: string;
  cancels?: Array<{
    cancelAmount: number;
    cancelReason: string;
    canceledAt: string;
    transactionKey: string;
  }>;
}

export async function requestRefund(request: RefundRequest): Promise<RefundResult> {
  try {
    if (!TOSS_SECRET_KEY) {
      return { success: false, error: 'Toss Secret Key not configured' };
    }

    const body: Record<string, any> = { cancelReason: request.cancelReason };
    if (request.cancelAmount !== undefined) body.cancelAmount = request.cancelAmount;
    if (request.refundReceiveAccount) body.refundReceiveAccount = request.refundReceiveAccount;

    const response = await fetch(
      `https://api.tosspayments.com/v1/payments/${request.paymentKey}/cancel`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${Buffer.from(`${TOSS_SECRET_KEY}:`).toString('base64')}`,
        },
        body: JSON.stringify(body),
      }
    );
    const data = await response.json();
    if (!response.ok) {
      return { success: false, error: data.message || '환불 처리에 실패했습니다.' };
    }
    return { success: true, cancels: data.cancels };
  } catch (err) {
    const message = err instanceof Error ? err.message : '환불 처리 중 오류가 발생했습니다.';
    console.error('requestRefund error:', err);
    return { success: false, error: message };
  }
}

export async function getPaymentByKey(paymentKey: string): Promise<{
  success: boolean;
  error?: string;
  payment?: any;
}> {
  try {
    if (!TOSS_SECRET_KEY) {
      return { success: false, error: 'Toss Secret Key not configured' };
    }
    const response = await fetch(
      `https://api.tosspayments.com/v1/payments/${paymentKey}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Basic ${Buffer.from(`${TOSS_SECRET_KEY}:`).toString('base64')}`,
        },
      }
    );
    const data = await response.json();
    if (!response.ok) {
      return { success: false, error: data.message || '결제 정보 조회에 실패했습니다.' };
    }
    return { success: true, payment: data };
  } catch (err) {
    const message = err instanceof Error ? err.message : '결제 정보 조회 중 오류가 발생했습니다.';
    console.error('getPaymentByKey error:', err);
    return { success: false, error: message };
  }
}

export async function canRefund(
  paymentKey: string,
  refundAmount?: number
): Promise<{
  canRefund: boolean;
  reason?: string;
  balanceAmount?: number;
}> {
  const result = await getPaymentByKey(paymentKey);
  if (!result.success || !result.payment) {
    return { canRefund: false, reason: result.error || '결제 정보를 찾을 수 없습니다.' };
  }
  const { payment } = result;

  if (payment.status === 'CANCELED') {
    return { canRefund: false, reason: '이미 전액 환불된 결제입니다.', balanceAmount: 0 };
  }
  if (!['DONE', 'PARTIAL_CANCELED'].includes(payment.status)) {
    return {
      canRefund: false,
      reason: `환불 가능한 상태가 아닙니다. (현재 상태: ${payment.status})`,
      balanceAmount: payment.balanceAmount,
    };
  }
  if (refundAmount !== undefined && refundAmount > payment.balanceAmount) {
    return {
      canRefund: false,
      reason: `환불 가능 금액(${formatKRW(payment.balanceAmount)}원)을 초과했습니다.`,
      balanceAmount: payment.balanceAmount,
    };
  }
  return { canRefund: true, balanceAmount: payment.balanceAmount };
}
