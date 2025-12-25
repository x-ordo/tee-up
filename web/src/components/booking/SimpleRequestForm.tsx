'use client';

import { useState } from 'react';
import { createBookingRequest } from '@/actions/booking-requests';

interface SimpleRequestFormProps {
  proId: string;
  proName: string;
  onSuccess?: () => void;
  className?: string;
}

export default function SimpleRequestForm({
  proId,
  proName,
  onSuccess,
  className = '',
}: SimpleRequestFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    preferredTime: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/[^\d]/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setFormData((prev) => ({ ...prev, phone: formatted }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim()) {
      setError('이름을 입력해주세요.');
      return;
    }
    if (!formData.phone.trim()) {
      setError('연락처를 입력해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createBookingRequest({
        proId,
        name: formData.name,
        phone: formData.phone,
        preferredTime: formData.preferredTime || undefined,
        message: formData.message || undefined,
      });

      if (result.success) {
        setIsSuccess(true);
        onSuccess?.();
      } else {
        setError(result.error);
      }
    } catch {
      setError('요청 처리 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className={`rounded-xl bg-tee-surface p-6 text-center ${className}`}>
        <div className="mb-4 flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-tee-success/10">
            <svg
              className="h-6 w-6 text-tee-success"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
        <h3 className="mb-2 text-lg font-semibold text-tee-ink-strong">
          문의가 접수되었습니다
        </h3>
        <p className="text-sm text-tee-ink-light">
          {proName} 프로님이 곧 연락드릴 예정입니다.
        </p>
        <button
          onClick={() => {
            setIsSuccess(false);
            setFormData({ name: '', phone: '', preferredTime: '', message: '' });
          }}
          className="mt-4 text-sm text-tee-accent-primary hover:underline"
        >
          다른 문의하기
        </button>
      </div>
    );
  }

  return (
    <div className={`rounded-xl bg-tee-surface p-6 ${className}`}>
      <h3 className="mb-4 text-lg font-semibold text-tee-ink-strong">
        레슨 문의하기
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div
            role="alert"
            className="rounded-lg bg-tee-error/10 px-4 py-3 text-sm text-tee-error"
          >
            {error}
          </div>
        )}

        <div>
          <label
            htmlFor="name"
            className="mb-1 block text-sm font-medium text-tee-ink-strong"
          >
            이름 <span className="text-tee-error">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="홍길동"
            className="w-full rounded-lg border border-tee-stone bg-white px-4 py-2.5 text-tee-ink-strong placeholder:text-tee-ink-muted focus:border-tee-accent-primary focus:outline-none focus:ring-1 focus:ring-tee-accent-primary"
            required
          />
        </div>

        <div>
          <label
            htmlFor="phone"
            className="mb-1 block text-sm font-medium text-tee-ink-strong"
          >
            연락처 <span className="text-tee-error">*</span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handlePhoneChange}
            placeholder="010-1234-5678"
            className="w-full rounded-lg border border-tee-stone bg-white px-4 py-2.5 text-tee-ink-strong placeholder:text-tee-ink-muted focus:border-tee-accent-primary focus:outline-none focus:ring-1 focus:ring-tee-accent-primary"
            required
          />
        </div>

        <div>
          <label
            htmlFor="preferredTime"
            className="mb-1 block text-sm font-medium text-tee-ink-strong"
          >
            희망 레슨 시간
          </label>
          <select
            id="preferredTime"
            name="preferredTime"
            value={formData.preferredTime}
            onChange={handleChange}
            className="w-full rounded-lg border border-tee-stone bg-white px-4 py-2.5 text-tee-ink-strong focus:border-tee-accent-primary focus:outline-none focus:ring-1 focus:ring-tee-accent-primary"
          >
            <option value="">선택해주세요</option>
            <option value="평일 오전">평일 오전 (9시-12시)</option>
            <option value="평일 오후">평일 오후 (12시-18시)</option>
            <option value="평일 저녁">평일 저녁 (18시-21시)</option>
            <option value="주말 오전">주말 오전 (9시-12시)</option>
            <option value="주말 오후">주말 오후 (12시-18시)</option>
            <option value="협의 필요">시간 협의 필요</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="message"
            className="mb-1 block text-sm font-medium text-tee-ink-strong"
          >
            문의 내용
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="레슨에 대해 궁금한 점이나 요청사항을 적어주세요"
            rows={3}
            className="w-full resize-none rounded-lg border border-tee-stone bg-white px-4 py-2.5 text-tee-ink-strong placeholder:text-tee-ink-muted focus:border-tee-accent-primary focus:outline-none focus:ring-1 focus:ring-tee-accent-primary"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-tee-accent-primary py-3 font-medium text-white transition-colors hover:bg-tee-accent-primary/90 focus:outline-none focus:ring-2 focus:ring-tee-accent-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              전송 중...
            </span>
          ) : (
            '문의하기'
          )}
        </button>

        <p className="text-center text-xs text-tee-ink-muted">
          문의 내용은 {proName} 프로님에게 전달됩니다
        </p>
      </form>
    </div>
  );
}
