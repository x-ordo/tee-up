'use client';

import { useMemo, useState } from 'react';
import { trackLead } from '@/actions/leads';
import { createBookingRequest } from '@/actions/booking-requests';
import { Button } from '@/components/ui/Button';

const CHANNELS = [
  { id: 'chat', label: '지금 채팅하기', description: '지금 바로 요구사항을 빠르게 확인합니다' },
  { id: 'form', label: '간단 상담 폼', description: '필수 정보만 남기면 24시간 내 연락드립니다' },
  { id: 'callback', label: '콜백 예약', description: '원하는 시간에 담당 매니저가 연락드립니다' },
] as const;

type ChannelId = (typeof CHANNELS)[number]['id'];

const PREFERRED_TIME_OPTIONS = [
  '평일 오전 (9시-12시)',
  '평일 오후 (12시-18시)',
  '평일 저녁 (18시-21시)',
  '주말 오전 (9시-12시)',
  '주말 오후 (12시-18시)',
  '협의 필요',
];

const inputClassName = 'w-full rounded-xl border border-tee-stone bg-white px-4 py-3 text-sm text-tee-ink-strong placeholder:text-tee-ink-muted focus:border-tee-accent-primary focus:outline-none focus:ring-2 focus:ring-tee-accent-primary/20';

