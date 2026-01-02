'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import {
  Camera,
  Check,
  ChevronRight,
  ChevronLeft,
  Loader2,
  Copy,
  ExternalLink,
  Sparkles,
  UploadCloud,
  FileText,
  X,
} from 'lucide-react';
import { uploadImage, STORAGE_BUCKETS, ALLOWED_IMAGE_TYPES, MAX_FILE_SIZES } from '@/lib/storage';

// ============================================
// Types
// ============================================

export interface OnboardingData {
  name: string;
  birthDate: string;
  phoneNumber: string;
  profileImageUrl?: string;
  proVerificationFileUrl?: string;
  primaryRegion: string;
  primaryCity: string;
}

interface VisualOnboardingProps {
  onComplete: (data: OnboardingData) => Promise<{ success: boolean; slug?: string; error?: string }>;
  initialData?: Partial<OnboardingData>;
  isAuthenticated?: boolean;
  userId?: string;
  autoSubmit?: boolean;
}

// ============================================
// Constants
// ============================================

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

function ProfileStep({
  data,
  onChange,
  userId,
}: {
  data: OnboardingData;
  onChange: (updates: Partial<OnboardingData>) => void;
  userId?: string;
}) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const today = new Date().toISOString().split('T')[0];

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      e.target.value = '';

      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) return;
      if (file.size > MAX_FILE_SIZES.IMAGE) return;

      setIsUploading(true);
      try {
        if (!userId) {
          const reader = new FileReader();
          reader.onloadend = () => {
            const result = reader.result as string;
            onChange({ profileImageUrl: result });
            sessionStorage.setItem('pendingProfileImage', result);
          };
          reader.readAsDataURL(file);
        } else {
          const result = await uploadImage(file, userId, {
            bucket: STORAGE_BUCKETS.PROFILE_IMAGES,
            folder: 'profiles',
            compress: true,
            generateThumbnail: false,
            maxWidth: 800,
            maxHeight: 800,
            quality: 0.85,
          });
          if (result.success && result.url) {
            onChange({ profileImageUrl: result.url });
          }
        }
      } finally {
        setIsUploading(false);
      }
    },
    [userId, onChange]
  );

  return (
    <div className="flex flex-col items-center justify-center flex-1 px-4">
      <motion.button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="relative mb-8"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className={
          `relative h-36 w-36 rounded-full overflow-hidden transition-all duration-300 ${
            data.profileImageUrl
              ? 'ring-4 ring-tee-accent-primary/30'
              : 'border-4 border-dashed border-tee-stone'
          }`
        }>
          {data.profileImageUrl ? (
            <Image
              src={data.profileImageUrl}
              alt="프로필"
              fill
              className="object-cover"
              sizes="144px"
              unoptimized={data.profileImageUrl.startsWith('data:image/')}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-tee-background to-tee-stone/30">
              <span className="text-6xl opacity-50">👤</span>
            </div>
          )}

          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <Loader2 className="h-10 w-10 animate-spin text-white" />
            </div>
          )}
        </div>

        <motion.div
          className="absolute -bottom-2 -right-2 flex h-12 w-12 items-center justify-center rounded-full bg-tee-accent-primary text-white shadow-lg"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Camera className="h-5 w-5" />
        </motion.div>
      </motion.button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />

      <div className="w-full max-w-xs space-y-4">
        <input
          type="text"
          value={data.name}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder="이름을 입력하세요"
          className="w-full text-center text-2xl font-bold bg-transparent border-b-2 border-tee-stone py-3 text-tee-ink-strong placeholder:text-tee-ink-muted/50 focus:border-tee-accent-primary focus:outline-none transition-colors"
          autoComplete="name"
        />

        <div className="space-y-3">
          <input
            type="date"
            value={data.birthDate}
            onChange={(e) => onChange({ birthDate: e.target.value })}
            max={today}
            className="w-full rounded-2xl border border-tee-stone bg-white px-4 py-3 text-base text-tee-ink-strong focus:border-tee-accent-primary focus:outline-none focus:ring-2 focus:ring-tee-accent-primary/20"
            autoComplete="bday"
          />
          <input
            type="tel"
            value={data.phoneNumber}
            onChange={(e) => onChange({ phoneNumber: formatPhone(e.target.value) })}
            placeholder="010-1234-5678"
            className="w-full rounded-2xl border border-tee-stone bg-white px-4 py-3 text-base text-tee-ink-strong placeholder:text-tee-ink-muted focus:border-tee-accent-primary focus:outline-none focus:ring-2 focus:ring-tee-accent-primary/20"
            autoComplete="tel"
          />
        </div>
      </div>

      <p className="mt-4 text-sm text-tee-ink-muted">
        프로필 사진과 기본 정보를 입력하세요. 사진은 승인 후 언제든 교체할 수 있습니다.
      </p>
    </div>
  );
}

