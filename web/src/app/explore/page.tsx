import { Suspense } from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import {
  getFilteredProfiles,
  getExploreFilterOptions,
  type ExploreFilters,
} from '@/actions/profiles';
import ExploreFiltersBar from './components/ExploreFiltersBar';
import ProCard from './components/ProCard';
import LoadMoreButton from './components/LoadMoreButton';

export const metadata: Metadata = {
  title: '프로 찾기 | TEE:UP',
  description:
    '검증된 골프 프로를 찾아보세요. 지역, 전문분야별로 필터링하고 나에게 맞는 프로를 선택하세요.',
  openGraph: {
    title: '프로 찾기 | TEE:UP',
    description: '검증된 골프 프로를 찾아보세요.',
    type: 'website',
  },
};

export const dynamic = 'force-dynamic';

type SearchParams = {
  region?: string;
  specialty?: string;
  search?: string;
  sort?: string;
  page?: string;
};

function buildFilters(searchParams: SearchParams): ExploreFilters {
  return {
    region: searchParams.region || undefined,
    specialty: searchParams.specialty || undefined,
    search: searchParams.search || undefined,
    sortBy: (searchParams.sort as ExploreFilters['sortBy']) || 'recommended',
    page: searchParams.page ? parseInt(searchParams.page, 10) : 1,
    limit: 12,
  };
}

function getSeoTitle(searchParams: SearchParams): string {
  const parts: string[] = [];

  if (searchParams.region) {
    const REGION_LABELS: Record<string, string> = {
      seoul: '서울',
      gyeonggi: '경기',
      incheon: '인천',
      busan: '부산',
      daegu: '대구',
      gwangju: '광주',
      daejeon: '대전',
      ulsan: '울산',
      sejong: '세종',
      gangwon: '강원',
      chungbuk: '충북',
      chungnam: '충남',
      jeonbuk: '전북',
      jeonnam: '전남',
      gyeongbuk: '경북',
      gyeongnam: '경남',
      jeju: '제주',
      overseas: '해외',
    };
    parts.push(REGION_LABELS[searchParams.region] || searchParams.region);
  }

  if (searchParams.specialty) {
    parts.push(searchParams.specialty);
  }

  if (searchParams.search) {
    parts.push(`"${searchParams.search}"`);
  }

  if (parts.length === 0) {
    return '전체 프로';
  }

  return `${parts.join(' · ')} 프로`;
}

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const resolvedParams = await searchParams;
  const filters = buildFilters(resolvedParams);
  const [profilesResult, filterOptionsResult] = await Promise.all([
    getFilteredProfiles(filters),
    getExploreFilterOptions(),
  ]);

  const profiles = profilesResult.success ? profilesResult.data.profiles : [];
  const total = profilesResult.success ? profilesResult.data.total : 0;
  const hasMore = profilesResult.success ? profilesResult.data.hasMore : false;

  const filterOptions = filterOptionsResult.success
    ? filterOptionsResult.data
    : { regions: [], specialties: [] };

  const seoTitle = getSeoTitle(resolvedParams);

  return (
    <div className="min-h-screen bg-tee-background">
      {/* Hero Section */}
      <section className="relative border-b border-tee-stone/40 bg-gradient-to-b from-white to-tee-background">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-tee-stone bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-tee-ink-muted">
              Verified Pro Directory
            </span>
            <h1 className="mt-4 text-3xl font-semibold text-tee-ink-strong md:text-4xl">
              {seoTitle}
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-tee-ink-light">
              검증된 골프 프로를 찾아보세요. 지역, 전문분야별로 필터링하고
              나에게 맞는 프로를 선택하세요.
            </p>

            {/* Quick Stats */}
            <div className="mt-6 flex justify-center gap-8 text-sm">
              <div className="text-center">
                <span className="text-2xl font-bold text-tee-accent-secondary">
                  {total}
                </span>
                <p className="text-tee-ink-muted">명의 프로</p>
              </div>
              <div className="text-center">
                <span className="text-2xl font-bold text-tee-accent-secondary">
                  100%
                </span>
                <p className="text-tee-ink-muted">인증 완료</p>
              </div>
              <div className="text-center">
                <span className="text-2xl font-bold text-tee-accent-secondary">
                  24h
                </span>
                <p className="text-tee-ink-muted">평균 응답</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <Suspense fallback={<div className="h-16 animate-pulse bg-white" />}>
        <ExploreFiltersBar
          regions={filterOptions.regions}
          specialties={filterOptions.specialties}
          currentFilters={resolvedParams}
        />
      </Suspense>

      {/* Results */}
      <section className="mx-auto max-w-6xl px-6 py-8">
        {/* Results Header */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-tee-ink-muted">
            {total > 0 ? (
              <>
                <span className="font-semibold text-tee-ink-strong">{total}</span>
                명의 프로를 찾았습니다
              </>
            ) : (
              '검색 결과가 없습니다'
            )}
          </p>

          {/* CTA for quiz */}
          <Link
            href="/quiz"
            className="hidden items-center gap-2 rounded-full bg-tee-accent-primary px-4 py-2 text-xs font-semibold text-white transition-transform hover:scale-105 md:inline-flex"
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
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
            맞춤 프로 추천받기
          </Link>
        </div>

        {/* Profile Grid */}
        {profiles.length > 0 ? (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {profiles.map((profile) => (
                <ProCard key={profile.id} profile={profile} />
              ))}
            </div>

            {/* Load More */}
            {hasMore && (
              <div className="mt-10 text-center">
                <LoadMoreButton
                  currentPage={filters.page || 1}
                  searchParams={resolvedParams}
                />
              </div>
            )}
          </>
        ) : (
          <div className="py-20 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-tee-stone/50">
              <svg
                className="h-8 w-8 text-tee-ink-muted"
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
            <h3 className="text-lg font-semibold text-tee-ink-strong">
              조건에 맞는 프로가 없습니다
            </h3>
            <p className="mt-2 text-sm text-tee-ink-muted">
              다른 조건으로 다시 검색해보세요
            </p>
            <Link
              href="/explore"
              className="mt-4 inline-flex items-center gap-2 rounded-full border border-tee-accent-primary px-4 py-2 text-sm font-semibold text-tee-accent-primary transition-colors hover:bg-tee-accent-primary/10"
            >
              전체 프로 보기
            </Link>
          </div>
        )}
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-tee-stone/40 bg-white py-12">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h2 className="text-2xl font-semibold text-tee-ink-strong">
            아직 결정이 어려우신가요?
          </h2>
          <p className="mt-3 text-tee-ink-light">
            5문항 퀴즈로 나에게 딱 맞는 프로를 추천받으세요.
          </p>
          <Link
            href="/quiz"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-tee-accent-secondary px-8 py-3 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-105"
          >
            무료 맞춤 매칭 시작하기
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
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
