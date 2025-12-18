'use client';

import { useState, useTransition } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import type { ThemeType } from '@/actions/types';
import type { PortfolioSection } from '@/actions/portfolios';
import {
  reorderPortfolioSections,
  createPortfolioSection,
  deletePortfolioSection,
  updatePortfolioSection,
} from '@/actions/portfolios';
import { DEFAULT_SECTIONS } from '@/lib/portfolio-constants';

interface SectionListProps {
  profileId: string;
  sections: PortfolioSection[];
  themeType: ThemeType;
  onSectionsChange: (sections: PortfolioSection[]) => void;
  onSectionSelect: (sectionId: string) => void;
  disabled?: boolean;
}

const SECTION_TYPE_LABELS: Record<string, string> = {
  hero: '히어로',
  gallery: '갤러리',
  stats: '통계',
  testimonials: '후기',
  contact: '연락처',
  curriculum: '커리큘럼',
  pricing: '가격표',
  faq: '자주 묻는 질문',
  instagram_feed: '인스타그램 피드',
  youtube_embed: '유튜브 영상',
  custom: '커스텀',
};

const SECTION_ICONS: Record<string, string> = {
  hero: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
  gallery: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z',
  stats: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
  testimonials: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
  contact: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  curriculum: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
  pricing: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  faq: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  instagram_feed: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z',
  youtube_embed: 'M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  custom: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
};

