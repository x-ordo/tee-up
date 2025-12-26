'use client';

import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  'aria-label'?: string;
}

export function Skeleton({ className, 'aria-label': ariaLabel = '로딩 중' }: SkeletonProps) {
  return (
    <div
      className={cn(
        'skeleton',
        className
      )}
      role="status"
      aria-label={ariaLabel}
    />
  );
}

// T038: SkeletonCard variant
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div
      className={cn('rounded-2xl bg-tee-surface shadow-card overflow-hidden', className)}
      role="status"
      aria-busy="true"
      aria-live="polite"
      aria-label="카드 로딩 중"
    >
      <Skeleton className="h-48 w-full rounded-none" aria-label="이미지 로딩 중" />
      <div className="p-6 space-y-3">
        <Skeleton className="h-4 w-2/3" aria-label="제목 로딩 중" />
        <Skeleton className="h-3 w-full" aria-label="설명 로딩 중" />
        <Skeleton className="h-3 w-4/5" aria-label="설명 로딩 중" />
      </div>
    </div>
  );
}

// T039: SkeletonText variant
interface SkeletonTextProps {
  lines?: number;
  className?: string;
}

export function SkeletonText({ lines = 3, className }: SkeletonTextProps) {
  return (
    <div
      className={cn('space-y-2', className)}
      role="status"
      aria-busy="true"
      aria-live="polite"
      aria-label="텍스트 로딩 중"
    >
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn('h-4', i === lines - 1 ? 'w-3/4' : 'w-full')}
          aria-label={`텍스트 줄 ${i + 1} 로딩 중`}
        />
      ))}
    </div>
  );
}

// T040: SkeletonAvatar variant
interface SkeletonAvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function SkeletonAvatar({ size = 'md', className }: SkeletonAvatarProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-16 w-16',
    xl: 'h-24 w-24',
  };

  return (
    <Skeleton
      className={cn('rounded-full', sizeClasses[size], className)}
      aria-label="프로필 이미지 로딩 중"
    />
  );
}

// 프로 카드 스켈레톤
export function ProCardSkeleton() {
  return (
    <div className="rounded-2xl bg-tee-surface shadow-card overflow-hidden">
      {/* Image placeholder */}
      <Skeleton className="h-64 w-full rounded-none" />

      {/* Content */}
      <div className="p-6">
        {/* Role & City */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>

        {/* Name */}
        <Skeleton className="h-8 w-40" />

        {/* Tags */}
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-14 rounded-full" />
        </div>

        {/* Rate & CTA */}
        <div className="flex items-center justify-between border-t border-tee-stone pt-4">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-10 w-24 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

// 프로 프로필 상세 스켈레톤
export function ProProfileSkeleton() {
  return (
    <div className="min-h-screen bg-tee-background">
      {/* Hero */}
      <div className="relative h-96 w-full">
        <Skeleton className="h-full w-full rounded-none" />
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-6 py-12">
        {/* Avatar & Name */}
        <div className="-mt-20 mb-8 flex items-end gap-6">
          <Skeleton className="h-32 w-32 rounded-full border-4 border-tee-background" />
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
            <div key={i} className="rounded-2xl bg-tee-surface shadow-card p-6">
              <Skeleton className="mb-2 h-8 w-16" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>

        {/* CTA */}
        <Skeleton className="h-14 w-full rounded-xl" />
      </div>
    </div>
  );
}

// 테이블 행 스켈레톤
export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <tr className="table-row">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="table-cell">
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
    <div className="divide-y divide-tee-stone">
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
    <div className="rounded-2xl bg-tee-surface shadow-card p-6">
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
