---
id: ISSUE-005
title: Plan 3 - Design System and Token Alignment
status: Done
priority: P1
owner: TBD
created: 2025-12-30
started: 2025-12-30
completed: 2025-12-30
---

# Plan 3 - Design System and Token Alignment

## Scope
Normalize design tokens and ensure portfolio/profile UI uses tokens instead of hard-coded colors.

## Target Areas
- Design token references in portfolio templates and shared sections.
- Accent color propagation via `--portfolio-accent`.
- Palette decision between PRD (Deep Green/Matte Gold) and Calm Control tokens.

## Deliverables
- Token-only color usage in portfolio templates.
- Visible `--portfolio-accent` application across primary UI elements.
- Documented decision on palette direction and an update to the relevant docs.
- Optional linting guardrails from UI/UX validation strategy.

## Progress
- [x] Portfolio accent token override applied in renderer (Issue-003).
- [x] Portfolio overlays moved to token-backed variables (`--tee-overlay-*`).
- [x] Palette direction finalized to PRD Deep Green/Matte Gold and documented.
- [x] Luxury profile theme hard-coded black overlays replaced with tokenized overlays.
- [x] UI/UX principles and validation docs aligned with tee token naming.
- [x] Stylelint config + ESLint guardrails added for hex colors.

## Success Criteria
- No hard-coded color values in portfolio template files.
- Accent changes affect CTA, stats, badges, and section headings.
- A single palette direction is defined and documented.

## References
- `web/lib/docs/business/PRD.md`
- `web/lib/docs/UI_UX_PRINCIPLES.md`
- `guides/UI_UX_VALIDATION_STRATEGY.md`
