---
id: ISSUE-007
title: Self-Promotion Modules Priority for Pro Portfolio
status: In Progress
priority: P1
owner: TBD
created: 2025-12-30
started: 2025-12-31
---

# Self-Promotion Modules Priority for Pro Portfolio

## Scope
Decide which self-promotion modules are mandatory vs. optional for the luxury pro portfolio experience.

## Goals
- Keep the core portfolio elegant while enabling strong self-appeal.
- Provide a clear priority list for template expansion.
- Define the minimal v1 set that can be templated.

## Candidate Modules
- Achievements timeline (tours, awards, records)
- Sponsorships & partners
- Media/press highlights
- Availability & schedule snapshot
- Brand story / philosophy
- Media kit download

## Deliverables
- Priority ranking (v1, v1.5, later).
- Required data fields per module.
- Design intent notes (luxury tone, spacing, typography focus).

## Priority Ranking
- **V1 (Core)**
  - Achievements timeline (tours, awards, records)
  - Sponsorships & partners
  - Media/press highlights
  - Availability & schedule snapshot
- **V1.5 (Enhancement)**
  - Brand story / philosophy
  - Media kit download
- **Later**
  - Expanded legacy archive (full career chronology)
  - Long-form interviews / documentary media

## Required Data Fields
- **Achievements**
  - title, tour_or_event, year, placement, note(optional)
- **Sponsorships**
  - brand_name, logo_url(optional), role, contract_period(optional), link(optional)
- **Media/Press**
  - outlet, headline, date, link, media_type(optional), thumbnail_url(optional)
- **Availability**
  - region, cadence(weekly/biweekly), preferred_days, time_window, seasonality(optional)
- **Brand Story**
  - headline, short_bio(1-2 sentences), philosophy(1-2 sentences)
- **Media Kit**
  - kit_url(pdf), one_liner, contact_email(optional)

## Design Intent Notes
- Emphasize scarcity and prestige with concise modules (3-5 items max).
- Use large typography + generous spacing; avoid dense grids.
- Present sponsors/media as monochrome logos or subtle wordmarks.
- Schedule snapshot should read as “limited slots”, not a full calendar.

## Success Criteria
- Portfolio templates can ship with a consistent v1 module set.
- Concierge customization has a clear expansion backlog.

## References
- `specs/003-screen-definitions/screens/03-portfolio/pro-portfolio.md`
- `web/src/components/portfolio/templates/VisualTemplate.tsx`
- `web/src/components/portfolio/templates/CurriculumTemplate.tsx`
- `web/src/components/portfolio/templates/SocialTemplate.tsx`
