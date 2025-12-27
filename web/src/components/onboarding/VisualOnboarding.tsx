'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import {
  Camera,
  Check,
  ChevronRight,
  ChevronLeft,
  MessageCircle,
  Phone,
  Loader2,
  Copy,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { uploadImage, STORAGE_BUCKETS, ALLOWED_IMAGE_TYPES } from '@/lib/storage';

// ============================================
// Types
// ============================================

export interface OnboardingData {
  name: string;
  profileImageUrl?: string;
  specialty: string;
  priceRange: string;
  contactType: 'kakao' | 'phone';
  contactValue: string;
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

const SPECIALTIES = [
  { value: 'full_swing', label: '풀스윙', icon: '🏌️', color: 'from-green-400 to-emerald-500' },
  { value: 'short_game', label: '숏게임', icon: '⛳', color: 'from-teal-400 to-cyan-500' },
  { value: 'putting', label: '퍼팅', icon: '🎯', color: 'from-blue-400 to-indigo-500' },
  { value: 'course_strategy', label: '코스 전략', icon: '📋', color: 'from-amber-400 to-orange-500' },
  { value: 'fitness', label: '피트니스', icon: '💪', color: 'from-purple-400 to-pink-500' },
  { value: 'mental', label: '멘탈', icon: '🧠', color: 'from-rose-400 to-red-500' },
];

const PRICE_RANGES = [
  { value: 'budget', label: '~5만원', subLabel: '부담없이', icon: '💚' },
  { value: 'standard', label: '5~10만원', subLabel: '합리적인', icon: '💙' },
  { value: 'premium', label: '10~20만원', subLabel: '프리미엄', icon: '💜' },
  { value: 'luxury', label: '20만원~', subLabel: '최상급', icon: '🖤' },
];

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

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      e.target.value = '';

      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) return;
      if (file.size > 5 * 1024 * 1024) return;

      setIsUploading(true);
      try {
        if (!userId) {
          const previewUrl = URL.createObjectURL(file);
          onChange({ profileImageUrl: previewUrl });
          const reader = new FileReader();
          reader.onloadend = () => {
            sessionStorage.setItem('pendingProfileImage', reader.result as string);
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
      {/* 큰 프로필 이미지 영역 */}
      <motion.button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="relative mb-8"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className={`
          relative h-40 w-40 rounded-full overflow-hidden
          ${data.profileImageUrl
            ? 'ring-4 ring-tee-accent-primary/30'
            : 'border-4 border-dashed border-tee-stone'
          }
          transition-all duration-300
        `}>
          {data.profileImageUrl ? (
            <Image
              src={data.profileImageUrl}
              alt="프로필"
              fill
              className="object-cover"
              sizes="160px"
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

        {/* 카메라 버튼 */}
        <motion.div
          className="absolute -bottom-2 -right-2 flex h-14 w-14 items-center justify-center rounded-full bg-tee-accent-primary text-white shadow-lg"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Camera className="h-6 w-6" />
        </motion.div>
      </motion.button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* 이름 입력 - 큰 폰트, 중앙 정렬 */}
      <div className="w-full max-w-xs">
        <input
          type="text"
          value={data.name}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder="이름을 입력하세요"
          className="w-full text-center text-2xl font-bold bg-transparent border-b-2 border-tee-stone py-3 text-tee-ink-strong placeholder:text-tee-ink-muted/50 focus:border-tee-accent-primary focus:outline-none transition-colors"
          autoComplete="name"
        />
      </div>

      <p className="mt-4 text-sm text-tee-ink-muted">
        탭하여 사진 추가
      </p>
    </div>
  );
}

function SpecialtyStep({
  data,
  onChange,
}: {
  data: OnboardingData;
  onChange: (updates: Partial<OnboardingData>) => void;
}) {
  return (
    <div className="flex flex-col flex-1 px-4">
      <h2 className="text-center text-xl font-bold text-tee-ink-strong mb-2">
        전문 분야
      </h2>
      <p className="text-center text-sm text-tee-ink-muted mb-6">
        가장 자신있는 분야 하나를 선택하세요
      </p>

      <div className="grid grid-cols-2 gap-3 flex-1 content-center">
        {SPECIALTIES.map((spec, index) => (
          <motion.button
            key={spec.value}
            type="button"
            onClick={() => onChange({ specialty: spec.value })}
            className={`
              relative overflow-hidden rounded-2xl p-4 text-left
              transition-all duration-200
              ${data.specialty === spec.value
                ? 'ring-2 ring-tee-accent-primary shadow-lg'
                : 'bg-white border border-tee-stone hover:border-tee-ink-muted'
              }
            `}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileTap={{ scale: 0.97 }}
          >
            {/* 선택 시 그라데이션 배경 */}
            {data.specialty === spec.value && (
              <motion.div
                className={`absolute inset-0 bg-gradient-to-br ${spec.color} opacity-10`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.15 }}
              />
            )}

            <div className="relative z-10">
              <span className="text-3xl mb-2 block">{spec.icon}</span>
              <span className={`font-semibold ${data.specialty === spec.value ? 'text-tee-accent-primary' : 'text-tee-ink-strong'}`}>
                {spec.label}
              </span>
            </div>

            {/* 체크 표시 */}
            {data.specialty === spec.value && (
              <motion.div
                className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-tee-accent-primary text-white"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500 }}
              >
                <Check className="h-4 w-4" />
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

function PriceStep({
  data,
  onChange,
}: {
  data: OnboardingData;
  onChange: (updates: Partial<OnboardingData>) => void;
}) {
  return (
    <div className="flex flex-col flex-1 px-4">
      <h2 className="text-center text-xl font-bold text-tee-ink-strong mb-2">
        레슨 가격대
      </h2>
      <p className="text-center text-sm text-tee-ink-muted mb-6">
        1회 레슨 기준 가격대를 선택하세요
      </p>

      <div className="flex flex-col gap-3 flex-1 justify-center">
        {PRICE_RANGES.map((price, index) => (
          <motion.button
            key={price.value}
            type="button"
            onClick={() => onChange({ priceRange: price.value })}
            className={`
              relative flex items-center gap-4 rounded-2xl p-4
              transition-all duration-200
              ${data.priceRange === price.value
                ? 'bg-tee-accent-primary text-white shadow-lg'
                : 'bg-white border border-tee-stone hover:border-tee-ink-muted'
              }
            `}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.08 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="text-2xl">{price.icon}</span>
            <div className="flex-1 text-left">
              <div className="font-bold text-lg">{price.label}</div>
              <div className={`text-sm ${data.priceRange === price.value ? 'text-white/80' : 'text-tee-ink-muted'}`}>
                {price.subLabel}
              </div>
            </div>
            {data.priceRange === price.value && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500 }}
              >
                <Check className="h-6 w-6" />
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

function ContactStep({
  data,
  onChange,
}: {
  data: OnboardingData;
  onChange: (updates: Partial<OnboardingData>) => void;
}) {
  return (
    <div className="flex flex-col flex-1 px-4">
      <h2 className="text-center text-xl font-bold text-tee-ink-strong mb-2">
        연락 방법
      </h2>
      <p className="text-center text-sm text-tee-ink-muted mb-6">
        회원이 문의할 수 있는 연락처를 등록하세요
      </p>

      {/* 연락 방법 선택 */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <motion.button
          type="button"
          onClick={() => onChange({ contactType: 'kakao', contactValue: '' })}
          className={`
            flex flex-col items-center gap-2 rounded-2xl p-5
            transition-all duration-200
            ${data.contactType === 'kakao'
              ? 'bg-[#FEE500] text-[#3C1E1E] shadow-lg'
              : 'bg-white border border-tee-stone'
            }
          `}
          whileTap={{ scale: 0.97 }}
        >
          <MessageCircle className="h-8 w-8" />
          <span className="font-semibold">카카오톡</span>
        </motion.button>

        <motion.button
          type="button"
          onClick={() => onChange({ contactType: 'phone', contactValue: '' })}
          className={`
            flex flex-col items-center gap-2 rounded-2xl p-5
            transition-all duration-200
            ${data.contactType === 'phone'
              ? 'bg-tee-accent-primary text-white shadow-lg'
              : 'bg-white border border-tee-stone'
            }
          `}
          whileTap={{ scale: 0.97 }}
        >
          <Phone className="h-8 w-8" />
          <span className="font-semibold">전화번호</span>
        </motion.button>
      </div>

      {/* 연락처 입력 */}
      <motion.div
        key={data.contactType}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1"
      >
        <input
          type={data.contactType === 'phone' ? 'tel' : 'url'}
          inputMode={data.contactType === 'phone' ? 'tel' : 'url'}
          value={data.contactValue}
          onChange={(e) => onChange({ contactValue: e.target.value })}
          placeholder={data.contactType === 'kakao' ? 'https://open.kakao.com/o/...' : '010-1234-5678'}
          className="w-full rounded-2xl border border-tee-stone bg-white px-5 py-4 text-lg text-tee-ink-strong placeholder:text-tee-ink-muted focus:border-tee-accent-primary focus:outline-none focus:ring-2 focus:ring-tee-accent-primary/20"
        />

        {data.contactType === 'kakao' && (
          <motion.div
            className="mt-4 rounded-xl bg-[#FEE500]/20 p-4 text-sm text-tee-ink-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <span className="font-medium">💡 오픈채팅 만들기:</span><br/>
            카카오톡 → 채팅 → 오픈채팅 → 채팅방 만들기 → 링크 복사
          </motion.div>
        )}
      </motion.div>
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
      {/* 축하 애니메이션 */}
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

          {/* Confetti */}
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
        프로필 완성! 🎉
      </motion.h2>

      <motion.p
        className="text-tee-ink-light mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        이제 링크를 공유해보세요
      </motion.p>

      {/* 링크 카드 */}
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

      {/* 액션 버튼 */}
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
    profileImageUrl: initialData?.profileImageUrl,
    specialty: initialData?.specialty || '',
    priceRange: initialData?.priceRange || '',
    contactType: initialData?.contactType || 'kakao',
    contactValue: initialData?.contactValue || '',
  });

  // Auto-submit after login
  useEffect(() => {
    if (autoSubmit && isAuthenticated && !autoSubmitTriggered.current && initialData) {
      autoSubmitTriggered.current = true;
      const submitData: OnboardingData = {
        name: initialData.name || '',
        profileImageUrl: initialData.profileImageUrl,
        specialty: initialData.specialty || '',
        priceRange: initialData.priceRange || '',
        contactType: initialData.contactType || 'kakao',
        contactValue: initialData.contactValue || '',
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
    if (step === 0) return data.name.trim().length >= 2;
    if (step === 1) return data.specialty !== '';
    if (step === 2) return data.priceRange !== '';
    if (step === 3) return data.contactValue.trim().length > 0;
    return false;
  }, [step, data]);

  const handleSubmit = useCallback(async (submitData: OnboardingData) => {
    setIsSubmitting(true);
    try {
      const result = await onComplete(submitData);
      if (result.success && result.slug) {
        setCompletedSlug(result.slug);
        setStep(4);
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [onComplete]);

  const handleNext = async () => {
    if (step < 3) {
      setStep((s) => s + 1);
      return;
    }
    await handleSubmit(data);
  };

  const handleBack = () => {
    if (step > 0) setStep((s) => s - 1);
  };

  // Completion view
  if (step === 4 && completedSlug) {
    const profileUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/profile/${completedSlug}`;
    return (
      <div className="flex flex-col min-h-[100dvh] bg-gradient-to-b from-tee-background to-white">
        <CompletionStep profileUrl={profileUrl} />
      </div>
    );
  }

  // Loading state
  if (isSubmitting) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-gradient-to-b from-tee-background to-white">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="h-16 w-16 rounded-full border-4 border-tee-stone border-t-tee-accent-primary"
        />
        <p className="mt-4 text-tee-ink-light">프로필 생성 중...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[100dvh] bg-gradient-to-b from-tee-background to-white">
      {/* Progress */}
      <StepIndicator current={step} total={4} />

      {/* Step Content */}
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
            {step === 1 && <SpecialtyStep data={data} onChange={handleChange} />}
            {step === 2 && <PriceStep data={data} onChange={handleChange} />}
            {step === 3 && <ContactStep data={data} onChange={handleChange} />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Navigation - 고정 */}
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
          className={`
            flex-1 flex items-center justify-center gap-2 h-14 rounded-2xl font-semibold text-lg
            transition-all duration-200
            ${canProceed()
              ? 'bg-tee-accent-primary text-white shadow-lg shadow-tee-accent-primary/30'
              : 'bg-tee-stone text-tee-ink-muted'
            }
          `}
          whileTap={canProceed() ? { scale: 0.98 } : {}}
        >
          {step === 3 ? (
            isAuthenticated ? '완료' : '로그인하고 저장'
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
