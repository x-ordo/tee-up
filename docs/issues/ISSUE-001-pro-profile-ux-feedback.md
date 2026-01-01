---
id: ISSUE-001
title: Pro Profile UI/UX Feedback Summary
status: Done
priority: P1
owner: TBD
created: 2025-12-30
started: 2025-12-30
completed: 2025-12-30
---

# Pro Profile UI/UX Feedback Summary

## Summary
Collect design and UX findings for the pro profile experience based on current templates and sections.

## Findings
- Hero CTA is supported but not wired in templates, so the first screen has no conversion affordance. `web/src/components/portfolio/sections/HeroSection.tsx` `web/src/components/portfolio/templates/VisualTemplate.tsx`
- Template differentiation is weak; Visual/Curriculum/Social share similar structure and hierarchy, reducing the value of theme choice. `web/src/components/portfolio/templates/VisualTemplate.tsx` `web/src/components/portfolio/templates/CurriculumTemplate.tsx` `web/src/components/portfolio/templates/SocialTemplate.tsx`
- CTA dead-link risk when no external link is provided; Pricing CTA falls back to `#` and creates a no-op click. `web/src/components/portfolio/templates/CurriculumTemplate.tsx`
- Accent color configuration is not consistently applied across components; `--portfolio-accent` has limited visible effect. `web/src/components/portfolio/PortfolioRenderer.tsx`
- Motion intensity and marquee usage can reduce readability and fails to account for reduced-motion preferences. `web/src/components/portfolio/sections/TestimonialsSection.tsx`
- Social icons use hard-coded brand gradients, risking design system mismatch. `web/src/components/portfolio/templates/SocialTemplate.tsx`

## Audit Notes (Doc Alignment)
- "Show, Don't Tell" and VIP persona goals require above-the-fold trust signals and immediate CTA exposure. `CONTEXT.md` `web/lib/docs/business/PRD.md`
- Calm Control and White Labeling call for token-first styles and template differentiation that elevates pro branding. `web/lib/docs/UI_UX_PRINCIPLES.md` `specs/003-screen-definitions/spec.md`
- Color direction conflict exists between PRD (green/gold) and Calm Control (blue accent), impacting consistency decisions. `web/lib/docs/business/PRD.md` `web/lib/docs/UI_UX_PRINCIPLES.md`

## Impact
- Reduced conversion at the top of the page.
- Theme selection feels cosmetic rather than strategic.
- Trust and polish degrade due to no-op actions and inconsistent visuals.

## Next Actions
- Translate findings into implementation tasks in ISSUE-002/ISSUE-003.
- Confirm palette direction before applying token changes.

## References
- `CONTEXT.md`
- `web/lib/docs/business/PRD.md`
- `web/lib/docs/UI_UX_PRINCIPLES.md`
- `guides/UI_UX_VALIDATION_STRATEGY.md`
- `specs/003-screen-definitions/spec.md`
