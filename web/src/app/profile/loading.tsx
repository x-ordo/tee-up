import { ProDirectorySkeleton } from '@/app/components/Skeleton';

export default function ProfileLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27] px-6 py-24">
      <div className="mx-auto max-w-7xl">
        {/* Header Skeleton */}
        <div className="mb-12 text-center">
          <div className="mx-auto mb-4 h-10 w-64 animate-pulse rounded-lg bg-white/10" />
          <div className="mx-auto h-5 w-96 animate-pulse rounded-lg bg-white/10" />
        </div>

        {/* Search & Filter Skeleton */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row">
          <div className="h-12 flex-1 animate-pulse rounded-full bg-white/10" />
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-10 w-20 animate-pulse rounded-full bg-white/10" />
            ))}
          </div>
        </div>

        {/* Grid Skeleton */}
        <ProDirectorySkeleton />
      </div>
    </div>
  );
}
