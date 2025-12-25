'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Check, ArrowRight, ArrowLeft, Copy, ExternalLink } from 'lucide-react';

// ============================================
// Types
// ============================================

export interface QuickSetupData {
  // Step 1: Basic Info
  name: string;
  profileImageUrl?: string;
  bio: string;
  // Step 2: Lesson Info
  specialty: string;
  location: string;
  priceRange: string;
  // Step 3: Contact
  contactType: 'kakao' | 'phone';
  contactValue: string;
}

interface QuickSetupWizardProps {
  onComplete: (data: QuickSetupData) => Promise<{ success: boolean; slug?: string; error?: string }>;
  initialData?: Partial<QuickSetupData>;
}

// ============================================
// Constants
// ============================================

const SPECIALTIES = [
  { value: 'beginner', label: '입문/초보 레슨' },
  { value: 'intermediate', label: '중급 스윙 교정' },
  { value: 'advanced', label: '상급/싱글 코칭' },
  { value: 'short_game', label: '숏게임 전문' },
  { value: 'putting', label: '퍼팅 전문' },
  { value: 'driving', label: '드라이버/비거리' },
  { value: 'on_course', label: '필드 라운드 레슨' },
  { value: 'junior', label: '주니어 전문' },
  { value: 'female', label: '여성 전문' },
];

const PRICE_RANGES = [
  { value: 'budget', label: '~5만원/회' },
  { value: 'standard', label: '5-10만원/회' },
  { value: 'premium', label: '10-20만원/회' },
  { value: 'luxury', label: '20만원~/회' },
];

// ============================================
// Step Components
// ============================================

