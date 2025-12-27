'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import VisualOnboarding, { type OnboardingData } from '@/components/onboarding/VisualOnboarding';
import { createQuickProfile } from '@/actions/profiles';
import { useAuth } from '@/hooks/useAuth';
import { LoadingSpinner } from '@/app/components/LoadingSpinner';

const STORAGE_KEY = 'teeup_onboarding_data';

export default function QuickSetupPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [initialData, setInitialData] = useState<Partial<OnboardingData> | undefined>();
  const [autoSubmit, setAutoSubmit] = useState(false);

  // 로그인 후 돌아왔을 때 저장된 데이터 복원
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setInitialData(parsed);
          setAutoSubmit(true);
          sessionStorage.removeItem(STORAGE_KEY);
        } catch {
          sessionStorage.removeItem(STORAGE_KEY);
        }
      }
    }
  }, [isLoading, isAuthenticated]);

  // 비로그인 상태에서 완료 시 → 데이터 저장 후 로그인 페이지로
  const handleLoginRequired = useCallback((data: OnboardingData) => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    router.push('/auth/login?redirect=/onboarding/quick-setup&message=save');
  }, [router]);

  const handleComplete = async (data: OnboardingData) => {
    if (!isAuthenticated) {
      handleLoginRequired(data);
      return { success: false, error: 'login_required' };
    }

    const result = await createQuickProfile({
      name: data.name,
      specialty: data.specialty,
      priceRange: data.priceRange,
      contactType: data.contactType,
      contactValue: data.contactValue,
      profileImageUrl: data.profileImageUrl,
    });

    return result;
  };

  if (isLoading) {
    return <LoadingSpinner message="로딩 중..." />;
  }

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-tee-background to-white flex flex-col">
      {/* 미니멀 헤더 - 절대 위치로 오버레이 */}
      <header className="absolute top-0 left-0 right-0 z-10 px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-display text-lg font-bold text-tee-ink-strong">
          TEE<span className="text-tee-accent-primary">:</span>UP
        </Link>
      </header>

      {/* 풀스크린 온보딩 */}
      <VisualOnboarding
        onComplete={handleComplete}
        initialData={initialData}
        autoSubmit={autoSubmit}
        isAuthenticated={isAuthenticated}
        userId={user?.id}
      />
    </div>
  );
}
