<!--
═══════════════════════════════════════════════════════════════════════════════
SYNC IMPACT REPORT
═══════════════════════════════════════════════════════════════════════════════
Version Change: 0.0.0 (template) → 1.0.0 (initial ratification)

Modified Principles:
  - [PRINCIPLE_1_NAME] → I. Korean Luxury Minimalism (User-Centric Design)
  - [PRINCIPLE_2_NAME] → II. Trust & Transparency
  - [PRINCIPLE_3_NAME] → III. Mobile-First Accessibility
  - [PRINCIPLE_4_NAME] → IV. Test-First Quality
  - [PRINCIPLE_5_NAME] → V. Incremental Delivery

Added Sections:
  - Core Principles (5 principles defined)
  - Technical Standards
  - Quality Gates
  - Governance (with amendment procedure)

Removed Sections:
  - [SECTION_2_NAME] placeholder → replaced with "Technical Standards"
  - [SECTION_3_NAME] placeholder → replaced with "Quality Gates"

Templates Requiring Updates:
  ✅ plan-template.md - Constitution Check section already aligned
  ✅ spec-template.md - User story prioritization aligned with Principle V
  ✅ tasks-template.md - Phase structure aligned with Principle V

Follow-up TODOs: None
═══════════════════════════════════════════════════════════════════════════════
-->

# TEE:UP Constitution

## Core Principles

### I. Korean Luxury Minimalism (User-Centric Design)

All UI/UX decisions MUST follow the "Calm Control" (차분한 통제) philosophy:

