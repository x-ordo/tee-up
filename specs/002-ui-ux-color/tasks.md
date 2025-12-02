# Tasks: UI/UX와 컬러 개선

**Input**: Design documents from `/specs/002-ui-ux-color/`
**Prerequisites**: plan.md (required), spec.md (required), research.md (available), data-model.md (available), contracts/ (available)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup ✅ COMPLETED

**Purpose**: Project initialization and dependency installation

- [x] T001 Install next-themes dependency in web/package.json (`npm install next-themes`)
- [x] T002 [P] Update darkMode setting to 'selector' in web/tailwind.config.ts
- [x] T003 [P] Create web/src/types/ directory if not exists
- [x] T004 [P] Create web/src/lib/theme.ts for theme utility functions

---

## Phase 2: Foundational (Shared Infrastructure) ✅ COMPLETED

**Purpose**: Core utilities and CSS tokens used by all user stories

- [x] T005 Add dark mode CSS variables to web/src/app/global.css (--calm-* tokens for .dark class)
- [x] T006 [P] Add semantic color tokens (success, warning, error) to web/src/app/global.css
- [x] T007 [P] Add brand color tokens (--brand-kakao-*) to web/src/app/global.css
- [x] T008 [P] Add animation CSS variables (--transition-*, --ease-*) to web/src/app/global.css
- [x] T009 [P] Add @keyframes definitions (fadeIn, shimmer) to web/src/app/global.css
- [x] T010 [P] Add prefers-reduced-motion media query to web/src/app/global.css
- [x] T011 Extend Tailwind colors config with CSS variable references in web/tailwind.config.ts

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Dark Mode Support (Priority: P1) 🎯 MVP ✅ COMPLETED

**Goal**: 사용자가 다크 모드와 라이트 모드 사이를 전환하여 선호하는 환경에서 플랫폼을 사용할 수 있다

**Independent Test**: 시스템 설정 또는 토글 버튼을 통해 다크/라이트 모드를 전환하고, 모든 페이지에서 일관된 테마가 적용되는지 확인

### Implementation for User Story 1

- [x] T012 [US1] Create ThemeProvider wrapper in web/src/app/layout.tsx (wrap children with next-themes ThemeProvider)
- [x] T013 [US1] Add suppressHydrationWarning to html tag in web/src/app/layout.tsx
- [x] T014 [US1] Create ThemeToggle component in web/src/app/components/ThemeToggle.tsx with useTheme hook
- [x] T015 [US1] Add ThemeToggle button to header/navigation in web/src/app/page.tsx
- [x] T016 [P] [US1] Add ThemeToggle to admin header in web/src/app/admin/components/AdminDashboard.tsx
- [x] T017 [P] [US1] Add ThemeToggle to profile page header in web/src/app/profile/ProfileTemplate.tsx
- [x] T018 [US1] Create useTheme wrapper hook in web/src/hooks/useTheme.ts for type safety
- [x] T019 [US1] Create unit test for useTheme hook in web/__tests__/hooks/useTheme.test.ts
- [x] T020 [US1] Create E2E test for theme switching in web/e2e/theme.spec.ts

**Checkpoint**: US1 complete - dark mode toggle works on all pages, theme persists in localStorage

---

## Phase 4: User Story 2 - Micro-interactions & Animations (Priority: P1) ✅ COMPLETED

**Goal**: 사용자가 버튼, 카드, 링크 등과 상호작용할 때 미세한 애니메이션 피드백을 받아 직관적인 사용 경험

**Independent Test**: 버튼 hover, 카드 hover, 링크 클릭 등의 인터랙션에서 부드러운 전환 효과가 있는지 확인

### Implementation for User Story 2

- [x] T021 [US2] Add .btn-hover utility class to web/src/app/global.css (scale 1.02 on hover)
- [x] T022 [P] [US2] Add .card-hover utility class to web/src/app/global.css (translateY -2px, shadow increase)
- [x] T023 [P] [US2] Add .link-hover utility class to web/src/app/global.css (color transition)
- [x] T024 [P] [US2] Add .fade-in utility class to web/src/app/global.css (uses fadeIn keyframe)
- [x] T025 [US2] Apply .btn-hover to .btn-primary and .btn-secondary in web/src/app/global.css
- [x] T026 [P] [US2] Apply .card-hover to .card class in web/src/app/global.css
- [x] T027 [US2] Add modal animation styles (overlay fade, modal scale) to web/src/app/global.css
- [x] T028 [US2] Apply modal animation to BookingModal in web/src/app/components/BookingModal.tsx
- [x] T029 [US2] Add staggered fade-in animation to homepage sections in web/src/app/page.tsx

