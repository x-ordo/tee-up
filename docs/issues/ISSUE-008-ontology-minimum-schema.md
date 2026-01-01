---
id: ISSUE-008
title: Ontology Minimum Schema Draft
status: Open
priority: P1
owner: TBD
created: 2025-12-30
---

# Ontology Minimum Schema Draft

## Scope
Draft a minimal ontology schema to support pro recommendations and trust messaging.

## Goals
- Enable explainable AI recommendations for golfers.
- Keep data capture lightweight for initial rollout.
- Align ontology with profile/portfolio content.

## Core Entities (v1)
- Pro
- Specialty
- Tour/Achievement
- Region
- Language
- Availability
- Sponsor/Partner
- Media/Press

## Deliverables
- Entity list with required attributes.
- Relationship map (Pro -> Specialty, Pro -> Region, Pro -> Achievement, etc.).
- Example JSON schema or relational tables.
- Capture points in UI (onboarding, profile editor, concierge).

## Success Criteria
- Minimal schema supports "AI 추천 + 근거" UI copy.
- Data requirements are feasible for v1 onboarding.

## References
- `specs/003-screen-definitions/screens/01-marketing/home.md`
- `specs/003-screen-definitions/screens/03-portfolio/pro-portfolio.md`
