'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { calculateRefundAmount, requestRefund } from '@/actions';
import { formatKRW } from '@/lib/payments';
import { createClient } from '@/lib/supabase/client';

interface BookingDetail {
  id: string;
  start_at: string;
  end_at: string;
  status: string;
  payment_status: string;
  price_amount: number | null;
  guest_name: string | null;
  refund_requested_at: string | null;
}

export default function RefundRequestPage() {
  const router = useRouter();
  const params = useParams();
  const bookingId = params.id as string;

  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [refundAmount, setRefundAmount] = useState<number>(0);
  const [refundPercentage, setRefundPercentage] = useState<number>(0);
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadBookingAndCalculateRefund() {
      const supabase = createClient();

      // Get booking details
      const { data: bookingData, error: bookingError } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', bookingId)
        .single();

      if (bookingError || !bookingData) {
        setError('예약을 찾을 수 없습니다.');
        setIsLoading(false);
        return;
      }

      setBooking(bookingData);

      // Calculate refund amount
      const result = await calculateRefundAmount(bookingId);
      if (result.success) {
        setRefundAmount(result.data.refundAmount);
        setRefundPercentage(result.data.refundPercentage);
      }

      setIsLoading(false);
    }

    loadBookingAndCalculateRefund();
  }, [bookingId]);

  const handleSubmit = async () => {
    if (!reason.trim()) {
      setError('환불 사유를 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const result = await requestRefund({
      bookingId,
      reason: reason.trim(),
    });

    if (result.success) {
      router.push('/dashboard/bookings?refund=requested');
    } else {
      setError(result.error);
    }

    setIsSubmitting(false);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-tee-accent-primary border-t-transparent" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center">
        <p className="mb-4 text-tee-ink-light">예약을 찾을 수 없습니다.</p>
        <Button onClick={() => router.push('/dashboard/bookings')}>돌아가기</Button>
      </div>
    );
  }

  // Check if refund is already requested or completed
  if (booking.refund_requested_at) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center">
        <p className="mb-4 text-tee-ink-light">이미 환불이 요청된 예약입니다.</p>
        <Button onClick={() => router.push('/dashboard/bookings')}>돌아가기</Button>
      </div>
    );
  }

  if (booking.payment_status === 'refunded') {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center">
        <p className="mb-4 text-tee-ink-light">이미 환불이 완료된 예약입니다.</p>
        <Button onClick={() => router.push('/dashboard/bookings')}>돌아가기</Button>
      </div>
    );
  }

  const hoursUntilLesson = Math.floor(
    (new Date(booking.start_at).getTime() - Date.now()) / (1000 * 60 * 60)
  );

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </Button>
        <h1 className="text-2xl font-bold text-tee-ink-strong">환불 요청</h1>
      </div>

      {/* Booking Info */}
      <Card>
        <CardHeader>
          <CardTitle>예약 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-tee-ink-light">예약 일시</span>
            <span className="font-medium">
              {new Date(booking.start_at).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'short',
              })}{' '}
              {new Date(booking.start_at).toLocaleTimeString('ko-KR', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-tee-ink-light">결제 금액</span>
            <span className="font-medium">
              {booking.price_amount ? `${formatKRW(booking.price_amount)}원` : '-'}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Refund Policy Info */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="py-4">
          <h3 className="mb-2 font-semibold text-yellow-800">환불 정책 안내</h3>
          <ul className="space-y-1 text-sm text-yellow-700">
            <li>- 레슨 시작 24시간 전: 100% 환불</li>
            <li>- 레슨 시작 12시간 전: 50% 환불</li>
            <li>- 레슨 시작 12시간 이내: 환불 불가</li>
          </ul>
        </CardContent>
      </Card>

      {/* Refund Calculation */}
      <Card>
        <CardHeader>
          <CardTitle>환불 금액</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg bg-tee-surface p-4">
            <div>
              <p className="text-sm text-tee-ink-light">
                레슨 시작까지{' '}
                <span className="font-medium text-tee-ink-strong">
                  {hoursUntilLesson > 0 ? `${hoursUntilLesson}시간` : '시작됨'}
                </span>
              </p>
              <p className="text-sm text-tee-ink-light">
                환불 비율: <span className="font-medium">{refundPercentage}%</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-tee-accent-primary">
                {formatKRW(refundAmount)}원
              </p>
              <p className="text-sm text-tee-ink-light">예상 환불 금액</p>
            </div>
          </div>

          {refundAmount === 0 && (
            <p className="text-center text-sm text-red-600">
              레슨 시작 12시간 이내로 환불이 불가합니다.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Reason Input */}
      <Card>
        <CardHeader>
          <CardTitle>환불 사유</CardTitle>
        </CardHeader>
        <CardContent>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="환불 사유를 입력해주세요."
            className="h-32 w-full rounded-lg border border-tee-stone p-3 text-sm focus:border-tee-accent-primary focus:outline-none focus:ring-1 focus:ring-tee-accent-primary"
          />
        </CardContent>
      </Card>

      {/* Error */}
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">{error}</div>
      )}

      {/* Submit */}
      <div className="flex gap-4">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          취소
        </Button>
        <Button
          className="flex-1"
          onClick={handleSubmit}
          disabled={isSubmitting || refundAmount === 0}
        >
          {isSubmitting ? '처리 중...' : '환불 요청'}
        </Button>
      </div>
    </div>
  );
}
