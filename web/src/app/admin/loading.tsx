import { DashboardCardSkeleton } from '@/app/components/Skeleton';

export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27] p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-2 h-8 w-48 animate-pulse rounded-lg bg-white/10" />
          <div className="h-5 w-64 animate-pulse rounded-lg bg-white/10" />
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <DashboardCardSkeleton key={i} />
          ))}
        </div>

        {/* Table Skeleton */}
        <div className="rounded-xl border border-white/10 bg-white/5">
          <div className="border-b border-white/10 p-4">
            <div className="h-6 w-32 animate-pulse rounded-lg bg-white/10" />
          </div>
          <div className="divide-y divide-white/10">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4 p-4">
                <div className="h-10 w-10 animate-pulse rounded-full bg-white/10" />
                <div className="flex-1">
                  <div className="mb-2 h-4 w-32 animate-pulse rounded bg-white/10" />
                  <div className="h-3 w-48 animate-pulse rounded bg-white/10" />
                </div>
                <div className="h-8 w-20 animate-pulse rounded-full bg-white/10" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
