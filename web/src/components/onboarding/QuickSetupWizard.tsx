'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Check, ArrowRight, ArrowLeft, Copy, ExternalLink, UploadCloud, X, FileText } from 'lucide-react';
import {
  GolfProgress,
  GolfSpinner,
  HoleInOne,
  StepTransition,
} from '@/components/animations/GolfAnimations';
import { ProfileImageUpload } from './ProfileImageUpload';
import { uploadImage, STORAGE_BUCKETS, ALLOWED_IMAGE_TYPES, MAX_FILE_SIZES } from '@/lib/storage';

// ============================================
// Types
// ============================================

export interface QuickSetupData {
  name: string;
  birthDate: string;
  phoneNumber: string;
  profileImageUrl?: string;
  proVerificationFileUrl?: string;
  primaryRegion: string;
  primaryCity: string;
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

const STEP_LABELS = ['기본 정보', '프로 인증', '활동 지역'];

const REGIONS = [
  { value: 'seoul', label: '서울' },
  { value: 'gyeonggi', label: '경기' },
  { value: 'incheon', label: '인천' },
  { value: 'busan', label: '부산' },
  { value: 'daegu', label: '대구' },
  { value: 'gwangju', label: '광주' },
  { value: 'daejeon', label: '대전' },
  { value: 'ulsan', label: '울산' },
  { value: 'sejong', label: '세종' },
  { value: 'gangwon', label: '강원' },
  { value: 'chungbuk', label: '충북' },
  { value: 'chungnam', label: '충남' },
  { value: 'jeonbuk', label: '전북' },
  { value: 'jeonnam', label: '전남' },
  { value: 'gyeongbuk', label: '경북' },
  { value: 'gyeongnam', label: '경남' },
  { value: 'jeju', label: '제주' },
  { value: 'overseas', label: '해외' },
];

const inputClassName = "w-full rounded-xl border border-tee-stone bg-white px-4 py-3.5 text-base text-tee-ink-strong placeholder:text-tee-ink-muted focus:border-tee-accent-primary focus:outline-none focus:ring-2 focus:ring-tee-accent-primary/20 transition-colors";

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const normalizePhone = (value: string) => value.replace(/\D/g, '');

const formatPhone = (value: string) => {
  const numbers = normalizePhone(value);
  if (numbers.length <= 3) return numbers;
  if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
  return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
};

// ============================================
// Step Components
// ============================================

function BasicInfoStep({
  data,
  onChange,
  userId,
}: {
  data: QuickSetupData;
  onChange: (updates: Partial<QuickSetupData>) => void;
  userId?: string;
}) {
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-5">
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
        <label htmlFor="birthDate" className="mb-2 block text-sm font-medium text-tee-ink-strong">
          생년월일 <span className="text-tee-error">*</span>
        </label>
        <input
          id="birthDate"
          type="date"
          value={data.birthDate}
          onChange={(e) => onChange({ birthDate: e.target.value })}
          max={today}
          className={inputClassName}
          autoComplete="bday"
        />
      </div>

      <div>
        <label htmlFor="phoneNumber" className="mb-2 block text-sm font-medium text-tee-ink-strong">
          연락처 <span className="text-tee-error">*</span>
        </label>
        <input
          id="phoneNumber"
          type="tel"
          value={data.phoneNumber}
          onChange={(e) => onChange({ phoneNumber: formatPhone(e.target.value) })}
          placeholder="010-1234-5678"
          className={inputClassName}
          autoComplete="tel"
        />
      </div>
    </div>
  );
}

function VerificationStep({
  data,
  onChange,
  userId,
}: {
  data: QuickSetupData;
  onChange: (updates: Partial<QuickSetupData>) => void;
  userId?: string;
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hasFile = Boolean(data.proVerificationFileUrl);

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      e.target.value = '';

      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        setError('JPG, PNG, WebP 이미지만 업로드 가능합니다.');
        return;
      }

      if (file.size > MAX_FILE_SIZES.IMAGE) {
        setError('5MB 이하 이미지만 업로드 가능합니다.');
        return;
      }

      setError(null);
      setIsUploading(true);

      try {
        if (!userId) {
          const reader = new FileReader();
          reader.onloadend = () => {
            const result = reader.result as string;
            onChange({ proVerificationFileUrl: result });
            sessionStorage.setItem('pendingProVerification', result);
            setIsUploading(false);
          };
          reader.readAsDataURL(file);
          return;
        }

        const result = await uploadImage(file, userId, {
          bucket: STORAGE_BUCKETS.PROFILE_IMAGES,
          folder: 'verification',
          compress: true,
          generateThumbnail: false,
          maxWidth: 1600,
          maxHeight: 1600,
          quality: 0.85,
        });

        if (result.success && result.url) {
          onChange({ proVerificationFileUrl: result.url });
        } else {
          setError(result.error || '업로드에 실패했습니다.');
        }
      } catch {
        setError('업로드 중 오류가 발생했습니다.');
      } finally {
        setIsUploading(false);
      }
    },
    [userId, onChange]
  );

  const handleRemove = useCallback(() => {
    onChange({ proVerificationFileUrl: undefined });
    sessionStorage.removeItem('pendingProVerification');
  }, [onChange]);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-tee-stone bg-white p-5">
        <div className="flex items-start gap-3">
          <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-tee-background">
            <FileText className="h-5 w-5 text-tee-ink-muted" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-tee-ink-strong">프로 인증 서류 업로드</p>
            <p className="mt-1 text-xs text-tee-ink-muted">
              협회/리그 인증서 또는 자격증 이미지를 업로드하세요.
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="h-11 px-4"
          >
            <UploadCloud className="mr-2 h-4 w-4" />
            {hasFile ? '다시 업로드' : '파일 업로드'}
          </Button>

          {hasFile && !isUploading && (
            <div className="flex items-center gap-2 text-xs text-tee-success">
              <Check className="h-4 w-4" />
              업로드 완료
            </div>
          )}

          {hasFile && !isUploading && (
            <button
              type="button"
              onClick={handleRemove}
              className="text-xs text-tee-ink-muted hover:text-tee-ink-strong"
            >
              <X className="mr-1 inline h-3 w-3" />
              삭제
            </button>
          )}

          {isUploading && (
            <span className="text-xs text-tee-ink-muted">업로드 중...</span>
          )}
        </div>

        {error && (
          <p className="mt-3 text-xs text-tee-error">{error}</p>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={ALLOWED_IMAGE_TYPES.join(',')}
        onChange={handleFileSelect}
        className="hidden"
        disabled={isUploading}
      />
    </div>
  );
}

