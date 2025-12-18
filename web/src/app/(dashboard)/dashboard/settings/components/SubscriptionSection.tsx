'use client';

import { Button } from '@/components/ui/Button';
import type { SettingsProfile } from '../SettingsClient';

interface SubscriptionSectionProps {
  profile: SettingsProfile;
}

const TIER_INFO = {
  free: {
    name: 'Free',
    price: '무료',
    leads: '3개/월',
    features: ['기본 포트폴리오', '월 3개 리드', '기본 템플릿'],
  },
  basic: {
    name: 'Basic',
    price: '₩19,900/월',
    leads: '10개/월',
    features: ['모든 템플릿', '월 10개 리드', '커스텀 도메인', '분석 대시보드'],
  },
  pro: {
    name: 'Pro',
    price: '₩49,900/월',
    leads: '무제한',
    features: ['모든 Basic 기능', '무제한 리드', '우선 지원', '고급 분석', 'API 액세스'],
  },
};

export default function SubscriptionSection({ profile }: SubscriptionSectionProps) {
  const currentTier = TIER_INFO[profile.subscription_tier];

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <div className="rounded-lg border border-tee-accent-primary/30 bg-tee-accent-primary/5 p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-tee-ink-light">현재 요금제</p>
            <h3 className="mt-1 text-2xl font-bold text-tee-accent-primary">
              {currentTier.name}
            </h3>
            <p className="mt-1 text-sm text-tee-ink-light">{currentTier.price}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-tee-ink-light">월 리드 한도</p>
            <p className="mt-1 text-lg font-semibold text-tee-ink-strong">
              {currentTier.leads}
            </p>
          </div>
        </div>

        <ul className="mt-4 space-y-2">
          {currentTier.features.map((feature) => (
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
      {profile.subscription_tier !== 'pro' && (
        <div className="space-y-4">
          <h4 className="font-medium text-tee-ink-strong">업그레이드</h4>

          <div className="grid gap-4 md:grid-cols-2">
            {profile.subscription_tier === 'free' && (
              <div className="rounded-lg border border-tee-stone p-4">
                <h5 className="font-medium text-tee-ink-strong">Basic</h5>
                <p className="mt-1 text-2xl font-bold text-tee-ink-strong">₩19,900<span className="text-sm font-normal text-tee-ink-light">/월</span></p>
                <ul className="mt-4 space-y-2">
                  {TIER_INFO.basic.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-xs text-tee-ink-light">
                      <svg className="h-3 w-3 text-tee-accent-primary" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button className="mt-4 w-full" variant="outline">
                  Basic으로 업그레이드
                </Button>
              </div>
            )}

            <div className="rounded-lg border-2 border-tee-accent-primary p-4">
              <div className="flex items-center gap-2">
                <h5 className="font-medium text-tee-ink-strong">Pro</h5>
                <span className="rounded-full bg-tee-accent-primary px-2 py-0.5 text-xs text-white">
                  추천
                </span>
              </div>
              <p className="mt-1 text-2xl font-bold text-tee-ink-strong">₩49,900<span className="text-sm font-normal text-tee-ink-light">/월</span></p>
              <ul className="mt-4 space-y-2">
                {TIER_INFO.pro.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-xs text-tee-ink-light">
                    <svg className="h-3 w-3 text-tee-accent-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <Button className="mt-4 w-full">
                Pro로 업그레이드
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Billing Info */}
      <div className="rounded-lg bg-tee-stone/30 p-4">
        <h4 className="text-sm font-medium text-tee-ink-strong">결제 정보</h4>
        <p className="mt-2 text-sm text-tee-ink-light">
          {profile.subscription_tier === 'free'
            ? '현재 무료 요금제를 사용 중입니다. 업그레이드하여 더 많은 기능을 사용해보세요.'
            : '결제 관련 문의는 support@teeup.kr로 연락해주세요.'}
        </p>
      </div>
    </div>
  );
}
