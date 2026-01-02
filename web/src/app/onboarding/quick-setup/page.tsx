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
  const [showGuide, setShowGuide] = useState(false);

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

    if (!data.profileImageUrl || !data.proVerificationFileUrl) {
      return { success: false, error: 'missing_required_fields' };
    }

    const result = await createQuickProfile({
      name: data.name,
      birthDate: data.birthDate,
      phoneNumber: data.phoneNumber,
      profileImageUrl: data.profileImageUrl,
      proVerificationFileUrl: data.proVerificationFileUrl,
      primaryRegion: data.primaryRegion,
      primaryCity: data.primaryCity,
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
        <button
          type="button"
          onClick={() => setShowGuide(true)}
          className="rounded-full border border-tee-stone bg-white/80 px-3 py-1 text-sm font-semibold text-tee-ink-strong shadow-sm backdrop-blur transition-colors hover:border-tee-accent-primary"
          aria-haspopup="dialog"
        >
          설명
        </button>
      </header>

      {/* 풀스크린 온보딩 */}
      <VisualOnboarding
        onComplete={handleComplete}
        initialData={initialData}
        autoSubmit={autoSubmit}
        isAuthenticated={isAuthenticated}
        userId={user?.id}
      />

      {showGuide && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6"
          role="dialog"
          aria-modal="true"
          aria-label="빠른 등록 안내"
          onClick={() => setShowGuide(false)}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-tee-ink-strong">빠른 등록 안내</h2>
                <p className="mt-1 text-sm text-tee-ink-muted">
                  프로필 초안을 만들기 위한 최소 정보를 입력합니다.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowGuide(false)}
                className="rounded-full border border-tee-stone px-3 py-1 text-xs font-semibold text-tee-ink-strong hover:border-tee-accent-primary"
                aria-label="설명 닫기"
              >
                닫기
              </button>
            </div>
            <ul className="mt-4 space-y-2 text-sm text-tee-ink-light">
              <li>필수 입력: 이름, 생년월일, 연락처</li>
              <li>프로 인증 서류와 프로필 사진 1장이 필요합니다.</li>
              <li>주요 활동 지역/도시는 추천 매칭에 활용됩니다.</li>
              <li>운영팀 검증 후 24시간 내 공개되며 담당 매니저가 연락드립니다.</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
