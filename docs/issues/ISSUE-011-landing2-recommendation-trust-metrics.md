---
id: ISSUE-011
title: Landing 2 Recommendation Trust Metrics Copy
status: Done
priority: P1
owner: TBD
created: 2025-12-30
completed: 2025-12-30
---

# Landing 2 Recommendation Trust Metrics Copy

## Scope
Add trust reinforcement copy on recommendation cards:
- "후기 수 n건 · 평점 집계일"

## Changes
- Recommendation cards show review count and rating aggregation date.
- Text is displayed under the rating badges for quick scan.

## Acceptance Criteria
- Each recommendation card displays:
  - 후기 수 n건 (or 집계 중)
  - 평점 집계일 (YYYY.MM.DD 형태)

## References
- `web/src/app/page.tsx`
