# Design Tokens Reference

**Feature**: 003-screen-definitions
**Date**: 2025-12-18
**Source**: `web/src/app/global.css`, `web/tailwind.config.ts`

---

## Overview

TEE:UP 프로젝트의 디자인 토큰 참조 문서이다.
모든 화면 정의에서 하드코딩된 값 대신 이 토큰들을 사용해야 한다.

---

## Color Tokens

### Base Colors (tee-* unified naming)

| Token | CSS Variable | Light Value | Dark Value | Usage |
|-------|--------------|-------------|------------|-------|
| `tee-background` | `var(--tee-background)` | #F7F4F0 | #1A1A17 | 페이지 배경 |
| `tee-surface` | `var(--tee-surface)` | #FFFFFF | #2A2A27 | 카드, 모달 배경 |
| `tee-stone` | `var(--tee-stone)` | #E8E8E5 | #3A3A37 | 보더, 구분선 |
| `tee-ink-strong` | `var(--tee-ink-strong)` | #1A1A1A | #FAFAF9 | 제목, 강조 텍스트 |
| `tee-ink-light` | `var(--tee-ink-light)` | #52524E | #A8A8A5 | 본문 텍스트 |
| `tee-ink-muted` | `var(--tee-ink-muted)` | #8A8A87 | #6A6A67 | 플레이스홀더, 비활성 |

### Accent Colors

| Token | CSS Variable | Light Value | Dark Value | Usage |
|-------|--------------|-------------|------------|-------|
| `tee-accent-primary` | `var(--tee-accent-primary)` | #0A362B | #4ABA9A | 주요 액션 (Forest Green) |
| `tee-accent-primary-hover` | `var(--tee-accent-primary-hover)` | #072A21 | #5FCBAB | 호버 상태 |
| `tee-accent-primary-active` | `var(--tee-accent-primary-active)` | #051E18 | #3AA98A | 활성 상태 |
| `tee-accent-primary-disabled` | `var(--tee-accent-primary-disabled)` | #B4C6BF | #2A4A42 | 비활성 상태 |
| `tee-accent-secondary` | `var(--tee-accent-secondary)` | #B39A68 | #D4B888 | 보조 액센트 (Gold) |

### Semantic Colors

| Token | CSS Variable | Light Value | Dark Value | Usage |
|-------|--------------|-------------|------------|-------|
| `tee-error` | `var(--tee-error)` | #D32F2F | #EF5350 | 에러, 삭제 |
| `tee-success` | `var(--tee-success)` | #388E3C | #66BB6A | 성공, 완료 |
| `tee-warning` | `var(--tee-warning)` | #FBC02D | #FFCA28 | 경고, 주의 |
| `tee-info` | `var(--tee-info)` | #1976D2 | #42A5F5 | 정보 |

### Brand Colors

| Token | CSS Variable | Value | Usage |
|-------|--------------|-------|-------|
| `tee-kakao` | `var(--tee-kakao)` | #FEE500 | 카카오톡 버튼 배경 |
| `tee-kakao-text` | `var(--tee-kakao-text)` | #3C1E1E | 카카오톡 버튼 텍스트 |

---

## Typography Tokens

### Font Families

| Token | Value | Usage |
|-------|-------|-------|
| `font-pretendard` | Cafe24ProSlim, sans-serif | 한글 (Display/Body) |
| `font-inter` | Cafe24ProSlim, sans-serif | 영문 (Global) |
| `font-mono` | JetBrains Mono, monospace | 코드, 숫자 |

### Font Sizes

| Token | Tailwind | Size | Line Height | Usage |
|-------|----------|------|-------------|-------|
| `text-h1` | `text-h1` | 3rem (48px) | 1.2 | 페이지 제목 |
| `text-h2` | `text-h2` | 2.25rem (36px) | 1.25 | 섹션 제목 |
| `text-h3` | `text-h3` | 1.5rem (24px) | 1.3 | 서브 제목 |
| `text-body` | `text-body` | 1rem (16px) | 1.5 | 본문 |
| `text-caption` | `text-caption` | 0.875rem (14px) | 1.4 | 캡션, 레이블 |

### Font Weights

| Token | Value | Usage |
|-------|-------|-------|
| `font-normal` | 400 | 본문 |
| `font-medium` | 500 | 강조 |
| `font-semibold` | 600 | 제목 |
| `font-bold` | 700 | 강한 강조 |

---

## Spacing Tokens

| Token | Tailwind | Value | Usage |
|-------|----------|-------|-------|
| `space-1` | `p-1`, `m-1` | 4px | 최소 간격 |
| `space-2` | `p-2`, `m-2` | 8px | 작은 간격 |
| `space-3` | `p-3`, `m-3` | 12px | 기본 간격 |
| `space-4` | `p-4`, `m-4` | 16px | 중간 간격 |
| `space-5` | `p-5`, `m-5` | 20px | 중간 큰 간격 |
| `space-6` | `p-6`, `m-6` | 24px | 큰 간격 |
| `space-8` | `p-8`, `m-8` | 32px | 섹션 간격 |
| `space-10` | `p-10`, `m-10` | 40px | 큰 섹션 간격 |
| `space-12` | `p-12`, `m-12` | 48px | 매우 큰 간격 |
| `space-16` | `p-16`, `m-16` | 64px | 페이지 여백 |
| `space-20` | `p-20`, `m-20` | 80px | 히어로 여백 |
| `space-24` | `p-24`, `m-24` | 96px | 대형 여백 |
| `space-32` | `p-32`, `m-32` | 128px | 최대 여백 |

