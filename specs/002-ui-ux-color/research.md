# Research: UI/UX와 컬러 개선

**Feature**: 002-ui-ux-color
**Date**: 2025-12-02
**Status**: Complete

## Research Summary

이 문서는 다크 모드, 마이크로인터랙션, 색상 시스템 확장을 위한 기술 조사 결과를 정리한다.

---

## 1. Dark Mode Implementation

### Decision: next-themes + Tailwind CSS selector 전략

### Rationale
- **next-themes**는 Next.js에서 다크 모드 구현을 위한 사실상 표준 라이브러리
- 2줄 코드로 완벽한 다크 모드 지원 (Flash of Unstyled Content 방지)
- 시스템 설정 자동 감지, localStorage 저장, SSR 지원
- Tailwind CSS와 완벽 호환

### Alternatives Considered
| 방식 | 장점 | 단점 | 결정 |
|------|------|------|------|
| CSS Media Query (prefers-color-scheme) | 별도 라이브러리 불필요 | 수동 토글 불가, 사용자 설정 저장 불가 | 기각 |
| 직접 구현 (Context + localStorage) | 완전 제어 가능 | FOUC 문제, SSR 복잡성, 휠 재발명 | 기각 |
| **next-themes** | 모든 문제 해결, 검증된 라이브러리 | 추가 의존성 (~3KB) | **채택** |

### Implementation Pattern

```tsx
// tailwind.config.js
module.exports = {
  darkMode: 'selector', // Tailwind v3.4.1+
  // ...
}

// app/layout.tsx
import { ThemeProvider } from 'next-themes'

export default function RootLayout({ children }) {
  return (
    <html suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

// components/ThemeToggle.tsx
'use client'
import { useTheme } from 'next-themes'

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  return (
    <button onClick={() => setTheme(resolvedTheme === 'light' ? 'dark' : 'light')}>
      Toggle Theme
    </button>
  )
}
```

### Dark Mode Color Tokens

Korean Luxury Minimalism 철학에 맞춘 다크 모드 색상:

```css
/* Light Mode (기존) */
--calm-white: #FAFAF9;     /* 페이지 배경 */
--calm-cloud: #F4F4F2;     /* 카드 배경 */
--calm-stone: #E8E8E5;     /* 보더, 구분선 */
--calm-charcoal: #52524E;  /* 본문 텍스트 */
--calm-obsidian: #1A1A17;  /* 제목 */

/* Dark Mode (신규) */
--calm-white: #0F0F0E;     /* 페이지 배경 (거의 검정) */
--calm-cloud: #1A1A17;     /* 카드 배경 */
--calm-stone: #2A2A26;     /* 보더, 구분선 */
--calm-charcoal: #A3A39E;  /* 본문 텍스트 */
--calm-obsidian: #FAFAF9;  /* 제목 (반전) */

/* Accent (동일) */
--calm-accent: #3B82F6;    /* 다크/라이트 모두 동일 */
```

---

## 2. Micro-interactions & Animations

### Decision: Tailwind CSS transition + 커스텀 keyframes

### Rationale
- tailwindcss-animate 플러그인은 과도한 기능 제공 (이 프로젝트에 불필요)
- Tailwind CSS 기본 transition 유틸리티로 대부분 충족
- 필요한 애니메이션만 global.css에 커스텀 정의
- Korean Luxury Minimalism: 섬세하고 절제된 애니메이션

### Alternatives Considered
| 방식 | 장점 | 단점 | 결정 |
|------|------|------|------|
| tailwindcss-animate 플러그인 | 많은 프리셋 | 과도한 기능, 번들 크기 증가 | 기각 |
| Framer Motion | 강력한 애니메이션 | 큰 번들 (~150KB), 과도한 복잡성 | 기각 |
| **Tailwind transition + 커스텀** | 경량, 충분한 기능 | 직접 정의 필요 | **채택** |

### Animation Guidelines

```css
/* 기본 전환 시간 */
--transition-fast: 150ms;    /* hover 상태 */
--transition-normal: 200ms;  /* 일반 전환 */
--transition-slow: 300ms;    /* 모달, 큰 요소 */

/* 이징 함수 */
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);  /* 자연스러운 감속 */
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1); /* 부드러운 전환 */
```

### Key Animations

```css
/* 페이드 인 (페이지 로드) */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 카드 호버 */
.card-hover {
  transition: transform 200ms ease-out, box-shadow 200ms ease-out;
}
.card-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px -5px rgba(0, 0, 0, 0.1);
}

/* 버튼 호버 */
.btn-hover {
  transition: all 150ms ease-out;
}
.btn-hover:hover {
  transform: scale(1.02);
}

/* Reduced Motion 존중 */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 3. Color System Extension

### Decision: CSS 변수 확장 + 시맨틱 토큰

### Rationale
- 기존 global.css의 CSS 변수 패턴 유지
- 시맨틱 네이밍으로 용도별 색상 정의
- 다크 모드에서 자동 전환되도록 설계

### Extended Color Tokens

```css
/* 상태 색상 (Semantic) */
--success: #10B981;         /* 성공 - 에메랄드 그린 */
--success-bg: #D1FAE5;      /* 성공 배경 */
--success-dark: #059669;    /* 성공 진한 */

