'use client';

import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-white/10',
        className
      )}
    />
  );
}

// 프로 카드 스켈레톤
export function ProCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-6">
      {/* Avatar */}
      <div className="mb-4 flex items-center gap-4">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div className="flex-1">
          <Skeleton className="mb-2 h-5 w-24" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>

      {/* Tags */}
      <div className="mb-4 flex gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-14 rounded-full" />
      </div>

      {/* Stats */}
      <div className="mb-4 grid grid-cols-3 gap-4">
        <Skeleton className="h-12 rounded-lg" />
        <Skeleton className="h-12 rounded-lg" />
        <Skeleton className="h-12 rounded-lg" />
      </div>

      {/* Button */}
      <Skeleton className="h-12 w-full rounded-full" />
    </div>
  );
}

// 프로 프로필 상세 스켈레톤
export function ProProfileSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27]">
      {/* Hero */}
      <div className="relative h-96 w-full">
        <Skeleton className="h-full w-full rounded-none" />
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-6 py-12">
        {/* Avatar & Name */}
        <div className="-mt-20 mb-8 flex items-end gap-6">
          <Skeleton className="h-32 w-32 rounded-full border-4 border-[#0a0e27]" />
          <div>
            <Skeleton className="mb-2 h-8 w-48" />
            <Skeleton className="h-5 w-32" />
          </div>
        </div>

        {/* Bio */}
        <Skeleton className="mb-2 h-4 w-full" />
        <Skeleton className="mb-2 h-4 w-full" />
        <Skeleton className="mb-8 h-4 w-3/4" />

        {/* Stats Grid */}
        <div className="mb-8 grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>

        {/* CTA */}
        <Skeleton className="h-14 w-full rounded-full" />
      </div>
    </div>
  );
}

// 테이블 행 스켈레톤
export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <tr className="border-b border-white/10">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="px-4 py-4">
          <Skeleton className="h-5 w-full" />
        </td>
      ))}
    </tr>
  );
}

// 채팅 메시지 스켈레톤
export function ChatMessageSkeleton({ isOwn = false }: { isOwn?: boolean }) {
  return (
    <div className={`flex gap-3 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
      {!isOwn && <Skeleton className="h-10 w-10 rounded-full" />}
      <div className={`max-w-[70%] ${isOwn ? 'items-end' : 'items-start'}`}>
        {!isOwn && <Skeleton className="mb-1 h-3 w-16" />}
        <Skeleton className={`h-16 w-48 ${isOwn ? 'rounded-tr-sm' : 'rounded-tl-sm'} rounded-2xl`} />
        <Skeleton className="mt-1 h-3 w-12" />
      </div>
    </div>
  );
}

// 채팅 목록 스켈레톤
export function ChatListSkeleton() {
  return (
    <div className="divide-y divide-white/10">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center gap-4 p-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex-1">
            <Skeleton className="mb-2 h-4 w-24" />
            <Skeleton className="h-3 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

// 대시보드 카드 스켈레톤
export function DashboardCardSkeleton() {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-6">
      <Skeleton className="mb-4 h-4 w-20" />
      <Skeleton className="mb-2 h-8 w-24" />
      <Skeleton className="h-3 w-16" />
    </div>
  );
}

// 프로 디렉토리 그리드 스켈레톤
export function ProDirectorySkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <ProCardSkeleton key={i} />
      ))}
    </div>
  );
}
