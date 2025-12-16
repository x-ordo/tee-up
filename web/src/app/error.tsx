'use client';

import { useEffect } from 'react';
import { ErrorState } from '@/app/components/ErrorState';

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
      <div className="max-w-md">
        <ErrorState
          title="문제가 발생했습니다"
          description="예상치 못한 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."
          onRetry={reset}
          showHomeLink={true}
        />

        {process.env.NODE_ENV === 'development' && (
          <details className="mt-8 text-left">
            <summary className="cursor-pointer text-body-sm text-calm-charcoal hover:text-calm-obsidian">
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