---

## Border Radius Tokens

| Token | Tailwind | Value | Usage |
|-------|----------|-------|-------|
| `rounded-sm` | `rounded-sm` | 0.25rem (4px) | 작은 요소, 칩 |
| `rounded-md` | `rounded-md` | 0.5rem (8px) | 버튼, 인풋 |
| `rounded-lg` | `rounded-lg` | 1rem (16px) | 카드 |
| `rounded-xl` | `rounded-xl` | 1.25rem (20px) | 모달 |
| `rounded-full` | `rounded-full` | 9999px | 아바타, 뱃지 |

---

## Shadow Tokens

| Token | Tailwind | Value | Usage |
|-------|----------|-------|-------|
| `shadow-sm` | `shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | 미세한 그림자 |
| `shadow` | `shadow` | `0 1px 3px rgba(0,0,0,0.1)` | 기본 그림자 |
| `shadow-md` | `shadow-md` | `0 4px 6px rgba(0,0,0,0.1)` | 카드 그림자 |
| `shadow-lg` | `shadow-lg` | `0 10px 15px rgba(0,0,0,0.1)` | 호버 그림자 |
| `shadow-xl` | `shadow-xl` | `0 20px 25px rgba(0,0,0,0.1)` | 모달 그림자 |

---

## Animation Tokens

### Duration

| Token | CSS Variable | Value | Usage |
|-------|--------------|-------|-------|
| `duration-fast` | `var(--duration-fast)` | 150ms | 호버, 포커스 |
| `duration-medium1` | `var(--duration-medium1)` | 200ms | 상태 변화 |
| `duration-medium2` | `var(--duration-medium2)` | 250ms | 전환 |
| `duration-medium3` | `var(--duration-medium3)` | 300ms | 모달 열기/닫기 |
| `duration-slow` | `var(--duration-slow)` | 400ms | 페이지 애니메이션 |

### Easing (M3 Standard Motion)

| Token | CSS Variable | Value | Usage |
|-------|--------------|-------|-------|
| `ease-standard` | `var(--ease-standard)` | `cubic-bezier(0.2, 0, 0, 1)` | 일반 전환 |
| `ease-standard-decelerate` | `var(--ease-standard-decelerate)` | `cubic-bezier(0, 0, 0, 1)` | 진입 |
| `ease-standard-accelerate` | `var(--ease-standard-accelerate)` | `cubic-bezier(0.3, 0, 1, 1)` | 퇴출 |

---

## Z-Index Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `z-0` | 0 | 기본 |
| `z-10` | 10 | 드롭다운 |
| `z-20` | 20 | 스티키 헤더 |
| `z-30` | 30 | 고정 요소 |
| `z-40` | 40 | 모달 오버레이 |
| `z-50` | 50 | 모달 콘텐츠 |

---

## Usage Examples

### Tailwind Classes

```tsx
// 올바른 사용
<div className="bg-tee-surface border border-tee-stone rounded-lg p-6 shadow-md">
  <h2 className="text-h2 text-tee-ink-strong font-semibold mb-4">
    제목
  </h2>
  <p className="text-body text-tee-ink-light">
    본문 텍스트
  </p>
  <Button className="bg-tee-accent-primary hover:bg-tee-accent-primary-hover">
    액션
  </Button>
</div>

// 잘못된 사용 (하드코딩)
<div className="bg-white border border-gray-200 rounded-lg p-6">
  <h2 className="text-2xl text-gray-900">제목</h2>
</div>
```

### CSS Variables

```css
.custom-component {
  background: var(--tee-surface);
  border: 1px solid var(--tee-stone);
  color: var(--tee-ink-strong);
  transition: all var(--duration-medium2) var(--ease-standard);
}

.custom-component:hover {
  background: var(--tee-accent-primary);
  color: white;
}
```

---

## Migration Guide

기존 하드코딩된 값을 토큰으로 교체:

| Before | After |
|--------|-------|
| `bg-white` | `bg-tee-surface` |
| `bg-[#F7F4F0]` | `bg-tee-background` |
| `border-gray-200` | `border-tee-stone` |
| `text-gray-500` | `text-tee-ink-muted` |
| `text-gray-700` | `text-tee-ink-light` |
| `text-gray-900` | `text-tee-ink-strong` |
| `bg-green-600` | `bg-tee-accent-primary` |
| `bg-red-500` | `bg-tee-error` |
| `bg-green-500` | `bg-tee-success` |
| `bg-yellow-500` | `bg-tee-warning` |

---

## References

- [global.css](../../../web/src/app/global.css) - CSS 변수 정의
- [tailwind.config.ts](../../../web/tailwind.config.ts) - Tailwind 설정
- [002-ui-ux-color/contracts/theme-tokens.md](../../002-ui-ux-color/contracts/theme-tokens.md) - 테마 토큰
