'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { SUBSCRIPTION_PLANS, requestSubscriptionPayment } from '@/lib/payments';
import type { ISubscriptionPlan } from '@/types';

export default function PricingPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [billingInterval, setBillingInterval] = useState<'month' | 'year'>('month');

  const filteredPlans = SUBSCRIPTION_PLANS.filter(
    (plan) => plan.interval === billingInterval || plan.price === 0
  );

  const handleSubscribe = async (plan: ISubscriptionPlan) => {
    if (!isAuthenticated || !user) {
      router.push('/auth/login?redirect=/pricing');
      return;
    }

    if (user.role !== 'pro') {
      alert('프로 계정만 구독할 수 있습니다.');
      return;
    }

    if (plan.price === 0) {
      // Basic 플랜은 이미 기본 제공
      router.push('/dashboard');
      return;
    }

    setIsLoading(plan.id);
    try {
      await requestSubscriptionPayment(
        plan.id,
        user.id,
        user.email,
        user.full_name
      );
    } catch (error) {
      console.error('Payment error:', error);
      alert('결제 처리 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-tee-background">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b border-tee-stone bg-tee-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/" className="font-display text-2xl font-bold text-tee-ink-strong">
            TEE<span className="text-accent">:</span>UP
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="px-6 pb-16 pt-28">
        <div className="mx-auto max-w-5xl">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="mb-4 font-display text-4xl font-bold text-tee-ink-strong md:text-5xl">
              심플한 <span className="text-accent">요금제</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-tee-ink-light">
              더 많은 고객을 만나고 비즈니스를 성장시키세요.
              <br />
              성과에 맞는 요금만 지불하면 됩니다.
            </p>
          </div>

          {/* Billing Toggle */}
          <div className="mb-12 flex items-center justify-center gap-4">
            <span
              className={`text-sm font-medium ${
                billingInterval === 'month' ? 'text-tee-ink-strong' : 'text-tee-ink-muted'
              }`}
            >
              월간 결제
            </span>
            <button
              onClick={() =>
                setBillingInterval((prev) =>
                  prev === 'month' ? 'year' : 'month'
                )
              }
              role="switch"
              aria-checked={billingInterval === 'year'}
              aria-label={`결제 주기 전환 (현재: ${billingInterval === 'year' ? '연간' : '월간'})`}
              className={`
                relative h-8 w-14 rounded-full transition-colors focus:outline-none focus:ring-4 focus:ring-accent-light
                ${billingInterval === 'year' ? 'bg-accent' : 'bg-tee-stone'}
              `}
            >
              <span
                className={`
                  absolute top-1 h-6 w-6 rounded-full bg-white shadow-md transition-transform
                  ${billingInterval === 'year' ? 'translate-x-7' : 'translate-x-1'}
                `}
              />
            </button>
            <span
              className={`flex items-center gap-2 text-sm font-medium ${
                billingInterval === 'year' ? 'text-tee-ink-strong' : 'text-tee-ink-muted'
              }`}
            >
              연간 결제
              <span className="tag-success">
                17% 할인
              </span>
            </span>
          </div>

          {/* Pricing Cards */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredPlans.map((plan) => (
              <div
                key={plan.id}
                className={`
                  card relative overflow-hidden p-8
                  ${
                    plan.is_popular
                      ? 'border-2 border-accent'
                      : ''
                  }
                `}
              >
                {/* Popular Badge */}
                {plan.is_popular && (
                  <div className="absolute -right-12 top-6 rotate-45 bg-accent px-12 py-1 text-xs font-bold text-white">
                    인기
                  </div>
                )}

                {/* Plan Info */}
                <div className="mb-6">
                  <h3 className="mb-2 text-xl font-bold text-tee-ink-strong">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline gap-1">
                    <span className="font-mono text-4xl font-bold text-tee-ink-strong">
                      {plan.price === 0
                        ? '무료'
                        : `₩${plan.price.toLocaleString()}`}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-tee-ink-muted">
                        /{plan.interval === 'month' ? '월' : '년'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Features */}
                <ul className="mb-8 space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <svg
                        className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent"
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
                      <span className="text-sm text-tee-ink-light">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  onClick={() => handleSubscribe(plan)}
                  disabled={isLoading === plan.id}
                  className={`
                    w-full rounded-xl py-3 font-semibold transition-all
                    ${
                      plan.is_popular
                        ? 'btn-primary'
                        : 'btn-secondary'
                    }
                  `}
                >
                  {isLoading === plan.id ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      처리 중...
                    </span>
                  ) : plan.price === 0 ? (
                    '현재 플랜'
                  ) : (
                    '구독하기'
                  )}
                </button>
              </div>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="mt-16">
            <h2 className="mb-8 text-center text-2xl font-bold text-tee-ink-strong">
              자주 묻는 질문
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                {
                  q: '무료 플랜에서 Pro로 업그레이드하면?',
                  a: '즉시 무제한 리드와 모든 Pro 기능을 이용할 수 있습니다. 기존 대화와 데이터는 모두 유지됩니다.',
                },
                {
                  q: '언제든지 취소할 수 있나요?',
                  a: '네, 언제든지 취소 가능합니다. 취소하면 결제 주기 끝까지 서비스를 이용할 수 있습니다.',
                },
                {
                  q: '리드 한도가 초과되면?',
                  a: '무료 플랜에서 월 3건 한도 초과 시 새로운 문의를 받을 수 없습니다. Pro로 업그레이드하면 무제한으로 이용 가능합니다.',
                },
                {
                  q: '결제 방법은 무엇인가요?',
                  a: '신용카드, 체크카드로 결제할 수 있습니다. 토스페이먼츠를 통해 안전하게 처리됩니다.',
                },
              ].map((faq, index) => (
                <div
                  key={index}
                  className="card p-6"
                >
                  <h3 className="mb-2 font-semibold text-tee-ink-strong">{faq.q}</h3>
                  <p className="text-sm text-tee-ink-light">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
