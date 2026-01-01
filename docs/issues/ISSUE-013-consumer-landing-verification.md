---
id: ISSUE-013
title: Consumer Landing Verification + Recommendation Data Wiring
status: Open
priority: P1
owner: TBD
created: 2025-12-31
---

# Consumer Landing Verification + Recommendation Data Wiring

## Scope
Verify `/` landing form submission end-to-end and confirm recommendation cards render real data from Supabase (not fallback).

## Tasks
- Provide runtime env vars for web:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `NEXT_PUBLIC_CONCIERGE_PRO_ID` (existing `pro_profiles.id`)
  - `NEXT_PUBLIC_CONCIERGE_CHAT_URL`
- Ensure at least one approved pro profile exists with testimonials:
  - `pro_profiles.is_approved = true`
  - `portfolio_sections.section_type = 'testimonials'` for the profile
- Run `web` dev server and submit the `/` landing form:
  - Success state renders in UI.
  - `consultation_requests` row created with `message`.
  - `leads` row created via `trackLead`.
- Confirm recommendation cards use real data:
  - Profile image, rating, and review count populated.
  - “후기 수 n건 · 평점 집계일” reflects real entries.

## Acceptance Criteria
- `/` form submission succeeds with visible success state.
- `consultation_requests` contains the submitted record (including `message`).
- Recommendation cards render non-fallback data from Supabase.

## Blockers
- `NEXT_PUBLIC_CONCIERGE_PRO_ID` not provided or invalid.
- No approved pro profiles or testimonials in Supabase.
- Supabase admin access/secret key required for data verification.

## Notes
- If no concierge pro exists, create one and use its `pro_profiles.id`.
- Data checks can be confirmed in Supabase Console if API access is restricted.
