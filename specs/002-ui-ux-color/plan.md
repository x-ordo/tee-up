# Implementation Plan: UI/UX와 컬러 개선

**Branch**: `002-ui-ux-color` | **Date**: 2025-12-02 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-ui-ux-color/spec.md`

## Summary

이 기능은 TEE:UP 플랫폼의 UI/UX를 개선하여 다크 모드 지원, 마이크로인터랙션, 확장된 색상 시스템, 로딩/스켈레톤 UI, 빈 상태/에러 상태 UI를 구현한다. 기존 Korean Luxury Minimalism 디자인 철학("Calm Control")을 유지하면서 사용자 경험을 향상시킨다.

## Technical Context

**Language/Version**: TypeScript 5.9, React 18.2, Next.js 14.0
**Primary Dependencies**: Tailwind CSS 3.4, @fontsource/pretendard, clsx, tailwind-merge
**Storage**: localStorage (테마 설정 저장)
**Testing**: Jest 30.x (unit), Playwright 1.57 (E2E), @axe-core/playwright (접근성)
**Target Platform**: Web (모바일 우선), Chrome/Firefox/Safari/Mobile
**Project Type**: Web application (Next.js App Router)
**Performance Goals**: LCP < 2.5s, 애니메이션 < 300ms, 테마 전환 < 300ms
**Constraints**: WCAG AA 명암비 4.5:1, prefers-reduced-motion 존중
**Scale/Scope**: 50+ 페이지/컴포넌트, 모든 인터랙티브 요소에 적용

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. User-Centric Design (Korean Luxury Minimalism)
- ✅ **90/10 Rule**: 다크 모드도 90% 중성 톤 + 10% 악센트 블루 유지
- ✅ **Show, Don't Tell**: 스켈레톤 UI로 콘텐츠 레이아웃 미리 시각화
- ✅ **Data Clarity**: 로딩 상태 명확히 표시
- ✅ **No Unnecessary Copy**: 빈 상태 메시지는 간결하고 행동 지향적

### II. Trust & Transparency
- ✅ **No Dark Patterns**: 테마 설정은 사용자 선택 존중
- ✅ **Clear Communication**: 에러 상태에서 명확한 안내 제공

### III. Mobile-First Accessibility
- ✅ **Responsive Design**: 모든 테마/애니메이션이 모바일에서 동작
- ✅ **WCAG AA Compliance**: 다크 모드에서도 명암비 4.5:1 이상 유지
- ✅ **Touch-Friendly**: 애니메이션이 터치 인터랙션에 방해되지 않음
- ✅ **Performance Budget**: 애니메이션 < 300ms, 테마 전환 즉시

### IV. Test-First Quality
- ✅ **E2E for Critical Paths**: 다크 모드 전환, 스켈레톤 UI 표시 테스트
- ✅ **Unit Tests for Logic**: useTheme hook 테스트
- ✅ **No Silent Failures**: 에러 상태 UI에서 재시도 옵션 제공

### V. Incremental Delivery
- ✅ **Phase-Based Development**: US1(다크모드) → US2(애니메이션) → US3(색상) → US4(로딩) → US5(상태)
- ✅ **User Story Independence**: 각 스토리가 독립적으로 배포 가능
- ✅ **Checkpoint Validation**: 각 User Story 완료 후 검증

**GATE STATUS**: ✅ PASSED - 모든 헌법 원칙 준수

## Project Structure

### Documentation (this feature)

```text
specs/002-ui-ux-color/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output (TypeScript types)
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (CSS contracts)
│   └── theme-tokens.md  # Dark mode color tokens specification
└── tasks.md             # Phase 2 output (created by /speckit.tasks)
```

### Source Code (repository root)

```text
web/
├── src/
│   ├── app/
│   │   ├── global.css           # 확장: 다크 모드 토큰, 애니메이션 keyframes
│   │   ├── layout.tsx           # 확장: ThemeProvider 통합
│   │   ├── components/
│   │   │   ├── ThemeToggle.tsx  # 신규: 테마 전환 버튼
│   │   │   ├── Skeleton.tsx     # 확장: 추가 스켈레톤 패턴
│   │   │   ├── EmptyState.tsx   # 신규: 빈 상태 컴포넌트
│   │   │   └── ErrorState.tsx   # 신규: 에러 상태 컴포넌트
│   │   └── [pages]              # 기존 페이지에 테마/애니메이션 적용
│   ├── hooks/
│   │   └── useTheme.ts          # 신규: 테마 관리 훅
│   └── lib/
│       └── theme.ts             # 신규: 테마 유틸리티
├── __tests__/
│   └── hooks/
│       └── useTheme.test.ts     # 신규: 테마 훅 테스트
└── e2e/
    └── theme.spec.ts            # 신규: 다크 모드 E2E 테스트
```

**Structure Decision**: 기존 웹 애플리케이션 구조 유지. 프론트엔드 전용 변경이므로 `/web` 디렉토리 내에서만 작업. 기존 `global.css` 확장, 신규 컴포넌트/훅 추가.

## Complexity Tracking

> **No violations** - 기존 구조를 확장하는 방식으로 복잡도 최소화

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | N/A | N/A |
