'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import QuickSetupWizard, { type QuickSetupData } from '@/components/onboarding/QuickSetupWizard';
import { createQuickProfile } from '@/actions/profiles';
import { useAuth } from '@/hooks/useAuth';
import { LoadingSpinner } from '@/app/components/LoadingSpinner';

const STORAGE_KEY = 'teeup_onboarding_data';

export default function QuickSetupPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [initialData, setInitialData] = useState<Partial<QuickSetupData> | undefined>();
  const [autoSubmit, setAutoSubmit] = useState(false);

  // 로그인 후 돌아왔을 때 저장된 데이터 복원
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setInitialData(parsed);
          setAutoSubmit(true); // 자동 제출 트리거
          sessionStorage.removeItem(STORAGE_KEY);
        } catch {
          sessionStorage.removeItem(STORAGE_KEY);
        }
      }
    }
  }, [isLoading, isAuthenticated]);

  // 비로그인 상태에서 완료 시 → 데이터 저장 후 로그인 페이지로
  const handleLoginRequired = useCallback((data: QuickSetupData) => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    router.push('/auth/login?redirect=/onboarding/quick-setup&message=save');
  }, [router]);

  const handleComplete = async (data: QuickSetupData) => {
    // 로그인 안 된 상태면 저장 후 로그인 페이지로
    if (!isAuthenticated) {
      handleLoginRequired(data);
      return { success: false, error: 'login_required' };
    }

    const result = await createQuickProfile({
      name: data.name,
      bio: data.bio,
      specialty: data.specialty,
      location: data.location,
      priceRange: data.priceRange,
      contactType: data.contactType,
      contactValue: data.contactValue,
    });

    return result;
  };

  if (isLoading) {
    return <LoadingSpinner message="로딩 중..." />;
  }

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-tee-background to-white flex flex-col">
      {/* 미니멀 모바일 헤더 */}
      <header className="flex-shrink-0 px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-display text-lg font-bold text-tee-ink-strong">
          TEE<span className="text-tee-accent-primary">:</span>UP
        </Link>
        <span className="text-xs text-tee-ink-muted bg-tee-accent-primary/10 px-2 py-1 rounded-full">
          3분이면 끝!
        </span>
      </header>

      {/* 메인 콘텐츠 - 풀스크린 */}
      <main className="flex-1 px-4 pb-4 flex flex-col">
        {/* 타이틀 - 모바일에서 간결하게 */}
        <div className="text-center mb-4">
          <h1 className="text-xl font-bold text-tee-ink-strong">
            내 프로필 만들기
          </h1>
          <p className="text-sm text-tee-ink-light mt-1">
            링크 하나로 레슨 문의 받기 ✨
          </p>
        </div>

        {/* 위자드 - flex-1로 공간 채우기 */}
        <div className="flex-1 flex flex-col">
          <QuickSetupWizard
            onComplete={handleComplete}
            initialData={initialData}
            autoSubmit={autoSubmit}
            isAuthenticated={isAuthenticated}
          />
        </div>
      </main>
    </div>
  );
}
