'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { createOrUpdateMembership, FEATURE_GATED_PLANS, type OldSubscriptionTier } from '@/lib/payments';
import { LoadingSpinner } from '@/app/components/LoadingSpinner';

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated } = useAuth();

  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processPayment = async () => {
      const paymentKey = searchParams.get('paymentKey');
      const orderId = searchParams.get('orderId');
      const amount = searchParams.get('amount');
      const planId = searchParams.get('planId');
      const interval = (searchParams.get('interval') || 'month') as 'month' | 'year';

      if (!paymentKey || !orderId || !amount || !planId) {
        setError('결제 정보가 올바르지 않습니다.');
        setIsProcessing(false);
        return;
      }

      if (!isAuthenticated || !user) {
        router.push('/auth/login');
        return;
      }

      const plan = FEATURE_GATED_PLANS.find((p) => p.id === planId);
      if (!plan) {
        setError('잘못된 플랜입니다.');
        setIsProcessing(false);
        return;
      }

      try {
        // Map new tier to old tier for backward compatibility
        const oldTier: OldSubscriptionTier = plan.tier === 'premium' || plan.tier === 'pro' ? 'pro' : 'basic';

        // 구독 생성
        const result = await createOrUpdateMembership(
          user.id,
          oldTier,
          paymentKey,
          user.id, // customerKey
          interval
        );

        if (!result.success) {
          setError(result.error || '구독 생성에 실패했습니다.');
        }
      } catch (err) {
        console.error('Subscription error:', err);
        setError('처리 중 오류가 발생했습니다.');
      } finally {
        setIsProcessing(false);
      }
    };

    processPayment();
  }, [searchParams, isAuthenticated, user, router]);

  if (isProcessing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-tee-background">
        <div className="text-center">
          <div className="mx-auto mb-6 h-16 w-16 animate-spin rounded-full border-4 border-tee-accent-primary border-t-transparent" />
          <h1 className="mb-2 text-2xl font-bold text-tee-ink-strong">결제 처리 중...</h1>
          <p className="text-tee-ink-muted">잠시만 기다려주세요.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-tee-background">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-tee-error/10">
            <svg
              className="h-10 w-10 text-tee-error"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h1 className="mb-2 text-2xl font-bold text-tee-ink-strong">결제 오류</h1>
          <p className="mb-6 text-tee-ink-light">{error}</p>
          <Link
            href="/pricing"
            className="inline-flex h-12 items-center gap-2 rounded-xl bg-tee-accent-primary px-6 py-3 font-medium text-white transition-colors hover:bg-tee-accent-primary-hover"
          >
            다시 시도
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-tee-background">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-tee-success/10">
          <svg
            className="h-10 w-10 text-tee-success"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="mb-2 text-2xl font-bold text-tee-ink-strong">구독 완료!</h1>
        <p className="mb-8 text-tee-ink-light">
          Pro 플랜이 활성화되었습니다.
          <br />
          이제 무제한 리드와 모든 프리미엄 기능을 이용할 수 있습니다.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/dashboard"
            className="h-12 rounded-xl bg-tee-accent-primary px-6 py-3 font-medium text-white transition-colors hover:bg-tee-accent-primary-hover"
          >
            대시보드로 이동
          </Link>
          <Link
            href="/chat"
            className="h-12 rounded-xl border border-tee-stone bg-tee-surface px-6 py-3 font-medium text-tee-ink-strong transition-colors hover:bg-tee-background"
          >
            메시지 확인
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<LoadingSpinner message="로딩 중..." />}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
