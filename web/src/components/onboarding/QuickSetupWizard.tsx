'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Check, ArrowRight, ArrowLeft, Copy, ExternalLink } from 'lucide-react';
import {
  GolfProgress,
  GolfSpinner,
  HoleInOne,
  StepTransition,
} from '@/components/animations/GolfAnimations';
import { ProfileImageUpload } from './ProfileImageUpload';

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
  autoSubmit?: boolean;
  isAuthenticated?: boolean;
  userId?: string;
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

const STEP_LABELS = ['기본 정보', '레슨 정보', '연락처'];

// 공통 입력 스타일 (44px+ 터치 타겟)
const inputClassName = "w-full rounded-xl border border-tee-stone bg-white px-4 py-3.5 text-base text-tee-ink-strong placeholder:text-tee-ink-muted focus:border-tee-accent-primary focus:outline-none focus:ring-2 focus:ring-tee-accent-primary/20 transition-colors";

function BasicInfoStep({
  data,
  onChange,
  userId,
}: {
  data: QuickSetupData;
  onChange: (updates: Partial<QuickSetupData>) => void;
  userId?: string;
}) {
  return (
    <div className="space-y-5">
      {/* 프로필 사진 - 상단에 배치 */}
      <div className="py-2">
        <ProfileImageUpload
          userId={userId}
          initialImageUrl={data.profileImageUrl}
          onImageChange={(url) => onChange({ profileImageUrl: url })}
        />
      </div>

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
          className={inputClassName}
          autoComplete="name"
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
          className={inputClassName}
          maxLength={100}
        />
        <p className="mt-1.5 text-right text-xs text-tee-ink-muted">
          {data.bio.length}/100
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
    <div className="space-y-5">
      <div>
        <label htmlFor="specialty" className="mb-2 block text-sm font-medium text-tee-ink-strong">
          전문 분야 <span className="text-tee-error">*</span>
        </label>
        <select
          id="specialty"
          value={data.specialty}
          onChange={(e) => onChange({ specialty: e.target.value })}
          className={inputClassName}
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
          className={inputClassName}
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-tee-ink-strong">
          레슨 가격대
        </label>
        <div className="grid grid-cols-2 gap-2">
          {PRICE_RANGES.map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => onChange({ priceRange: p.value })}
              className={`rounded-xl border px-3 py-3 text-sm font-medium transition-all active:scale-[0.98] ${
                data.priceRange === p.value
                  ? 'border-tee-accent-primary bg-tee-accent-primary/10 text-tee-accent-primary shadow-sm'
                  : 'border-tee-stone bg-white text-tee-ink-light active:bg-tee-background'
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
    <div className="space-y-5">
      <div>
        <label className="mb-2 block text-sm font-medium text-tee-ink-strong">
          연락 방법 <span className="text-tee-error">*</span>
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onChange({ contactType: 'kakao', contactValue: '' })}
            className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-4 text-sm font-medium transition-all active:scale-[0.98] ${
              data.contactType === 'kakao'
                ? 'border-yellow-400 bg-yellow-50 text-tee-ink-strong shadow-sm'
                : 'border-tee-stone bg-white text-tee-ink-light active:bg-tee-background'
            }`}
          >
            <span className="text-lg">💬</span>
            카카오톡
          </button>
          <button
            type="button"
            onClick={() => onChange({ contactType: 'phone', contactValue: '' })}
            className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-4 text-sm font-medium transition-all active:scale-[0.98] ${
              data.contactType === 'phone'
                ? 'border-tee-accent-primary bg-tee-accent-primary/10 text-tee-accent-primary shadow-sm'
                : 'border-tee-stone bg-white text-tee-ink-light active:bg-tee-background'
            }`}
          >
            <span className="text-lg">📞</span>
            전화번호
          </button>
        </div>
      </div>

      <div>
        <label htmlFor="contactValue" className="mb-2 block text-sm font-medium text-tee-ink-strong">
          {data.contactType === 'kakao' ? '오픈채팅 링크' : '전화번호'}
        </label>
        <input
          id="contactValue"
          type={data.contactType === 'phone' ? 'tel' : 'url'}
          inputMode={data.contactType === 'phone' ? 'tel' : 'url'}
          value={data.contactValue}
          onChange={(e) => onChange({ contactValue: e.target.value })}
          placeholder={
            data.contactType === 'kakao'
              ? 'https://open.kakao.com/o/...'
              : '010-1234-5678'
          }
          className={inputClassName}
          autoComplete={data.contactType === 'phone' ? 'tel' : 'url'}
        />
        {data.contactType === 'kakao' && (
          <div className="mt-3 rounded-lg bg-yellow-50 p-3 text-xs text-tee-ink-light">
            💡 카카오톡 → 채팅 → 오픈채팅 → 채팅방 만들기 → 링크 복사
          </div>
        )}
      </div>
    </div>
  );
}

function CompletionStep({ profileUrl }: { profileUrl: string }) {
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
      <p className="mb-6 text-tee-ink-light text-sm">
        인스타그램, 카카오톡에 공유하세요!
      </p>

      {/* 링크 복사 카드 */}
      <div className="mb-6 rounded-xl border border-tee-stone bg-tee-background p-4">
        <p className="mb-2 text-xs text-tee-ink-muted">내 프로필 링크</p>
        <div className="flex items-center gap-2">
          <code className="flex-1 truncate rounded-lg bg-white px-3 py-2.5 text-sm text-tee-ink-strong border border-tee-stone">
            {profileUrl}
          </code>
          <Button
            variant={copied ? 'primary' : 'outline'}
            onClick={handleCopy}
            className="h-10 px-4 flex-shrink-0"
          >
            {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* 액션 버튼 - 모바일 풀너비 */}
      <div className="flex flex-col gap-3">
        <Button asChild variant="primary" className="h-12 text-base">
          <a href={profileUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="mr-2 h-5 w-5" />
            프로필 보기
          </a>
        </Button>
        <Button asChild variant="outline" className="h-12 text-base">
          <a href="/dashboard">대시보드로 이동</a>
        </Button>
      </div>
    </div>
  );
}

// ============================================
// Main Component
// ============================================

export default function QuickSetupWizard({
  onComplete,
  initialData,
  autoSubmit = false,
  isAuthenticated = false,
  userId,
}: QuickSetupWizardProps) {
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completedSlug, setCompletedSlug] = useState<string | null>(null);
  const autoSubmitTriggered = useRef(false);

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

  // 로그인 후 자동 제출
  useEffect(() => {
    if (autoSubmit && isAuthenticated && !autoSubmitTriggered.current && initialData) {
      autoSubmitTriggered.current = true;
      // 데이터가 완전히 로드된 후 제출
      const submitData: QuickSetupData = {
        name: initialData.name || '',
        profileImageUrl: initialData.profileImageUrl,
        bio: initialData.bio || '',
        specialty: initialData.specialty || '',
        location: initialData.location || '',
        priceRange: initialData.priceRange || '',
        contactType: initialData.contactType || 'kakao',
        contactValue: initialData.contactValue || '',
      };

      setData(submitData);
      setStep(2); // 마지막 스텝으로 이동

      // 약간의 딜레이 후 자동 제출
      setTimeout(async () => {
        setIsSubmitting(true);
        try {
          const result = await onComplete(submitData);
          if (result.success && result.slug) {
            setCompletedSlug(result.slug);
            setStep(3);
          } else {
            setError(result.error || '프로필 생성 중 오류가 발생했습니다.');
          }
        } catch {
          setError('예상치 못한 오류가 발생했습니다.');
        } finally {
          setIsSubmitting(false);
        }
      }, 500);
    }
  }, [autoSubmit, isAuthenticated, initialData, onComplete]);

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

  // Completion view with HoleInOne animation
  if (step === 3 && completedSlug) {
    const profileUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/profile/${completedSlug}`;
    return (
      <div className="flex flex-col flex-1">
        <Card className="flex-1 p-6 flex flex-col items-center justify-center">
          <HoleInOne show={true} />
          <div className="mt-6 w-full">
            <CompletionStep profileUrl={profileUrl} />
          </div>
        </Card>
      </div>
    );
  }

  // Loading state with golf spinner
  if (isSubmitting) {
    return (
      <div className="flex flex-col flex-1">
        <Card className="p-4 mb-4">
          <GolfProgress currentStep={step} totalSteps={3} labels={STEP_LABELS} />
        </Card>
        <Card className="flex-1 flex items-center justify-center">
          <GolfSpinner message="프로필을 생성하고 있어요..." size="lg" />
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1">
      {/* 프로그레스 바 */}
      <Card className="p-4 mb-4">
        <GolfProgress currentStep={step} totalSteps={3} labels={STEP_LABELS} />
      </Card>

      {error && (
        <div className="mb-4 rounded-lg border border-tee-error/20 bg-tee-error/5 p-3 text-sm text-tee-error">
          {error}
        </div>
      )}

      {/* 스텝 콘텐츠 - 스크롤 가능 영역 */}
      <Card className="flex-1 p-5 overflow-y-auto">
        <StepTransition step={step}>
          {step === 0 && <BasicInfoStep data={data} onChange={handleChange} userId={userId} />}
          {step === 1 && <LessonInfoStep data={data} onChange={handleChange} />}
          {step === 2 && <ContactStep data={data} onChange={handleChange} />}
        </StepTransition>
      </Card>

      {/* 고정 하단 버튼 - 모바일 최적화 */}
      <div className="mt-4 flex gap-3">
        {step > 0 && (
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={isSubmitting}
            className="flex-1 h-12 text-base"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            이전
          </Button>
        )}
        <Button
          variant="primary"
          onClick={handleNext}
          disabled={!canProceed() || isSubmitting}
          className={`h-12 text-base ${step === 0 ? 'w-full' : 'flex-1'}`}
        >
          {step === 2 ? (
            isAuthenticated ? '완료 ⛳' : '로그인하고 저장 →'
          ) : (
            <>
              다음
              <ArrowRight className="ml-2 h-5 w-5" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
