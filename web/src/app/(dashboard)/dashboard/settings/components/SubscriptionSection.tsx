'use client';

import { Button } from '@/components/ui/Button';
import {
  type PlanTier,
  type LegacySubscriptionTier,
  PRICING,
  TIER_FEATURES,
  PLAN_DISPLAY,
  getFormattedPrice,
  mapLegacyTier,
} from '@/lib/billing';
import type { SettingsProfile } from '../SettingsClient';

interface SubscriptionSectionProps {
  profile: SettingsProfile;
}

/**
 * 구독 관리 섹션
 *
 * PRD v1.2 "무료 홍보 페이지 중심" 전략 기반
 * - 모든 플랜에서 리드는 무제한
 * - 가격은 편의 기능 기반
 */
export default function SubscriptionSection({ profile }: SubscriptionSectionProps) {
  // DB의 레거시 티어를 새 PlanTier로 변환
  const currentTier = mapLegacyTier(profile.subscription_tier as LegacySubscriptionTier);
  const currentPlan = PLAN_DISPLAY[currentTier];
  const currentFeatures = TIER_FEATURES[currentTier];

  // 업그레이드 가능한 플랜 목록 (현재 티어보다 상위)
  const upgradePlans: PlanTier[] = [];
  if (currentTier === 'free') {
    upgradePlans.push('pro', 'premium');
  } else if (currentTier === 'pro') {
    upgradePlans.push('premium');
  }

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <div className="rounded-lg border border-tee-accent-primary/30 bg-tee-accent-primary/5 p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-tee-ink-light">현재 요금제</p>
            <h3 className="mt-1 text-2xl font-bold text-tee-accent-primary">
              {currentPlan.nameKo}
            </h3>
            <p className="mt-1 text-sm text-tee-ink-light">
              {getFormattedPrice(currentTier, 'monthly')}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-tee-ink-light">월 리드 한도</p>
            <p className="mt-1 text-lg font-semibold text-tee-ink-strong">
              무제한
            </p>
          </div>
        </div>

        <ul className="mt-4 space-y-2">
          {currentFeatures.slice(0, 6).map((feature) => (
            <li key={feature} className="flex items-center gap-2 text-sm text-tee-ink-light">
              <svg
                className="h-4 w-4 text-tee-accent-primary"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              {feature}
            </li>
          ))}
        </ul>
      </div>

      {/* Upgrade Options */}
      {upgradePlans.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-medium text-tee-ink-strong">업그레이드</h4>

          <div className="grid gap-4 md:grid-cols-2">
            {upgradePlans.map((tier) => {
              const plan = PLAN_DISPLAY[tier];
              const features = TIER_FEATURES[tier];
              const price = PRICING[tier].monthly;
              const isPopular = plan.isPopular;

              return (
                <div
                  key={tier}
                  className={`rounded-lg p-4 ${
                    isPopular
                      ? 'border-2 border-tee-accent-primary'
                      : 'border border-tee-stone'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <h5 className="font-medium text-tee-ink-strong">{plan.nameKo}</h5>
                    {isPopular && (
                      <span className="rounded-full bg-tee-accent-primary px-2 py-0.5 text-xs text-white">
                        추천
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-2xl font-bold text-tee-ink-strong">
                    ₩{new Intl.NumberFormat('ko-KR').format(price)}
                    <span className="text-sm font-normal text-tee-ink-light">/월</span>
                  </p>
                  <p className="mt-1 text-xs text-tee-ink-muted">
                    {plan.description}
                  </p>
                  <ul className="mt-4 space-y-2">
                    {features.slice(0, 5).map((feature) => (
                      <li
                        key={feature}
                        className="flex items-center gap-2 text-xs text-tee-ink-light"
                      >
                        <svg
                          className="h-3 w-3 text-tee-accent-primary"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {feature}
                      </li>
                    ))}
                    {features.length > 5 && (
                      <li className="text-xs text-tee-ink-muted">
                        +{features.length - 5}개 기능 더보기
                      </li>
                    )}
                  </ul>
                  <Button
                    className="mt-4 w-full"
                    variant={isPopular ? 'default' : 'outline'}
                  >
                    {plan.nameKo}로 업그레이드
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Enterprise CTA */}
      {currentTier !== 'enterprise' && (
        <div className="rounded-lg border border-tee-stone bg-tee-stone/10 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h5 className="font-medium text-tee-ink-strong">Enterprise</h5>
              <p className="mt-1 text-sm text-tee-ink-light">
                아카데미 및 대형 스튜디오를 위한 맞춤 솔루션
              </p>
            </div>
            <Button variant="outline" size="sm">
              문의하기
            </Button>
          </div>
        </div>
      )}

      {/* Billing Info */}
      <div className="rounded-lg bg-tee-stone/30 p-4">
        <h4 className="text-sm font-medium text-tee-ink-strong">결제 정보</h4>
        <p className="mt-2 text-sm text-tee-ink-light">
          {currentTier === 'free'
            ? '현재 무료 요금제를 사용 중입니다. 업그레이드하여 더 많은 기능을 사용해보세요.'
            : '결제 관련 문의는 support@teeup.kr로 연락해주세요.'}
        </p>
      </div>
    </div>
  );
}
