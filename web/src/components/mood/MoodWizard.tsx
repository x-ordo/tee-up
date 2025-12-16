'use client';

import { useState, useCallback } from 'react';
import {
  ONBOARDING_QUESTIONS,
  getRecommendedPresets,
  PRESET_NAMES,
  PRESET_DESCRIPTIONS,
} from '@/lib/theme/generate';
import { applyThemeToDocument, DEFAULT_TOKENS } from '@/lib/theme/apply';
import type {
  OnboardingAnswers,
  OnboardingQuestion,
  OnboardingOption,
  PresetSlug,
  ThemeTokens,
} from '@/lib/theme/types';
import { cn } from '@/lib/utils';

// ============================================
// Types
// ============================================

interface MoodWizardProps {
  onComplete: (result: {
    selectedPreset: PresetSlug;
    answers: OnboardingAnswers;
  }) => void;
  onPreviewPreset?: (presetSlug: PresetSlug) => void;
  presetTokens?: Record<PresetSlug, ThemeTokens>;
  className?: string;
}

type WizardStep = 'questions' | 'results' | 'confirm';

// ============================================
// Preset Preview Tokens (하드코딩, 실제로는 DB에서 로드)
// ============================================

const PREVIEW_TOKENS: Record<PresetSlug, Partial<ThemeTokens>> = {
  classic: {
    accentColor: '#3B82F6',
    colorBackground: '#FAFAF9',
    borderRadius: '8px',
  },
  editorial: {
    accentColor: '#000000',
    colorBackground: '#FFFFFF',
    borderRadius: '0px',
  },
  air: {
    accentColor: '#2563EB',
    colorBackground: '#FFFFFF',
    borderRadius: '16px',
  },
};

// ============================================
// Main Component
// ============================================

export function MoodWizard({
  onComplete,
  onPreviewPreset,
  presetTokens,
  className,
}: MoodWizardProps) {
  const [step, setStep] = useState<WizardStep>('questions');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<OnboardingAnswers>({});
  const [recommendedPresets, setRecommendedPresets] = useState<PresetSlug[]>([]);
  const [selectedPreset, setSelectedPreset] = useState<PresetSlug | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const currentQuestion = ONBOARDING_QUESTIONS[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / ONBOARDING_QUESTIONS.length) * 100;

  // 답변 선택 핸들러
  const handleSelectOption = useCallback(
    (option: OnboardingOption) => {
      const newAnswers = {
        ...answers,
        [currentQuestion.id]: option.id,
      };
      setAnswers(newAnswers);

      // 다음 질문으로 이동 또는 결과 표시
      if (currentQuestionIndex < ONBOARDING_QUESTIONS.length - 1) {
        setIsAnimating(true);
        setTimeout(() => {
          setCurrentQuestionIndex((prev) => prev + 1);
          setIsAnimating(false);
        }, 300);
      } else {
        // 마지막 질문 완료 - 추천 계산
        const recommended = getRecommendedPresets(newAnswers);
        setRecommendedPresets(recommended);
        setSelectedPreset(recommended[0]); // 1순위 자동 선택
        setStep('results');
      }
    },
    [answers, currentQuestion, currentQuestionIndex]
  );

  // 프리셋 선택 핸들러
  const handleSelectPreset = useCallback(
    (preset: PresetSlug) => {
      setSelectedPreset(preset);

      // 프리뷰 적용
      if (onPreviewPreset) {
        onPreviewPreset(preset);
      } else if (presetTokens?.[preset]) {
        applyThemeToDocument(presetTokens[preset]);
      } else {
        // 기본 프리뷰 토큰 적용
        const previewToken = { ...DEFAULT_TOKENS, ...PREVIEW_TOKENS[preset] };
        applyThemeToDocument(previewToken as ThemeTokens);
      }
    },
    [onPreviewPreset, presetTokens]
  );

  // 완료 핸들러
  const handleConfirm = useCallback(() => {
    if (!selectedPreset) return;

    onComplete({
      selectedPreset,
      answers,
    });
  }, [selectedPreset, answers, onComplete]);

  // 이전 질문으로
  const handleBack = useCallback(() => {
    if (step === 'results') {
      setStep('questions');
      setCurrentQuestionIndex(ONBOARDING_QUESTIONS.length - 1);
    } else if (currentQuestionIndex > 0) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentQuestionIndex((prev) => prev - 1);
        setIsAnimating(false);
      }, 200);
    }
  }, [step, currentQuestionIndex]);

  return (
    <div className={cn('w-full max-w-lg mx-auto', className)}>
      {/* Progress Bar */}
      {step === 'questions' && (
        <div className="mb-8">
          <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-2 text-sm text-gray-500 text-center">
            {currentQuestionIndex + 1} / {ONBOARDING_QUESTIONS.length}
          </p>
        </div>
      )}

      {/* Step Content */}
      {step === 'questions' && currentQuestion && (
        <QuestionStep
          key={currentQuestion.id}
          question={currentQuestion}
          selectedOption={answers[currentQuestion.id]}
          onSelect={handleSelectOption}
          onBack={currentQuestionIndex > 0 ? handleBack : undefined}
          isAnimating={isAnimating}
        />
      )}

      {step === 'results' && (
        <ResultsStep
          recommendedPresets={recommendedPresets}
          selectedPreset={selectedPreset}
          onSelectPreset={handleSelectPreset}
          onConfirm={handleConfirm}
          onBack={handleBack}
        />
      )}
    </div>
  );
}

