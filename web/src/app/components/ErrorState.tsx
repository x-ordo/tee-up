'use client';

import Link from 'next/link';

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  showHomeLink?: boolean;
  className?: string;
}

/**
 * ErrorState component for displaying error states
 *
 * @example
 * <ErrorState
 *   title="데이터를 불러올 수 없습니다"
 *   description="네트워크 연결을 확인해주세요"
 *   onRetry={() => refetch()}
 * />
 */
export function ErrorState({
  title = '오류가 발생했습니다',
  description = '예상치 못한 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
  onRetry,
  showHomeLink = true,
  className = '',
}: ErrorStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center py-16 text-center ${className}`}
      role="alert"
    >
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-tee-error/10">
        <svg
          className="h-12 w-12 text-tee-error"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>

      <h3 className="mb-2 text-xl font-semibold text-tee-ink-strong">
        {title}
      </h3>

      <p className="mb-6 max-w-md text-body text-tee-ink-light">
        {description}
      </p>

      <div className="flex flex-col gap-3 sm:flex-row">
        {onRetry && (
          <button
            onClick={onRetry}
            className="h-12 rounded-xl bg-tee-accent-primary px-6 py-3 font-medium text-white transition-colors hover:bg-tee-accent-primary-hover"
          >
            다시 시도
          </button>
        )}
        {showHomeLink && (
          <Link
            href="/"
            className="h-12 rounded-xl border border-tee-stone bg-tee-surface px-6 py-3 font-medium text-tee-ink-strong transition-colors hover:bg-tee-background"
          >
            홈으로 이동
          </Link>
        )}
      </div>
    </div>
  );
}

// Network error preset (fetch failed, timeout)
export function NetworkError({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorState
      title="연결할 수 없습니다"
      description="인터넷 연결을 확인하고 다시 시도해주세요."
      onRetry={onRetry}
      showHomeLink={false}
    />
  );
}

// Server error preset (5xx)
export function ServerError({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorState
      title="서버 오류"
      description="서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요."
      onRetry={onRetry}
    />
  );
}

// Client error preset (4xx)
export function ClientError({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorState
      title="요청을 처리할 수 없습니다"
      description="입력 내용을 확인하고 다시 시도해주세요."
      onRetry={onRetry}
      showHomeLink={true}
    />
  );
}

// Data load error preset
export function DataLoadError({
  entityName = '데이터',
  onRetry,
}: {
  entityName?: string;
  onRetry?: () => void;
}) {
  return (
    <ErrorState
      title={`${entityName}를 불러올 수 없습니다`}
      description="일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
      onRetry={onRetry}
    />
  );
}

export default ErrorState;
