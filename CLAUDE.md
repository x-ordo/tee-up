# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TEE:UP is a **Golf Pro Personal Branding Portfolio SaaS** platform. It provides professional golf instructors with customizable portfolio pages to showcase their expertise and capture leads.

**Core Strategy:** "White Labeling" - Minimize platform branding, maximize pro's personal brand.

**Status:** Phase 2 (Portfolio SaaS Pivot)
**Tech Stack:** Next.js 14 (App Router) + Server Actions + Supabase (PostgreSQL)
**Design Philosophy:** "Calm Control" (차분한 통제) — 90% neutrals, 10% accent green (#0A362B)

## Development Commands

**From project root (recommended):**
```bash
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
npm run install:web     # Install web dependencies
```

**Or directly in web/ folder:**
```bash
cd web && npm install   # Install dependencies
cd web && npm run dev   # Start dev server
```

## Architecture

### Project Structure
```
tee-up/
├── web/                          # Next.js 14 frontend (full-stack)
│   ├── src/
│   │   ├── app/                  # App Router pages
│   │   │   ├── (portfolio)/      # Pro portfolio pages
│   │   │   │   ├── [slug]/       # Individual pro portfolio
│   │   │   │   └── studio/[studioSlug]/
│   │   │   ├── (dashboard)/      # Pro dashboard (auth required)
│   │   │   ├── admin/            # Platform admin
│   │   │   ├── auth/             # Authentication pages
│   │   │   ├── chat/             # Chat (legacy)
│   │   │   ├── profile/          # Profile management
│   │   │   ├── api/              # API routes (webhooks)
│   │   │   └── components/       # Page-specific components
│   │   ├── actions/              # Server Actions (backend logic)
│   │   │   ├── profiles.ts       # User/pro profile management
│   │   │   ├── portfolios.ts     # Portfolio CRUD
│   │   │   ├── studios.ts        # Studio/academy management
│   │   │   ├── leads.ts          # Lead tracking
│   │   │   ├── scheduler.ts      # Appointment scheduling
│   │   │   ├── calendar.ts       # Calendar management
│   │   │   ├── refunds.ts        # Refund processing
│   │   │   └── types.ts          # Shared types
│   │   ├── components/           # Shared components
│   │   │   ├── ui/               # shadcn/ui components
│   │   │   ├── magicui/          # Magic UI components
│   │   │   ├── portfolio/        # Portfolio templates
│   │   │   ├── scheduler/        # Scheduling components
│   │   │   ├── layout/           # Layout components
│   │   │   └── patterns/         # Reusable patterns
│   │   ├── hooks/                # Custom React hooks
│   │   ├── constants/            # App constants
│   │   ├── lib/                  # Utilities
│   │   │   ├── supabase/         # Supabase client/server
│   │   │   ├── api/              # API utilities
│   │   │   └── seo/              # SEO utilities
│   │   └── types/                # TypeScript types
│   ├── lib/                      # Legacy lib (deprecated)
│   ├── e2e/                      # Playwright E2E tests
│   └── __tests__/                # Jest unit tests
├── supabase/
│   ├── schema.sql                # Base database schema
│   └── migrations/               # Versioned SQL migrations
├── specs/                        # Feature specifications
├── .github/                      # GitHub Actions & templates
│   ├── workflows/                # CI/CD workflows
│   └── ISSUE_TEMPLATE/           # Issue templates
└── .claude/                      # Claude Code settings
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
**"Monochrome + Single Accent"** - 90% calm neutrals, 10% accent green

```css
/* Design Tokens (tee-* unified naming) */
--tee-background: #F7F4F0;    /* Warm beige background */
--tee-surface: #FFFFFF;       /* White card/surface */
--tee-stone: #E8E8E5;         /* Border/divider */
--tee-ink-strong: #1A1A1A;    /* Primary text */
--tee-ink-light: #52524E;     /* Secondary text */
--tee-ink-muted: #8A8A87;     /* Tertiary/placeholder text */
--tee-accent-primary: #0A362B; /* Forest green accent */
--tee-accent-secondary: #B39A68; /* Gold accent */

/* State Colors */
--tee-error: #D32F2F;
--tee-success: #388E3C;
--tee-warning: #FBC02D;
--tee-info: #1976D2;

/* Brand Colors */
--tee-kakao: #FEE500;         /* KakaoTalk */
```

### Dark Mode
Dark mode is supported via `next-themes` with `.dark` class:
```css
.dark {
  --tee-background: #1A1A17;
  --tee-surface: #2A2A27;
  --tee-ink-strong: #FAFAF9;
  --tee-ink-light: #A8A8A5;
  --tee-accent-primary: #4ABA9A;
}
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

### 필수 규칙
1. **main 브랜치에 직접 push 금지** - 항상 PR을 통해 머지
2. **외부 설정/수동 작업은 GitHub Issue로 등록**

### 커밋 메시지 규칙
- **자동 생성 문구 제외** - "🤖 Generated with Claude Code", "Co-Authored-By: Claude" 등 자동 생성 문구 사용 금지
- Conventional Commits 형식 사용 (feat, fix, docs, refactor, test, chore)
- 한글/영문 혼용 가능

### PR 생성 절차
```bash
# 1. feature 브랜치 생성
git checkout -b feat/feature-name

# 2. 변경사항 커밋
git add -A && git commit -m "feat: description"

# 3. 브랜치 push 및 PR 생성
git push -u origin feat/feature-name
gh pr create --title "feat: title" --body "## Summary\n..."
```

### 외부 설정 Issue 등록
Dashboard 설정이나 수동 작업이 필요한 경우 GitHub Issue로 등록:
- Vercel 환경 변수 설정
- Supabase Dashboard 설정 (Storage 버킷 등)
- 카카오/Toss 등 외부 서비스 설정

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

| Category | Technology |
|----------|------------|
| Framework | Next.js 14 (App Router) + React 18 |
| Language | TypeScript 5.x (strict mode) |
| Styling | Tailwind CSS 3.4 + shadcn/ui |
| Database | Supabase (PostgreSQL + Auth + RLS) |
| Testing | Playwright (E2E) + Jest (Unit) |
| CI/CD | GitHub Actions |

## License

**Proprietary Software** - All rights reserved. See [LICENSE](./LICENSE) for details.

## Recent Changes

- 2025-12: GitHub 기능 설정 (Branch Protection, Dependabot, Labels)
- 2025-12: 독점 라이선스 명시 (CONTRIBUTING.md, CODE_OF_CONDUCT.md 제거)
- Portfolio SaaS Pivot: Express.js 제거, Next.js Server Actions 전환
- 3종 포트폴리오 템플릿 (Visual, Curriculum, Social)
- 리드 추적 및 과금 시스템 구현
- 스튜디오/아카데미 페이지 추가
