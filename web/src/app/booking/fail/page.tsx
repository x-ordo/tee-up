'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function BookingFailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const errorCode = searchParams.get('code');
  const errorMessage = searchParams.get('message');

  // Error message mapping
  const getErrorDescription = (code: string | null): string => {
    switch (code) {
      case 'PAY_PROCESS_CANCELED':
        return '결제가 취소되었습니다.';
      case 'PAY_PROCESS_ABORTED':
        return '결제가 중단되었습니다.';
      case 'REJECT_CARD_COMPANY':
        return '카드사에서 결제를 거절했습니다.';
      case 'EXCEED_MAX_DAILY_PAYMENT_COUNT':
        return '일일 결제 한도를 초과했습니다.';
      case 'EXCEED_MAX_PAYMENT_AMOUNT':
        return '결제 금액 한도를 초과했습니다.';
      case 'INVALID_CARD_NUMBER':
        return '카드 번호가 올바르지 않습니다.';
      case 'INVALID_CARD_EXPIRATION':
        return '카드 유효기간이 올바르지 않습니다.';
      case 'INVALID_STOPPED_CARD':
        return '정지된 카드입니다.';
      case 'INVALID_CARD_LOST':
        return '분실 신고된 카드입니다.';
      default:
        return errorMessage || '결제 처리 중 오류가 발생했습니다.';
    }
  };

  return (
    <div className="min-h-screen bg-tee-background flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-tee-surface rounded-2xl shadow-lg p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
          <XCircle className="h-8 w-8 text-red-600" />
        </div>

        <h1 className="text-xl font-semibold text-tee-ink-strong mb-2">
          결제에 실패했습니다
        </h1>

        <p className="text-tee-ink-light mb-2">
          {getErrorDescription(errorCode)}
        </p>

        {errorCode && (
          <p className="text-xs text-tee-ink-muted mb-6">
            오류 코드: {errorCode}
          </p>
        )}

        <div className="space-y-3">
          <Button onClick={() => router.back()} className="w-full">
            다시 시도하기
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push('/')}
            className="w-full"
          >
            홈으로 돌아가기
          </Button>
        </div>

        <p className="text-xs text-tee-ink-muted mt-6">
          문제가 계속되면 고객센터로 문의해주세요.
        </p>
      </div>
    </div>
  );
}
