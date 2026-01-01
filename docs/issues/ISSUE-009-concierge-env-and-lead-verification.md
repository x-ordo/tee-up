---
id: ISSUE-009
title: Concierge Env Setup + Lead/Booking Verification
status: Open
priority: P1
owner: TBD
created: 2025-12-30
---

# Concierge Env Setup + Lead/Booking Verification

## Scope
Enable real concierge verification by wiring Supabase + concierge env vars and confirming live lead/booking writes from `/pro`.

## Tasks
- Configure runtime env vars for the web app:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `NEXT_PUBLIC_CONCIERGE_PRO_ID` (must be an existing `pro_profiles.id`)
  - `NEXT_PUBLIC_CONCIERGE_CHAT_URL`
- Link Supabase project and apply migrations:
  - `supabase link --project-ref <project-ref>`
  - `supabase db push` (includes `020_add_pro_onboarding_fields.sql`)
- Run `web` dev server and verify `/pro` consultation flows:
  - Chat CTA click triggers `trackLead` success.
  - Form submission triggers `trackLead` success.
  - Callback reservation triggers `createBookingRequest` success.
- Confirm data persistence in Supabase:
  - `leads` rows created for chat/form.
  - `booking_requests` row created for callback.

## Acceptance Criteria
- Env vars are present and valid (no placeholder keys).
- Supabase migrations are applied without errors.
- `/pro` consultation flows return success states.
- Verified records exist in `leads` and `booking_requests`.

## Blockers
- Supabase project not linked (`supabase link --project-ref ...` required).
- `SUPABASE_ACCESS_TOKEN` missing for CLI (run `supabase login` or set token).
- Concierge env vars not provided (`NEXT_PUBLIC_CONCIERGE_PRO_ID`, `NEXT_PUBLIC_CONCIERGE_CHAT_URL`).

## Notes
- If no concierge pro exists, create one first and use its `pro_profiles.id`.
- Chat verification only checks lead creation (chat UI may open external URL).
