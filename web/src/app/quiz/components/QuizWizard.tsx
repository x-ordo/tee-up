'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { getMatchedProfiles } from '@/actions/profiles';
import type { ExploreProfile } from '@/actions/profiles';

type QuizAnswers = {
  skillLevel: string;
  focusArea: string;
  lessonStyle: string;
  region: string;
  budget: string;
};

type Question = {
  id: keyof QuizAnswers;
  title: string;
  subtitle: string;
  options: Array<{
    value: string;
    label: string;
    description: string;
  }>;
};

const questions: Question[] = [
  {
    id: 'skillLevel',
    title: '현재 골프 실력은 어느 정도인가요?',
    subtitle: '가장 가까운 단계를 선택해주세요',
    options: [
      { value: 'beginner', label: '처음 시작해요', description: '클럽을 처음 잡아봐요' },
      { value: 'novice', label: '필드 나가봤어요', description: '필드 라운딩 경험이 있어요' },
      { value: 'intermediate', label: '90타 전후예요', description: '어느 정도 스윙이 잡혀있어요' },
      { value: 'advanced', label: '싱글 목표예요', description: '80타 이하를 목표로 해요' },
    ],
  },
  {
    id: 'focusArea',
    title: '어떤 부분을 개선하고 싶으세요?',
    subtitle: '가장 중요한 부분을 선택해주세요',
    options: [
      { value: 'swing', label: '기본 스윙', description: '풀스윙 자세와 감각' },
      { value: 'driver', label: '드라이버 비거리', description: '장타와 정확성' },
      { value: 'shortgame', label: '숏게임/어프로치', description: '웨지 샷과 칩샷' },
      { value: 'putting', label: '퍼팅', description: '그린 위 정확성' },
      { value: 'course', label: '코스 매니지먼트', description: '전략적 플레이' },
    ],
  },
  {
    id: 'lessonStyle',
    title: '선호하는 레슨 스타일은?',
    subtitle: '나에게 맞는 스타일을 선택해주세요',
    options: [
      { value: 'systematic', label: '체계적 커리큘럼', description: '단계별로 차근차근' },
      { value: 'practical', label: '실전 위주', description: '필드/라운딩 중심' },
      { value: 'video', label: '영상 분석', description: '스윙 촬영 및 분석' },
      { value: 'intensive', label: '집중 교정', description: '특정 문제 집중 해결' },
    ],
  },
  {
    id: 'region',
    title: '레슨 받고 싶은 지역은?',
    subtitle: '활동 지역을 선택해주세요',
    options: [
      { value: 'seoul', label: '서울', description: '서울 전 지역' },
      { value: 'gyeonggi', label: '경기', description: '경기도 전 지역' },
      { value: 'incheon', label: '인천', description: '인천 전 지역' },
      { value: 'busan', label: '부산/경남', description: '부산, 경남 지역' },
      { value: 'other', label: '그 외 지역', description: '기타 지역' },
    ],
  },
  {
    id: 'budget',
    title: '레슨 예산은 어느 정도인가요?',
    subtitle: '회당 기준으로 선택해주세요',
    options: [
      { value: 'low', label: '5만원 이하', description: '합리적인 가격대' },
      { value: 'medium', label: '5~10만원', description: '일반적인 가격대' },
      { value: 'high', label: '10~20만원', description: '프리미엄 레슨' },
      { value: 'premium', label: '20만원 이상', description: '투어 프로급 레슨' },
    ],
  },
];

type MatchedPro = ExploreProfile & {
  matchScore: number;
};

