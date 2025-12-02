# Tasks: UX 접근성 및 디자인 일관성 개선

**Input**: Design documents from `/specs/001-ux-a11y-fixes/`
**Prerequisites**: plan.md (required), spec.md (required), research.md (available)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup

**Purpose**: Project initialization and shared infrastructure

- [x] T001 Install @axe-core/playwright dev dependency in web/package.json
- [x] T002 [P] Create web/src/hooks/ directory if not exists
- [x] T003 [P] Create web/__tests__/hooks/ directory if not exists

---

## Phase 2: Foundational (Shared Components)

**Purpose**: Core utilities used by multiple user stories

- [x] T004 Add external brand color tokens to web/src/app/global.css (--brand-kakao, --brand-kakao-text, --brand-kakao-hover)
- [x] T005 [P] Add focus ring styles for all links in web/src/app/global.css (a:focus-visible with outline)
- [x] T006 [P] Create useFocusTrap hook in web/src/hooks/useFocusTrap.ts (containerRef, isActive, onClose parameters)
- [x] T007 Create useScrollVisibility hook in web/src/hooks/useScrollVisibility.ts (show/hide on scroll with 1s delay)

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - 모바일 사용자 콘텐츠 접근성 (Priority: P1) 🎯 MVP

**Goal**: 모바일에서 플로팅 CTA가 콘텐츠를 가리지 않도록 개선

**Independent Test**: 모바일 375px에서 프로필 페이지 모든 섹션 스크롤하여 가림 확인

### Implementation for User Story 1

- [x] T008 [US1] Refactor floating CTA container in web/src/app/profile/ProfileTemplate.tsx - add scroll visibility logic using useScrollVisibility hook
- [x] T009 [US1] Add responsive CTA layout in web/src/app/profile/ProfileTemplate.tsx - single button for screens < 768px
- [x] T010 [US1] Add minimize/close button to floating CTA in web/src/app/profile/ProfileTemplate.tsx
- [x] T011 [US1] Add bottom padding to page content in web/src/app/profile/ProfileTemplate.tsx to prevent content overlap (pb-24 on mobile)
- [x] T012 [US1] Add data-testid="floating-cta" attribute to CTA container in web/src/app/profile/ProfileTemplate.tsx

**Checkpoint**: US1 complete - mobile CTA no longer blocks content

---

## Phase 4: User Story 2 - 키보드 사용자 전체 기능 접근 (Priority: P1)

**Goal**: 키보드만으로 전체 사이트 탐색 및 모달 사용 가능

**Independent Test**: Tab 키로 홈 → 프로필 → 예약 모달 전체 흐름 수행

### Implementation for User Story 2

- [x] T013 [US2] Integrate useFocusTrap hook into BookingModal in web/src/app/components/BookingModal.tsx
- [x] T014 [US2] Add Escape key handler to close modal in web/src/app/components/BookingModal.tsx
- [x] T015 [US2] Store and restore focus to trigger button when modal closes in web/src/app/components/BookingModal.tsx
- [x] T016 [P] [US2] Add role="dialog" and aria-modal="true" to BookingModal in web/src/app/components/BookingModal.tsx
- [x] T017 [P] [US2] Add visible focus styles to all buttons in web/src/app/global.css (.btn-primary:focus-visible, .btn-secondary:focus-visible)
- [x] T018 [US2] Verify all interactive elements have tabindex in web/src/app/page.tsx (homepage links, buttons)

**Checkpoint**: US2 complete - keyboard-only navigation works end-to-end

---

## Phase 5: User Story 3 - 디자인 시스템 일관성 유지 (Priority: P2)

**Goal**: 모든 하드코딩 색상을 디자인 토큰으로 교체

