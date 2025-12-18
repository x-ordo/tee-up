/**
 * Toss Payments 결제 라이브러리
 * @description Toss Payments API를 사용한 결제 및 구독 관리
 */

import { createClient } from '@/lib/supabase/client';
import type { ISubscription, ISubscriptionPlan, SubscriptionTier } from '@/types';

// ============================================
// Constants
// ============================================

export const TOSS_CLIENT_KEY = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || '';
export const TOSS_SECRET_KEY = process.env.TOSS_SECRET_KEY || '';

// 구독 플랜 정의
export const SUBSCRIPTION_PLANS: ISubscriptionPlan[] = [
  {
    id: 'basic',
    name: 'Basic',
    tier: 'basic',
    price: 0,
    currency: 'KRW',
    interval: 'month',
    features: [
      '월 3건 무료 리드',
      '기본 프로필 페이지',
      '채팅 기능',
    ],
    lead_limit: 3,
    is_popular: false,
  },
  {
    id: 'pro-monthly',
    name: 'Pro 월간',
    tier: 'pro',
    price: 99000,
    currency: 'KRW',
    interval: 'month',
    features: [
      '무제한 리드',
      '프리미엄 프로필 배지',
      '우선 노출',
      '상세 분석 대시보드',
      '우선 고객 지원',
    ],
    lead_limit: -1,
    is_popular: true,
  },
  {
    id: 'pro-yearly',
    name: 'Pro 연간',
    tier: 'pro',
    price: 990000,
    currency: 'KRW',
    interval: 'year',
    features: [
      '무제한 리드',
      '프리미엄 프로필 배지',
      '우선 노출',
      '상세 분석 대시보드',
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

/**
 * Deposit payment request options
 */
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

/**
 * Toss Payments SDK 초기화
 */
export async function initTossPayments(): Promise<ReturnType<NonNullable<typeof window.TossPayments>> | null> {
  if (typeof window === 'undefined') return null;

  // SDK 스크립트 로드
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

/**
 * 구독 결제 요청
 */
export async function requestSubscriptionPayment(
  planId: string,
  userId: string,
  userEmail: string,
  userName: string
): Promise<void> {
  const toss = await initTossPayments();
  if (!toss) throw new Error('Toss Payments not initialized');

  const plan = SUBSCRIPTION_PLANS.find((p) => p.id === planId);
  if (!plan) throw new Error('Invalid plan');

  const orderId = `sub_${userId}_${Date.now()}`;
  const baseUrl = window.location.origin;

  await toss.requestPayment('카드', {
    amount: plan.price,
    orderId,
    orderName: `TEE:UP ${plan.name} 구독`,
    customerName: userName,
    customerEmail: userEmail,
    successUrl: `${baseUrl}/payment/success?planId=${planId}`,
    failUrl: `${baseUrl}/payment/fail`,
  });
}

/**
 * 빌링키 등록 (자동 결제용)
 */
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
// Subscription Management
// ============================================

/**
 * 구독 정보 조회
 */
export async function getSubscription(userId: string): Promise<ISubscription | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .single();

  if (error || !data) return null;

  return data;
}

/**
 * 구독 생성/업데이트
 */
export async function createSubscription(
  userId: string,
  tier: SubscriptionTier,
  paymentKey: string,
  interval: 'month' | 'year'
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  const now = new Date();
  const periodEnd = new Date(now);
  if (interval === 'month') {
    periodEnd.setMonth(periodEnd.getMonth() + 1);
  } else {
    periodEnd.setFullYear(periodEnd.getFullYear() + 1);
  }

  // 기존 구독 확인
  const { data: existingSubscription } = await supabase
    .from('subscriptions')
    .select('id')
    .eq('user_id', userId)
    .single();

  if (existingSubscription) {
    // 업데이트
    const { error } = await supabase
      .from('subscriptions')
      .update({
        tier,
        status: 'active',
        current_period_start: now.toISOString(),
        current_period_end: periodEnd.toISOString(),
        payment_key: paymentKey,
        updated_at: now.toISOString(),
      })
      .eq('id', existingSubscription.id);

    if (error) return { success: false, error: error.message };
  } else {
    // 생성
    const { error } = await supabase.from('subscriptions').insert({
      user_id: userId,
      tier,
      status: 'active',
      current_period_start: now.toISOString(),
      current_period_end: periodEnd.toISOString(),
      payment_key: paymentKey,
    });

    if (error) return { success: false, error: error.message };
  }

  // 프로 프로필 구독 티어 업데이트
  await supabase
    .from('pro_profiles')
    .update({
      subscription_tier: tier,
      subscription_expires_at: periodEnd.toISOString(),
    })
    .eq('user_id', userId);

  return { success: true };
}

/**
 * 구독 취소
 */
export async function cancelSubscription(
  userId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  const { error } = await supabase
    .from('subscriptions')
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
 * 구독 즉시 종료
 */
export async function terminateSubscription(
  userId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  const { error } = await supabase
    .from('subscriptions')
    .update({
      status: 'cancelled',
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

/**
 * 결제 성공 처리
 */
export async function handlePaymentSuccess(
  paymentKey: string,
  orderId: string,
  amount: number
): Promise<{ success: boolean; error?: string }> {
  // 서버에서 Toss API로 결제 승인 요청
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
 * 월간 구독 갱신 처리
 */
export async function processSubscriptionRenewal(subscriptionId: string): Promise<void> {
  const supabase = createClient();

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('id', subscriptionId)
    .single();

  if (!subscription) return;

  // 취소 예정인 경우 종료 처리
  if (subscription.cancel_at_period_end) {
    await terminateSubscription(subscription.user_id);
    return;
  }

  // 자동 결제 진행 (빌링키 사용)
  // TODO: Toss Payments 빌링 API 호출

  // 기간 연장
  const newPeriodEnd = new Date(subscription.current_period_end);
  newPeriodEnd.setMonth(newPeriodEnd.getMonth() + 1);

  await supabase
    .from('subscriptions')
    .update({
      current_period_start: subscription.current_period_end,
      current_period_end: newPeriodEnd.toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', subscriptionId);
}

// ============================================
// Deposit Payment (예약금 결제)
// ============================================

/**
 * 예약금 결제 요청 (Toss Payments 결제창 호출)
 * @returns orderId - 결제 성공 후 콜백에서 사용
 */
export async function requestDepositPayment(
  request: DepositPaymentRequest
): Promise<{ orderId: string }> {
  const toss = await initTossPayments();
  if (!toss) throw new Error('Toss Payments not initialized');

  const orderId = `dep_${request.proId.slice(0, 8)}_${Date.now()}`;
  const baseUrl = window.location.origin;

  // URL-safe 파라미터 인코딩
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

/**
 * 예약금 결제 검증 (서버 사이드)
 * Toss API로 결제 승인 요청
 */
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

/**
 * 금액 포맷팅 (KRW)
 */
export function formatKRW(amount: number): string {
  return new Intl.NumberFormat('ko-KR').format(amount);
}
