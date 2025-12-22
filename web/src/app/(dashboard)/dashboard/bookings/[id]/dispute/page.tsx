'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { openDispute, getDisputeLogs } from '@/actions';
import { createClient } from '@/lib/supabase/client';
import type { DisputeLog } from '@/actions/refunds';

interface BookingDetail {
  id: string;
  start_at: string;
  end_at: string;
  status: string;
  payment_status: string;
  price_amount: number | null;
  dispute_status: string | null;
  dispute_opened_at: string | null;
}

export default function DisputePage() {
  const router = useRouter();
  const params = useParams();
  const bookingId = params.id as string;

  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [disputeLogs, setDisputeLogs] = useState<DisputeLog[]>([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadBookingAndDispute() {
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

      setBooking(bookingData);

      // Load dispute logs if dispute exists
      if (bookingData.dispute_status) {
        const logsResult = await getDisputeLogs(bookingId);
        if (logsResult.success) {
          setDisputeLogs(logsResult.data);
        }
      }

      setIsLoading(false);
    }

    loadBookingAndDispute();
  }, [bookingId]);

  const handleSubmit = async () => {
    if (!message.trim()) {
      setError('분쟁 사유를 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const result = await openDispute(bookingId, message.trim());

    if (result.success) {
      router.push('/dashboard/bookings?dispute=opened');
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

  // If dispute already exists, show dispute status and history
  if (booking.dispute_status) {
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
          <h1 className="text-2xl font-bold text-tee-ink-strong">분쟁 현황</h1>
        </div>

        {/* Dispute Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              분쟁 상태
              <span className="rounded-full bg-orange-100 px-2 py-1 text-xs font-medium text-orange-700">
                {booking.dispute_status === 'opened' && '접수됨'}
                {booking.dispute_status === 'pro_responded' && '프로 응답 완료'}
                {booking.dispute_status === 'escalated' && '관리자 개입 중'}
                {booking.dispute_status === 'resolved_pro' && '프로 측 해결'}
                {booking.dispute_status === 'resolved_customer' && '고객 측 해결'}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-tee-ink-light">
              분쟁 접수일:{' '}
              {booking.dispute_opened_at
                ? new Date(booking.dispute_opened_at).toLocaleDateString('ko-KR')
                : '-'}
            </p>
          </CardContent>
        </Card>

        {/* Dispute History */}
        <Card>
          <CardHeader>
            <CardTitle>분쟁 진행 내역</CardTitle>
          </CardHeader>
          <CardContent>
            {disputeLogs.length === 0 ? (
              <p className="text-sm text-tee-ink-light">진행 내역이 없습니다.</p>
            ) : (
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
            )}
          </CardContent>
        </Card>

        <Button
          variant="outline"
          className="w-full"
          onClick={() => router.push('/dashboard/bookings')}
        >
          돌아가기
        </Button>
      </div>
    );
  }

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
        <h1 className="text-2xl font-bold text-tee-ink-strong">분쟁 신청</h1>
      </div>

      {/* Info */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="py-4">
          <h3 className="mb-2 font-semibold text-blue-800">분쟁 절차 안내</h3>
          <ol className="space-y-1 text-sm text-blue-700">
            <li>1. 분쟁 접수 (고객 또는 프로)</li>
            <li>2. 상대방 응답 (48시간 이내)</li>
            <li>3. 회사 중재 (7일 이내)</li>
            <li>4. 최종 결정 또는 외부 조정 안내</li>
          </ol>
        </CardContent>
      </Card>

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
              })}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-tee-ink-light">예약 상태</span>
            <span className="font-medium">{booking.status}</span>
          </div>
        </CardContent>
      </Card>

      {/* Dispute Reason */}
      <Card>
        <CardHeader>
          <CardTitle>분쟁 사유</CardTitle>
        </CardHeader>
        <CardContent>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="분쟁 사유를 상세히 작성해주세요. 구체적인 내용을 포함할수록 빠른 해결이 가능합니다."
            className="h-40 w-full rounded-lg border border-tee-stone p-3 text-sm focus:border-tee-accent-primary focus:outline-none focus:ring-1 focus:ring-tee-accent-primary"
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
        <Button className="flex-1" onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? '처리 중...' : '분쟁 신청'}
        </Button>
      </div>
    </div>
  );
}
