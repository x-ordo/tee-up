---
id: ISSUE-003
title: Plan 1 - Public Profile Template Improvements
status: Done
priority: P1
owner: TBD
created: 2025-12-30
started: 2025-12-30
completed: 2025-12-31
---

# Plan 1 - Public Profile Template Improvements

## Scope
Improve the production public profile experience rendered at `/(portfolio)/[slug]` and the portfolio templates.

## Target Files
- `web/src/app/(portfolio)/[slug]/page.tsx`
- `web/src/components/portfolio/PortfolioRenderer.tsx`
- `web/src/components/portfolio/templates/VisualTemplate.tsx`
- `web/src/components/portfolio/templates/CurriculumTemplate.tsx`
- `web/src/components/portfolio/templates/SocialTemplate.tsx`
- `web/src/components/portfolio/sections/*.tsx`

## Deliverables
- Hero CTA wired to contact section.
- Template-specific layout and typography patterns.
- Tokenized accent usage and social icon normalization.
- Reduced-motion support and motion budget review.

## Progress
- [x] Hero CTA wired in Visual/Curriculum/Social templates (anchor to `#contact`).
- [x] Contact section anchor support added for portfolio templates.
- [x] Stats variants and bio layout adjustments implemented per template.
- [x] Accent token override scoped to portfolio renderer.
- [x] Reduced-motion guards added to hover scale elements.

## Success Criteria
- Conversion CTA visible above the fold on all templates.
- No dead-link CTAs remain.
- Theme changes are visually noticeable without hard-coded colors.
- Templates are visually distinguishable in layout and rhythm.

## Notes
This plan aligns with Calm Control and White Labeling principles and should be tracked alongside UX-005 in `plan.md`.
