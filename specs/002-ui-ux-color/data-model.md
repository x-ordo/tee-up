# Data Model: UI/UX와 컬러 개선

**Feature**: 002-ui-ux-color
**Date**: 2025-12-02

## Overview

이 기능은 프론트엔드 전용 변경이므로 데이터베이스 스키마 변경이 없다.
대신 TypeScript 타입 정의와 CSS 토큰 구조를 정의한다.

---

## TypeScript Types

### Theme Types

```typescript
// types/theme.ts

/** 지원하는 테마 값 */
export type Theme = 'light' | 'dark';

/** 테마 설정 (시스템 포함) */
export type ThemePreference = 'light' | 'dark' | 'system';

/** useTheme 훅 반환 타입 */
export interface UseThemeReturn {
  /** 현재 적용된 테마 (system 해석 후) */
  theme: Theme | undefined;
  /** 사용자 설정 테마 */
  setTheme: (theme: ThemePreference) => void;
  /** 시스템 테마 해석 후 실제 테마 */
  resolvedTheme: Theme | undefined;
  /** 현재 설정된 테마 (system 포함) */
  themes: ThemePreference[];
  /** 시스템 테마 사용 여부 */
  systemTheme: Theme | undefined;
}
```

### Loading State Types

```typescript
// types/loading.ts

/** 데이터 로딩 상태 */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

/** 비동기 데이터 상태 */
export interface AsyncState<T> {
  data: T | null;
  status: LoadingState;
  error: Error | null;
}

/** 스켈레톤 컴포넌트 Props */
export interface SkeletonProps {
  /** 스켈레톤 너비 (Tailwind 클래스 또는 CSS 값) */
  width?: string;
  /** 스켈레톤 높이 (Tailwind 클래스 또는 CSS 값) */
  height?: string;
  /** 원형 스켈레톤 여부 */
  circle?: boolean;
  /** 추가 CSS 클래스 */
  className?: string;
}
```

### Empty/Error State Types

```typescript
// types/states.ts

/** 빈 상태 컴포넌트 Props */
export interface EmptyStateProps {
  /** 아이콘 (React 노드 또는 SVG) */
  icon?: React.ReactNode;
  /** 제목 */
  title: string;
  /** 설명 (선택) */
  description?: string;
  /** CTA 버튼 (선택) */
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
  };
  /** 추가 CSS 클래스 */
  className?: string;
}

/** 에러 상태 컴포넌트 Props */
export interface ErrorStateProps {
  /** 에러 제목 */
  title?: string;
  /** 에러 설명 */
  description?: string;
  /** 재시도 콜백 */
  onRetry?: () => void;
  /** 홈으로 이동 콜백 */
  onGoHome?: () => void;
  /** 에러 코드 (개발용) */
  errorCode?: string;
  /** 추가 CSS 클래스 */
  className?: string;
}
```

### Animation Types

```typescript
// types/animation.ts

/** 애니메이션 지속 시간 */
export type AnimationDuration = 'fast' | 'normal' | 'slow';

/** 애니메이션 지속 시간 매핑 (ms) */
export const ANIMATION_DURATION: Record<AnimationDuration, number> = {
  fast: 150,
  normal: 200,
  slow: 300,
} as const;

/** 애니메이션 이징 함수 */
export type AnimationEasing = 'ease-out' | 'ease-in-out' | 'linear';

/** 페이드 인 애니메이션 Props */
export interface FadeInProps {
  /** 지연 시간 (ms) */
  delay?: number;
  /** 지속 시간 */
  duration?: AnimationDuration;
  /** 자식 요소 */
  children: React.ReactNode;
}
```

---

## CSS Token Structure

### Color Tokens (CSS Variables)

