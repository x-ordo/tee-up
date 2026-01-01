---
id: ISSUE-002
title: Pro Profile UX Improvement Plan
status: Done
priority: P1
owner: TBD
created: 2025-12-30
started: 2025-12-30
completed: 2025-12-30
---

# Pro Profile UX Improvement Plan

## Goal
Align the pro profile experience with documented UX principles and improve conversion without breaking design tokens.

## Plan
1. **Top-of-fold conversion**: Expose a primary CTA in the hero that links to the contact section or booking flow.
2. **Template differentiation**: Define layout/typography/section rhythm differences per template to make selection meaningful.
3. **No-op CTA cleanup**: Replace `#` fallbacks with a contact form or disabled state.
4. **Theme token coverage**: Apply `--portfolio-accent` and tokenized colors to key UI elements.
5. **Motion accessibility**: Respect `prefers-reduced-motion` and provide static fallbacks for marquee and hover scaling.
6. **Trust signals**: Emphasize certifications, verified badges, and key metrics above the fold.

## Milestones
- M1: Hero CTA wired in all portfolio templates. (Done)
- M2: Template differentiation spec + initial implementation. (Done)
- M3: Accent token coverage and reduced-motion fallbacks implemented. (Done)

## Acceptance Criteria
- Hero CTA visible on all templates with a working target.
- No CTA buttons link to `#` when no destination is available.
- At least 3 template-level visual differences (grid, typography, section order) are documented and implemented.
- Accent color changes are visible in at least 5 key UI elements per template.
- Reduced-motion preference disables marquee and large hover scaling.

## References
- `CONTEXT.md`
- `web/lib/docs/business/PRD.md`
- `web/lib/docs/UI_UX_PRINCIPLES.md`
- `guides/UI_UX_VALIDATION_STRATEGY.md`
- `specs/003-screen-definitions/spec.md`