function ActivityLocationStep({
  data,
  onChange,
}: {
  data: QuickSetupData;
  onChange: (updates: Partial<QuickSetupData>) => void;
}) {
  return (
    <div className="space-y-5">
      <div>
        <label htmlFor="primaryRegion" className="mb-2 block text-sm font-medium text-tee-ink-strong">
          주요 활동 지역 <span className="text-tee-error">*</span>
        </label>
        <select
          id="primaryRegion"
          value={data.primaryRegion}
          onChange={(e) => onChange({ primaryRegion: e.target.value })}
          className={inputClassName}
        >
          <option value="">선택하세요</option>
          {REGIONS.map((region) => (
            <option key={region.value} value={region.value}>
              {region.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="primaryCity" className="mb-2 block text-sm font-medium text-tee-ink-strong">
          세부 지역 <span className="text-tee-error">*</span>
        </label>
        <input
          id="primaryCity"
          type="text"
          value={data.primaryCity}
          onChange={(e) => onChange({ primaryCity: e.target.value })}
          placeholder="예: 강남구, 해운대구"
          className={inputClassName}
        />
      </div>

      <div className="rounded-lg bg-tee-background p-3 text-xs text-tee-ink-muted">
        프로필 공개 후에도 활동 지역은 언제든지 수정할 수 있습니다.
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
      <p className="mb-2 text-tee-ink-light text-sm">
        등록이 완료되었습니다. 인증 확인 후 공개됩니다.
      </p>
      <p className="mb-6 text-tee-ink-light text-sm">
        프로필 링크는 승인 후에도 동일하게 유지됩니다.
      </p>

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
    birthDate: initialData?.birthDate || '',
    phoneNumber: initialData?.phoneNumber || '',
    profileImageUrl: initialData?.profileImageUrl,
    proVerificationFileUrl: initialData?.proVerificationFileUrl,
    primaryRegion: initialData?.primaryRegion || '',
    primaryCity: initialData?.primaryCity || '',
  });

  useEffect(() => {
    if (autoSubmit && isAuthenticated && !autoSubmitTriggered.current && initialData) {
      autoSubmitTriggered.current = true;
      const submitData: QuickSetupData = {
        name: initialData.name || '',
        birthDate: initialData.birthDate || '',
        phoneNumber: initialData.phoneNumber || '',
        profileImageUrl: initialData.profileImageUrl,
        proVerificationFileUrl: initialData.proVerificationFileUrl,
        primaryRegion: initialData.primaryRegion || '',
        primaryCity: initialData.primaryCity || '',
      };

      setData(submitData);
      setStep(2);

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
      return (
        data.name.trim().length >= 2 &&
        DATE_PATTERN.test(data.birthDate) &&
        normalizePhone(data.phoneNumber).length >= 10 &&
        Boolean(data.profileImageUrl)
      );
    }
    if (step === 1) {
      return Boolean(data.proVerificationFileUrl);
    }
    if (step === 2) {
      return data.primaryRegion !== '' && data.primaryCity.trim().length > 0;
    }
    return false;
  }, [step, data]);

  const handleNext = async () => {
    if (step < 2) {
      setStep((s) => s + 1);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await onComplete(data);
      if (result.success && result.slug) {
        setCompletedSlug(result.slug);
        setStep(3);
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

  if (isSubmitting) {
    return (
      <div className="flex flex-col flex-1">
        <Card className="p-4 mb-4">
          <GolfProgress currentStep={step} totalSteps={3} labels={STEP_LABELS} />
        </Card>
        <Card className="flex-1 flex items-center justify-center">
          <GolfSpinner message="등록 정보를 저장하고 있어요..." size="lg" />
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1">
      <Card className="p-4 mb-4">
        <GolfProgress currentStep={step} totalSteps={3} labels={STEP_LABELS} />
      </Card>

      {error && (
        <div className="mb-4 rounded-lg border border-tee-error/20 bg-tee-error/5 p-3 text-sm text-tee-error">
          {error}
        </div>
      )}

      <Card className="flex-1 p-5 overflow-y-auto">
        <StepTransition step={step}>
          {step === 0 && <BasicInfoStep data={data} onChange={handleChange} userId={userId} />}
          {step === 1 && <VerificationStep data={data} onChange={handleChange} userId={userId} />}
          {step === 2 && <ActivityLocationStep data={data} onChange={handleChange} />}
        </StepTransition>
      </Card>

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
            isAuthenticated ? '등록 완료' : '로그인하고 저장 →'
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
