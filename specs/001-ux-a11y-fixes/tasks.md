# Tasks for UX Accessibility & Design Consistency Fixes

**Feature Branch**: `001-ux-a11y-fixes`
**Spec**: [spec.md](./spec.md)
**Plan**: [plan.md](./plan.md)

This task list is generated based on the implementation plan and feature specification. Tasks are organized by user story to enable independent, incremental implementation and testing.

---

## Phase 1: Setup

These tasks prepare the foundational files and styles required for the subsequent user stories.

- [x] T001 Create custom hook file `web/src/hooks/useScrollVisibility.ts`
- [x] T002 Create custom hook file `web/src/hooks/useFocusTrap.ts`
- [x] T003 Create E2E test file `web/e2e/accessibility.spec.ts`
- [x] T004 Add external brand colors section to `web/src/app/globals.css`
- [x] T005 Add global styles for `:focus-visible` in `web/src/app/globals.css` to ensure a consistent focus ring

---

## Phase 2: User Stories (Implementation)

### User Story 1: Mobile User Content Accessibility (P1)

**Goal**: Prevent the floating CTA from obstructing content on mobile devices.
**Independent Test**: Verify on a mobile viewport that the CTA hides on scroll and reappears, and that all content is accessible.

- [x] T006 [US1] Implement the `useScrollVisibility` hook logic in `web/src/hooks/useScrollVisibility.ts`
- [x] T007 [P] [US1] Integrate the `useScrollVisibility` hook into the floating CTA component in `web/src/app/(components)/ui/FloatingCTA.tsx`
- [x] T008 [P] [US1] Add responsive styles to the floating CTA to handle minimization on small screens in `web/src/app/(components)/ui/FloatingCTA.tsx`
- [x] T009 [US1] Write an E2E test in `web/e2e/accessibility.spec.ts` to verify the mobile CTA's scroll behavior

### User Story 2: Keyboard User Full Functionality Access (P1)

**Goal**: Ensure all interactive elements are accessible and manageable using only a keyboard.
**Independent Test**: Navigate the entire user flow from homepage to booking modal using only the Tab and Enter/Escape keys.

- [x] T010 [US2] Implement the `useFocusTrap` hook logic in `web/src/hooks/useFocusTrap.ts`
- [x] T011 [P] [US2] Integrate the `useFocusTrap` hook into the booking modal component in `web/src/app/(components)/ui/BookingModal.tsx`
- [x] T012 [US2] Write an E2E test in `web/e2e/accessibility.spec.ts` to verify the modal focus trap
- [x] T013 [P] [US2] Write an E2E test in `web/e2e/accessibility.spec.ts` to confirm visual focus indicators on tab navigation

### User Story 3: Design System Consistency (P2)

**Goal**: Eliminate hardcoded values by using defined design tokens for a consistent UI.
**Independent Test**: Verify that brand colors and error page styles are derived from CSS variables.

- [x] T014 [US3] Add Kakao brand color variables to `web/src/app/globals.css`
- [x] T015 [P] [US3] Refactor the Kakao button component to use the new CSS variables instead of hardcoded colors
- [x] T016 [P] [US3] Refactor the error page component to use design system variables for all colors

### User Story 4: Screen Reader User Information Access (P2)

**Goal**: Ensure dynamic content changes and icon-only buttons are clearly communicated to screen reader users.
**Independent Test**: Use a screen reader (VoiceOver/NVDA) to navigate pages and confirm all buttons and dynamic updates are announced correctly.

- [x] T017 [P] [US4] Add descriptive `aria-label` attributes to all icon-only buttons across the application
- [x] T018 [US4] Implement `aria-live` regions for dynamic content announcements (e.g., loading states, form submission errors)
- [x] T019 [P] [US4] Add `role="alert"` and `aria-live="assertive"` to error message components
- [x] T020 [US4] Integrate `axe-core` with Playwright in `web/playwright.config.ts` and add a basic accessibility test to `web/e2e/accessibility.spec.ts`

### User Story 5: Admin Table Mobile Accessibility (P3)

**Goal**: Make data tables in the admin section usable on mobile devices.
**Independent Test**: Access the admin data table on a mobile viewport and confirm all data is accessible via horizontal scroll.

- [x] T021 [US5] Apply `overflow-x-auto` to the admin table container component
- [x] T022 [P] [US5] Implement a visual scroll hint (e.g., a gradient overlay) for horizontally scrollable tables on mobile

---

## Phase 3: Polish & Validation

- [ ] T023 Run the full suite of E2E tests, including all accessibility checks in `web/e2e/accessibility.spec.ts`
- [ ] T024 Manually verify all user stories using the scenarios outlined in `quickstart.md`
- [ ] T025 Review and merge the `001-ux-a11y-fixes` branch

---

## Dependencies & Parallel Execution

- **Phase 1 (Setup)** should be completed first.
- **User Stories (Phase 2)** can largely be worked on in parallel after Phase 1 is complete, especially tasks marked with `[P]`.
- **Task Dependencies**:
  - `T006` must be done before `T007`.
  - `T010` must be done before `T011`.
  - `T014` must be done before `T015`.
- **MVP Scope**: Completing User Stories 1 and 2 (P1) would deliver the highest impact for an initial release.