function VerificationStep({
  data,
  onChange,
  userId,
}: {
  data: OnboardingData;
  onChange: (updates: Partial<OnboardingData>) => void;
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
    <div className="flex flex-col flex-1 px-5 justify-center">
      <h2 className="text-center text-xl font-bold text-tee-ink-strong mb-2">
        프로 인증 서류
      </h2>
      <p className="text-center text-sm text-tee-ink-muted mb-2">
        협회/리그 인증서 또는 자격증을 업로드하세요
      </p>
      <p className="text-center text-xs text-tee-ink-muted mb-6">
        인증은 노출을 위한 필수 절차이며, 운영팀이 24시간 내 확인합니다.
      </p>

      <div className="rounded-2xl border border-tee-stone bg-white p-5">
        <div className="flex items-start gap-3">
          <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-tee-background">
            <FileText className="h-5 w-5 text-tee-ink-muted" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-tee-ink-strong">프로 인증 서류 업로드</p>
            <p className="mt-1 text-xs text-tee-ink-muted">
              JPG, PNG, WebP 파일만 가능합니다. (최대 5MB)
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <motion.button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex items-center gap-2 rounded-xl border border-tee-stone px-4 py-2 text-sm font-medium text-tee-ink-strong"
            whileTap={{ scale: 0.97 }}
          >
            <UploadCloud className="h-4 w-4" />
            {hasFile ? '다시 업로드' : '파일 업로드'}
          </motion.button>

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

function LocationStep({
  data,
  onChange,
}: {
  data: OnboardingData;
  onChange: (updates: Partial<OnboardingData>) => void;
}) {
  return (
    <div className="flex flex-col flex-1 px-4">
      <h2 className="text-center text-xl font-bold text-tee-ink-strong mb-2">
        주요 활동 지역
      </h2>
      <p className="text-center text-sm text-tee-ink-muted mb-6">
        주로 활동하는 지역을 입력하세요
      </p>

      <div className="space-y-4 flex-1 flex flex-col justify-center">
        <select
          value={data.primaryRegion}
          onChange={(e) => onChange({ primaryRegion: e.target.value })}
          className="w-full rounded-2xl border border-tee-stone bg-white px-4 py-3 text-base text-tee-ink-strong focus:border-tee-accent-primary focus:outline-none focus:ring-2 focus:ring-tee-accent-primary/20"
        >
          <option value="">지역 선택</option>
          {REGIONS.map((region) => (
            <option key={region.value} value={region.value}>
              {region.label}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={data.primaryCity}
          onChange={(e) => onChange({ primaryCity: e.target.value })}
          placeholder="예: 강남구, 해운대구"
          className="w-full rounded-2xl border border-tee-stone bg-white px-4 py-3 text-base text-tee-ink-strong placeholder:text-tee-ink-muted focus:border-tee-accent-primary focus:outline-none focus:ring-2 focus:ring-tee-accent-primary/20"
        />
        <div className="rounded-xl bg-tee-background px-4 py-3 text-xs text-tee-ink-muted">
          승인 후 프로필에서 언제든지 수정할 수 있습니다.
        </div>
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
    <div className="flex flex-col items-center justify-center flex-1 px-4 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className="mb-6"
      >
        <div className="relative">
          <motion.div
            className="h-24 w-24 rounded-full bg-gradient-to-br from-tee-accent-primary to-emerald-400 flex items-center justify-center"
            animate={{
              boxShadow: ['0 0 0 0 rgba(10, 54, 43, 0.4)', '0 0 0 20px rgba(10, 54, 43, 0)']
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Sparkles className="h-12 w-12 text-white" />
          </motion.div>

          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                backgroundColor: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'][i % 6],
                left: '50%',
                top: '50%',
              }}
              initial={{ x: 0, y: 0, scale: 0 }}
              animate={{
                x: Math.cos(i * 30 * Math.PI / 180) * 80,
                y: Math.sin(i * 30 * Math.PI / 180) * 80,
                scale: [0, 1, 0],
              }}
              transition={{ duration: 1, delay: 0.3 }}
            />
          ))}
        </div>
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-tee-ink-strong mb-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        등록 완료! 🎉
      </motion.h2>

      <motion.p
        className="text-tee-ink-light mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        보통 24시간 내 검증이 완료되며, 완료 즉시 프로필이 공개됩니다. 담당 매니저가 연락드립니다.
      </motion.p>

      <motion.div
        className="w-full max-w-sm rounded-2xl bg-tee-background p-4 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <p className="text-xs text-tee-ink-muted mb-2">내 프로필 링크</p>
        <div className="flex items-center gap-2">
          <code className="flex-1 truncate rounded-xl bg-white px-4 py-3 text-sm text-tee-ink-strong border border-tee-stone">
            {profileUrl}
          </code>
          <motion.button
            onClick={handleCopy}
            className={`flex h-12 w-12 items-center justify-center rounded-xl transition-colors ${
              copied ? 'bg-tee-success text-white' : 'bg-tee-accent-primary text-white'
            }`}
            whileTap={{ scale: 0.95 }}
          >
            {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
          </motion.button>
        </div>
      </motion.div>

      <motion.div
        className="w-full max-w-sm space-y-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <a
          href={profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full h-14 rounded-2xl bg-tee-accent-primary text-white font-semibold text-lg"
        >
          <ExternalLink className="h-5 w-5" />
          프로필 보기
        </a>
        <a
          href="/dashboard"
          className="flex items-center justify-center w-full h-14 rounded-2xl border-2 border-tee-stone text-tee-ink-strong font-semibold"
        >
          대시보드로 이동
        </a>
      </motion.div>
    </div>
  );
}

// ============================================
// Progress Indicator
// ============================================

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center justify-center gap-2 py-4">
      {[...Array(total)].map((_, i) => (
        <motion.div
          key={i}
          className={`h-2 rounded-full transition-all duration-300 ${
            i === current
              ? 'w-8 bg-tee-accent-primary'
              : i < current
                ? 'w-2 bg-tee-accent-primary/50'
                : 'w-2 bg-tee-stone'
          }`}
          animate={i === current ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
        />
      ))}
    </div>
  );
}

// ============================================
// Main Component
// ============================================

export default function VisualOnboarding({
  onComplete,
  initialData,
  isAuthenticated = false,
  userId,
  autoSubmit = false,
}: VisualOnboardingProps) {
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedSlug, setCompletedSlug] = useState<string | null>(null);
  const autoSubmitTriggered = useRef(false);

  const [data, setData] = useState<OnboardingData>({
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
      const submitData: OnboardingData = {
        name: initialData.name || '',
        birthDate: initialData.birthDate || '',
        phoneNumber: initialData.phoneNumber || '',
        profileImageUrl: initialData.profileImageUrl,
        proVerificationFileUrl: initialData.proVerificationFileUrl,
        primaryRegion: initialData.primaryRegion || '',
        primaryCity: initialData.primaryCity || '',
      };
      setData(submitData);
      handleSubmit(submitData);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoSubmit, isAuthenticated, initialData]);

  const handleChange = useCallback((updates: Partial<OnboardingData>) => {
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
    if (step === 1) return Boolean(data.proVerificationFileUrl);
    if (step === 2) return data.primaryRegion !== '' && data.primaryCity.trim().length > 0;
    return false;
  }, [step, data]);

  const handleSubmit = useCallback(async (submitData: OnboardingData) => {
    setIsSubmitting(true);
    try {
      const result = await onComplete(submitData);
      if (result.success && result.slug) {
        setCompletedSlug(result.slug);
        setStep(3);
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [onComplete]);

  const handleNext = async () => {
    if (step < 2) {
      setStep((s) => s + 1);
      return;
    }
    await handleSubmit(data);
  };

  const handleBack = () => {
    if (step > 0) setStep((s) => s - 1);
  };

  if (step === 3 && completedSlug) {
    const profileUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/profile/${completedSlug}`;
    return (
      <div className="flex flex-col min-h-[100dvh] bg-gradient-to-b from-tee-background to-white">
        <CompletionStep profileUrl={profileUrl} />
      </div>
    );
  }

  if (isSubmitting) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-gradient-to-b from-tee-background to-white">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="h-16 w-16 rounded-full border-4 border-tee-stone border-t-tee-accent-primary"
        />
        <p className="mt-4 text-tee-ink-light">등록 정보 저장 중...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[100dvh] bg-gradient-to-b from-tee-background to-white">
      <StepIndicator current={step} total={3} />
      <p className="px-6 text-center text-sm text-tee-ink-muted">
        필수 정보만 완료하면 전담 매니저가 검증을 진행해 24시간 내 공개 및 리드 연결을 시작합니다.
      </p>

      <div className="flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.2 }}
            className="flex-1 flex flex-col"
          >
            {step === 0 && <ProfileStep data={data} onChange={handleChange} userId={userId} />}
            {step === 1 && <VerificationStep data={data} onChange={handleChange} userId={userId} />}
            {step === 2 && <LocationStep data={data} onChange={handleChange} />}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex-shrink-0 p-4 pb-8 flex gap-3">
        {step > 0 && (
          <motion.button
            onClick={handleBack}
            className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-tee-stone bg-white"
            whileTap={{ scale: 0.95 }}
          >
            <ChevronLeft className="h-6 w-6 text-tee-ink-light" />
          </motion.button>
        )}

        <motion.button
          onClick={handleNext}
          disabled={!canProceed()}
          className={
            `flex-1 flex items-center justify-center gap-2 h-14 rounded-2xl font-semibold text-lg transition-all duration-200 ${
              canProceed()
                ? 'bg-tee-accent-primary text-white shadow-lg shadow-tee-accent-primary/30'
                : 'bg-tee-stone text-tee-ink-muted'
            }`
          }
          whileTap={canProceed() ? { scale: 0.98 } : {}}
        >
          {step === 2 ? (
            isAuthenticated ? '등록 완료' : '로그인하고 저장'
          ) : (
            <>
              다음
              <ChevronRight className="h-5 w-5" />
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
}
