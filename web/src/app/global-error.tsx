'use client';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <html lang="ko">
      <body style={{ backgroundColor: 'var(--calm-white, #FAFAF9)' }}>
        <div className="flex min-h-screen items-center justify-center px-6">
          <div className="max-w-md text-center">
            {/* 경고 아이콘 */}
            <div
              className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full"
              style={{ backgroundColor: 'var(--calm-error-bg, #FEE2E2)' }}
            >
              <svg
                className="h-10 w-10"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                style={{ color: 'var(--calm-error, #EF4444)' }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>

            <h1
              className="mb-4 text-2xl font-semibold"
              style={{ color: 'var(--calm-obsidian, #1A1A17)' }}
            >
              심각한 오류가 발생했습니다
            </h1>
            <p
              className="mb-8 text-base"
              style={{ color: 'var(--calm-charcoal, #52524E)' }}
            >
              페이지를 불러오는 중 문제가 발생했습니다.
              <br />
              페이지를 새로고침하거나 잠시 후 다시 시도해 주세요.
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
              <div className="mt-8 text-left">
                <p
                  className="mb-2 text-sm"
                  style={{ color: 'var(--calm-ash, #78786E)' }}
                >
                  오류 정보:
                </p>
                <pre
                  className="alert-error overflow-auto rounded-xl p-4 text-xs"
                >
                  {error.message}
                </pre>
              </div>
            )}
          </div>
        </div>
      </body>
    </html>
  );
}