```css
/* Light Mode (기본) */
:root {
  /* Base Neutrals */
  --calm-white: #FAFAF9;
  --calm-cloud: #F4F4F2;
  --calm-stone: #E8E8E5;
  --calm-ash: #8A8A85;
  --calm-charcoal: #52524E;
  --calm-obsidian: #1A1A17;

  /* Accent */
  --calm-accent: #3B82F6;
  --calm-accent-light: #DBEAFE;
  --calm-accent-dark: #1E40AF;

  /* Semantic - Success */
  --success: #10B981;
  --success-bg: #D1FAE5;
  --success-dark: #059669;

  /* Semantic - Warning */
  --warning: #F59E0B;
  --warning-bg: #FEF3C7;
  --warning-dark: #D97706;

  /* Semantic - Error */
  --error: #EF4444;
  --error-bg: #FEE2E2;
  --error-dark: #DC2626;

  /* Brand - Kakao */
  --brand-kakao: #FEE500;
  --brand-kakao-text: #000000;
  --brand-kakao-hover: #E6CF00;

  /* Animation */
  --transition-fast: 150ms;
  --transition-normal: 200ms;
  --transition-slow: 300ms;
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Dark Mode */
.dark {
  /* Base Neutrals (반전) */
  --calm-white: #0F0F0E;
  --calm-cloud: #1A1A17;
  --calm-stone: #2A2A26;
  --calm-ash: #6A6A65;
  --calm-charcoal: #A3A39E;
  --calm-obsidian: #FAFAF9;

  /* Accent (동일) */
  --calm-accent: #3B82F6;
  --calm-accent-light: #1E3A5F;
  --calm-accent-dark: #60A5FA;

  /* Semantic - Success (다크 조정) */
  --success: #34D399;
  --success-bg: #064E3B;
  --success-dark: #6EE7B7;

  /* Semantic - Warning (다크 조정) */
  --warning: #FBBF24;
  --warning-bg: #78350F;
  --warning-dark: #FCD34D;

  /* Semantic - Error (다크 조정) */
  --error: #F87171;
  --error-bg: #7F1D1D;
  --error-dark: #FCA5A5;

  /* Brand - Kakao (동일) */
  --brand-kakao: #FEE500;
  --brand-kakao-text: #000000;
  --brand-kakao-hover: #E6CF00;
}
```

---

## Component Relationships

```
┌─────────────────────────────────────────────────────────────┐
│                      ThemeProvider                          │
│                    (next-themes)                            │
└─────────────────────┬───────────────────────────────────────┘
                      │
         ┌────────────┼────────────┐
         │            │            │
         ▼            ▼            ▼
┌─────────────┐ ┌──────────┐ ┌──────────────┐
│ ThemeToggle │ │ useTheme │ │ CSS Variables│
│ (UI)        │ │ (Hook)   │ │ (global.css) │
└─────────────┘ └──────────┘ └──────────────┘
                      │
         ┌────────────┼────────────┐
         │            │            │
         ▼            ▼            ▼
┌─────────────┐ ┌──────────┐ ┌──────────────┐
│  Skeleton   │ │EmptyState│ │  ErrorState  │
│ Components  │ │Component │ │  Component   │
└─────────────┘ └──────────┘ └──────────────┘
```

---

## Validation Rules

### Theme
- Theme 값은 'light', 'dark' 중 하나여야 함
- localStorage 키: 'theme'
- 시스템 테마가 undefined인 경우 'light' 기본값

### Animation
- 모든 애니메이션은 300ms 이하
- prefers-reduced-motion 시 애니메이션 0ms로 설정
- transform/opacity만 애니메이션 (reflow 방지)

### Color Contrast
- 라이트 모드: 텍스트 명암비 최소 4.5:1
- 다크 모드: 텍스트 명암비 최소 4.5:1
- 포커스 상태: 테두리 명암비 최소 3:1

---

## State Transitions

### Theme State

```
┌─────────┐  setTheme('dark')  ┌─────────┐
│  light  │ ────────────────▶  │  dark   │
└─────────┘                    └─────────┘
     ▲                              │
     │      setTheme('light')       │
     └──────────────────────────────┘

           setTheme('system')
               │
               ▼
         ┌─────────┐
         │ system  │ ── resolves to ──▶ light | dark
         └─────────┘    (based on OS)
```

### Loading State

```
┌──────┐  fetch()   ┌─────────┐  success  ┌─────────┐
│ idle │ ─────────▶ │ loading │ ────────▶ │ success │
└──────┘            └─────────┘           └─────────┘
                         │
                         │ error
                         ▼
                    ┌─────────┐  retry()  ┌─────────┐
                    │  error  │ ────────▶ │ loading │
                    └─────────┘           └─────────┘
```
