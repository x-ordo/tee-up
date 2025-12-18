'use client';

import { useState, useTransition } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import type { ThemeType } from '@/actions/types';
import type { PortfolioSection } from '@/actions/portfolios';
import { updatePortfolioTheme, initializeDefaultSections } from '@/actions/portfolios';
import { DEFAULT_SECTIONS } from '@/lib/portfolio-constants';

interface TemplateSelectorProps {
  profileId: string;
  currentTheme: ThemeType;
  onThemeChange: (theme: ThemeType) => void;
  onSectionsChange: (sections: PortfolioSection[]) => void;
  disabled?: boolean;
}

type TemplateOption = {
  id: ThemeType;
  name: string;
  description: string;
  features: string[];
  preview: string;
};

const templates: TemplateOption[] = [
  {
    id: 'visual',
    name: 'Visual',
    description: '이미지 중심의 매거진 스타일',
    features: ['풀스크린 히어로 이미지', '갤러리 섹션', '통계 카드', '후기 캐러셀'],
    preview: '/images/templates/visual-preview.png',
  },
  {
    id: 'curriculum',
    name: 'Curriculum',
    description: '커리큘럼과 가격 중심의 정보형',
    features: ['레슨 커리큘럼', '가격표', '자주 묻는 질문', '문의 양식'],
    preview: '/images/templates/curriculum-preview.png',
  },
  {
    id: 'social',
    name: 'Social',
    description: 'SNS 연동 중심의 소셜 스타일',
    features: ['인스타그램 피드', '유튜브 영상', '실시간 후기', 'SNS 링크'],
    preview: '/images/templates/social-preview.png',
  },
];

export default function TemplateSelector({
  profileId,
  currentTheme,
  onThemeChange,
  onSectionsChange,
  disabled,
}: TemplateSelectorProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState<ThemeType | null>(null);

  const handleTemplateSelect = (theme: ThemeType) => {
    if (theme === currentTheme) return;
    setShowConfirm(theme);
  };

  const handleConfirm = async () => {
    if (!showConfirm) return;

    setError(null);
    startTransition(async () => {
      // Update theme
      const themeResult = await updatePortfolioTheme(profileId, showConfirm);
      if (!themeResult.success) {
        setError(themeResult.error);
        setShowConfirm(null);
        return;
      }

      // Initialize default sections for new theme
      const sectionsResult = await initializeDefaultSections(profileId, showConfirm);
      if (!sectionsResult.success) {
        setError(sectionsResult.error);
        setShowConfirm(null);
        return;
      }

      onThemeChange(showConfirm);
      onSectionsChange(sectionsResult.data);
      setShowConfirm(null);
    });
  };

  return (
    <div className="space-y-6">
      {/* Template Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => handleTemplateSelect(template.id)}
            disabled={disabled || isPending}
            className={cn(
              'group relative flex flex-col overflow-hidden rounded-xl border-2 text-left transition-all duration-200',
              currentTheme === template.id
                ? 'border-tee-accent-primary bg-tee-accent-primary/5 ring-2 ring-tee-accent-primary/20'
                : 'border-tee-stone hover:border-tee-ink-light/30 hover:bg-tee-surface',
              (disabled || isPending) && 'cursor-not-allowed opacity-60'
            )}
          >
            {/* Preview Image */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-tee-stone/50">
              <div className="flex h-full items-center justify-center text-tee-ink-muted">
                <svg
                  className="h-12 w-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              {currentTheme === template.id && (
                <div className="absolute right-2 top-2 rounded-full bg-tee-accent-primary p-1 text-white">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </div>

            {/* Template Info */}
            <div className="flex flex-1 flex-col p-4">
              <h3 className="text-lg font-semibold text-tee-ink-strong">
                {template.name}
              </h3>
              <p className="mt-1 text-sm text-tee-ink-light">{template.description}</p>

              <ul className="mt-3 space-y-1">
                {template.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2 text-xs text-tee-ink-muted"
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
              </ul>
            </div>
          </button>
        ))}
      </div>

      {/* Default Sections Info */}
      <div className="rounded-lg bg-tee-stone/30 p-4">
        <h4 className="text-sm font-medium text-tee-ink-strong">
          현재 템플릿: {templates.find((t) => t.id === currentTheme)?.name}
        </h4>
        <p className="mt-1 text-xs text-tee-ink-light">
          기본 섹션: {DEFAULT_SECTIONS[currentTheme].map((s) => s.title).join(' → ')}
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="rounded-lg border border-tee-error/20 bg-tee-error/5 p-4">
          <p className="text-sm text-tee-error">{error}</p>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-md rounded-xl bg-tee-surface p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-tee-ink-strong">
              템플릿을 변경하시겠습니까?
            </h3>
            <p className="mt-2 text-sm text-tee-ink-light">
              템플릿을 변경하면 기존 섹션이 새 템플릿의 기본 섹션으로 교체됩니다.
              콘텐츠 데이터는 유지되지만, 일부 섹션은 새 템플릿에서 표시되지 않을 수 있습니다.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowConfirm(null)}
                disabled={isPending}
              >
                취소
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={isPending}
              >
                {isPending ? '변경 중...' : '변경하기'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
