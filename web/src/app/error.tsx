'use client';

import { useEffect } from 'react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // 에러 로깅 서비스로 전송 (Sentry 등)
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-calm-white px-6">
      <div className="max-w-md text-center">
        {/* 아이콘 */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-error-bg">
          <svg className="h-10 w-10 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        <h1 className="mb-4 text-display-sm font-semibold text-calm-obsidian">
          문제가 발생했습니다
        </h1>
        <p className="mb-8 text-body-md text-calm-charcoal">
          예상치 못한 오류가 발생했습니다.
          <br />
          잠시 후 다시 시도해 주세요.
        </p>

        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <button
            onClick={reset}
            className="btn-primary"
          >
            다시 시도
          </button>
          <a
            href="/"
            className="btn-secondary"
          >
            홈으로 이동
          </a>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <details className="mt-8 text-left">
            <summary className="cursor-pointer text-body-sm text-calm-ash hover:text-calm-charcoal">
              오류 상세 정보 (개발 모드)
            </summary>
            <pre className="mt-4 overflow-auto rounded-xl border border-error bg-error-bg p-4 text-body-xs text-error">
              {error.message}
              {error.stack && `\n\n${error.stack}`}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}