function StepIndicator({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-center gap-2">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div key={index} className="flex items-center">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                index < currentStep
                  ? 'bg-tee-accent-primary text-white'
                  : index === currentStep
                    ? 'border-2 border-tee-accent-primary bg-white text-tee-accent-primary'
                    : 'border-2 border-tee-stone bg-white text-tee-ink-muted'
              }`}
            >
              {index < currentStep ? <Check className="h-4 w-4" /> : index + 1}
            </div>
            {index < totalSteps - 1 && (
              <div
                className={`mx-2 h-0.5 w-8 transition-colors ${
                  index < currentStep ? 'bg-tee-accent-primary' : 'bg-tee-stone'
                }`}
              />
            )}
          </div>
        ))}
      </div>
      <p className="mt-4 text-center text-sm text-tee-ink-muted">
        {currentStep === 0 && '기본 정보'}
        {currentStep === 1 && '레슨 정보'}
        {currentStep === 2 && '연락처 설정'}
      </p>
    </div>
  );
}

function BasicInfoStep({
  data,
  onChange,
}: {
  data: QuickSetupData;
  onChange: (updates: Partial<QuickSetupData>) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="name" className="mb-2 block text-sm font-medium text-tee-ink-strong">
          이름 <span className="text-tee-error">*</span>
        </label>
        <input
          id="name"
          type="text"
          value={data.name}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder="예: 김프로"
          className="w-full rounded-lg border border-tee-stone bg-white px-4 py-3 text-tee-ink-strong placeholder:text-tee-ink-muted focus:border-tee-accent-primary focus:outline-none focus:ring-2 focus:ring-tee-accent-primary/20"
        />
      </div>

      <div>
        <label htmlFor="bio" className="mb-2 block text-sm font-medium text-tee-ink-strong">
          한 줄 소개
        </label>
        <input
          id="bio"
          type="text"
          value={data.bio}
          onChange={(e) => onChange({ bio: e.target.value })}
          placeholder="예: 10년 경력, 친절하고 체계적인 레슨"
          className="w-full rounded-lg border border-tee-stone bg-white px-4 py-3 text-tee-ink-strong placeholder:text-tee-ink-muted focus:border-tee-accent-primary focus:outline-none focus:ring-2 focus:ring-tee-accent-primary/20"
          maxLength={100}
        />
        <p className="mt-1 text-right text-xs text-tee-ink-muted">
          {data.bio.length}/100
        </p>
      </div>

      <div className="rounded-lg border border-dashed border-tee-stone bg-tee-background p-6 text-center">
        <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-tee-stone/50">
          <svg className="h-8 w-8 text-tee-ink-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </div>
        <p className="text-sm text-tee-ink-light">
          프로필 사진은 나중에 추가할 수 있어요
        </p>
      </div>
    </div>
  );
}

function LessonInfoStep({
  data,
  onChange,
}: {
  data: QuickSetupData;
  onChange: (updates: Partial<QuickSetupData>) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="specialty" className="mb-2 block text-sm font-medium text-tee-ink-strong">
          전문 분야 <span className="text-tee-error">*</span>
        </label>
        <select
          id="specialty"
          value={data.specialty}
          onChange={(e) => onChange({ specialty: e.target.value })}
          className="w-full rounded-lg border border-tee-stone bg-white px-4 py-3 text-tee-ink-strong focus:border-tee-accent-primary focus:outline-none focus:ring-2 focus:ring-tee-accent-primary/20"
        >
          <option value="">선택하세요</option>
          {SPECIALTIES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="location" className="mb-2 block text-sm font-medium text-tee-ink-strong">
          레슨 장소
        </label>
        <input
          id="location"
          type="text"
          value={data.location}
          onChange={(e) => onChange({ location: e.target.value })}
          placeholder="예: 강남 XX골프아카데미"
          className="w-full rounded-lg border border-tee-stone bg-white px-4 py-3 text-tee-ink-strong placeholder:text-tee-ink-muted focus:border-tee-accent-primary focus:outline-none focus:ring-2 focus:ring-tee-accent-primary/20"
        />
      </div>

      <div>
        <label htmlFor="priceRange" className="mb-2 block text-sm font-medium text-tee-ink-strong">
          레슨 가격대
        </label>
        <div className="grid grid-cols-2 gap-3">
          {PRICE_RANGES.map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => onChange({ priceRange: p.value })}
              className={`rounded-lg border px-4 py-3 text-sm font-medium transition-colors ${
                data.priceRange === p.value
                  ? 'border-tee-accent-primary bg-tee-accent-primary/5 text-tee-accent-primary'
                  : 'border-tee-stone bg-white text-tee-ink-light hover:border-tee-ink-muted'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ContactStep({
  data,
  onChange,
}: {
  data: QuickSetupData;
  onChange: (updates: Partial<QuickSetupData>) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <label className="mb-3 block text-sm font-medium text-tee-ink-strong">
          연락 방법 선택 <span className="text-tee-error">*</span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onChange({ contactType: 'kakao', contactValue: '' })}
            className={`flex items-center justify-center gap-2 rounded-lg border px-4 py-4 text-sm font-medium transition-colors ${
              data.contactType === 'kakao'
                ? 'border-tee-kakao bg-tee-kakao/10 text-tee-ink-strong'
                : 'border-tee-stone bg-white text-tee-ink-light hover:border-tee-ink-muted'
            }`}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3C6.48 3 2 6.48 2 10.5c0 2.53 1.67 4.75 4.14 5.99-.16.56-.52 2.07-.6 2.38-.1.39.15.38.31.28.13-.08 1.99-1.34 2.8-1.88.43.06.88.09 1.35.09 5.52 0 10-3.48 10-7.5S17.52 3 12 3z" />
            </svg>
            카카오톡
          </button>
          <button
            type="button"
            onClick={() => onChange({ contactType: 'phone', contactValue: '' })}
            className={`flex items-center justify-center gap-2 rounded-lg border px-4 py-4 text-sm font-medium transition-colors ${
              data.contactType === 'phone'
                ? 'border-tee-accent-primary bg-tee-accent-primary/5 text-tee-accent-primary'
                : 'border-tee-stone bg-white text-tee-ink-light hover:border-tee-ink-muted'
            }`}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            전화번호
          </button>
        </div>
      </div>

      <div>
        <label htmlFor="contactValue" className="mb-2 block text-sm font-medium text-tee-ink-strong">
          {data.contactType === 'kakao' ? '카카오톡 오픈채팅 링크' : '전화번호'}
        </label>
        <input
          id="contactValue"
          type={data.contactType === 'phone' ? 'tel' : 'url'}
          value={data.contactValue}
          onChange={(e) => onChange({ contactValue: e.target.value })}
          placeholder={
            data.contactType === 'kakao'
              ? 'https://open.kakao.com/o/...'
              : '010-1234-5678'
          }
          className="w-full rounded-lg border border-tee-stone bg-white px-4 py-3 text-tee-ink-strong placeholder:text-tee-ink-muted focus:border-tee-accent-primary focus:outline-none focus:ring-2 focus:ring-tee-accent-primary/20"
        />
        {data.contactType === 'kakao' && (
          <p className="mt-2 text-xs text-tee-ink-muted">
            카카오톡 &gt; 채팅 &gt; 오픈채팅 &gt; 오픈채팅방 만들기에서 링크를 복사하세요
          </p>
        )}
      </div>
    </div>
  );
}

function CompletionStep({ slug, profileUrl }: { slug: string; profileUrl: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = profileUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="text-center">
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-tee-success/10">
        <Check className="h-10 w-10 text-tee-success" />
      </div>
      <h2 className="mb-2 text-2xl font-bold text-tee-ink-strong">
        프로필 완성!
      </h2>
      <p className="mb-8 text-tee-ink-light">
        이제 인스타그램, 카카오톡 등에 링크를 공유하세요
      </p>

      <div className="mb-6 rounded-lg border border-tee-stone bg-tee-background p-4">
        <p className="mb-2 text-xs text-tee-ink-muted">내 프로필 링크</p>
        <div className="flex items-center gap-2">
          <code className="flex-1 truncate rounded bg-white px-3 py-2 text-sm text-tee-ink-strong">
            {profileUrl}
          </code>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="flex-shrink-0"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button asChild variant="primary">
          <a href={profileUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="mr-2 h-4 w-4" />
            프로필 보기
          </a>
        </Button>
        <Button asChild variant="outline">
          <a href="/dashboard">대시보드로 이동</a>
        </Button>
      </div>
    </div>
  );
}

// ============================================
// Main Component
// ============================================

export default function QuickSetupWizard({ onComplete, initialData }: QuickSetupWizardProps) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completedSlug, setCompletedSlug] = useState<string | null>(null);

  const [data, setData] = useState<QuickSetupData>({
    name: initialData?.name || '',
    profileImageUrl: initialData?.profileImageUrl,
    bio: initialData?.bio || '',
    specialty: initialData?.specialty || '',
    location: initialData?.location || '',
    priceRange: initialData?.priceRange || '',
    contactType: initialData?.contactType || 'kakao',
    contactValue: initialData?.contactValue || '',
  });

  const handleChange = useCallback((updates: Partial<QuickSetupData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  }, []);

  const canProceed = useCallback(() => {
    if (step === 0) {
      return data.name.trim().length >= 2;
    }
    if (step === 1) {
      return data.specialty !== '';
    }
    if (step === 2) {
      return data.contactValue.trim().length > 0;
    }
    return false;
  }, [step, data]);

  const handleNext = async () => {
    if (step < 2) {
      setStep((s) => s + 1);
      return;
    }

    // Final step - submit
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await onComplete(data);
      if (result.success && result.slug) {
        setCompletedSlug(result.slug);
        setStep(3); // Move to completion step
      } else {
        setError(result.error || '프로필 생성 중 오류가 발생했습니다.');
      }
    } catch {
      setError('예상치 못한 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep((s) => s - 1);
    }
  };

  // Completion view
  if (step === 3 && completedSlug) {
    const profileUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/profile/${completedSlug}`;
    return (
      <Card className="mx-auto max-w-md p-8">
        <CompletionStep slug={completedSlug} profileUrl={profileUrl} />
      </Card>
    );
  }

  return (
    <Card className="mx-auto max-w-md p-8">
      <StepIndicator currentStep={step} totalSteps={3} />

      {error && (
        <div className="mb-6 rounded-lg border border-tee-error/20 bg-tee-error/5 p-4 text-sm text-tee-error">
          {error}
        </div>
      )}

      <div className="min-h-[300px]">
        {step === 0 && <BasicInfoStep data={data} onChange={handleChange} />}
        {step === 1 && <LessonInfoStep data={data} onChange={handleChange} />}
        {step === 2 && <ContactStep data={data} onChange={handleChange} />}
      </div>

      <div className="mt-8 flex justify-between">
        <Button
          variant="ghost"
          onClick={handleBack}
          disabled={step === 0 || isSubmitting}
          className={step === 0 ? 'invisible' : ''}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          이전
        </Button>
        <Button
          variant="primary"
          onClick={handleNext}
          disabled={!canProceed() || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              저장 중...
            </>
          ) : step === 2 ? (
            '완료'
          ) : (
            <>
              다음
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </Card>
  );
}
