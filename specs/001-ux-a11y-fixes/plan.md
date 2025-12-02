# Implementation Plan: UX 접근성 및 디자인 일관성 개선

**Branch**: `001-ux-a11y-fixes` | **Date**: 2025-12-02 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-ux-a11y-fixes/spec.md`

## Summary

프로 프로필 페이지의 모바일 CTA 개선, 키보드/스크린 리더 접근성 강화, 디자인 시스템 일관성 확보를 위한 프론트엔드 리팩토링. 모든 변경은 기존 Next.js 14 앱 내에서 CSS와 컴포넌트 수정으로 구현되며, 백엔드 변경 없음.

## Technical Context

**Language/Version**: TypeScript 5.x, Next.js 14 (App Router)
**Primary Dependencies**: React 18, Tailwind CSS 3.x, existing global.css design tokens
**Storage**: N/A (프론트엔드 전용 변경)
**Testing**: Playwright (E2E), Jest (unit), axe-core (접근성 자동 검사)
**Target Platform**: Web (Chrome, Safari, Firefox, Edge - 최신 2개 버전), Mobile Safari/Chrome
**Project Type**: Web application (frontend only for this feature)
**Performance Goals**: LCP < 2.5s 유지, 추가 JS 번들 최소화
**Constraints**: WCAG 2.1 AA 준수, 기존 디자인 토큰 활용, 최소한의 DOM 변경
**Scale/Scope**: 약 15개 파일 수정 (components, pages, global.css)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Evidence |
|-----------|--------|----------|
| **I. User-Centric Design** | ✅ PASS | 90/10 색상 규칙 준수, 하드코딩 색상 제거로 일관성 강화 |
| **II. Trust & Transparency** | ✅ PASS | 변경 없음 (기능적 신뢰성 영향 없음) |
| **III. Mobile-First Accessibility** | ✅ PASS | 핵심 목표 - WCAG AA 준수, 모바일 CTA 개선 |
| **IV. Test-First Quality** | ✅ PASS | Playwright E2E 테스트로 접근성 검증 예정 |
| **V. Incremental Delivery** | ✅ PASS | 5개 User Story를 독립적으로 구현/테스트 가능 |

**Gate Result**: ✅ ALL PASS - Phase 0으로 진행

## Project Structure

### Documentation (this feature)

```text
specs/001-ux-a11y-fixes/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── quickstart.md        # Phase 1 output (테스트 시나리오)
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (affected files)

```text
web/
├── src/
│   ├── app/
│   │   ├── global.css                    # 디자인 토큰 추가 (카카오 색상)
│   │   ├── global-error.tsx              # 하드코딩 색상 제거
│   │   ├── error.tsx                     # 접근성 속성 추가
│   │   ├── not-found.tsx                 # 접근성 속성 추가
│   │   ├── layout.tsx                    # 포커스 링 스타일 추가
│   │   ├── page.tsx                      # 아이콘 ARIA 속성 추가
│   │   ├── profile/
│   │   │   └── ProfileTemplate.tsx       # 모바일 CTA 리팩토링
│   │   ├── components/
│   │   │   ├── KakaoTalkButton.tsx       # 디자인 토큰 사용
│   │   │   ├── BookingModal.tsx          # 포커스 트랩 구현
│   │   │   └── LoadingSpinner.tsx        # aria-busy 추가
│   │   └── admin/
│   │       └── chats/
│   │           └── page.tsx              # 테이블 스크롤 개선
│   └── hooks/
│       └── useFocusTrap.ts               # 신규 - 포커스 트랩 훅
├── e2e/
│   └── accessibility.spec.ts             # 신규 - 접근성 E2E 테스트
└── __tests__/
    └── hooks/
        └── useFocusTrap.test.ts          # 신규 - 훅 단위 테스트
```

**Structure Decision**: 기존 web/ 프론트엔드 구조 유지. 신규 파일은 `useFocusTrap.ts` 훅과 접근성 테스트 파일 2개만 추가.

## Complexity Tracking

> 이 기능은 모든 헌법 원칙을 준수하며, 복잡성 위반 사항 없음.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | N/A | N/A |
