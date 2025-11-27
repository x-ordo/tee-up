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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27] px-6">
      <div className="max-w-md text-center">
        <div className="mb-6 text-6xl">⚠️</div>
        <h1 className="mb-4 text-2xl font-bold text-white">
          문제가 발생했습니다
        </h1>
        <p className="mb-8 text-white/60">
          예상치 못한 오류가 발생했습니다.
          <br />
          잠시 후 다시 시도해 주세요.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={reset}
            className="rounded-full bg-gradient-to-r from-[#d4af37] to-[#f4e5c2] px-8 py-3 font-semibold text-[#0a0e27] transition-all hover:scale-105"
          >
            다시 시도
          </button>
          <a
            href="/"
            className="rounded-full border border-white/30 px-8 py-3 font-semibold text-white transition-all hover:border-[#d4af37] hover:bg-[#d4af37]/10"
          >
            홈으로 이동
          </a>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <details className="mt-8 text-left">
            <summary className="cursor-pointer text-sm text-white/40 hover:text-white/60">
              오류 상세 정보 (개발 모드)
            </summary>
            <pre className="mt-4 overflow-auto rounded-lg bg-white/5 p-4 text-xs text-red-400">
              {error.message}
              {error.stack && `\n\n${error.stack}`}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}
