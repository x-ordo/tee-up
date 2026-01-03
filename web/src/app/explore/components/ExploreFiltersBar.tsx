'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useCallback, useTransition } from 'react';

type FilterOption = {
  value: string;
  label: string;
  count: number;
};

type ExploreFiltersBarProps = {
  regions: FilterOption[];
  specialties: FilterOption[];
  currentFilters: {
    region?: string;
    specialty?: string;
    search?: string;
    sort?: string;
  };
};

const SORT_OPTIONS = [
  { value: 'recommended', label: '추천순' },
  { value: 'rating', label: '평점순' },
  { value: 'newest', label: '최신순' },
  { value: 'popular', label: '인기순' },
];

export default function ExploreFiltersBar({
  regions,
  specialties,
  currentFilters,
}: ExploreFiltersBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [searchValue, setSearchValue] = useState(currentFilters.search || '');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const updateFilters = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }

      // Reset to page 1 when filters change
      params.delete('page');

      startTransition(() => {
        router.push(`/explore?${params.toString()}`);
      });
    },
    [router, searchParams]
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters('search', searchValue || null);
  };

  const clearAllFilters = () => {
    setSearchValue('');
    startTransition(() => {
      router.push('/explore');
    });
  };

  const hasActiveFilters = Boolean(
    currentFilters.region ||
      currentFilters.specialty ||
      currentFilters.search ||
      (currentFilters.sort && currentFilters.sort !== 'recommended')
  );

  return (
    <div className="sticky top-0 z-30 border-b border-tee-stone/40 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-6">
        {/* Search Bar */}
        <div className="py-4">
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="프로 이름, 지역, 전문분야 검색..."
                className="w-full rounded-full border border-tee-stone bg-tee-background py-3 pl-12 pr-4 text-sm text-tee-ink-strong placeholder:text-tee-ink-muted focus:border-tee-accent-primary focus:outline-none focus:ring-2 focus:ring-tee-accent-primary/20"
              />
              <svg
                className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-tee-ink-muted"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <button
              type="submit"
              disabled={isPending}
              className="rounded-full bg-tee-accent-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-tee-accent-primary-hover disabled:opacity-50"
            >
              검색
            </button>
          </form>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-hide">
          {/* Filters Toggle (Mobile) */}
          <button
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            className="flex shrink-0 items-center gap-2 rounded-full border border-tee-stone bg-white px-4 py-2 text-sm font-medium text-tee-ink-strong transition-colors hover:border-tee-accent-primary md:hidden"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            필터
            {hasActiveFilters && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-tee-accent-primary text-xs text-white">
                !
              </span>
            )}
          </button>

          {/* Desktop Filters */}
          <div className="hidden items-center gap-3 md:flex">
            {/* Region Filter */}
            <select
              value={currentFilters.region || ''}
              onChange={(e) =>
                updateFilters('region', e.target.value || null)
              }
              disabled={isPending}
              className="rounded-full border border-tee-stone bg-white px-4 py-2 text-sm text-tee-ink-strong focus:border-tee-accent-primary focus:outline-none disabled:opacity-50"
            >
              <option value="">전체 지역</option>
              {regions.map((region) => (
                <option key={region.value} value={region.value}>
                  {region.label} ({region.count})
                </option>
              ))}
            </select>

            {/* Specialty Filter */}
            <select
              value={currentFilters.specialty || ''}
              onChange={(e) =>
                updateFilters('specialty', e.target.value || null)
              }
              disabled={isPending}
              className="rounded-full border border-tee-stone bg-white px-4 py-2 text-sm text-tee-ink-strong focus:border-tee-accent-primary focus:outline-none disabled:opacity-50"
            >
              <option value="">전문분야</option>
              {specialties.slice(0, 10).map((specialty) => (
                <option key={specialty.value} value={specialty.value}>
                  {specialty.label} ({specialty.count})
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={currentFilters.sort || 'recommended'}
              onChange={(e) =>
                updateFilters(
                  'sort',
                  e.target.value === 'recommended' ? null : e.target.value
                )
              }
              disabled={isPending}
              className="rounded-full border border-tee-stone bg-white px-4 py-2 text-sm text-tee-ink-strong focus:border-tee-accent-primary focus:outline-none disabled:opacity-50"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Active Filter Tags */}
          {currentFilters.search && (
            <span className="flex shrink-0 items-center gap-1 rounded-full bg-tee-accent-primary/10 px-3 py-1.5 text-xs font-medium text-tee-accent-primary">
              &quot;{currentFilters.search}&quot;
              <button
                onClick={() => {
                  setSearchValue('');
                  updateFilters('search', null);
                }}
                className="ml-1 hover:text-tee-accent-primary-hover"
              >
                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </span>
          )}

          {/* Clear All */}
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="shrink-0 text-xs font-medium text-tee-ink-muted hover:text-tee-ink-strong"
            >
              초기화
            </button>
          )}

          {/* Loading indicator */}
          {isPending && (
            <div className="ml-auto">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-tee-accent-primary border-t-transparent" />
            </div>
          )}
        </div>

        {/* Mobile Filters Dropdown */}
        {isFiltersOpen && (
          <div className="border-t border-tee-stone/40 py-4 md:hidden">
            <div className="grid gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-tee-ink-muted">
                  지역
                </label>
                <select
                  value={currentFilters.region || ''}
                  onChange={(e) =>
                    updateFilters('region', e.target.value || null)
                  }
                  className="w-full rounded-lg border border-tee-stone bg-white px-4 py-2.5 text-sm"
                >
                  <option value="">전체 지역</option>
                  {regions.map((region) => (
                    <option key={region.value} value={region.value}>
                      {region.label} ({region.count})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-tee-ink-muted">
                  전문분야
                </label>
                <select
                  value={currentFilters.specialty || ''}
                  onChange={(e) =>
                    updateFilters('specialty', e.target.value || null)
                  }
                  className="w-full rounded-lg border border-tee-stone bg-white px-4 py-2.5 text-sm"
                >
                  <option value="">전체</option>
                  {specialties.map((specialty) => (
                    <option key={specialty.value} value={specialty.value}>
                      {specialty.label} ({specialty.count})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-tee-ink-muted">
                  정렬
                </label>
                <select
                  value={currentFilters.sort || 'recommended'}
                  onChange={(e) =>
                    updateFilters(
                      'sort',
                      e.target.value === 'recommended' ? null : e.target.value
                    )
                  }
                  className="w-full rounded-lg border border-tee-stone bg-white px-4 py-2.5 text-sm"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
