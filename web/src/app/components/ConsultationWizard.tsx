'use client';

import { useState } from 'react';
import { trackLead } from '@/actions/leads';
import { createConsultationRequest } from '@/actions/consultation-requests';

// Step data types
type LessonInterest = 'swing' | 'short_game' | 'course' | 'beginner';
type ContactMethod = 'kakao' | 'phone' | 'email';
type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'pro';

interface FormData {
  interest: LessonInterest | null;
  contactMethod: ContactMethod | null;
  contactValue: string;
  skillLevel: SkillLevel | null;
  goal: string;
  preferredTime: string;
}

const LESSON_INTERESTS: { value: LessonInterest; label: string; icon: string }[] = [
  { value: 'swing', label: '스윙 교정', icon: '🏌️' },
  { value: 'short_game', label: '숏게임/퍼팅', icon: '⛳' },
  { value: 'course', label: '코스 공략', icon: '🗺️' },
  { value: 'beginner', label: '골프 입문', icon: '🌱' },
];

const CONTACT_METHODS: { value: ContactMethod; label: string; description: string; recommended?: boolean }[] = [
  { value: 'kakao', label: '카카오톡', description: '가장 빠른 응답', recommended: true },
  { value: 'phone', label: '전화', description: '직접 통화 선호 시' },
  { value: 'email', label: '이메일', description: '문서 첨부 필요 시' },
];

const SKILL_LEVELS: { value: SkillLevel; label: string }[] = [
  { value: 'beginner', label: '입문 (처음 시작)' },
  { value: 'intermediate', label: '초중급 (100타 이상)' },
  { value: 'advanced', label: '중상급 (90타 전후)' },
  { value: 'pro', label: '상급 (싱글 목표)' },
];

