---
id: ISSUE-012
title: Supabase DB Push Blocked - Project Ref Not Linked
status: Done
priority: P1
owner: TBD
created: 2025-12-30
completed: 2025-12-31
---

# Supabase DB Push Blocked - Project Ref Not Linked

## Context
`supabase db push` fails because the project ref is not linked.

## Error
```
Cannot find project ref. Have you run supabase link?
```

## Attempt
- `supabase link --project-ref yrdfopkerrrhsafynakg` → Access token not provided.
- `supabase db push --db-url (remote)` → `no route to host` (IPv6 only endpoint)

## Resolution
- Supabase CLI linked and `db push` completed after updating `019_query_optimization.sql`.

## Impact
- Resolved: migrations were applied after linking and updating the function definition.

## Required Action
1. Run `supabase link --project-ref <project-ref>`
2. Ensure CLI has auth (`supabase login` or `SUPABASE_ACCESS_TOKEN`)
3. Ensure network can reach IPv6 or use an IPv4-capable endpoint.
4. Re-run `supabase db push`

## References
- `supabase/migrations/021_add_consultation_requests.sql`
