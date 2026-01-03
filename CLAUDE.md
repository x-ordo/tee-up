# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TEE:UP is a **Golf Pro Personal Branding Portfolio SaaS** platform. It provides professional golf instructors with customizable portfolio pages to showcase their expertise and capture leads.

**Core Strategy:** "White Labeling" - Minimize platform branding, maximize pro's personal brand.

**Status:** Phase 2 (Portfolio SaaS Pivot)
**Tech Stack:** Next.js 14 (App Router) + Server Actions + Supabase (PostgreSQL)
**Design Philosophy:** "Calm Control" (차분한 통제) — 90% neutrals, 10% accent green (#0A362B)

## Development Commands

```bash
# From project root (recommended)
npm run dev             # Start dev server (http://localhost:3000)
npm run build           # Production build
npm run lint            # Run ESLint
npm run type-check      # Check TypeScript types

# Testing
npm test                          # Run all Jest unit tests
npm test -- profiles.test.ts      # Run single test file
npm run test:coverage             # Run tests with coverage report
npm run test:e2e                  # Run Playwright E2E tests
npm run test:e2e:ui               # Playwright with UI mode
npm run test:e2e:headed           # Run E2E tests in headed mode
npx playwright test portfolio     # Run specific E2E test

# Installation
npm run install:web     # Install web dependencies
```

## Architecture

### Project Structure
```
tee-up/
├── web/                          # Next.js 14 frontend (full-stack)
│   ├── src/
│   │   ├── app/                  # App Router pages
│   │   │   ├── (portfolio)/      # Pro portfolio pages [slug]
│   │   │   ├── (dashboard)/      # Pro dashboard (auth required)
│   │   │   ├── admin/            # Platform admin
│   │   │   └── api/              # API routes (webhooks)
│   │   ├── actions/              # Server Actions (backend logic)
│   │   ├── components/           # Shared components
│   │   │   ├── ui/               # shadcn/ui components
│   │   │   ├── portfolio/        # Portfolio templates & sections
│   │   │   └── scheduler/        # Scheduling components
│   │   ├── hooks/                # Custom React hooks
│   │   ├── lib/                  # Utilities
│   │   │   └── supabase/         # Supabase client/server
│   │   └── types/                # TypeScript types
│   └── e2e/                      # Playwright E2E tests
├── docs/                         # Documentation
├── supabase/
│   ├── schema.sql                # Base database schema
│   └── migrations/               # Versioned SQL migrations
└── specs/                        # SpecKit feature specs (spec.md, plan.md, tasks.md)
```

### Key Architectural Decisions

1. **No Separate Backend** - All backend logic via Next.js Server Actions
2. **Direct Supabase Access** - Server Actions connect directly to Supabase with RLS
3. **Route Groups** - `(portfolio)`, `(dashboard)`, `(marketing)` for layout isolation
4. **Lead-Based Billing** - Revenue from lead captures, not chat creation

### Data Flow

```
Client (Browser)
    ↓
Server Actions (web/src/actions/*.ts)
    ↓ ActionResult<T> = { success, data/error }
Supabase (PostgreSQL + RLS)
```

### Security Layers

| Layer | Implementation | Purpose |
|-------|----------------|---------|
| 1. Middleware | `middleware.ts` | Session refresh, route protection |
| 2. Layout | `(dashboard)/layout.tsx` | Role-based access control |
| 3. Server Action | `auth.getUser()` check | User authentication |
| 4. Database | RLS Policies | Row-level data isolation |

### Server Actions Pattern

```typescript
// web/src/actions/profiles.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import type { ActionResult } from './types'

export async function updateProProfile(
  profileId: string,
  updates: ProProfileUpdate
): Promise<ActionResult<ProProfile>> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  const { data, error } = await supabase
    .from('pro_profiles')
    .update(updates)
    .eq('id', profileId)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) return { success: false, error: error.message }
  return { success: true, data }
}
```

## Key Components

### Portfolio Templates
Three templates in `/web/src/components/portfolio/templates/`:
- **Visual** - Image-focused, magazine-style layout
- **Curriculum** - Teaching-focused with pricing and FAQ
- **Social** - Social media integrated with feed embeds

### FloatingContactButton
Fixed-position KakaoTalk contact button (`/web/src/components/portfolio/FloatingContactButton.tsx`):
- Appears on portfolio pages when `open_chat_url` is set
- Automatically tracks leads via `trackLead()` action
- WCAG 2.2 compliant (44px touch target)

### UI Components
- **shadcn/ui** - Base components in `src/components/ui/`
- **Button sizes** - All 44px minimum height for WCAG 2.2 compliance
- Use `cn()` utility for className merging

## Database

### Core Tables
- `profiles` - User information (role: golfer/pro/admin)
- `pro_profiles` - Pro details, theme settings, contact links
- `studios` - Team/academy pages
- `leads` - Contact captures (billable events)
- `portfolio_sections` - Customizable portfolio sections

### Migrations
Versioned migrations in `supabase/migrations/`:
```bash
supabase db push    # Apply migrations
supabase db status  # Check status
```

### Deprecated Code
`web/lib/chat/`, `web/lib/leads/`, `web/lib/payments/` contain legacy matchmaking platform code. These modules are DEPRECATED and should not be used for new development.

## Design System

### Colors (tee-* tokens)
```css
--tee-background: #F7F4F0;     /* Warm beige */
--tee-surface: #FFFFFF;        /* White card */
--tee-ink-strong: #1A1A1A;     /* Primary text */
--tee-ink-light: #52524E;      /* Secondary text */
--tee-accent-primary: #0A362B; /* Forest green */
--tee-accent-secondary: #B39A68; /* Gold */
--tee-kakao: #FEE500;          /* KakaoTalk */
```

### Typography
- **Display:** Pretendard (Korean)
- **Body:** Inter
- **Mono:** JetBrains Mono

## Key Routes

| Route | Purpose |
|-------|---------|
| `/` | Marketing homepage |
| `/[slug]` | Pro portfolio page |
| `/studio/[studioSlug]` | Studio/academy page |
| `/dashboard` | Pro dashboard (auth) |
| `/dashboard/leads` | Lead management |
| `/dashboard/portfolio` | Portfolio editor |
| `/admin/pros` | Pro verification |

## Git Workflow

### Rules
1. **Never push directly to main** - Always use PRs
2. **External settings → GitHub Issue** (Vercel, Supabase, Kakao)
3. **No AI mentions in commits** - Remove auto-generated footers

### Commit Format
```bash
# Conventional Commits
feat: add floating contact button
fix: correct lead tracking on mobile
docs: update screen definitions
chore: update config files
```

### PR Checklist
- [ ] Tests pass (`npm test`, `npm run test:e2e`)
- [ ] Type check passes (`npm run type-check`)
- [ ] Lint passes (`npm run lint`)
- [ ] Security reviewed (auth/permissions)
- [ ] Performance considered

## Troubleshooting

### Server Action Errors
- Ensure `'use server'` directive at top
- Check Supabase credentials in `.env.local`
- Verify RLS policies allow the operation

### Build Errors
- Run `npm run type-check` for TypeScript issues
- Check imports use `@/` path alias

### E2E Tests Failing
- Run `npx playwright install` for browsers
- Ensure dev server running on port 3000

## Working with Supabase

```typescript
// Server-side (Server Actions, Server Components)
import { createClient } from '@/lib/supabase/server'
const supabase = await createClient()

// Client-side (Client Components)
import { createClient } from '@/lib/supabase/client'
const supabase = createClient()
```

## Business Model

- **Free:** 3 leads/month, basic portfolio
- **Basic:** 10 leads/month, all templates
- **Pro:** Unlimited leads, custom domain, analytics

Revenue from lead captures (KakaoTalk, contact form, phone clicks).

## Technical Debt (Priority)

| P0 | Add Sentry + structured error codes |
| P0 | Add Zod validation to all Server Actions |
| P1 | Increase unit test coverage |
| P1 | Document RLS policy intentions |
| P2 | Add Redis caching for hot data |

## Response Principles

When working in this codebase:
- **CTO perspective** - Decision-focused, not option listing
- **Evidence-based** - Reference code lines (e.g., `profiles.ts:123`)
- **Prioritized** - P0/P1/P2 classification
- **Concise** - Avoid filler phrases

## Recent Architectural Changes

- **SaaS Pivot**: Migrated from Express API to Next.js Server Actions architecture
- **Portfolio Templates**: 3 templates (Visual, Curriculum, Social)
- **WCAG 2.2 Compliance**: 44px minimum button heights
- **CI/CD**: Vercel auto-deploy + GitHub Actions
