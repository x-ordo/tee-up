/**
 * Theme Generation & Recommendation Logic
 * TEE:UP Portfolio SaaS - Onboarding Wizard
 */

import type {
  OnboardingQuestion,
  OnboardingAnswers,
  PresetSlug,
  ThemeTokens,
} from './types';

// ============================================
// Onboarding Questions (4-6개, 60초 내 완료 목표)
// ============================================

export const ONBOARDING_QUESTIONS: OnboardingQuestion[] = [
  {
    id: 'mood',
    question: '어떤 분위기를 원하시나요?',
    options: [
      {
        id: 'professional',
        label: '프로페셔널',
        emoji: '💼',
        description: '신뢰감 있고 전문적인',
        weight: { classic: 3, editorial: 1, air: 1 },
      },
      {
        id: 'modern',
        label: '모던',
        emoji: '✨',
        description: '세련되고 트렌디한',
        weight: { classic: 1, editorial: 3, air: 2 },
      },
      {
        id: 'friendly',
        label: '친근함',
        emoji: '🤝',
        description: '편안하고 접근하기 쉬운',
        weight: { classic: 1, editorial: 1, air: 3 },
      },
    ],
  },
  {
    id: 'target',
    question: '주요 고객층은 누구인가요?',
    options: [
      {
        id: 'beginners',
        label: '골프 입문자',
        emoji: '🌱',
        description: '처음 시작하는 분들',
        weight: { classic: 1, editorial: 1, air: 3 },
      },
      {
        id: 'intermediate',
        label: '실력 향상 희망',
        emoji: '📈',
        description: '스코어를 줄이고 싶은 분들',
        weight: { classic: 2, editorial: 2, air: 2 },
      },
      {
        id: 'serious',
        label: 'VIP/진지한 골퍼',
        emoji: '🏆',
        description: '최고의 레슨을 원하는 분들',
        weight: { classic: 3, editorial: 3, air: 1 },
      },
    ],
  },
  {
    id: 'style',
    question: '선호하는 디자인 스타일은?',
    options: [
      {
        id: 'minimal',
        label: '미니멀',
        emoji: '◻️',
        description: '심플하고 깔끔한',
        weight: { classic: 2, editorial: 2, air: 3 },
      },
      {
        id: 'bold',
        label: '임팩트',
        emoji: '🎯',
        description: '강렬하고 눈에 띄는',
        weight: { classic: 1, editorial: 3, air: 1 },
      },
      {
        id: 'elegant',
        label: '엘레강스',
        emoji: '🎩',
        description: '우아하고 고급스러운',
        weight: { classic: 3, editorial: 2, air: 2 },
      },
    ],
  },
  {
    id: 'colorPreference',
    question: '선호하는 컬러 톤은?',
    options: [
      {
        id: 'warm',
        label: '따뜻한 톤',
        emoji: '🌅',
        description: '베이지, 브라운 계열',
        weight: { classic: 3, editorial: 1, air: 2 },
      },
      {
        id: 'cool',
        label: '차가운 톤',
        emoji: '🌊',
        description: '블루, 그레이 계열',
        weight: { classic: 2, editorial: 2, air: 3 },
      },
      {
        id: 'mono',
        label: '모노톤',
        emoji: '⚫',
        description: '블랙 & 화이트',
        weight: { classic: 1, editorial: 3, air: 1 },
      },
    ],
  },
  {
    id: 'contentFocus',
    question: '가장 강조하고 싶은 콘텐츠는?',
    options: [
      {
        id: 'photos',
        label: '사진/영상',
        emoji: '📸',
        description: '시각적 포트폴리오',
        weight: { classic: 1, editorial: 3, air: 2 },
      },
      {
        id: 'credentials',
        label: '경력/자격',
        emoji: '📜',
        description: '전문성과 경험',
        weight: { classic: 3, editorial: 2, air: 1 },
      },
      {
        id: 'personality',
        label: '개성/스토리',
        emoji: '💬',
        description: '나만의 이야기',
        weight: { classic: 1, editorial: 2, air: 3 },
      },
    ],
  },
];

