'use client';

import { useState } from 'react';
import Link from 'next/link';

type PricingTier = 'free' | 'basic' | 'pro';

const TIER_INFO: Record<
  PricingTier,
  { label: string; feeRate: number; description: string }
> = {
  free: { label: 'Free', feeRate: 0.15, description: '15% 수수료' },
  basic: { label: 'Basic', feeRate: 0.1, description: '10% 수수료' },
  pro: { label: 'Pro', feeRate: 0, description: '수수료 0%' },
};

export default function EarningsCalculator() {
  const [lessonsPerWeek, setLessonsPerWeek] = useState(5);
  const [lessonRate, setLessonRate] = useState(10);
  const [tier, setTier] = useState<PricingTier>('basic');

  const monthlyLessons = lessonsPerWeek * 4;
  const grossEarnings = monthlyLessons * lessonRate * 10000;
  const platformFee = grossEarnings * TIER_INFO[tier].feeRate;
  const netEarnings = grossEarnings - platformFee;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ko-KR').format(value);
  };

  return (
    <div className="rounded-3xl border border-tee-stone/60 bg-white p-8 shadow-card">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-tee-ink-muted">
          Earnings Calculator
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-tee-ink-strong">
          나의 예상 수익 계산하기
        </h2>
      </div>

      <div className="space-y-6">
        {/* Lessons per week */}
        <div>
          <label className="block text-sm font-medium text-tee-ink-strong">
            주당 레슨 수
          </label>
          <div className="mt-2 flex items-center gap-4">
            <input
              type="range"
              min={1}
              max={20}
              value={lessonsPerWeek}
              onChange={(e) => setLessonsPerWeek(Number(e.target.value))}
              className="h-2 flex-1 cursor-pointer appearance-none rounded-full bg-tee-stone/40 accent-tee-accent-secondary"
            />
            <span className="w-16 text-right text-lg font-semibold text-tee-accent-secondary">
              {lessonsPerWeek}회
            </span>
          </div>
        </div>

        {/* Lesson rate */}
        <div>
          <label className="block text-sm font-medium text-tee-ink-strong">
            회당 레슨비
          </label>
          <div className="mt-2 flex items-center gap-4">
            <input
              type="range"
              min={3}
              max={30}
              value={lessonRate}
              onChange={(e) => setLessonRate(Number(e.target.value))}
              className="h-2 flex-1 cursor-pointer appearance-none rounded-full bg-tee-stone/40 accent-tee-accent-secondary"
            />
            <span className="w-20 text-right text-lg font-semibold text-tee-accent-secondary">
              {lessonRate}만원
            </span>
          </div>
        </div>

        {/* Tier selection */}
        <div>
          <label className="block text-sm font-medium text-tee-ink-strong">
            요금제
          </label>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {(Object.keys(TIER_INFO) as PricingTier[]).map((tierKey) => (
              <button
                key={tierKey}
                onClick={() => setTier(tierKey)}
                className={`rounded-xl border-2 px-4 py-3 text-center transition-all ${
                  tier === tierKey
                    ? 'border-tee-accent-secondary bg-tee-accent-secondary/10'
                    : 'border-tee-stone/60 hover:border-tee-stone'
                }`}
              >
                <p
                  className={`text-sm font-semibold ${
                    tier === tierKey
                      ? 'text-tee-accent-secondary'
                      : 'text-tee-ink-strong'
                  }`}
                >
                  {TIER_INFO[tierKey].label}
                </p>
                <p className="mt-0.5 text-xs text-tee-ink-muted">
                  {TIER_INFO[tierKey].description}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="rounded-2xl border border-tee-stone/60 bg-tee-background p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-tee-ink-muted">
            예상 월 수익
          </p>

          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-tee-ink-light">총 레슨 수입</span>
              <span className="text-lg font-semibold text-tee-ink-strong">
                {formatCurrency(grossEarnings)}원
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-tee-ink-light">
                플랫폼 수수료 ({Math.round(TIER_INFO[tier].feeRate * 100)}%)
              </span>
              <span className="text-lg font-semibold text-red-500">
                -{formatCurrency(platformFee)}원
              </span>
            </div>
            <div className="border-t border-tee-stone/60 pt-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-tee-ink-strong">
                  순 수익
                </span>
                <span className="text-2xl font-bold text-tee-accent-secondary">
                  {formatCurrency(netEarnings)}원
                </span>
              </div>
            </div>
          </div>

          {tier !== 'pro' && (
            <div className="mt-4 rounded-xl bg-tee-accent-primary/5 p-4">
              <p className="text-sm text-tee-accent-primary">
                <span className="font-semibold">Pro 요금제</span>로
                업그레이드하면 수수료 0%!
                <br />
                <span className="text-tee-accent-primary/80">
                  월{' '}
                  {formatCurrency(
                    grossEarnings * TIER_INFO[tier].feeRate
                  )}
                  원 추가 수익
                </span>
              </p>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/onboarding/quick-setup"
            className="flex-1 rounded-full bg-tee-accent-secondary py-3 text-center text-sm font-semibold text-white transition-transform hover:scale-105"
          >
            지금 등록하기
          </Link>
          <Link
            href="/pricing"
            className="flex-1 rounded-full border-2 border-tee-accent-secondary py-3 text-center text-sm font-semibold text-tee-accent-secondary transition-colors hover:bg-tee-accent-secondary/10"
          >
            요금제 비교
          </Link>
        </div>
      </div>
    </div>
  );
}
