'use client';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <html lang="ko">
      <body className="bg-[#0a0e27]">
        <div className="flex min-h-screen items-center justify-center px-6">
          <div className="max-w-md text-center">
            <div className="mb-6 text-6xl">🚨</div>
            <h1 className="mb-4 text-2xl font-bold text-white">
              심각한 오류가 발생했습니다
            </h1>
            <p className="mb-8 text-white/60">
              페이지를 불러오는 중 문제가 발생했습니다.
              <br />
              페이지를 새로고침하거나 잠시 후 다시 시도해 주세요.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                onClick={reset}
                className="rounded-full bg-[#d4af37] px-8 py-3 font-semibold text-[#0a0e27] transition-opacity hover:opacity-90"
              >
                다시 시도
              </button>
              <a
                href="/"
                className="rounded-full border border-white/30 px-8 py-3 font-semibold text-white transition-colors hover:border-white/50"
              >
                홈으로 이동
              </a>
            </div>

            {process.env.NODE_ENV === 'development' && (
              <div className="mt-8 text-left">
                <p className="mb-2 text-sm text-white/40">오류 정보:</p>
                <pre className="overflow-auto rounded-lg bg-white/5 p-4 text-xs text-red-400">
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
