'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { getDisputeLogs, processRefund, resolveDispute } from '@/actions';
import { formatKRW } from '@/lib/payments';
import { createClient } from '@/lib/supabase/client';
import type { DisputeLog, BookingWithRefund } from '@/actions/refunds';

export default function AdminDisputeDetailPage() {
  const router = useRouter();
  const params = useParams();
  const bookingId = params.id as string;

  const [booking, setBooking] = useState<BookingWithRefund | null>(null);
  const [disputeLogs, setDisputeLogs] = useState<DisputeLog[]>([]);
  const [resolution, setResolution] = useState<'resolved_pro' | 'resolved_customer'>(
    'resolved_customer'
  );
  const [notes, setNotes] = useState('');
  const [refundAmount, setRefundAmount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      const supabase = createClient();

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

      setBooking(bookingData as BookingWithRefund);
      setRefundAmount(bookingData.refund_amount || bookingData.price_amount || 0);

      // Load dispute logs
      const logsResult = await getDisputeLogs(bookingId);
      if (logsResult.success) {
        setDisputeLogs(logsResult.data);
      }

      setIsLoading(false);
    }

    loadData();
  }, [bookingId]);

  const handleProcessRefund = async () => {
    if (!booking) return;

    setIsSubmitting(true);
    setError(null);

    const result = await processRefund(bookingId, refundAmount);

    if (result.success) {
      router.push('/admin/disputes?refund=processed');
    } else {
      setError(result.error);
    }

    setIsSubmitting(false);
  };

  const handleResolveDispute = async () => {
    if (!booking || !notes.trim()) {
      setError('해결 내용을 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const result = await resolveDispute(
      bookingId,
      resolution,
      notes.trim(),
      resolution === 'resolved_customer' ? refundAmount : undefined
    );

    if (result.success) {
      router.push('/admin/disputes?dispute=resolved');
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
        <Button onClick={() => router.push('/admin/disputes')}>돌아가기</Button>
      </div>
    );
  }

  const isDisputeCase = !!booking.dispute_status;
  const isRefundCase = !!booking.refund_requested_at && !booking.refund_processed_at;
  const isResolved =
    booking.dispute_status === 'resolved_pro' ||
    booking.dispute_status === 'resolved_customer' ||
    booking.payment_status === 'refunded';

  return (
    <div className="mx-auto max-w-3xl space-y-6">
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
        <h1 className="text-2xl font-bold text-tee-ink-strong">
          {isDisputeCase ? '분쟁 상세' : '환불 요청 상세'}
        </h1>
      </div>

      {/* Booking Info */}
      <Card>
        <CardHeader>
          <CardTitle>예약 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-tee-ink-light">예약 ID</span>
            <span className="font-mono text-sm">{booking.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-tee-ink-light">예약 일시</span>
            <span className="font-medium">
              {new Date(booking.start_at).toLocaleString('ko-KR')}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-tee-ink-light">예약 상태</span>
            <span className="font-medium">{booking.status}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-tee-ink-light">결제 상태</span>
            <span className="font-medium">{booking.payment_status}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-tee-ink-light">결제 금액</span>
            <span className="font-medium">
              {booking.price_amount ? `${formatKRW(booking.price_amount)}원` : '-'}
            </span>
          </div>
          {booking.refund_amount > 0 && (
            <div className="flex justify-between">
              <span className="text-tee-ink-light">환불 요청 금액</span>
              <span className="font-medium text-purple-600">
                {formatKRW(booking.refund_amount)}원
              </span>
            </div>
          )}
          {booking.refund_reason && (
            <div className="mt-4 rounded-lg bg-tee-surface p-3">
              <p className="text-sm font-medium text-tee-ink-light">환불 사유:</p>
              <p className="mt-1 text-sm">{booking.refund_reason}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dispute Status & History */}
      {isDisputeCase && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              분쟁 상태
              <span
                className={`rounded-full px-2 py-1 text-xs font-medium ${
                  booking.dispute_status === 'opened'
                    ? 'bg-yellow-100 text-yellow-700'
                    : booking.dispute_status === 'pro_responded'
                      ? 'bg-blue-100 text-blue-700'
                      : booking.dispute_status === 'escalated'
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-green-100 text-green-700'
                }`}
              >
                {booking.dispute_status === 'opened' && '접수됨'}
                {booking.dispute_status === 'pro_responded' && '프로 응답'}
                {booking.dispute_status === 'escalated' && '에스컬레이션'}
                {booking.dispute_status === 'resolved_pro' && '프로 승'}
                {booking.dispute_status === 'resolved_customer' && '고객 승'}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {disputeLogs.map((log) => (
                <div key={log.id} className="border-l-2 border-tee-stone pl-4">
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        log.actor_role === 'customer'
                          ? 'bg-blue-100 text-blue-700'
                          : log.actor_role === 'pro'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-purple-100 text-purple-700'
                      }`}
                    >
                      {log.actor_role === 'customer' && '고객'}
                      {log.actor_role === 'pro' && '프로'}
                      {log.actor_role === 'admin' && '관리자'}
                    </span>
                    <span className="text-xs text-tee-ink-muted">
                      {new Date(log.created_at).toLocaleString('ko-KR')}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-tee-ink-light">{log.message}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resolution (if already resolved) */}
      {booking.dispute_resolution && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-800">해결 내용</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-green-700">{booking.dispute_resolution}</p>
            {booking.dispute_resolved_at && (
              <p className="mt-2 text-sm text-green-600">
                해결일: {new Date(booking.dispute_resolved_at).toLocaleString('ko-KR')}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Admin Actions */}
      {!isResolved && (
        <>
          {/* Refund Only Case */}
          {isRefundCase && !isDisputeCase && (
            <Card>
              <CardHeader>
                <CardTitle>환불 처리</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-tee-ink-light">
                    환불 금액
                  </label>
                  <input
                    type="number"
                    value={refundAmount}
                    onChange={(e) => setRefundAmount(Number(e.target.value))}
                    className="w-full rounded-lg border border-tee-stone p-2"
                    max={booking.price_amount || 0}
                  />
                </div>

                <Button onClick={handleProcessRefund} disabled={isSubmitting} className="w-full">
                  {isSubmitting ? '처리 중...' : '환불 처리'}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Dispute Case */}
          {isDisputeCase && (
            <Card>
              <CardHeader>
                <CardTitle>분쟁 해결</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-tee-ink-light">
                    결정
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="resolution"
                        checked={resolution === 'resolved_customer'}
                        onChange={() => setResolution('resolved_customer')}
                        className="text-tee-accent-primary"
                      />
                      <span className="text-sm">고객 측 해결 (환불)</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="resolution"
                        checked={resolution === 'resolved_pro'}
                        onChange={() => setResolution('resolved_pro')}
                        className="text-tee-accent-primary"
                      />
                      <span className="text-sm">프로 측 해결</span>
                    </label>
                  </div>
                </div>

                {resolution === 'resolved_customer' && (
                  <div>
                    <label className="mb-2 block text-sm font-medium text-tee-ink-light">
                      환불 금액
                    </label>
                    <input
                      type="number"
                      value={refundAmount}
                      onChange={(e) => setRefundAmount(Number(e.target.value))}
                      className="w-full rounded-lg border border-tee-stone p-2"
                      max={booking.price_amount || 0}
                    />
                  </div>
                )}

                <div>
                  <label className="mb-2 block text-sm font-medium text-tee-ink-light">
                    해결 내용
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="해결 내용을 상세히 작성해주세요."
                    className="h-32 w-full rounded-lg border border-tee-stone p-3 text-sm"
                  />
                </div>

                <Button onClick={handleResolveDispute} disabled={isSubmitting} className="w-full">
                  {isSubmitting ? '처리 중...' : '분쟁 해결'}
                </Button>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">{error}</div>
      )}

      <Button
        variant="outline"
        className="w-full"
        onClick={() => router.push('/admin/disputes')}
      >
        목록으로 돌아가기
      </Button>
    </div>
  );
}
