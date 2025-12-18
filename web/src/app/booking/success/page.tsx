'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, Loader2, AlertCircle, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { createBooking } from '@/actions/scheduler';
import { formatKRW } from '@/lib/payments';
import { format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';

type PageState = 'processing' | 'success' | 'error';

interface BookingData {
  proId: string;
  slotStart: string;
  slotEnd: string;
  guestName: string;
  guestPhone?: string;
  guestEmail?: string;
  customerNotes?: string;
}

export default function BookingSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [state, setState] = useState<PageState>('processing');
  const [error, setError] = useState<string | null>(null);
  const [bookingData, setBookingData] = useState<BookingData | null>(null);

  useEffect(() => {
    const processPayment = async () => {
      // Get query params from Toss redirect
      const paymentKey = searchParams.get('paymentKey');
      const orderId = searchParams.get('orderId');
      const amount = searchParams.get('amount');
      const dataParam = searchParams.get('data');

      if (!paymentKey || !orderId || !amount || !dataParam) {
        setError('결제 정보가 올바르지 않습니다.');
        setState('error');
        return;
      }

      // Parse booking data
      let parsedData: BookingData;
      try {
        parsedData = JSON.parse(decodeURIComponent(dataParam));
        setBookingData(parsedData);
      } catch {
        setError('예약 정보를 처리할 수 없습니다.');
        setState('error');
        return;
      }

      // Create booking with payment verification
      const result = await createBooking({
        pro_id: parsedData.proId,
        start_at: parsedData.slotStart,
        end_at: parsedData.slotEnd,
        guest_name: parsedData.guestName,
        guest_phone: parsedData.guestPhone,
        guest_email: parsedData.guestEmail,
        customer_notes: parsedData.customerNotes,
        paymentKey,
        orderId,
        amount: parseInt(amount, 10),
      });

      if (!result.success) {
        setError(result.error || '예약 생성에 실패했습니다.');
        setState('error');
        return;
      }

      setState('success');
    };

    processPayment();
  }, [searchParams]);

  // Processing state
  if (state === 'processing') {
    return (
      <div className="min-h-screen bg-tee-background flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-tee-surface rounded-2xl shadow-lg p-8 text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-tee-stone" />
            <div className="absolute inset-0 rounded-full border-4 border-tee-accent-primary border-t-transparent animate-spin" />
          </div>
          <h1 className="text-xl font-semibold text-tee-ink-strong mb-2">
            예약을 확정하고 있습니다
          </h1>
          <p className="text-tee-ink-light">
            결제 검증 중입니다. 잠시만 기다려주세요...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (state === 'error') {
    return (
      <div className="min-h-screen bg-tee-background flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-tee-surface rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-xl font-semibold text-tee-ink-strong mb-2">
            예약 처리 실패
          </h1>
          <p className="text-tee-ink-light mb-6">
            {error || '알 수 없는 오류가 발생했습니다.'}
          </p>
          <Button onClick={() => router.back()} className="w-full">
            돌아가기
          </Button>
        </div>
      </div>
    );
  }

  // Success state
  return (
    <div className="min-h-screen bg-tee-background flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-tee-surface rounded-2xl shadow-lg p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-tee-accent-primary/10 flex items-center justify-center">
          <CheckCircle className="h-8 w-8 text-tee-accent-primary" />
        </div>

        <h1 className="text-xl font-semibold text-tee-ink-strong mb-2">
          VIP 예약이 확정되었습니다!
        </h1>

        <p className="text-tee-ink-light mb-6">
          예약금 결제가 완료되었습니다.
          <br />
          레슨 일정이 확정되었습니다.
        </p>

        {/* Booking details */}
        {bookingData && (
          <div className="bg-tee-background rounded-xl p-4 mb-6 text-left">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="h-4 w-4 text-tee-accent-primary" />
              <span className="text-sm font-medium text-tee-ink-strong">
                {format(parseISO(bookingData.slotStart), 'yyyy년 M월 d일 (EEE)', { locale: ko })}
              </span>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <Clock className="h-4 w-4 text-tee-accent-primary" />
              <span className="text-sm text-tee-ink-light">
                {format(parseISO(bookingData.slotStart), 'HH:mm')} - {format(parseISO(bookingData.slotEnd), 'HH:mm')}
              </span>
            </div>
            <div className="text-sm text-tee-ink-muted">
              예약자: {bookingData.guestName}
            </div>
          </div>
        )}

        <p className="text-xs text-tee-ink-muted mb-6">
          예약 확인 및 상세 내용은 등록하신 연락처로 안내드립니다.
        </p>

        <Button onClick={() => router.push('/')} className="w-full">
          홈으로 돌아가기
        </Button>
      </div>
    </div>
  );
}