// ============================================
// Recommendation Engine
// ============================================

/**
 * 온보딩 답변을 기반으로 프리셋 추천 점수 계산
 */
export function calculatePresetScores(
  answers: OnboardingAnswers
): Record<PresetSlug, number> {
  const scores: Record<PresetSlug, number> = {
    classic: 0,
    editorial: 0,
    air: 0,
  };

  // 각 답변에 대해 가중치 합산
  for (const question of ONBOARDING_QUESTIONS) {
    const answerId = answers[question.id];
    if (!answerId) continue;

    const option = question.options.find((o) => o.id === answerId);
    if (!option) continue;

    scores.classic += option.weight.classic;
    scores.editorial += option.weight.editorial;
    scores.air += option.weight.air;
  }

  return scores;
}

/**
 * 점수를 기반으로 추천 프리셋 순서 결정
 */
export function getRecommendedPresets(
  answers: OnboardingAnswers
): PresetSlug[] {
  const scores = calculatePresetScores(answers);

  // 점수 내림차순 정렬
  const sorted = Object.entries(scores)
    .sort(([, a], [, b]) => b - a)
    .map(([slug]) => slug as PresetSlug);

  return sorted;
}

/**
 * 프리셋별 설명 텍스트
 */
export const PRESET_DESCRIPTIONS: Record<PresetSlug, string> = {
  classic: '클래식하고 신뢰감 있는 스타일입니다. 전통적인 레슨 프로에게 적합합니다.',
  editorial: '매거진 스타일의 시각적 임팩트. 미디어 중심 프로에게 적합합니다.',
  air: '깨끗하고 가벼운 여백 중심 스타일. 미니멀한 느낌을 원하시면 추천드립니다.',
};

/**
 * 프리셋별 이름
 */
export const PRESET_NAMES: Record<PresetSlug, string> = {
  classic: 'Classic',
  editorial: 'Editorial',
  air: 'Air',
};

// ============================================
// Token Merging
// ============================================

/**
 * 기본 토큰 + 프리셋 토큰 + 변형 토큰 + 사용자 오버라이드 병합
 */
export function mergeTokens(
  baseTokens: ThemeTokens,
  variantOverrides: Partial<ThemeTokens> = {},
  userOverrides: Partial<ThemeTokens> = {}
): ThemeTokens {
  return {
    ...baseTokens,
    ...variantOverrides,
    ...userOverrides,
  };
}

/**
 * 액센트 컬러만 오버라이드
 */
export function applyAccentColor(
  tokens: ThemeTokens,
  accentColor: string
): ThemeTokens {
  return {
    ...tokens,
    accentColor,
    // 라이트/다크 버전 자동 생성 (단순 버전)
    accentColorLight: lightenColor(accentColor, 0.9),
    accentColorDark: darkenColor(accentColor, 0.2),
  };
}

// ============================================
// Color Utilities
// ============================================

/**
 * HEX 컬러를 밝게
 */
function lightenColor(hex: string, factor: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  const r = Math.round(rgb.r + (255 - rgb.r) * factor);
  const g = Math.round(rgb.g + (255 - rgb.g) * factor);
  const b = Math.round(rgb.b + (255 - rgb.b) * factor);

  return rgbToHex(r, g, b);
}

/**
 * HEX 컬러를 어둡게
 */
function darkenColor(hex: string, factor: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  const r = Math.round(rgb.r * (1 - factor));
  const g = Math.round(rgb.g * (1 - factor));
  const b = Math.round(rgb.b * (1 - factor));

  return rgbToHex(r, g, b);
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

function rgbToHex(r: number, g: number, b: number): string {
  return (
    '#' +
    [r, g, b]
      .map((x) => {
        const hex = Math.max(0, Math.min(255, x)).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      })
      .join('')
  );
}