// ============================================
// Question Step
// ============================================

interface QuestionStepProps {
  question: OnboardingQuestion;
  selectedOption?: string;
  onSelect: (option: OnboardingOption) => void;
  onBack?: () => void;
  isAnimating?: boolean;
}

function QuestionStep({
  question,
  selectedOption,
  onSelect,
  onBack,
  isAnimating,
}: QuestionStepProps) {
  return (
    <div
      className={cn(
        'transition-all duration-300',
        isAnimating ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'
      )}
    >
      {/* Question */}
      <h2 className="text-2xl font-semibold text-center mb-8">
        {question.question}
      </h2>

      {/* Options */}
      <div className="space-y-3">
        {question.options.map((option) => (
          <button
            key={option.id}
            onClick={() => onSelect(option)}
            className={cn(
              'w-full p-4 rounded-xl border-2 text-left transition-all duration-200',
              'hover:border-blue-400 hover:bg-blue-50',
              selectedOption === option.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 bg-white'
            )}
          >
            <div className="flex items-center gap-3">
              {option.emoji && (
                <span className="text-2xl">{option.emoji}</span>
              )}
              <div>
                <p className="font-medium">{option.label}</p>
                {option.description && (
                  <p className="text-sm text-gray-500">{option.description}</p>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Back Button */}
      {onBack && (
        <button
          onClick={onBack}
          className="mt-6 text-gray-500 hover:text-gray-700 text-sm"
        >
          ← 이전
        </button>
      )}
    </div>
  );
}

// ============================================
// Results Step
// ============================================

interface ResultsStepProps {
  recommendedPresets: PresetSlug[];
  selectedPreset: PresetSlug | null;
  onSelectPreset: (preset: PresetSlug) => void;
  onConfirm: () => void;
  onBack: () => void;
}

function ResultsStep({
  recommendedPresets,
  selectedPreset,
  onSelectPreset,
  onConfirm,
  onBack,
}: ResultsStepProps) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold mb-2">
          추천 스타일이 준비되었어요!
        </h2>
        <p className="text-gray-500">
          마음에 드는 스타일을 선택해주세요
        </p>
      </div>

      {/* Preset Cards */}
      <div className="space-y-4">
        {recommendedPresets.map((preset, index) => (
          <button
            key={preset}
            onClick={() => onSelectPreset(preset)}
            className={cn(
              'w-full p-5 rounded-xl border-2 text-left transition-all duration-200',
              'hover:border-blue-400',
              selectedPreset === preset
                ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                : 'border-gray-200 bg-white'
            )}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-lg">
                    {PRESET_NAMES[preset]}
                  </span>
                  {index === 0 && (
                    <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full">
                      추천
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500">
                  {PRESET_DESCRIPTIONS[preset]}
                </p>
              </div>

              {/* Preview Swatch */}
              <div
                className="w-12 h-12 border-2 flex-shrink-0"
                style={{
                  backgroundColor: PREVIEW_TOKENS[preset].colorBackground,
                  borderColor: PREVIEW_TOKENS[preset].accentColor,
                  borderRadius: PREVIEW_TOKENS[preset].borderRadius,
                }}
              />
            </div>
          </button>
        ))}
      </div>

      {/* Actions */}
      <div className="mt-8 flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 py-3 px-4 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
        >
          다시 선택
        </button>
        <button
          onClick={onConfirm}
          disabled={!selectedPreset}
          className={cn(
            'flex-1 py-3 px-4 rounded-xl font-medium transition-colors',
            selectedPreset
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          )}
        >
          이 스타일로 시작
        </button>
      </div>
    </div>
  );
}

export default MoodWizard;
