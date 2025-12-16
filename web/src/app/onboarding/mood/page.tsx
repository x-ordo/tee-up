'use client';

import { useRouter } from 'next/navigation';
import { useState, useCallback } from 'react';
import MoodWizard from '@/components/mood/MoodWizard';
import type { OnboardingAnswers, PresetSlug } from '@/lib/theme/types';
import { saveThemeToCookie } from '@/lib/theme/apply';

export default function MoodOnboardingPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleComplete = useCallback(
    async (result: {
      selectedPreset: PresetSlug;
      answers: OnboardingAnswers;
    }) => {
      setIsSubmitting(true);
      setError(null);

      try {
        // 1. 쿠키에 테마 저장 (SSR용)
        saveThemeToCookie(result.selectedPreset, 'light');

        // 2. TODO: RPC 호출하여 DB에 저장
        // const supabase = createClient();
        // await supabase.rpc('tup_set_site_theme', {
        //   p_site_id: siteId,
        //   p_preset_slug: result.selectedPreset,
        //   p_variant: 'light',
        // });

        // 3. 온보딩 답변 저장 (분석용)
        // await supabase.from('site_theme_answers').insert({
        //   site_id: siteId,
        //   answers: result.answers,
        //   selected_preset: result.selectedPreset,
        //   completed_at: new Date().toISOString(),
        // });

        // 4. 대시보드로 이동
        router.push('/dashboard');
      } catch (err) {
        console.error('Failed to save theme:', err);
        setError('테마 저장 중 오류가 발생했습니다. 다시 시도해주세요.');
      } finally {
        setIsSubmitting(false);
      }
    },
    [router]
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex flex-col">
      {/* Header */}
      <header className="py-6 px-4">
        <div className="max-w-lg mx-auto">
          <h1 className="text-xl font-semibold text-center text-gray-900">
            TEE:UP
          </h1>
          <p className="text-sm text-center text-gray-500 mt-1">
            나만의 골프 포트폴리오
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full">
          {error && (
            <div className="max-w-lg mx-auto mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <MoodWizard
            onComplete={handleComplete}
            className={isSubmitting ? 'opacity-50 pointer-events-none' : ''}
          />

          {isSubmitting && (
            <div className="max-w-lg mx-auto mt-6 text-center">
              <div className="inline-flex items-center gap-2 text-gray-500">
                <svg
                  className="animate-spin h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                <span>스타일 적용 중...</span>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 px-4">
        <p className="text-xs text-center text-gray-400">
          60초 안에 완료됩니다
        </p>
      </footer>
    </div>
  );
}
