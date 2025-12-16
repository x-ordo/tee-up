# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TEE:UP is a **Golf Pro Personal Branding Portfolio SaaS** platform. It provides professional golf instructors with customizable portfolio pages to showcase their expertise and capture leads.

**Core Strategy:** "White Labeling" - Minimize platform branding, maximize pro's personal brand.

**Status:** Phase 2 (Portfolio SaaS Pivot)
**Tech Stack:** Next.js 14 (App Router) + Server Actions + Supabase (PostgreSQL)
**Design Philosophy:** "Calm Control" (차분한 통제) — 90% neutrals, 10% accent blue (#2563EB)

## Development Commands

```bash
cd web
npm install              # Install dependencies
npm run dev             # Start dev server (http://localhost:3000)
npm run build           # Production build
npm start               # Start production server
npm run lint            # Run ESLint
npm test                # Run Jest unit tests
npm run test:watch      # Run Jest in watch mode
npm run test:e2e        # Run Playwright E2E tests
npm run test:e2e:ui     # Run Playwright with UI
npm run test:e2e:headed # Run Playwright in headed mode
npm run type-check      # Check TypeScript types
```

## Architecture

### Project Structure
```
tee_up/
├── web/                          # Next.js 14 frontend (full-stack)
│   ├── src/
│   │   ├── app/
│   │   │   ├── (marketing)/      # Public marketing pages
│   │   │   ├── (portfolio)/      # Pro portfolio pages
│   │   │   │   ├── [slug]/       # Individual pro portfolio
│   │   │   │   └── studio/[studioSlug]/  # Studio/team pages
│   │   │   ├── (dashboard)/      # Pro dashboard (auth required)
│   │   │   │   └── dashboard/
│   │   │   │       ├── portfolio/ # Portfolio editor
│   │   │   │       ├── leads/    # Lead management
│   │   │   │       └── settings/
│   │   │   ├── admin/            # Platform admin
│   │   │   └── api/webhooks/     # Webhooks only (Stripe, Kakao)
│   │   ├── actions/              # Server Actions (backend logic)
│   │   │   ├── profiles.ts
│   │   │   ├── portfolios.ts
│   │   │   ├── studios.ts
│   │   │   ├── leads.ts
│   │   │   └── types.ts
│   │   ├── components/
│   │   │   ├── ui/               # shadcn/ui components
│   │   │   ├── magicui/          # Magic UI components
│   │   │   └── portfolio/        # Portfolio templates & sections
│   │   ├── hooks/
│   │   └── lib/supabase/
│   └── e2e/                      # Playwright E2E tests
├── supabase/
│   ├── schema.sql                # Base database schema
│   └── migrations/               # Versioned SQL migrations
└── specs/                        # Feature specifications
```

### Key Architectural Decisions

1. **No Separate Backend** - All backend logic via Next.js Server Actions
2. **Direct Supabase Access** - Server Actions connect directly to Supabase with RLS
3. **Route Groups** - `(portfolio)`, `(dashboard)`, `(marketing)` for layout isolation
4. **Lead-Based Billing** - Revenue from lead captures, not chat creation

### Server Actions Pattern

```typescript
// /web/src/actions/profiles.ts
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

### Portfolio Templates

Three portfolio templates available:
- **Visual** (`visual`) - Image-focused, magazine-style layout
- **Curriculum** (`curriculum`) - Teaching-focused with pricing and FAQ
- **Social** (`social`) - Social media integrated with feed embeds

Templates are in `/web/src/components/portfolio/templates/`

### UI Components

- **shadcn/ui** - Base components (Button, Card, Dialog, Input)
- **Magic UI** - Animated components (Marquee, BentoGrid, AnimatedGradient)
- **Design Tokens** - Custom Tailwind config with Korean Luxury Minimalism

### Database (Supabase)

**Core Tables:**
- `profiles` - User information (extends auth.users, role: golfer/pro/admin)
- `pro_profiles` - Pro instructor details, theme settings, contact links
- `studios` - Team/academy pages (multiple pros)
- `leads` - Contact captures (billable events)
- `portfolio_sections` - Customizable portfolio sections

**New Columns (pro_profiles):**
- `theme_type` - visual | curriculum | social
- `payment_link` - External payment page URL
- `open_chat_url` - KakaoTalk open chat URL
- `studio_id` - Optional studio affiliation

**Security:**
- Row Level Security (RLS) enabled on all tables
- Public profiles require `is_approved = true`
- Lead data visible only to owning pro

### Migrations

Run migrations in order:
```sql
-- supabase/migrations/
001_add_theme_and_new_columns.sql
002_add_studios.sql
003_add_leads.sql
004_add_portfolio_sections.sql
005_archive_chat.sql  -- Soft-deletes legacy chat tables
```

## Design System

### Color Philosophy
**"Monochrome + Single Accent"** - 90% calm neutrals, 10% accent blue

```css
/* Semantic Tokens */
--tee-background: var(--calm-white)
--tee-surface: var(--calm-cloud)
--tee-ink-strong: var(--calm-obsidian)
--tee-ink-light: var(--calm-charcoal)
--tee-accent-primary: var(--calm-accent)

/* Base Neutrals */
--calm-white: #FAFAF9
--calm-cloud: #F4F4F2
--calm-stone: #E8E8E5
--calm-charcoal: #52524E
--calm-obsidian: #1A1A17

/* Accent */
--calm-accent: #3B82F6
```

### Typography
- **Display:** Pretendard (Korean excellence)
- **Body:** Inter (global standard)
- **Mono:** JetBrains Mono (metrics/data)

### Component Patterns
- shadcn/ui components in `src/components/ui/`
- Use `cn()` utility for className merging
- Server components by default
- Client components marked with `"use client"`

## Testing Strategy

### E2E Tests (Playwright)
Located in `web/e2e/`:
- `portfolio-templates.spec.ts` - Portfolio page tests
- `lead-tracking.spec.ts` - Lead capture flow tests
- `admin-pro-verification.spec.ts` - Admin workflow tests
- `theme.spec.ts` - Theme switching tests

Run: `npm run test:e2e`

### Unit Tests (Jest)
- Located in `__tests__/` directories
- Run: `npm test`

## Business Model

- **Free Tier:** 3 free leads/month, basic portfolio
- **Basic Tier:** 10 leads/month, all templates
- **Pro Tier:** Unlimited leads, custom domain, analytics

Revenue from lead captures (contact form, KakaoTalk link, phone click), not from lesson fees.

## Key Routes

### Public
- `/` - Marketing homepage
- `/[slug]` - Pro portfolio page
- `/studio/[studioSlug]` - Studio/academy page

### Dashboard (Auth Required)
- `/dashboard` - Overview
- `/dashboard/leads` - Lead management
- `/dashboard/portfolio` - Portfolio editor
- `/dashboard/settings` - Account settings

### Admin
- `/admin` - Admin dashboard
- `/admin/pros` - Pro verification
- `/admin/users` - User management

## Common Patterns

### Adding a Server Action
```typescript
// src/actions/myaction.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { ActionResult } from './types'

export async function myAction(): Promise<ActionResult<MyData>> {
  const supabase = await createClient()
  // ... logic
  revalidatePath('/affected-path')
  return { success: true, data }
}
```

### Using Server Actions in Components
```tsx
// Server Component
import { getPublicProfile } from '@/actions/profiles'

export default async function Page({ params }) {
  const result = await getPublicProfile(params.slug)
  if (!result.success) return notFound()
  return <PortfolioRenderer profile={result.data} />
}
```

### Working with Supabase
```typescript
// Server-side (Server Actions, Server Components)
import { createClient } from '@/lib/supabase/server'
const supabase = await createClient()

// Client-side (Client Components)
import { createClient } from '@/lib/supabase/client'
const supabase = createClient()
```

## TypeScript Configuration

**Strict mode enabled.**

- Target: ES5 (Next.js compatible)
- Module: ESNext (bundler resolution)
- Path alias: `@/*` → `./src/*`

## Git Workflow

**Main Branch:** `main`
**Feature Branch:** `feature/portfolio-saas-pivot`

**Never Commit:**
- `.env`, `.env.local` (credentials)
- `node_modules/`, `.next/`
- `test-results/`, `playwright-report/`

## Quick Troubleshooting

### Server Action errors
- Ensure function has `'use server'` directive
- Check Supabase credentials in `.env.local`
- Verify RLS policies allow the operation

### Build errors
- Run `npm run type-check` for TypeScript issues
- Check imports use `@/` path alias correctly

### E2E tests failing
- Run `npx playwright install` for browsers
- Ensure dev server running on port 3000

## Performance Standards

- Page Load Time (LCP): < 2.5s
- Server Action Response: < 200ms
- Uptime: 99.9%

## Deployment

- **Frontend:** Vercel (recommended)
- **Database:** Supabase
- **Payments:** Stripe (international) / Toss Payments (Korea)

## Active Technologies
- TypeScript 5.9, Next.js 14 (App Router), React 18
- Tailwind CSS 3.4, shadcn/ui (New York style)
- Supabase (PostgreSQL + Auth + RLS)
- Playwright for E2E testing

## Recent Changes
- Portfolio SaaS Pivot: Migrated from Express.js backend to Next.js Server Actions
- Added 3 portfolio templates (Visual, Curriculum, Social)
- Implemented lead tracking with billing trigger
- Added studios for team/academy pages
- Archived legacy chat functionality
