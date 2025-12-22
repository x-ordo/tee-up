'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import {
  getMyStudioAffiliations,
  setPrimaryStudio,
  leaveStudio,
  type StudioAffiliation,
} from '@/actions';

// ============================================
// Studio Card Component
// ============================================

function StudioCard({
  affiliation,
  onSetPrimary,
  onLeave,
  isUpdating,
}: {
  affiliation: StudioAffiliation;
  onSetPrimary: (studioId: string) => void;
  onLeave: (studioId: string) => void;
  isUpdating: boolean;
}) {
  const studio = affiliation.studio;
  if (!studio) return null;

  return (
    <div
      className={`rounded-lg border bg-tee-surface p-6 transition-colors ${
        affiliation.is_primary
          ? 'border-tee-accent-primary ring-1 ring-tee-accent-primary'
          : 'border-tee-stone'
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Studio Logo */}
        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-tee-stone">
          {studio.logo_url ? (
            <Image
              src={studio.logo_url}
              alt={studio.name}
              fill
              className="object-cover"
              sizes="64px"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-2xl font-bold text-tee-ink-muted">
              {studio.name.charAt(0)}
            </div>
          )}
        </div>

        {/* Studio Info */}
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-tee-ink-strong">{studio.name}</h3>
                {affiliation.is_primary && (
                  <span className="rounded bg-tee-accent-primary px-2 py-0.5 text-xs text-white">
                    대표
                  </span>
                )}
                <span
                  className={`rounded px-2 py-0.5 text-xs ${
                    affiliation.role === 'owner'
                      ? 'bg-tee-accent-secondary/20 text-tee-accent-secondary'
                      : 'bg-tee-stone text-tee-ink-light'
                  }`}
                >
                  {affiliation.role === 'owner' ? '오너' : '멤버'}
                </span>
              </div>
              {studio.location && (
                <p className="mt-1 text-sm text-tee-ink-light">{studio.location}</p>
              )}
              {studio.description && (
                <p className="mt-1 line-clamp-2 text-sm text-tee-ink-muted">
                  {studio.description}
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href={`/studio/${studio.slug}`}
              className="rounded border border-tee-stone px-3 py-1.5 text-sm text-tee-ink-light hover:border-tee-ink-muted hover:text-tee-ink-strong"
            >
              페이지 보기
            </Link>

            {affiliation.role === 'owner' && (
              <Link
                href={`/dashboard/studios/${studio.id}`}
                className="rounded border border-tee-stone px-3 py-1.5 text-sm text-tee-ink-light hover:border-tee-ink-muted hover:text-tee-ink-strong"
              >
                관리
              </Link>
            )}

            {!affiliation.is_primary && (
              <button
                onClick={() => onSetPrimary(affiliation.studio_id)}
                disabled={isUpdating}
                className="rounded border border-tee-accent-primary px-3 py-1.5 text-sm text-tee-accent-primary hover:bg-tee-accent-primary/5 disabled:opacity-50"
              >
                대표로 설정
              </button>
            )}

            {affiliation.role !== 'owner' && (
              <button
                onClick={() => onLeave(affiliation.studio_id)}
                disabled={isUpdating}
                className="rounded border border-red-300 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
              >
                탈퇴
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// Main Page Component
// ============================================

export default function StudioAffiliationsPage() {
  const router = useRouter();
  const [affiliations, setAffiliations] = useState<StudioAffiliation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch affiliations
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const result = await getMyStudioAffiliations();
        if (result.success) {
          setAffiliations(result.data);
        } else {
          setError(result.error || '스튜디오 정보를 불러오는데 실패했습니다.');
        }
      } catch {
        setError('스튜디오 정보를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  // Handle set primary
  const handleSetPrimary = async (studioId: string) => {
    setIsUpdating(true);
    setError(null);

    try {
      const result = await setPrimaryStudio(studioId);
      if (result.success) {
        // Refresh affiliations
        const refreshed = await getMyStudioAffiliations();
        if (refreshed.success) {
          setAffiliations(refreshed.data);
        }
      } else {
        setError(result.error || '대표 스튜디오 설정에 실패했습니다.');
      }
    } catch {
      setError('대표 스튜디오 설정 중 오류가 발생했습니다.');
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle leave
  const handleLeave = async (studioId: string) => {
    const studio = affiliations.find((a) => a.studio_id === studioId)?.studio;
    if (!studio) return;

    if (!confirm(`정말로 "${studio.name}" 스튜디오를 탈퇴하시겠습니까?`)) {
      return;
    }

    setIsUpdating(true);
    setError(null);

    try {
      const result = await leaveStudio(studioId);
      if (result.success) {
        setAffiliations((prev) => prev.filter((a) => a.studio_id !== studioId));
      } else {
        setError(result.error || '스튜디오 탈퇴에 실패했습니다.');
      }
    } catch {
      setError('스튜디오 탈퇴 중 오류가 발생했습니다.');
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-tee-accent-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-tee-ink-strong">소속 스튜디오</h1>
          <p className="mt-1 text-sm text-tee-ink-light">
            소속된 스튜디오를 관리합니다. 대표 스튜디오는 프로필에 표시됩니다.
          </p>
        </div>
        <Button onClick={() => router.push('/dashboard/studios/new')}>
          + 스튜디오 만들기
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Affiliations List */}
      {affiliations.length === 0 ? (
        <div className="rounded-lg border border-tee-stone bg-tee-surface p-12 text-center">
          <svg
            className="mx-auto h-12 w-12 text-tee-ink-muted"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
          <p className="mt-4 text-tee-ink-light">아직 소속된 스튜디오가 없습니다.</p>
          <p className="mt-1 text-sm text-tee-ink-muted">
            새 스튜디오를 만들거나, 초대 링크를 통해 스튜디오에 가입하세요.
          </p>
          <div className="mt-4 flex justify-center gap-3">
            <Button onClick={() => router.push('/dashboard/studios/new')}>
              스튜디오 만들기
            </Button>
            <Button
              variant="secondary"
              onClick={() => router.push('/dashboard/studios/join')}
            >
              초대 링크로 가입
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {affiliations.map((affiliation) => (
            <StudioCard
              key={affiliation.id}
              affiliation={affiliation}
              onSetPrimary={handleSetPrimary}
              onLeave={handleLeave}
              isUpdating={isUpdating}
            />
          ))}
        </div>
      )}

      {/* Info Box */}
      <div className="rounded-lg border border-tee-stone bg-tee-background p-4">
        <h3 className="font-medium text-tee-ink-strong">스튜디오 소속 안내</h3>
        <ul className="mt-2 space-y-1 text-sm text-tee-ink-light">
          <li>- 여러 스튜디오에 동시에 소속될 수 있습니다.</li>
          <li>- 대표 스튜디오는 프로필 페이지에 표시됩니다.</li>
          <li>- 스튜디오 오너는 탈퇴할 수 없습니다. 소유권을 이전해야 합니다.</li>
          <li>- 스튜디오에 가입하려면 오너로부터 초대 링크를 받아야 합니다.</li>
        </ul>
      </div>
    </div>
  );
}