**Checkpoint**: US2 complete - all interactive elements have smooth hover/click animations

---

## Phase 5: User Story 3 - Color Palette Extension & Brand Colors (Priority: P2) ✅ COMPLETED

**Goal**: 플랫폼이 확장된 색상 팔레트와 외부 브랜드 색상을 일관되게 사용하여 시각적 통일성 유지

**Independent Test**: 다양한 UI 상태(성공, 경고, 에러)와 카카오톡 버튼에서 일관된 색상이 적용되는지 확인

### Implementation for User Story 3

- [x] T030 [US3] Update KakaoTalkButton to use --brand-kakao tokens in web/src/app/components/KakaoTalkButton.tsx (already using CSS vars)
- [x] T031 [P] [US3] Create .alert-success, .alert-warning, .alert-error utility classes in web/src/app/global.css (already exist)
- [x] T032 [P] [US3] Update error.tsx to use semantic color tokens in web/src/app/error.tsx
- [x] T033 [P] [US3] Update global-error.tsx to use semantic color tokens in web/src/app/global-error.tsx
- [x] T034 [P] [US3] Update not-found.tsx to use semantic color tokens in web/src/app/not-found.tsx
- [x] T035 [US3] Run grep to verify no hardcoded color patterns remain (bg-[#, text-[#) in web/src/app/

**Checkpoint**: US3 complete - 100% design token usage, consistent brand colors

---

## Phase 6: User Story 4 - Loading States & Skeleton UI (Priority: P2) ✅ COMPLETED

**Goal**: 데이터를 로딩하는 동안 사용자에게 시각적 피드백을 제공

**Independent Test**: 프로필 목록 로딩 시 스켈레톤 UI가 표시되고, 데이터 로드 후 실제 콘텐츠로 전환되는지 확인

### Implementation for User Story 4

- [x] T036 [US4] Add .skeleton base class with shimmer animation to web/src/app/global.css
- [x] T037 [US4] Extend Skeleton component with shimmer effect in web/src/app/components/Skeleton.tsx
- [x] T038 [P] [US4] Create SkeletonCard variant in web/src/app/components/Skeleton.tsx
- [x] T039 [P] [US4] Create SkeletonText variant in web/src/app/components/Skeleton.tsx
- [x] T040 [P] [US4] Create SkeletonAvatar variant in web/src/app/components/Skeleton.tsx
- [x] T041 [US4] Add aria-busy="true" and aria-live="polite" to skeleton containers in web/src/app/components/Skeleton.tsx
- [x] T042 [US4] Loading pages already use Skeleton components (shimmer auto-applied)
- [x] T043 [P] [US4] profile/loading.tsx already uses ProDirectorySkeleton
- [x] T044 [P] [US4] admin/loading.tsx already uses DashboardCardSkeleton
- [x] T045 [US4] Add LoadingButton component to web/src/app/components/LoadingSpinner.tsx

**Checkpoint**: US4 complete - skeleton UI with shimmer effect shown during data loading

---

## Phase 7: User Story 5 - Empty States & Error States (Priority: P3) ✅ COMPLETED

**Goal**: 데이터가 없거나 오류가 발생한 상황에서 명확하고 도움이 되는 피드백 제공

**Independent Test**: 검색 결과가 없을 때 빈 상태 UI가, 네트워크 오류 시 에러 UI가 적절히 표시되는지 확인

### Implementation for User Story 5

- [x] T046 [US5] Create EmptyState component in web/src/app/components/EmptyState.tsx (icon, title, description, CTA)
- [x] T047 [P] [US5] Create ErrorState component in web/src/app/components/ErrorState.tsx (retry button, go home)
- [x] T048 [US5] Add role="status" and aria-live="polite" to EmptyState in web/src/app/components/EmptyState.tsx
- [x] T049 [US5] Add role="alert" to ErrorState in web/src/app/components/ErrorState.tsx
- [x] T050 [US5] Update ProsDirectory to show EmptyState when no results in web/src/app/components/ProsDirectory.tsx
- [x] T051 [P] [US5] Update chat page to show EmptyState when no conversations in web/src/app/chat/page.tsx
- [x] T052 [US5] Update not-found.tsx to use EmptyState component in web/src/app/not-found.tsx
- [x] T053 [US5] Update error.tsx to use ErrorState component in web/src/app/error.tsx

**Checkpoint**: US5 complete - user-friendly empty and error states with actionable CTAs

---

## Phase 8: Polish & Cross-Cutting Concerns ✅ COMPLETED

**Purpose**: Testing, validation, and documentation

- [x] T054 [P] Add dark mode tests to accessibility.spec.ts in web/e2e/accessibility.spec.ts
- [x] T055 [P] Add skeleton UI tests to accessibility.spec.ts in web/e2e/accessibility.spec.ts
- [x] T056 Run full axe-core scan in both light and dark modes (30 tests passed)
- [x] T057 Verify WCAG AA contrast ratios in dark mode using lighthouse (Note: accent color contrast issue documented)
- [x] T058 Manual testing: theme toggle on all major pages (home, profile, admin, chat) - verified via E2E
- [x] T059 Manual testing: prefers-reduced-motion behavior - verified via E2E test
- [x] T060 Run quickstart.md validation checklist - build and lint passed

**Note**: ✅ RESOLVED - Color contrast issue fixed. Accent color updated from #3B82F6 (3.67:1) to #2563EB (4.7:1) for WCAG AA compliance.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion (T001-T004)
- **User Stories (Phase 3-7)**: All depend on Foundational phase completion (T005-T011)
  - US1 and US2 are both P1 and can start in parallel after foundation
  - US3 and US4 are both P2 and can start after P1 stories or independently
  - US5 is P3 and depends on US3 for semantic colors
- **Polish (Phase 8)**: Depends on all user stories being complete

### User Story Dependencies

- **US1 (Dark Mode)**: Depends on T005 (dark mode CSS tokens), T011 (Tailwind config)
- **US2 (Animations)**: Depends on T008, T009 (animation tokens and keyframes)
- **US3 (Colors)**: Depends on T006, T007 (semantic and brand tokens)
- **US4 (Skeleton)**: Depends on T009 (shimmer keyframe), can run parallel with US2/US3
- **US5 (Empty/Error)**: Depends on US3 (semantic colors for states)

### Parallel Opportunities

All tasks marked [P] can run in parallel within their phase.

```bash
# Phase 2 parallel tasks:
T006 (semantic colors) || T007 (brand colors) || T008 (animation tokens) || T009 (keyframes) || T010 (reduced motion)

# US1 parallel tasks:
T016 (admin toggle) || T017 (profile toggle)

# US2 parallel tasks:
T022 (card hover) || T023 (link hover) || T024 (fade-in) || T026 (apply card hover)

# US3 parallel tasks:
T031 (alert classes) || T032 (error.tsx) || T033 (global-error) || T034 (not-found)

# US4 parallel tasks:
T038 (SkeletonCard) || T039 (SkeletonText) || T040 (SkeletonAvatar) || T043 (profile loading) || T044 (admin loading)

# US5 parallel tasks:
T047 (ErrorState) || T051 (chat empty)
```

---

## Implementation Strategy

### MVP First (US1 Only)

1. Complete Phase 1: Setup (T001-T004)
2. Complete Phase 2: Foundational (T005-T011)
3. Complete Phase 3: US1 - Dark Mode (T012-T020)
4. **STOP and VALIDATE**: Test dark mode on all pages
5. Deploy/demo MVP

### Incremental Delivery

1. Setup + Foundational → Ready
2. US1 (Dark Mode) → Deploy (MVP)
3. US2 (Animations) → Deploy
4. US3 (Colors) → Deploy
5. US4 (Skeleton UI) → Deploy
6. US5 (Empty/Error States) → Deploy
7. Polish phase → Final release

---

## Notes

- [P] tasks = different files, no dependencies within phase
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- Tests in Phase 8 validate all stories together
- Commit after each phase or logical group
- Stop at any checkpoint to validate story independently
- Total: 60 tasks across 8 phases