- **90/10 Rule**: 90% calm neutrals, 10% accent blue (#2563EB). No additional accent colors without constitution amendment.
- **Show, Don't Tell**: Visual storytelling over text. Data and imagery MUST speak before copy.
- **Data Clarity**: Metrics and information MUST be scannable at a glance. No hidden complexity.
- **No Unnecessary Copy**: Every word MUST earn its place. Remove marketing fluff.
- **Whitespace as Design Element**: Generous spacing is mandatory, not optional.

Rationale: Premium golf platform users expect sophistication. Cognitive load reduction builds trust and reflects brand positioning.

### II. Trust & Transparency

User trust is non-negotiable. All features MUST:

- **No Dark Patterns**: Never manipulate users into unintended actions. Settings MUST respect explicit user choices.
- **Clear Communication**: Error states, loading states, and system status MUST be communicated clearly and immediately.
- **Privacy First**: Phone numbers and PII MUST be hidden until explicit user action (e.g., chat initiation).
- **Honest Pricing**: Subscription costs and limitations MUST be visible before commitment. No hidden fees.
- **Data Ownership**: Users MUST be able to export or delete their data upon request.

Rationale: Golf lesson decisions involve significant trust. Platform integrity directly impacts user acquisition and retention.

### III. Mobile-First Accessibility

Every feature MUST prioritize mobile experience and accessibility:

- **Responsive Design**: All pages MUST function on 320px-2560px viewports without horizontal scroll.
- **WCAG AA Compliance**: Minimum 4.5:1 contrast ratio for normal text, 3:1 for large text and UI components.
- **Touch-Friendly**: Interactive elements MUST have minimum 44x44px touch targets.
- **Performance Budget**: LCP < 2.5s, animations < 300ms, theme transitions < 300ms.
- **Reduced Motion Support**: All animations MUST respect `prefers-reduced-motion` system setting.
- **Keyboard Navigation**: All interactive elements MUST be accessible via Tab/Enter/Escape.

Rationale: 70%+ of users access via mobile. Accessibility is both ethical and legally required (WCAG compliance).

### IV. Test-First Quality

Code quality gates MUST be enforced:

- **E2E for Critical Paths**: User flows involving authentication, payments, or data modification MUST have Playwright E2E tests.
- **Unit Tests for Logic**: Business logic, hooks, and utilities MUST have Jest unit tests.
- **Type Safety**: TypeScript strict mode is mandatory. No `any` types without explicit justification.
- **No Silent Failures**: All errors MUST surface to users with actionable recovery options (retry, go home, contact support).
- **axe-core Integration**: Accessibility tests MUST run on all pages in CI pipeline.

Rationale: Premium platform reputation depends on reliability. Bugs erode user trust faster than features build it.

### V. Incremental Delivery

Features MUST be delivered in independently testable increments:

- **Phase-Based Development**: Every feature follows Setup → Foundation → User Stories → Polish.
- **User Story Independence**: Each story MUST be deployable and demonstrable without other stories.
- **MVP First**: P1 user stories MUST be fully functional before P2 work begins.
- **Checkpoint Validation**: Each user story completion triggers validation before proceeding.
- **No Big Bang Releases**: Features MUST NOT accumulate in development branches longer than 2 weeks.

Rationale: Reduces risk, enables faster feedback loops, and allows course correction before significant investment.

## Technical Standards

### Technology Stack (Locked)

Changes to core technologies require constitution amendment:

| Layer | Technology | Version | Status |
|-------|------------|---------|--------|
| Frontend Framework | Next.js (App Router) | 14.x | Locked |
| Language | TypeScript | 5.x | Locked |
| Styling | Tailwind CSS | 3.x | Locked |
| Backend Framework | Express.js | 4.x | Locked |
| Database | Supabase (PostgreSQL) | Latest | Locked |
| Authentication | Supabase Auth | Latest | Locked |
| Testing (Unit) | Jest | Latest | Locked |
| Testing (E2E) | Playwright | Latest | Locked |
| Accessibility Testing | axe-core | Latest | Locked |

### Design Token Authority

- All colors MUST use CSS variables from `global.css`
- All spacing MUST use Tailwind utilities or design tokens
- All typography MUST use Pretendard (Korean) / Inter (English) / JetBrains Mono (data)
- Hardcoded values (`#hex`, `px` literals) are prohibited except in token definitions

### API Standards

- REST endpoints MUST follow `/api/[resource]` naming
- All endpoints MUST return JSON with consistent error structure
- API response time MUST be < 200ms (p95)
- All mutations MUST be idempotent or clearly documented as non-idempotent

## Quality Gates

### Pre-Commit Gates

All commits MUST pass:

1. TypeScript compilation with zero errors
2. ESLint with zero errors (warnings allowed with justification)
3. Prettier formatting applied

### Pre-Merge Gates (PR)

All PRs MUST pass:

1. All pre-commit gates
2. Jest unit tests (100% pass rate)
3. Playwright E2E tests (100% pass rate)
4. axe-core accessibility scan (0 critical/serious violations)
5. Build succeeds without errors

### Pre-Deploy Gates

Production deployments MUST verify:

1. All pre-merge gates
2. Lighthouse accessibility score >= 90
3. No console errors in production build
4. Environment variables validated

## Governance

### Authority

This constitution supersedes all other development practices, style guides, and informal conventions. When conflicts arise, this document is authoritative.

### Amendment Process

1. **Proposal**: Document proposed change with rationale in a GitHub issue
2. **Review Period**: Minimum 48 hours for team review
3. **Approval**: Requires explicit approval from tech lead
4. **Migration Plan**: Breaking changes MUST include migration steps
5. **Version Bump**: Follow semantic versioning (MAJOR.MINOR.PATCH)

### Version Semantics

- **MAJOR**: Backward-incompatible principle changes or removals
- **MINOR**: New principles, sections, or material expansions
- **PATCH**: Clarifications, typo fixes, non-breaking refinements

### Compliance Verification

- All PRs MUST include "Constitution Check: PASSED" or explicit justification for violations
- Code reviews MUST verify principle compliance
- Quarterly audits SHOULD review overall compliance

### Guidance Documents

For runtime development guidance, refer to:

- `CLAUDE.md` - Development patterns and commands
- `README.md` - Project overview and quick start
- `specs/DESIGN_SYSTEM.md` - Complete design specifications

**Version**: 1.0.0 | **Ratified**: 2025-12-10 | **Last Amended**: 2025-12-10
