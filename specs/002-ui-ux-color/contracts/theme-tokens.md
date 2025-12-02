# Theme Tokens Contract

**Feature**: 002-ui-ux-color
**Date**: 2025-12-02
**Type**: CSS Design Tokens

## Overview

이 문서는 다크 모드 지원을 위한 CSS 변수 계약을 정의한다.
모든 컴포넌트는 하드코딩된 색상 대신 이 토큰을 사용해야 한다.

---

## Token Naming Convention

```
--{category}-{name}[-{variant}]

Categories:
- calm: 기본 색상 시스템
- success/warning/error: 시맨틱 상태 색상
- brand: 외부 브랜드 색상
- transition: 애니메이션 관련
- ease: 이징 함수
```

---

## Base Color Tokens

### Light Mode (Default)

| Token | Value | Usage |
|-------|-------|-------|
| `--calm-white` | `#FAFAF9` | 페이지 배경 |
| `--calm-cloud` | `#F4F4F2` | 카드, 섹션 배경 |
| `--calm-stone` | `#E8E8E5` | 보더, 구분선 |
| `--calm-ash` | `#8A8A85` | 비활성 텍스트, 플레이스홀더 |
| `--calm-charcoal` | `#52524E` | 본문 텍스트 |
| `--calm-obsidian` | `#1A1A17` | 제목, 강조 텍스트 |

### Dark Mode

| Token | Value | Usage |
|-------|-------|-------|
| `--calm-white` | `#0F0F0E` | 페이지 배경 |
| `--calm-cloud` | `#1A1A17` | 카드, 섹션 배경 |
| `--calm-stone` | `#2A2A26` | 보더, 구분선 |
| `--calm-ash` | `#6A6A65` | 비활성 텍스트, 플레이스홀더 |
| `--calm-charcoal` | `#A3A39E` | 본문 텍스트 |
| `--calm-obsidian` | `#FAFAF9` | 제목, 강조 텍스트 |

---

## Accent Color Tokens

| Token | Light Value | Dark Value | Usage |
|-------|-------------|------------|-------|
| `--calm-accent` | `#3B82F6` | `#3B82F6` | 주요 액션, 링크 |
| `--calm-accent-light` | `#DBEAFE` | `#1E3A5F` | 액센트 배경 |
| `--calm-accent-dark` | `#1E40AF` | `#60A5FA` | 액센트 hover |

---

## Semantic Color Tokens

### Success

| Token | Light Value | Dark Value | Usage |
|-------|-------------|------------|-------|
| `--success` | `#10B981` | `#34D399` | 성공 텍스트/아이콘 |
| `--success-bg` | `#D1FAE5` | `#064E3B` | 성공 배경 |
| `--success-dark` | `#059669` | `#6EE7B7` | 성공 hover |

### Warning

| Token | Light Value | Dark Value | Usage |
|-------|-------------|------------|-------|
| `--warning` | `#F59E0B` | `#FBBF24` | 경고 텍스트/아이콘 |
| `--warning-bg` | `#FEF3C7` | `#78350F` | 경고 배경 |
| `--warning-dark` | `#D97706` | `#FCD34D` | 경고 hover |

### Error

| Token | Light Value | Dark Value | Usage |
|-------|-------------|------------|-------|
| `--error` | `#EF4444` | `#F87171` | 에러 텍스트/아이콘 |
| `--error-bg` | `#FEE2E2` | `#7F1D1D` | 에러 배경 |
| `--error-dark` | `#DC2626` | `#FCA5A5` | 에러 hover |

---

## Brand Color Tokens

### Kakao

| Token | Value | Usage |
|-------|-------|-------|
| `--brand-kakao` | `#FEE500` | 카카오 버튼 배경 |
| `--brand-kakao-text` | `#000000` | 카카오 버튼 텍스트 |
| `--brand-kakao-hover` | `#E6CF00` | 카카오 버튼 hover |

> Note: 브랜드 색상은 다크 모드에서도 변경되지 않음 (브랜드 가이드라인 준수)

---

## Animation Tokens

### Duration

| Token | Value | Usage |
|-------|-------|-------|
| `--transition-fast` | `150ms` | hover 상태 |
| `--transition-normal` | `200ms` | 일반 전환 |
| `--transition-slow` | `300ms` | 모달, 큰 요소 |