**Independent Test**: grep으로 bg-[#], text-[#] 패턴 검색 시 0개

### Implementation for User Story 3

- [x] T019 [P] [US3] Replace hardcoded colors in web/src/app/global-error.tsx with CSS variables (bg-error-bg, text-error, text-calm-obsidian)
- [x] T020 [P] [US3] Replace hardcoded Kakao colors in web/src/app/components/KakaoTalkButton.tsx with var(--brand-kakao), var(--brand-kakao-text), var(--brand-kakao-hover)
- [x] T021 [P] [US3] Review and fix any hardcoded colors in web/src/app/error.tsx
- [x] T022 [P] [US3] Review and fix any hardcoded colors in web/src/app/not-found.tsx
- [x] T023 [US3] Run grep search to verify no remaining hardcoded color patterns (bg-[#, text-[#) in web/src/app/

**Checkpoint**: US3 complete - 100% design token usage

---

## Phase 6: User Story 4 - 스크린 리더 사용자 정보 접근 (Priority: P2)

**Goal**: 모든 인터랙티브 요소에 적절한 ARIA 레이블 제공

**Independent Test**: VoiceOver/NVDA로 모든 버튼 목적 파악 가능

### Implementation for User Story 4

- [x] T024 [P] [US4] Add aria-label to icon-only buttons in web/src/app/page.tsx (scroll indicator, nav icons)
- [x] T025 [P] [US4] Add aria-hidden="true" to decorative SVG icons in web/src/app/page.tsx
- [x] T026 [P] [US4] Add aria-busy and aria-live to LoadingSpinner in web/src/app/components/LoadingSpinner.tsx
- [x] T027 [P] [US4] Ensure all alerts have role="alert" and aria-live="assertive" in web/src/app/components/
- [x] T028 [US4] Add aria-label to KakaoTalkButton describing the action in web/src/app/components/KakaoTalkButton.tsx
- [x] T029 [US4] Review ProfileTemplate for missing ARIA labels on interactive elements in web/src/app/profile/ProfileTemplate.tsx

**Checkpoint**: US4 complete - screen reader announces all interactive elements

---

## Phase 7: User Story 5 - 관리자 테이블 모바일 접근성 (Priority: P3)

**Goal**: 관리자 테이블이 모바일에서 수평 스크롤로 접근 가능

**Independent Test**: 375px에서 채팅 테이블 모든 컬럼 스크롤로 확인

### Implementation for User Story 5

- [x] T030 [US5] Wrap table in overflow-x-auto container in web/src/app/admin/chats/page.tsx
- [x] T031 [US5] Add min-width to table to prevent column squishing in web/src/app/admin/chats/page.tsx (min-w-[800px])
- [x] T032 [US5] Add scroll hint gradient overlay for mobile in web/src/app/admin/chats/page.tsx (fade from white on right edge, hidden on md+)
- [x] T033 [P] [US5] Apply same responsive table pattern to web/src/app/admin/pros/page.tsx if tables exist
- [x] T034 [P] [US5] Apply same responsive table pattern to web/src/app/admin/users/page.tsx if tables exist

**Checkpoint**: US5 complete - admin tables scrollable on mobile

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Testing, validation, and documentation

- [x] T035 [P] Create accessibility E2E test file web/e2e/accessibility.spec.ts with axe-core integration
- [x] T036 [P] Create useFocusTrap unit test in web/__tests__/hooks/useFocusTrap.test.ts
- [x] T037 Add accessibility tests for profile page, homepage, and admin pages in web/e2e/accessibility.spec.ts
- [x] T038 Run full axe-core scan and fix any remaining WCAG AA violations
- [x] T039 Update web/src/app/global.css to add .table-scroll-container utility class
- [ ] T040 Manual testing: keyboard navigation flow (home → profile → modal → close)
- [ ] T041 Manual testing: VoiceOver/NVDA on profile page buttons
- [ ] T042 Run quickstart.md validation checklist

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion
- **User Stories (Phase 3-7)**: All depend on Foundational phase completion
  - US1 and US2 are both P1 and can start in parallel
  - US3 and US4 are both P2 and can start after US1/US2 or in parallel
  - US5 is P3 and can start after P2 stories or independently
- **Polish (Phase 8)**: Depends on all user stories being complete

### User Story Dependencies

- **US1 (모바일 CTA)**: Depends on T007 (useScrollVisibility hook)
- **US2 (키보드 접근성)**: Depends on T006 (useFocusTrap hook)
- **US3 (디자인 토큰)**: Depends on T004 (brand color tokens in global.css)
- **US4 (스크린 리더)**: No dependencies on other stories
- **US5 (관리자 테이블)**: No dependencies on other stories

### Parallel Opportunities

All tasks marked [P] can run in parallel within their phase.

```bash
# Phase 2 parallel tasks:
T005 (focus ring styles) || T006 (useFocusTrap) || T007 (useScrollVisibility)

# US3 parallel tasks:
T019 (global-error) || T020 (KakaoTalkButton) || T021 (error.tsx) || T022 (not-found.tsx)

# US4 parallel tasks:
T024 || T025 || T026 || T027 (all ARIA additions in different files)
```

---

## Implementation Strategy

### MVP First (US1 + US2 Only)

1. Complete Phase 1: Setup (T001-T003)
2. Complete Phase 2: Foundational (T004-T007)
3. Complete Phase 3: US1 - Mobile CTA (T008-T012)
4. Complete Phase 4: US2 - Keyboard A11y (T013-T018)
5. **STOP and VALIDATE**: Test mobile + keyboard independently
6. Deploy/demo MVP

### Incremental Delivery

1. Setup + Foundational → Ready
2. US1 (Mobile CTA) → Deploy
3. US2 (Keyboard) → Deploy
4. US3 (Design Tokens) → Deploy
5. US4 (Screen Reader) → Deploy
6. US5 (Admin Tables) → Deploy
7. Polish phase → Final release

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- Tests in Phase 8 validate all stories together
- Commit after each phase or logical group
- Stop at any checkpoint to validate story independently
