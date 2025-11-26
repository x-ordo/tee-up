'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { LoadingSpinner } from '@/app/components/LoadingSpinner';

function PaymentFailContent() {
  const searchParams = useSearchParams();
  const errorCode = searchParams.get('code');
  const errorMessage = searchParams.get('message');

  const getErrorMessage = () => {
    switch (errorCode) {
      case 'PAY_PROCESS_CANCELED':
        return '결제가 취소되었습니다.';
      case 'PAY_PROCESS_ABORTED':
        return '결제가 중단되었습니다.';
      case 'INVALID_CARD_COMPANY':
        return '지원하지 않는 카드입니다.';
      case 'EXCEED_MAX_CARD_INSTALLMENT_PLAN':
        return '할부 개월 수를 초과했습니다.';
      default:
        return errorMessage || '결제 처리 중 오류가 발생했습니다.';
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27]">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-500/20">
          <svg
            className="h-10 w-10 text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h1 className="mb-2 text-2xl font-bold text-white">결제 실패</h1>
        <p className="mb-8 text-white/60">{getErrorMessage()}</p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/pricing"
            className="rounded-full bg-gradient-to-r from-[#d4af37] to-[#f4e5c2] px-6 py-3 font-medium text-[#0a0e27] transition-all hover:shadow-[0_0_30px_rgba(212,175,55,0.4)]"
          >
            다시 시도
          </Link>
          <Link
            href="/"
            className="rounded-full border border-white/20 px-6 py-3 font-medium text-white transition-colors hover:border-[#d4af37]"
          >
            홈으로
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentFailPage() {
  return (
    <Suspense fallback={<LoadingSpinner message="로딩 중..." />}>
      <PaymentFailContent />
    </Suspense>
  );
}