export default function QuizWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>({});
  const [matchedPros, setMatchedPros] = useState<MatchedPro[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [isPending, startTransition] = useTransition();

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  const handleSelect = (value: string) => {
    const newAnswers = { ...answers, [currentQuestion.id]: value };
    setAnswers(newAnswers);

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Quiz complete, fetch matched pros
      startTransition(async () => {
        const result = await getMatchedProfiles(newAnswers as QuizAnswers);
        if (result.success) {
          setMatchedPros(result.data);
        }
        setIsComplete(true);
      });
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setAnswers({});
    setMatchedPros([]);
    setIsComplete(false);
  };

  if (isComplete) {
    return <QuizResults matchedPros={matchedPros} onRestart={handleRestart} />;
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      {/* Header */}
      <div className="mb-8 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-tee-stone bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-tee-ink-muted">
          Pro Matching Quiz
        </span>
        <h1 className="mt-4 text-2xl font-semibold text-tee-ink-strong md:text-3xl">
          나에게 딱 맞는 프로 찾기
        </h1>
        <p className="mt-2 text-sm text-tee-ink-light">
          5개 질문에 답하면 맞춤 프로를 추천해드려요
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs text-tee-ink-muted">
          <span>
            {currentStep + 1} / {questions.length}
          </span>
          <span>{Math.round(progress)}% 완료</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-tee-stone/40">
          <div
            className="h-full rounded-full bg-tee-accent-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="rounded-3xl border border-tee-stone/60 bg-white p-8 shadow-card">
        <h2 className="text-xl font-semibold text-tee-ink-strong">
          {currentQuestion.title}
        </h2>
        <p className="mt-2 text-sm text-tee-ink-light">
          {currentQuestion.subtitle}
        </p>

        {/* Options */}
        <div className="mt-6 space-y-3">
          {currentQuestion.options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              disabled={isPending}
              className={`flex w-full items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all hover:border-tee-accent-primary hover:bg-tee-accent-primary/5 disabled:cursor-not-allowed disabled:opacity-50 ${
                answers[currentQuestion.id] === option.value
                  ? 'border-tee-accent-primary bg-tee-accent-primary/5'
                  : 'border-tee-stone/60 bg-white'
              }`}
            >
              <div
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                  answers[currentQuestion.id] === option.value
                    ? 'border-tee-accent-primary bg-tee-accent-primary'
                    : 'border-tee-stone'
                }`}
              >
                {answers[currentQuestion.id] === option.value && (
                  <svg
                    className="h-3 w-3 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>
              <div>
                <p className="font-medium text-tee-ink-strong">{option.label}</p>
                <p className="mt-0.5 text-sm text-tee-ink-light">
                  {option.description}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className="text-sm font-medium text-tee-ink-muted transition-colors hover:text-tee-ink-strong disabled:invisible"
          >
            ← 이전
          </button>
          {isPending && (
            <div className="flex items-center gap-2 text-sm text-tee-ink-muted">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-tee-accent-primary border-t-transparent" />
              매칭 중...
            </div>
          )}
        </div>
      </div>

      {/* Skip Link */}
      <div className="mt-6 text-center">
        <Link
          href="/explore"
          className="text-sm text-tee-ink-muted hover:text-tee-ink-strong"
        >
          퀴즈 없이 프로 둘러보기 →
        </Link>
      </div>
    </div>
  );
}

function QuizResults({
  matchedPros,
  onRestart,
}: {
  matchedPros: MatchedPro[];
  onRestart: () => void;
}) {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-tee-accent-primary/10">
          <svg
            className="h-8 w-8 text-tee-accent-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-semibold text-tee-ink-strong md:text-3xl">
          맞춤 프로를 찾았어요!
        </h1>
        <p className="mt-2 text-sm text-tee-ink-light">
          {matchedPros.length > 0
            ? `${matchedPros.length}명의 프로가 매칭되었습니다`
            : '조건에 맞는 프로를 찾고 있습니다'}
        </p>
      </div>

      {/* Matched Pros */}
      {matchedPros.length > 0 ? (
        <div className="space-y-4">
          {matchedPros.map((pro, index) => (
            <div
              key={pro.id}
              className="flex gap-4 rounded-2xl border border-tee-stone/60 bg-white p-6 shadow-card transition-shadow hover:shadow-lg"
            >
              {/* Rank Badge */}
              <div className="flex shrink-0 flex-col items-center gap-2">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white ${
                    index === 0
                      ? 'bg-tee-accent-secondary'
                      : index === 1
                        ? 'bg-tee-stone'
                        : 'bg-tee-ink-muted'
                  }`}
                >
                  {index + 1}위
                </div>
                <span className="text-xs font-semibold text-tee-accent-primary">
                  {pro.matchScore}% 일치
                </span>
              </div>

              {/* Profile */}
              <div className="flex flex-1 gap-4">
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-tee-stone/30">
                  {pro.profileImageUrl || pro.heroImageUrl ? (
                    <img
                      src={pro.profileImageUrl || pro.heroImageUrl || ''}
                      alt={pro.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <svg
                        className="h-10 w-10 text-tee-stone"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-tee-ink-strong">
                        {pro.title}
                      </h3>
                      <p className="mt-0.5 text-sm text-tee-ink-muted">
                        {pro.location || '활동 지역 확인 중'}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <svg
                        className="h-4 w-4 text-tee-accent-secondary"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="font-semibold text-tee-accent-secondary">
                        {pro.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>

                  {pro.bio && (
                    <p className="mt-2 line-clamp-2 text-sm text-tee-ink-light">
                      {pro.bio}
                    </p>
                  )}

                  <div className="mt-3 flex flex-wrap gap-2">
                    {pro.specialties.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-tee-stone/40 px-3 py-1 text-xs text-tee-ink-muted"
                      >
                        {tag}
                      </span>
                    ))}
                    {pro.certifications.length > 0 && (
                      <span className="rounded-full bg-tee-accent-primary/10 px-3 py-1 text-xs text-tee-accent-primary">
                        {pro.certifications[0]}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex shrink-0 flex-col justify-center gap-2">
                <Link
                  href={`/${pro.slug}`}
                  className="rounded-full bg-tee-accent-primary px-5 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-tee-accent-primary-hover"
                >
                  프로필 보기
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-tee-stone/60 bg-white p-12 text-center shadow-card">
          <p className="text-tee-ink-muted">
            조건에 맞는 프로를 찾지 못했어요.
          </p>
          <Link
            href="/explore"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-tee-accent-primary px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-105"
          >
            전체 프로 둘러보기
          </Link>
        </div>
      )}

      {/* Bottom Actions */}
      <div className="mt-8 flex items-center justify-center gap-4">
        <button
          onClick={onRestart}
          className="text-sm font-medium text-tee-ink-muted hover:text-tee-ink-strong"
        >
          다시 매칭하기
        </button>
        <Link
          href="/explore"
          className="text-sm font-medium text-tee-accent-primary hover:underline"
        >
          전체 프로 보기 →
        </Link>
      </div>

      {/* CTA */}
      <div className="mt-12 rounded-3xl border border-tee-stone/60 bg-gradient-to-r from-tee-accent-primary to-tee-accent-primary/80 p-8 text-center text-white shadow-lg">
        <h2 className="text-xl font-semibold">아직 결정이 어려우신가요?</h2>
        <p className="mt-2 text-sm text-white/80">
          운영팀이 직접 상담해드려요. 부담없이 문의하세요.
        </p>
        <Link
          href="/#chat"
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-tee-accent-primary transition-transform hover:scale-105"
        >
          무료 상담 신청
        </Link>
      </div>
    </div>
  );
}
