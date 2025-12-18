'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Calendar, Clock, User, Phone, Mail, MessageSquare, Loader2, CheckCircle, CreditCard, Shield } from 'lucide-react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';
import { requestDepositPayment, formatKRW } from '@/lib/payments';
import type { TimeSlot, BookingRequest, BookingSettings } from './types';

interface BookingSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate: Date | null;
  selectedSlot: TimeSlot | null;
  proId: string;
  proName?: string;
  bookingSettings?: BookingSettings;
  onSubmit: (request: BookingRequest) => Promise<void>;
  className?: string;
}

type BookingStep = 'form' | 'submitting' | 'processing_payment' | 'success';

export function BookingSheet({
  open,
  onOpenChange,
  selectedDate,
  selectedSlot,
  proId,
  proName = '프로',
  bookingSettings,
  onSubmit,
  className,
}: BookingSheetProps) {
  const [step, setStep] = React.useState<BookingStep>('form');
  const [formData, setFormData] = React.useState({
    name: '',
    phone: '',
    email: '',
    notes: '',
  });
  const [error, setError] = React.useState<string | null>(null);

  // Check if deposit payment is required
  const isDepositRequired = bookingSettings?.deposit_enabled ?? false;
  const depositAmount = bookingSettings?.deposit_amount ?? 30000;

  // Reset state when drawer opens
  React.useEffect(() => {
    if (open) {
      setStep('form');
      setError(null);
    }
  }, [open]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDate || !selectedSlot) return;
    if (!formData.name.trim()) {
      setError('이름을 입력해주세요');
      return;
    }
    if (!formData.phone.trim() && !formData.email.trim()) {
      setError('연락처(전화번호 또는 이메일)를 입력해주세요');
      return;
    }

    setError(null);

    // If deposit is required, initiate payment flow
    if (isDepositRequired) {
      setStep('processing_payment');

      try {
        // This will redirect to Toss payment page
        await requestDepositPayment({
          proId,
          proName,
          amount: depositAmount,
          slotStart: selectedSlot.start.toISOString(),
          slotEnd: selectedSlot.end.toISOString(),
          guestName: formData.name.trim(),
          guestPhone: formData.phone.trim() || undefined,
          guestEmail: formData.email.trim() || undefined,
          customerNotes: formData.notes.trim() || undefined,
        });
        // Note: After payment, user will be redirected to /booking/success
        // which will call createBooking with paymentKey
      } catch (err) {
        setError(err instanceof Error ? err.message : '결제 요청에 실패했습니다');
        setStep('form');
      }
      return;
    }

    // Standard booking flow (no deposit)
    setStep('submitting');

    try {
      await onSubmit({
        pro_id: proId,
        start_at: selectedSlot.start.toISOString(),
        end_at: selectedSlot.end.toISOString(),
        guest_name: formData.name.trim(),
        guest_phone: formData.phone.trim() || undefined,
        guest_email: formData.email.trim() || undefined,
        customer_notes: formData.notes.trim() || undefined,
      });
      setStep('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : '예약 요청에 실패했습니다');
      setStep('form');
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset form after animation
    setTimeout(() => {
      setFormData({ name: '', phone: '', email: '', notes: '' });
      setStep('form');
      setError(null);
    }, 300);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className={cn('max-h-[90vh]', className)}>
        {step === 'success' ? (
          <SuccessContent onClose={handleClose} proName={proName} isDeposit={isDepositRequired} />
        ) : step === 'processing_payment' ? (
          <PaymentProcessingContent proName={proName} amount={depositAmount} />
        ) : (
          <>
            <DrawerHeader className="text-left">
              <DrawerTitle>
                {isDepositRequired ? 'VIP 레슨 예약' : '레슨 예약'}
              </DrawerTitle>
              <DrawerDescription>
                {proName} 프로님과의 레슨을 예약합니다
                {isDepositRequired && (
                  <span className="block mt-1 text-tee-accent-primary font-medium">
                    예약금 {formatKRW(depositAmount)}원으로 일정을 확보하세요
                  </span>
                )}
              </DrawerDescription>
            </DrawerHeader>

            <form onSubmit={handleSubmit} className="px-4 pb-4 space-y-4 overflow-y-auto">
              {/* Selected Time Summary */}
              {selectedDate && selectedSlot && (
                <div className="flex gap-4 p-3 bg-tee-background rounded-xl">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-tee-accent-primary" />
                    <span className="text-tee-ink-strong font-medium">
                      {format(selectedDate, 'M월 d일 (EEE)', { locale: ko })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-tee-accent-primary" />
                    <span className="text-tee-ink-strong font-medium">
                      {format(selectedSlot.start, 'HH:mm')} - {format(selectedSlot.end, 'HH:mm')}
                    </span>
                  </div>
                </div>
              )}

              {/* Error message */}
              {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                  {error}
                </div>
              )}

              {/* Form fields */}
              <div className="space-y-3">
                <FormField
                  icon={<User className="h-4 w-4" />}
                  label="이름"
                  required
                >
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="홍길동"
                    required
                    disabled={step === 'submitting'}
                  />
                </FormField>

                <FormField
                  icon={<Phone className="h-4 w-4" />}
                  label="전화번호"
                >
                  <Input
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="010-1234-5678"
                    disabled={step === 'submitting'}
                  />
                </FormField>

                <FormField
                  icon={<Mail className="h-4 w-4" />}
                  label="이메일"
                >
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="email@example.com"
                    disabled={step === 'submitting'}
                  />
                </FormField>

                <FormField
                  icon={<MessageSquare className="h-4 w-4" />}
                  label="요청사항"
                >
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="프로님께 전달할 메시지 (선택)"
                    rows={2}
                    disabled={step === 'submitting'}
                    className="flex w-full rounded-md border border-tee-stone bg-tee-surface px-3 py-2 text-sm placeholder:text-tee-ink-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-tee-accent-primary disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                  />
                </FormField>
              </div>

              <p className="text-xs text-tee-ink-muted">
                * 전화번호 또는 이메일 중 하나는 필수입니다
              </p>
            </form>

            <DrawerFooter>
              {/* Deposit info banner */}
              {isDepositRequired && (
                <div className="flex items-center gap-2 p-3 bg-tee-accent-primary/5 border border-tee-accent-primary/20 rounded-xl mb-2">
                  <Shield className="h-5 w-5 text-tee-accent-primary flex-shrink-0" />
                  <p className="text-xs text-tee-ink-light">
                    예약금은 레슨 당일 수강료에서 차감됩니다. No-Show 방지를 위한 진성 고객 확인 절차입니다.
                  </p>
                </div>
              )}

              <Button
                type="submit"
                onClick={handleSubmit}
                disabled={step === 'submitting' || !selectedSlot}
                className={cn(
                  'w-full h-12 text-base font-semibold',
                  isDepositRequired && 'bg-gradient-to-r from-tee-accent-primary to-tee-accent-primary/80 hover:from-tee-accent-primary/90 hover:to-tee-accent-primary/70'
                )}
              >
                {step === 'submitting' ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    예약 요청 중...
                  </>
                ) : isDepositRequired ? (
                  <>
                    <CreditCard className="h-5 w-5 mr-2" />
                    VIP 예약 확정하기 ({formatKRW(depositAmount)}원)
                  </>
                ) : (
                  '예약 요청하기'
                )}
              </Button>
              <DrawerClose asChild>
                <Button
                  variant="outline"
                  className="w-full"
                  disabled={step === 'submitting'}
                >
                  취소
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
}

interface FormFieldProps {
  icon: React.ReactNode;
  label: string;
  required?: boolean;
  children: React.ReactNode;
}

function FormField({ icon, label, required, children }: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-sm font-medium text-tee-ink-light">
        {icon}
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

interface SuccessContentProps {
  onClose: () => void;
  proName: string;
  isDeposit?: boolean;
}

function SuccessContent({ onClose, proName, isDeposit }: SuccessContentProps) {
  return (
    <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
      <div className={cn(
        'w-16 h-16 rounded-full flex items-center justify-center mb-4',
        isDeposit ? 'bg-tee-accent-primary/10' : 'bg-green-100'
      )}>
        <CheckCircle className={cn(
          'h-8 w-8',
          isDeposit ? 'text-tee-accent-primary' : 'text-green-600'
        )} />
      </div>
      <h3 className="text-xl font-semibold text-tee-ink-strong mb-2">
        {isDeposit ? 'VIP 예약 확정!' : '예약 요청 완료!'}
      </h3>
      <p className="text-tee-ink-light mb-6">
        {isDeposit ? (
          <>
            예약금 결제가 완료되었습니다.
            <br />
            {proName} 프로님과의 레슨이 확정되었습니다.
          </>
        ) : (
          <>
            {proName} 프로님이 예약을 확인하면
            <br />
            연락드릴 예정입니다.
          </>
        )}
      </p>
      <Button onClick={onClose} className="w-full max-w-xs">
        확인
      </Button>
    </div>
  );
}

interface PaymentProcessingContentProps {
  proName: string;
  amount: number;
}

function PaymentProcessingContent({ proName, amount }: PaymentProcessingContentProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {/* Premium loading animation */}
      <div className="relative w-20 h-20 mb-6">
        <div className="absolute inset-0 rounded-full border-4 border-tee-stone" />
        <div className="absolute inset-0 rounded-full border-4 border-tee-accent-primary border-t-transparent animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <CreditCard className="h-8 w-8 text-tee-accent-primary" />
        </div>
      </div>

      <h3 className="text-lg font-semibold text-tee-ink-strong mb-2">
        결제 준비 중...
      </h3>

      <p className="text-tee-ink-light text-sm mb-4">
        {proName} 프로님의 일정을 확보하고 있습니다
      </p>

      <div className="flex items-center gap-2 px-4 py-2 bg-tee-accent-primary/5 rounded-lg">
        <Shield className="h-4 w-4 text-tee-accent-primary" />
        <span className="text-sm text-tee-ink-light">
          예약금 <span className="font-semibold text-tee-accent-primary">{formatKRW(amount)}원</span>
        </span>
      </div>

      <p className="text-xs text-tee-ink-muted mt-4">
        잠시 후 결제 화면으로 이동합니다
      </p>
    </div>
  );
}