export default function SectionList({
  profileId,
  sections,
  themeType,
  onSectionsChange,
  onSectionSelect,
  disabled,
}: SectionListProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const handleMoveUp = (index: number) => {
    if (index === 0) return;

    const newSections = [...sections];
    [newSections[index - 1], newSections[index]] = [newSections[index], newSections[index - 1]];

    startTransition(async () => {
      const result = await reorderPortfolioSections(
        profileId,
        newSections.map((s) => s.id)
      );

      if (result.success) {
        onSectionsChange(newSections.map((s, i) => ({ ...s, display_order: i })));
      } else {
        setError(result.error);
      }
    });
  };

  const handleMoveDown = (index: number) => {
    if (index === sections.length - 1) return;

    const newSections = [...sections];
    [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];

    startTransition(async () => {
      const result = await reorderPortfolioSections(
        profileId,
        newSections.map((s) => s.id)
      );

      if (result.success) {
        onSectionsChange(newSections.map((s, i) => ({ ...s, display_order: i })));
      } else {
        setError(result.error);
      }
    });
  };

  const handleToggleVisibility = (sectionId: string, isVisible: boolean) => {
    startTransition(async () => {
      const result = await updatePortfolioSection(sectionId, { is_visible: !isVisible });

      if (result.success) {
        onSectionsChange(
          sections.map((s) =>
            s.id === sectionId ? { ...s, is_visible: !isVisible } : s
          )
        );
      } else {
        setError(result.error);
      }
    });
  };

  const handleDeleteSection = (sectionId: string) => {
    if (!confirm('이 섹션을 삭제하시겠습니까?')) return;

    startTransition(async () => {
      const result = await deletePortfolioSection(sectionId);

      if (result.success) {
        onSectionsChange(sections.filter((s) => s.id !== sectionId));
      } else {
        setError(result.error);
      }
    });
  };

  const handleAddSection = async (sectionType: string, title: string) => {
    setError(null);
    startTransition(async () => {
      const result = await createPortfolioSection({
        pro_profile_id: profileId,
        section_type: sectionType,
        title,
        content: {},
        display_order: sections.length,
      });

      if (result.success) {
        onSectionsChange([...sections, result.data]);
        setShowAddModal(false);
      } else {
        setError(result.error);
      }
    });
  };

  // Available section types not yet added
  const availableSectionTypes = DEFAULT_SECTIONS[themeType]
    .filter((def) => !sections.some((s) => s.section_type === def.section_type))
    .concat([{ section_type: 'custom', title: 'Custom' }]);

  return (
    <div className="space-y-4">
      {/* Section List */}
      <div className="space-y-2">
        {sections.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-tee-stone py-12">
            <svg
              className="h-12 w-12 text-tee-ink-muted"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <p className="mt-4 text-tee-ink-light">섹션이 없습니다.</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setShowAddModal(true)}
            >
              첫 번째 섹션 추가
            </Button>
          </div>
        ) : (
          sections.map((section, index) => (
            <div
              key={section.id}
              className={cn(
                'group flex items-center gap-3 rounded-lg border border-tee-stone bg-tee-surface p-4 transition-all',
                !section.is_visible && 'opacity-50',
                isPending && 'pointer-events-none'
              )}
            >
              {/* Move Buttons */}
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => handleMoveUp(index)}
                  disabled={index === 0 || disabled || isPending}
                  className="rounded p-1 text-tee-ink-muted hover:bg-tee-stone hover:text-tee-ink-strong disabled:cursor-not-allowed disabled:opacity-30"
                  aria-label="위로 이동"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </button>
                <button
                  onClick={() => handleMoveDown(index)}
                  disabled={index === sections.length - 1 || disabled || isPending}
                  className="rounded p-1 text-tee-ink-muted hover:bg-tee-stone hover:text-tee-ink-strong disabled:cursor-not-allowed disabled:opacity-30"
                  aria-label="아래로 이동"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

              {/* Section Icon */}
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-tee-stone/50">
                <svg
                  className="h-5 w-5 text-tee-ink-light"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d={SECTION_ICONS[section.section_type] || SECTION_ICONS.custom}
                  />
                </svg>
              </div>

              {/* Section Info */}
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-tee-ink-strong truncate">
                  {section.title || SECTION_TYPE_LABELS[section.section_type] || section.section_type}
                </h4>
                <p className="text-xs text-tee-ink-muted">
                  {SECTION_TYPE_LABELS[section.section_type] || section.section_type}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  onClick={() => handleToggleVisibility(section.id, section.is_visible)}
                  disabled={disabled || isPending}
                  className="rounded p-2 text-tee-ink-muted hover:bg-tee-stone hover:text-tee-ink-strong"
                  aria-label={section.is_visible ? '숨기기' : '보이기'}
                >
                  {section.is_visible ? (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  )}
                </button>
                <button
                  onClick={() => onSectionSelect(section.id)}
                  disabled={disabled || isPending}
                  className="rounded p-2 text-tee-ink-muted hover:bg-tee-accent-primary/10 hover:text-tee-accent-primary"
                  aria-label="편집"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDeleteSection(section.id)}
                  disabled={disabled || isPending}
                  className="rounded p-2 text-tee-ink-muted hover:bg-tee-error/10 hover:text-tee-error"
                  aria-label="삭제"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Section Button */}
      {sections.length > 0 && (
        <Button
          variant="outline"
          className="w-full"
          onClick={() => setShowAddModal(true)}
          disabled={disabled || isPending}
        >
          <svg
            className="mr-2 h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          섹션 추가
        </Button>
      )}

      {/* Error Display */}
      {error && (
        <div className="rounded-lg border border-tee-error/20 bg-tee-error/5 p-4">
          <p className="text-sm text-tee-error">{error}</p>
        </div>
      )}

      {/* Add Section Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-md rounded-xl bg-tee-surface p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-tee-ink-strong">섹션 추가</h3>
            <p className="mt-1 text-sm text-tee-ink-light">추가할 섹션 유형을 선택하세요</p>

            <div className="mt-4 grid gap-2">
              {availableSectionTypes.map((sectionDef) => (
                <button
                  key={sectionDef.section_type}
                  onClick={() => handleAddSection(sectionDef.section_type, sectionDef.title)}
                  disabled={isPending}
                  className="flex items-center gap-3 rounded-lg border border-tee-stone p-3 text-left transition-colors hover:bg-tee-stone/50 disabled:opacity-50"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-tee-stone/50">
                    <svg
                      className="h-5 w-5 text-tee-ink-light"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d={SECTION_ICONS[sectionDef.section_type] || SECTION_ICONS.custom}
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-tee-ink-strong">
                      {SECTION_TYPE_LABELS[sectionDef.section_type] || sectionDef.title}
                    </p>
                    <p className="text-xs text-tee-ink-muted">{sectionDef.section_type}</p>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <Button variant="outline" onClick={() => setShowAddModal(false)} disabled={isPending}>
                취소
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