--warning: #F59E0B;         /* 경고 - 앰버 */
--warning-bg: #FEF3C7;      /* 경고 배경 */
--warning-dark: #D97706;    /* 경고 진한 */

--error: #EF4444;           /* 에러 - 레드 */
--error-bg: #FEE2E2;        /* 에러 배경 */
--error-dark: #DC2626;      /* 에러 진한 */

/* 브랜드 색상 */
--brand-kakao: #FEE500;     /* 카카오 노랑 */
--brand-kakao-text: #000000;/* 카카오 텍스트 */
--brand-kakao-hover: #E6CF00;/* 카카오 호버 */

/* 다크 모드 상태 색상 */
.dark {
  --success: #34D399;
  --success-bg: #064E3B;
  --warning: #FBBF24;
  --warning-bg: #78350F;
  --error: #F87171;
  --error-bg: #7F1D1D;
}
```

---

## 4. Skeleton UI Patterns

### Decision: CSS 애니메이션 기반 스켈레톤

### Rationale
- JavaScript 불필요, 순수 CSS로 구현
- shimmer 효과로 로딩 상태 표시
- 기존 Skeleton.tsx 컴포넌트 확장

### Implementation Pattern

```css
/* Shimmer 애니메이션 */
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.skeleton {
  background: linear-gradient(
    90deg,
    var(--calm-cloud) 0%,
    var(--calm-stone) 50%,
    var(--calm-cloud) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
}

/* 다크 모드 */
.dark .skeleton {
  background: linear-gradient(
    90deg,
    var(--calm-cloud) 0%,
    var(--calm-stone) 50%,
    var(--calm-cloud) 100%
  );
}
```

### Skeleton Variants

```tsx
// 텍스트 스켈레톤
<div className="skeleton h-4 w-3/4" />

// 이미지 스켈레톤
<div className="skeleton aspect-video w-full" />

// 카드 스켈레톤
<div className="skeleton-card">
  <div className="skeleton h-48 w-full" />
  <div className="p-4 space-y-2">
    <div className="skeleton h-4 w-1/2" />
    <div className="skeleton h-4 w-full" />
  </div>
</div>
```

---

## 5. Empty & Error States

### Decision: 재사용 가능한 컴포넌트 + 일관된 디자인

### Rationale
- 모든 빈 상태/에러 상태에 일관된 UX 제공
- 행동 지향적 메시지 + CTA 버튼
- 간단한 일러스트레이션 (SVG 아이콘)

### Component API

```tsx
// EmptyState 컴포넌트
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// ErrorState 컴포넌트
interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}
```

---

## 6. Dependencies

### New Dependencies

| 패키지 | 버전 | 용도 | 크기 |
|--------|------|------|------|
| next-themes | ^0.4.x | 다크 모드 | ~3KB |

### No New Dependencies Needed For
- 애니메이션 (Tailwind CSS 기본 제공)
- 스켈레톤 UI (커스텀 CSS)
- 색상 시스템 (CSS 변수 확장)
- 빈/에러 상태 (커스텀 컴포넌트)

---

## 7. Performance Considerations

### Theme Switching
- next-themes는 HTML attribute 방식으로 FOUC 방지
- 테마 전환 시 reflow 최소화 (CSS 변수 사용)

### Animations
- `will-change` 속성 사용 자제 (필요한 경우만)
- GPU 가속: transform, opacity만 애니메이션
- prefers-reduced-motion 필수 지원

### Bundle Size Impact
- next-themes: +3KB (gzipped)
- 추가 CSS: ~2KB (gzipped)
- **총 증가량: ~5KB** (허용 범위)

---

## 8. Accessibility Checklist

- [ ] 다크 모드에서 WCAG AA 명암비 4.5:1 이상
- [ ] prefers-reduced-motion 존중
- [ ] 테마 토글에 aria-label 제공
- [ ] 스켈레톤에 aria-busy="true" 적용
- [ ] 에러 메시지에 role="alert" 적용
- [ ] 포커스 상태 다크/라이트 모두 명확

---

## References

- [next-themes GitHub](https://github.com/pacocoursey/next-themes)
- [Tailwind CSS Dark Mode](https://tailwindcss.com/docs/dark-mode)
- [WCAG Color Contrast](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [Reduced Motion Best Practices](https://web.dev/prefers-reduced-motion/)