export default function ConsultationWizard() {
  const conciergeProId = process.env.NEXT_PUBLIC_CONCIERGE_PRO_ID || '';
  const conciergeChatUrl = process.env.NEXT_PUBLIC_CONCIERGE_CHAT_URL || '';
  const canSubmit = conciergeProId.length > 0;

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    interest: null,
    contactMethod: null,
    contactValue: '',
    skillLevel: null,
    goal: '',
    preferredTime: '',
  });
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleInterestSelect = (interest: LessonInterest) => {
    setFormData((prev) => ({ ...prev, interest }));
    setStep(2);
  };

  const handleContactMethodSelect = (method: ContactMethod) => {
    setFormData((prev) => ({ ...prev, contactMethod: method }));

    // If kakao, go directly to step 3 (or submit if skipping)
    if (method === 'kakao') {
      // Open kakao chat directly
      if (conciergeChatUrl) {
        const sourceUrl = typeof window !== 'undefined' ? window.location.href : undefined;
        const referrer = typeof document !== 'undefined' && document.referrer ? document.referrer : undefined;

        void trackLead(conciergeProId, {
          contact_method: 'kakao',
          source_url: sourceUrl,
          referrer,
        });

        window.open(conciergeChatUrl, '_blank');
        setFormStatus('success');
      }
    }
  };

  const handleContactValueChange = (value: string) => {
    setFormData((prev) => ({ ...prev, contactValue: value }));
  };

  const handleStep2Submit = () => {
    if (!formData.contactValue.trim()) {
      setErrorMessage('연락처를 입력해주세요.');
      return;
    }
    setErrorMessage(null);
    setStep(3);
  };

  const handleSkipStep3 = () => {
    submitForm();
  };

  const handleStep3Submit = () => {
    submitForm();
  };

  const submitForm = async () => {
    if (!canSubmit) {
      setErrorMessage('운영팀 상담 채널이 아직 설정되지 않았습니다.');
      setFormStatus('error');
      return;
    }

    setFormStatus('submitting');

    const sourceUrl = typeof window !== 'undefined' ? window.location.href : undefined;
    const referrer = typeof document !== 'undefined' && document.referrer ? document.referrer : undefined;

    // Build message from form data
    const messageParts: string[] = [];
    if (formData.interest) {
      const interestLabel = LESSON_INTERESTS.find((i) => i.value === formData.interest)?.label;
      messageParts.push(`관심 분야: ${interestLabel}`);
    }
    if (formData.skillLevel) {
      const skillLabel = SKILL_LEVELS.find((s) => s.value === formData.skillLevel)?.label;
      messageParts.push(`실력: ${skillLabel}`);
    }
    if (formData.goal) {
      messageParts.push(`목표: ${formData.goal}`);
    }
    if (formData.preferredTime) {
      messageParts.push(`선호 시간: ${formData.preferredTime}`);
    }

    const contactMethodLabel = formData.contactMethod === 'phone' ? '전화' : '이메일';

    const requestResult = await createConsultationRequest({
      proId: conciergeProId,
      name: `${contactMethodLabel} 상담 요청`,
      phone: formData.contactMethod === 'phone' ? formData.contactValue : '',
      email: formData.contactMethod === 'email' ? formData.contactValue : undefined,
      message: messageParts.join('\n'),
      sourceUrl,
      referrer,
    });

    if (requestResult.success) {
      setFormStatus('success');
      void trackLead(conciergeProId, {
        contact_method: formData.contactMethod || 'form',
        source_url: sourceUrl,
        referrer,
      });
      return;
    }

    setFormStatus('error');
    setErrorMessage(requestResult.error || '요청 처리 중 오류가 발생했습니다.');
  };

  const goBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setErrorMessage(null);
    }
  };

  // Progress indicator
  const ProgressBar = () => (
    <div className="mb-6">
      <div className="flex items-center justify-between text-xs text-tee-ink-muted">
        <span>Step {step}/3</span>
        <span>{step === 1 ? '관심 분야' : step === 2 ? '연락 방법' : '추가 정보'}</span>
      </div>
      <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-tee-stone/40">
        <div
          className="h-full bg-tee-accent-primary transition-all duration-300"
          style={{ width: `${(step / 3) * 100}%` }}
        />
      </div>
    </div>
  );

  // Success state
  if (formStatus === 'success') {
    return (
      <div className="w-full max-w-lg rounded-3xl border border-tee-stone/60 bg-white p-8 shadow-card">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-tee-success/10">
            <svg className="h-8 w-8 text-tee-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-tee-ink-strong">상담 요청 완료!</h2>
          <p className="mt-3 text-sm text-tee-ink-light">
            {formData.contactMethod === 'kakao'
              ? '카카오톡 채팅창이 열렸습니다. 운영팀이 빠르게 응답드릴게요.'
              : '24시간 내 연락드리겠습니다. 감사합니다!'}
          </p>
          <button
            onClick={() => {
              setStep(1);
              setFormStatus('idle');
              setFormData({
                interest: null,
                contactMethod: null,
                contactValue: '',
                skillLevel: null,
                goal: '',
                preferredTime: '',
              });
            }}
            className="mt-6 inline-flex h-10 items-center justify-center rounded-full border border-tee-stone px-6 text-sm font-medium text-tee-ink-light hover:bg-tee-background"
          >
            처음으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg rounded-3xl border border-tee-stone/60 bg-white p-6 shadow-card">
      <ProgressBar />

      {/* Step 1: Select Interest */}
      {step === 1 && (
        <div>
          <h2 className="text-xl font-semibold text-tee-ink-strong">어떤 레슨에 관심 있으세요?</h2>
          <p className="mt-2 text-sm text-tee-ink-light">
            관심 분야를 선택하면 맞춤 프로를 추천해드립니다.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3">
            {LESSON_INTERESTS.map((interest) => (
              <button
                key={interest.value}
                onClick={() => handleInterestSelect(interest.value)}
                className="flex flex-col items-center gap-2 rounded-2xl border-2 border-tee-stone/60 bg-white p-5 text-center transition-all hover:border-tee-accent-primary hover:bg-tee-accent-primary/5"
              >
                <span className="text-3xl">{interest.icon}</span>
                <span className="text-sm font-medium text-tee-ink-strong">{interest.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Select Contact Method */}
      {step === 2 && (
        <div>
          <button
            onClick={goBack}
            className="mb-4 flex items-center gap-1 text-sm text-tee-ink-muted hover:text-tee-ink-strong"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            이전
          </button>

          <h2 className="text-xl font-semibold text-tee-ink-strong">연락받으실 방법은?</h2>
          <p className="mt-2 text-sm text-tee-ink-light">
            선호하는 연락 방법을 선택해주세요.
          </p>

          <div className="mt-6 space-y-3">
            {CONTACT_METHODS.map((method) => (
              <button
                key={method.value}
                onClick={() => handleContactMethodSelect(method.value)}
                className={`flex w-full items-center justify-between rounded-2xl border-2 p-4 text-left transition-all ${
                  formData.contactMethod === method.value
                    ? 'border-tee-accent-primary bg-tee-accent-primary/5'
                    : 'border-tee-stone/60 hover:border-tee-stone'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-tee-ink-strong">{method.label}</span>
                    {method.recommended && (
                      <span className="rounded-full bg-tee-accent-primary/10 px-2 py-0.5 text-xs font-medium text-tee-accent-primary">
                        추천
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-tee-ink-muted">{method.description}</p>
                </div>
                <div
                  className={`h-5 w-5 rounded-full border-2 ${
                    formData.contactMethod === method.value
                      ? 'border-tee-accent-primary bg-tee-accent-primary'
                      : 'border-tee-stone'
                  }`}
                >
                  {formData.contactMethod === method.value && (
                    <svg className="h-full w-full text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Contact value input for phone/email */}
          {formData.contactMethod && formData.contactMethod !== 'kakao' && (
            <div className="mt-4">
              <input
                type={formData.contactMethod === 'email' ? 'email' : 'tel'}
                placeholder={formData.contactMethod === 'email' ? 'example@email.com' : '010-1234-5678'}
                value={formData.contactValue}
                onChange={(e) => handleContactValueChange(e.target.value)}
                className="w-full rounded-xl border border-tee-stone bg-white px-4 py-3 text-sm text-tee-ink-strong placeholder:text-tee-ink-muted focus:border-tee-accent-primary focus:outline-none focus:ring-2 focus:ring-tee-accent-primary/20"
              />
              {errorMessage && <p className="mt-2 text-sm text-tee-error">{errorMessage}</p>}
              <button
                onClick={handleStep2Submit}
                className="mt-4 inline-flex h-12 w-full items-center justify-center rounded-full bg-tee-accent-primary px-6 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-[1.02]"
              >
                다음
              </button>
            </div>
          )}
        </div>
      )}

      {/* Step 3: Additional Info (Optional) */}
      {step === 3 && (
        <div>
          <button
            onClick={goBack}
            className="mb-4 flex items-center gap-1 text-sm text-tee-ink-muted hover:text-tee-ink-strong"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            이전
          </button>

          <h2 className="text-xl font-semibold text-tee-ink-strong">더 정확한 매칭을 위해</h2>
          <p className="mt-2 text-sm text-tee-ink-light">
            추가 정보를 알려주시면 맞춤 프로를 추천해드려요. (선택)
          </p>

          <div className="mt-6 space-y-4">
            {/* Skill Level */}
            <div>
              <label className="mb-2 block text-sm font-medium text-tee-ink-strong">현재 실력</label>
              <div className="grid grid-cols-2 gap-2">
                {SKILL_LEVELS.map((level) => (
                  <button
                    key={level.value}
                    onClick={() => setFormData((prev) => ({ ...prev, skillLevel: level.value }))}
                    className={`rounded-xl border-2 px-3 py-2 text-xs transition-all ${
                      formData.skillLevel === level.value
                        ? 'border-tee-accent-primary bg-tee-accent-primary/5 text-tee-accent-primary'
                        : 'border-tee-stone/60 text-tee-ink-light hover:border-tee-stone'
                    }`}
                  >
                    {level.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Goal */}
            <div>
              <label className="mb-2 block text-sm font-medium text-tee-ink-strong">목표 (선택)</label>
              <input
                type="text"
                placeholder="예: 90타 돌파, 드라이버 비거리 향상"
                value={formData.goal}
                onChange={(e) => setFormData((prev) => ({ ...prev, goal: e.target.value }))}
                className="w-full rounded-xl border border-tee-stone bg-white px-4 py-3 text-sm text-tee-ink-strong placeholder:text-tee-ink-muted focus:border-tee-accent-primary focus:outline-none focus:ring-2 focus:ring-tee-accent-primary/20"
              />
            </div>

            {/* Preferred Time */}
            <div>
              <label className="mb-2 block text-sm font-medium text-tee-ink-strong">선호 시간대 (선택)</label>
              <input
                type="text"
                placeholder="예: 주말 오전, 평일 저녁"
                value={formData.preferredTime}
                onChange={(e) => setFormData((prev) => ({ ...prev, preferredTime: e.target.value }))}
                className="w-full rounded-xl border border-tee-stone bg-white px-4 py-3 text-sm text-tee-ink-strong placeholder:text-tee-ink-muted focus:border-tee-accent-primary focus:outline-none focus:ring-2 focus:ring-tee-accent-primary/20"
              />
            </div>
          </div>

          {errorMessage && <p className="mt-4 text-sm text-tee-error">{errorMessage}</p>}

          <div className="mt-6 flex gap-3">
            <button
              onClick={handleSkipStep3}
              disabled={formStatus === 'submitting'}
              className="flex-1 rounded-full border-2 border-tee-stone py-3 text-sm font-medium text-tee-ink-light transition-colors hover:bg-tee-background disabled:opacity-50"
            >
              건너뛰기
            </button>
            <button
              onClick={handleStep3Submit}
              disabled={formStatus === 'submitting'}
              className="flex-1 rounded-full bg-tee-accent-primary py-3 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-[1.02] disabled:opacity-50"
            >
              {formStatus === 'submitting' ? '제출 중...' : '상담 요청'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
