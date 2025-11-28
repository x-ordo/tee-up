import { ProDirectorySkeleton, Skeleton } from '@/app/components/Skeleton';

export default function ProfileLoading() {
  return (
    <div className="min-h-screen bg-calm-white px-6 py-24">
      <div className="mx-auto max-w-7xl">
        {/* Header Skeleton */}
        <div className="mb-12 text-center">
          <Skeleton className="mx-auto mb-4 h-10 w-64" />
          <Skeleton className="mx-auto h-5 w-96" />
        </div>

        {/* Search & Filter Skeleton */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row">
          <Skeleton className="h-12 flex-1 rounded-xl" />
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-10 w-20 rounded-full" />
            ))}
          </div>
        </div>

        {/* Grid Skeleton */}
        <ProDirectorySkeleton />
      </div>
    </div>
  );
}
