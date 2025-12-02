# Quickstart: UI/UX와 컬러 개선

**Feature**: 002-ui-ux-color
**Date**: 2025-12-02

## Prerequisites

- Node.js 18+
- npm 9+
- 기존 TEE:UP 프로젝트 설정 완료

---

## Setup

### 1. Install Dependencies

```bash
cd web
npm install next-themes
```

### 2. Configure Tailwind

```javascript
// tailwind.config.js
module.exports = {
  darkMode: 'selector', // ← 추가
  theme: {
    extend: {
      // ... 기존 설정 유지
    },
  },
}
```

### 3. Wrap App with ThemeProvider

```tsx
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
```

---

## Development

### Start Dev Server

```bash
npm run dev
```

### Run Tests

```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Accessibility tests
npm run test:e2e -- accessibility.spec.ts
```

### Check Types

```bash
npm run type-check
```

---

## Validation Checklist

### User Story 1: Dark Mode

- [ ] 테마 토글 버튼이 모든 페이지에서 접근 가능
- [ ] 시스템 테마 설정이 자동 감지됨
- [ ] 테마 변경 시 localStorage에 저장됨
- [ ] 페이지 새로고침 시 테마 유지됨
- [ ] FOUC(Flash of Unstyled Content) 없음

### User Story 2: Micro-interactions

- [ ] 버튼 hover 시 부드러운 전환 효과
- [ ] 카드 hover 시 그림자 변화
- [ ] 페이지 로드 시 fade-in 애니메이션
- [ ] 모달 열기/닫기 애니메이션
- [ ] prefers-reduced-motion 존중

### User Story 3: Color System

- [ ] 모든 하드코딩된 색상이 CSS 변수로 교체됨
- [ ] 성공/경고/에러 상태 색상 일관성
- [ ] 카카오 버튼 브랜드 색상 적용

### User Story 4: Loading States

- [ ] 스켈레톤 UI shimmer 효과 동작
- [ ] 데이터 로딩 시 스켈레톤 표시
- [ ] 버튼 로딩 시 스피너 표시 및 disabled

### User Story 5: Empty/Error States

- [ ] 빈 상태 메시지 + CTA 버튼 표시
- [ ] 에러 상태 메시지 + 재시도 버튼 표시
- [ ] 404 페이지 디자인 일관성

### Accessibility

- [ ] 다크 모드 명암비 WCAG AA (4.5:1) 충족
- [ ] 모든 애니메이션 300ms 이내
- [ ] 테마 토글에 aria-label 적용
- [ ] lighthouse 접근성 점수 90+ 유지

---

## Key Files

| 파일 | 설명 |
|------|------|
| `web/src/app/global.css` | 다크 모드 토큰, 애니메이션 keyframes |
| `web/src/app/layout.tsx` | ThemeProvider 래퍼 |
| `web/src/app/components/ThemeToggle.tsx` | 테마 전환 버튼 |
| `web/src/hooks/useTheme.ts` | 테마 관리 훅 |
| `web/src/app/components/Skeleton.tsx` | 스켈레톤 컴포넌트 |
| `web/src/app/components/EmptyState.tsx` | 빈 상태 컴포넌트 |
| `web/src/app/components/ErrorState.tsx` | 에러 상태 컴포넌트 |
| `web/tailwind.config.js` | 다크 모드 설정 |

---

## Testing Commands

```bash
# 단위 테스트 실행
npm test

# 특정 테스트 파일 실행
npm test -- useTheme.test.ts

# E2E 테스트 실행
npm run test:e2e

# 특정 E2E 테스트 실행
npm run test:e2e -- theme.spec.ts

# 접근성 테스트만 실행
npm run test:e2e -- accessibility.spec.ts

# UI 모드로 E2E 테스트
npm run test:e2e:ui
```

---

## Manual Testing

### Dark Mode Testing

1. 브라우저 개발자 도구 → Application → Local Storage
2. `theme` 키 확인 (light/dark/system)
3. 시스템 테마 변경 후 자동 전환 확인
4. 모든 페이지에서 색상 일관성 확인

### Animation Testing

1. 개발자 도구 → Rendering → Emulate CSS media feature
2. `prefers-reduced-motion: reduce` 설정
3. 애니메이션이 즉시 전환으로 대체되는지 확인

### Accessibility Testing

1. lighthouse 접근성 감사 실행
2. axe DevTools 확장 프로그램으로 검사
3. 키보드만으로 전체 기능 탐색 가능 확인

---

## Troubleshooting

### FOUC (Flash of Unstyled Content)

**문제**: 페이지 로드 시 잠깐 흰색 → 다크로 전환

**해결**: `html` 태그에 `suppressHydrationWarning` 추가 확인

```tsx
<html suppressHydrationWarning>
```

### 테마 토글 동작 안 함

**문제**: useTheme 훅이 undefined 반환

**해결**:
1. ThemeProvider가 layout.tsx에 있는지 확인
2. 컴포넌트에 `'use client'` 지시문 확인

### 다크 모드 색상 미적용

**문제**: 특정 요소가 다크 모드에서 색상 변경 안 됨

**해결**:
1. 하드코딩된 색상(bg-white 등)을 CSS 변수로 교체
2. tailwind.config.js의 darkMode 설정 확인

---

## Next Steps

1. `/speckit.tasks` 실행하여 작업 목록 생성
2. `/speckit.implement` 실행하여 구현 시작
3. 각 User Story 완료 후 체크포인트 검증