export default function ConsultationChannels() {
  const [activeChannel, setActiveChannel] = useState<ChannelId>('chat');
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [callbackStatus, setCallbackStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [callbackData, setCallbackData] = useState({ name: '', phone: '', preferredTime: '', message: '' });

  const conciergeProId = process.env.NEXT_PUBLIC_CONCIERGE_PRO_ID || '';
  const conciergeChatUrl = process.env.NEXT_PUBLIC_CONCIERGE_CHAT_URL || '';
  const chatDisabled = conciergeChatUrl.length === 0;

  const canSubmit = useMemo(() => conciergeProId.length > 0, [conciergeProId]);

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

    const result = await trackLead(conciergeProId, {
      contact_name: formData.name,
      contact_method: 'form',
      source_url: sourceUrl,
      referrer,
    });

    if (result.success) {
      setFormStatus('success');
      setFormData({ name: '', phone: '' });
      return;
    }

    setFormStatus('error');
    setErrorMessage(result.error || '요청 처리 중 오류가 발생했습니다.');
  };

  const handleCallbackSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage(null);

    if (!canSubmit) {
      setErrorMessage('운영팀 상담 채널이 아직 설정되지 않았습니다.');
      setCallbackStatus('error');
      return;
    }

    if (!callbackData.name.trim() || !callbackData.phone.trim()) {
      setErrorMessage('이름과 연락처를 입력해주세요.');
      setCallbackStatus('error');
      return;
    }

    setCallbackStatus('submitting');

    const result = await createBookingRequest({
      proId: conciergeProId,
      name: callbackData.name,
      phone: callbackData.phone,
      preferredTime: callbackData.preferredTime || undefined,
      message: callbackData.message || undefined,
    });

    if (result.success) {
      setCallbackStatus('success');
      setCallbackData({ name: '', phone: '', preferredTime: '', message: '' });
      return;
    }

    setCallbackStatus('error');
    setErrorMessage(result.error || '요청 처리 중 오류가 발생했습니다.');
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
    <div className="rounded-3xl border border-tee-stone/60 bg-white/90 p-6 shadow-card backdrop-blur">
      <div className="mb-6 flex flex-wrap gap-2">
        {CHANNELS.map((channel) => (
          <button
            key={channel.id}
            type="button"
            onClick={() => {
              setActiveChannel(channel.id);
              setErrorMessage(null);
              setFormStatus('idle');
              setCallbackStatus('idle');
            }}
            className={
              `rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                activeChannel === channel.id
                  ? 'bg-tee-accent-primary text-white'
                  : 'bg-tee-background text-tee-ink-light hover:text-tee-ink-strong'
              }`
            }
          >
            {channel.label}
          </button>
        ))}
      </div>

      <div className="mb-6">
        <p className="text-sm text-tee-ink-muted">
          {CHANNELS.find((channel) => channel.id === activeChannel)?.description}
        </p>
      </div>

      {activeChannel === 'chat' && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-tee-stone/60 bg-tee-background px-5 py-4 text-sm text-tee-ink-light">
            채팅은 운영팀 카카오톡으로 연결됩니다. 문의 내용을 간단히 정리해두면 더 빠르게 대응할 수 있습니다.
          </div>
          <Button
            asChild
            variant="primary"
            className="w-full h-12"
            disabled={chatDisabled}
          >
            <a
              href={conciergeChatUrl || '#'}
              onClick={(event) => {
                if (chatDisabled) {
                  event.preventDefault();
                  return;
                }
                handleChatClick();
              }}
              aria-disabled={chatDisabled}
              target={conciergeChatUrl ? '_blank' : undefined}
              rel={conciergeChatUrl ? 'noopener noreferrer' : undefined}
            >
              카카오톡 상담 시작
            </a>
          </Button>
          {!conciergeChatUrl && (
            <p className="text-xs text-tee-ink-muted">
              운영팀 채팅 채널 준비 중입니다. 다른 상담 방식을 선택해주세요.
            </p>
          )}
        </div>
      )}

      {activeChannel === 'form' && (
        <form onSubmit={handleFormSubmit} className="space-y-4">
          {formStatus === 'success' ? (
            <div className="rounded-2xl border border-tee-success/20 bg-tee-success/10 px-4 py-3 text-sm text-tee-success">
              상담 요청이 접수되었습니다. 24시간 내 연락드리겠습니다.
            </div>
          ) : (
            <>
              <div className="grid gap-3 md:grid-cols-2">
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
              </div>
              {formStatus === 'error' && errorMessage && (
                <p className="text-sm text-tee-error">{errorMessage}</p>
              )}
              <Button type="submit" variant="primary" className="w-full h-12" disabled={formStatus === 'submitting'}>
                {formStatus === 'submitting' ? '전송 중...' : '상담 요청 보내기'}
              </Button>
            </>
          )}
        </form>
      )}

      {activeChannel === 'callback' && (
        <form onSubmit={handleCallbackSubmit} className="space-y-4">
          {callbackStatus === 'success' ? (
            <div className="rounded-2xl border border-tee-success/20 bg-tee-success/10 px-4 py-3 text-sm text-tee-success">
              콜백 예약이 접수되었습니다. 선택한 시간대에 연락드리겠습니다.
            </div>
          ) : (
            <>
              <div className="grid gap-3 md:grid-cols-2">
                <input
                  type="text"
                  placeholder="이름"
                  value={callbackData.name}
                  onChange={(event) => setCallbackData((prev) => ({ ...prev, name: event.target.value }))}
                  className={inputClassName}
                />
                <input
                  type="tel"
                  placeholder="연락처"
                  value={callbackData.phone}
                  onChange={(event) => setCallbackData((prev) => ({ ...prev, phone: event.target.value }))}
                  className={inputClassName}
                />
              </div>
              <select
                value={callbackData.preferredTime}
                onChange={(event) => setCallbackData((prev) => ({ ...prev, preferredTime: event.target.value }))}
                className={inputClassName}
              >
                <option value="">희망 연락 시간 선택</option>
                {PREFERRED_TIME_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <textarea
                placeholder="추가 요청 사항 (선택)"
                value={callbackData.message}
                onChange={(event) => setCallbackData((prev) => ({ ...prev, message: event.target.value }))}
                className={`${inputClassName} min-h-[120px]`}
              />
              {callbackStatus === 'error' && errorMessage && (
                <p className="text-sm text-tee-error">{errorMessage}</p>
              )}
              <Button type="submit" variant="primary" className="w-full h-12" disabled={callbackStatus === 'submitting'}>
                {callbackStatus === 'submitting' ? '예약 중...' : '콜백 예약하기'}
              </Button>
            </>
          )}
        </form>
      )}
    </div>
  );
}
