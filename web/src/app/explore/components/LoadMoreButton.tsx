'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

type LoadMoreButtonProps = {
  currentPage: number;
  searchParams: Record<string, string | undefined>;
};

export default function LoadMoreButton({
  currentPage,
  searchParams,
}: LoadMoreButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleLoadMore = () => {
    const params = new URLSearchParams();

    // Preserve existing filters
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value && key !== 'page') {
        params.set(key, value);
      }
    });

    // Set next page
    params.set('page', String(currentPage + 1));

    startTransition(() => {
      router.push(`/explore?${params.toString()}`, { scroll: false });
    });
  };

  return (
    <button
      onClick={handleLoadMore}
      disabled={isPending}
      className="inline-flex items-center gap-2 rounded-full border-2 border-tee-accent-primary px-8 py-3 text-sm font-semibold text-tee-accent-primary transition-colors hover:bg-tee-accent-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isPending ? (
        <>
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          불러오는 중...
        </>
      ) : (
        <>
          더 보기
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
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </>
      )}
    </button>
  );
}
