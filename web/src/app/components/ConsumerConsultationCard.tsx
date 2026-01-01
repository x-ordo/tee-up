'use client';

import { useState } from 'react';
import { trackLead } from '@/actions/leads';
import { createConsultationRequest } from '@/actions/consultation-requests';

const inputClassName = 'w-full rounded-xl border border-tee-stone bg-white px-4 py-3 text-sm text-tee-ink-strong placeholder:text-tee-ink-muted focus:border-tee-accent-primary focus:outline-none focus:ring-2 focus:ring-tee-accent-primary/20';

export default function ConsumerConsultationCard() {
  const conciergeProId = process.env.NEXT_PUBLIC_CONCIERGE_PRO_ID || '';
  const conciergeChatUrl = process.env.NEXT_PUBLIC_CONCIERGE_CHAT_URL || '';
  const canSubmit = conciergeProId.length > 0;
  const chatDisabled = conciergeChatUrl.length === 0;

  const [formData, setFormData] = useState({ name: '', phone: '', message: '' });
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage(null);

    if (!canSubmit) {
      setErrorMessage('운영팀 상담 채널이 아직 설정되지 않았습니다.');
      setFormStatus('error');
      return;
    }

    if (!formData.name.trim() || !formData.phone.trim()) {
      setErrorMessage('이름과 연락처를 입력해주세요.');
      setFormStatus('error');
      return;
    }

    setFormStatus('submitting');

    const sourceUrl = typeof window !== 'undefined' ? window.location.href : undefined;
    const referrer = typeof document !== 'undefined' && document.referrer ? document.referrer : undefined;

    const requestResult = await createConsultationRequest({
      proId: conciergeProId,
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      message: formData.message.trim() || undefined,
      sourceUrl,
      referrer,
    });

    if (requestResult.success) {
      setFormStatus('success');
      setFormData({ name: '', phone: '', message: '' });
      void trackLead(conciergeProId, {
        contact_name: formData.name.trim(),
        contact_method: 'form',
        source_url: sourceUrl,
        referrer,
      });
      return;
    }

    setFormStatus('error');
    setErrorMessage(requestResult.error || '요청 처리 중 오류가 발생했습니다.');
  };

  const handleChatClick = () => {
    if (!canSubmit) return;

    const sourceUrl = typeof window !== 'undefined' ? window.location.href : undefined;
    const referrer = typeof document !== 'undefined' && document.referrer ? document.referrer : undefined;

    void trackLead(conciergeProId, {
      contact_method: 'kakao',
      source_url: sourceUrl,
      referrer,
    });
  };

  return (
    <div className="w-full max-w-lg rounded-3xl border border-tee-stone/60 bg-white p-6 shadow-card">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-tee-ink-muted">Chat Entry</p>
      <h2 className="mt-3 text-2xl font-semibold">지금 상담을 시작하세요</h2>
      <p className="mt-2 text-sm text-tee-ink-light">
        초기 응답은 운영팀(컨시어지)이 진행합니다. 매칭 확정 후 해당 프로가 직접 소통합니다.
      </p>
      <div className="mt-5 space-y-3">
        <div className="rounded-2xl border border-tee-stone bg-tee-background px-4 py-3 text-sm text-tee-ink-muted">
          예시: 스윙 교정, 숏게임 집중, 주 1회 레슨 희망
        </div>
        {chatDisabled ? (
          <div className="flex h-12 w-full items-center justify-center rounded-full bg-tee-stone text-sm font-semibold text-tee-ink-muted">
            채팅 채널 준비 중입니다
          </div>
        ) : (
          <a
            href={conciergeChatUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleChatClick}
            className="inline-flex h-12 w-full items-center justify-center rounded-full bg-tee-accent-primary px-6 text-sm font-semibold text-white shadow-lg"
          >
            상담 시작하기
          </a>
        )}
      </div>
      <p className="mt-4 text-xs text-tee-ink-muted">
        상담 단계에서는 언제든 중단 가능합니다. 부담 없이 문의하세요.
      </p>

      <div className="mt-6 border-t border-tee-stone/60 pt-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-tee-ink-muted">Quick Form</p>
        <h3 className="mt-2 text-lg font-semibold">간단 상담 폼</h3>
        <p className="mt-1 text-sm text-tee-ink-light">
          필수 정보만 남기면 24시간 내 연락드립니다.
        </p>
        <form onSubmit={handleFormSubmit} className="mt-4 space-y-3">
          {formStatus === 'success' ? (
            <div className="rounded-2xl border border-tee-success/20 bg-tee-success/10 px-4 py-3 text-sm text-tee-success">
              상담 요청이 접수되었습니다. 24시간 내 연락드리겠습니다.
            </div>
          ) : (
            <>
              <input
                type="text"
                placeholder="이름"
                value={formData.name}
                onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))}
                className={inputClassName}
              />
              <input
                type="tel"
                placeholder="연락처"
                value={formData.phone}
                onChange={(event) => setFormData((prev) => ({ ...prev, phone: event.target.value }))}
                className={inputClassName}
              />
              <textarea
                placeholder="문의 내용을 남겨주세요 (선택)"
                value={formData.message}
                onChange={(event) => setFormData((prev) => ({ ...prev, message: event.target.value }))}
                className={`${inputClassName} min-h-[96px]`}
                rows={3}
              />
              {formStatus === 'error' && errorMessage && (
                <p className="text-sm text-tee-error">{errorMessage}</p>
              )}
              <button
                type="submit"
                disabled={formStatus === 'submitting'}
                className="inline-flex h-12 w-full items-center justify-center rounded-full bg-tee-accent-primary px-6 text-sm font-semibold text-white shadow-lg disabled:bg-tee-stone disabled:text-tee-ink-muted"
              >
                {formStatus === 'submitting' ? '전송 중...' : '상담 요청 보내기'}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