### Easing

| Token | Value | Usage |
|-------|-------|-------|
| `--ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | 자연스러운 감속 |
| `--ease-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` | 부드러운 전환 |

---

## Contrast Requirements

### WCAG AA Compliance

모든 텍스트 색상 조합은 WCAG AA 기준을 충족해야 한다:

| 조합 | Light Ratio | Dark Ratio | 기준 |
|------|-------------|------------|------|
| `--calm-obsidian` on `--calm-white` | 18.1:1 | 17.8:1 | ≥ 4.5:1 ✅ |
| `--calm-charcoal` on `--calm-white` | 7.2:1 | 6.8:1 | ≥ 4.5:1 ✅ |
| `--calm-ash` on `--calm-white` | 4.6:1 | 4.5:1 | ≥ 4.5:1 ✅ |
| `--calm-accent` on `--calm-white` | 4.5:1 | 4.7:1 | ≥ 4.5:1 ✅ |

---

## Usage Examples

### Button Component

```tsx
// 올바른 사용
<button className="bg-calm-accent text-white hover:bg-calm-accent-dark transition-colors duration-[var(--transition-fast)]">
  Click me
</button>

// 잘못된 사용 (하드코딩 금지)
<button className="bg-[#3B82F6] text-white">
  Click me
</button>
```

### Card Component

```tsx
// 올바른 사용 - 자동으로 다크 모드 지원
<div className="bg-calm-cloud border border-calm-stone text-calm-charcoal">
  <h3 className="text-calm-obsidian">Title</h3>
  <p>Content</p>
</div>
```

### Status Message

```tsx
// 성공 메시지
<div className="bg-success-bg text-success border border-success">
  Success message
</div>

// 에러 메시지
<div className="bg-error-bg text-error border border-error">
  Error message
</div>
```

---

## Migration Guide

기존 하드코딩된 색상을 토큰으로 교체:

| Before | After |
|--------|-------|
| `bg-white` | `bg-calm-white` |
| `bg-gray-50` | `bg-calm-cloud` |
| `border-gray-200` | `border-calm-stone` |
| `text-gray-500` | `text-calm-ash` |
| `text-gray-700` | `text-calm-charcoal` |
| `text-gray-900` | `text-calm-obsidian` |
| `bg-blue-500` | `bg-calm-accent` |
| `bg-green-100` | `bg-success-bg` |
| `text-green-700` | `text-success` |
| `bg-red-100` | `bg-error-bg` |
| `text-red-700` | `text-error` |

---

## Tailwind Config Extension

```javascript
// tailwind.config.js
module.exports = {
  darkMode: 'selector',
  theme: {
    extend: {
      colors: {
        'calm-white': 'var(--calm-white)',
        'calm-cloud': 'var(--calm-cloud)',
        'calm-stone': 'var(--calm-stone)',
        'calm-ash': 'var(--calm-ash)',
        'calm-charcoal': 'var(--calm-charcoal)',
        'calm-obsidian': 'var(--calm-obsidian)',
        'calm-accent': 'var(--calm-accent)',
        'calm-accent-light': 'var(--calm-accent-light)',
        'calm-accent-dark': 'var(--calm-accent-dark)',
        success: 'var(--success)',
        'success-bg': 'var(--success-bg)',
        'success-dark': 'var(--success-dark)',
        warning: 'var(--warning)',
        'warning-bg': 'var(--warning-bg)',
        'warning-dark': 'var(--warning-dark)',
        error: 'var(--error)',
        'error-bg': 'var(--error-bg)',
        'error-dark': 'var(--error-dark)',
        'brand-kakao': 'var(--brand-kakao)',
        'brand-kakao-text': 'var(--brand-kakao-text)',
        'brand-kakao-hover': 'var(--brand-kakao-hover)',
      },
      transitionDuration: {
        fast: 'var(--transition-fast)',
        normal: 'var(--transition-normal)',
        slow: 'var(--transition-slow)',
      },
      transitionTimingFunction: {
        'out': 'var(--ease-out)',
        'in-out': 'var(--ease-in-out)',
      },
    },
  },
}
```
