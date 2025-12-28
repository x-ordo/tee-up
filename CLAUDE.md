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

### Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client (Browser)                          │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐         │
│  │   Server    │    │   Client    │    │   useAuth   │         │
│  │  Component  │    │  Component  │    │    Hook     │         │
│  └──────┬──────┘    └──────┬──────┘    └──────┬──────┘         │
└─────────┼──────────────────┼──────────────────┼─────────────────┘
          │                  │                  │
          ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Server Actions Layer                          │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐         │
│  │ profiles.ts │    │  leads.ts   │    │ studios.ts  │         │
│  │ portfolios  │    │ scheduler   │    │  refunds    │         │
│  └──────┬──────┘    └──────┬──────┘    └──────┬──────┘         │
│         │                  │                  │                 │
│         └──────────────────┼──────────────────┘                 │
│                            ▼                                     │
│              ┌─────────────────────────┐                        │
│              │  ActionResult<T> Type   │                        │
│              │  { success, data/error }│                        │
│              └─────────────────────────┘                        │
└─────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Supabase (Backend)                          │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐         │
│  │   Auth +    │    │ PostgreSQL  │    │   Storage   │         │
│  │   Session   │    │  + RLS      │    │   Buckets   │         │
│  └─────────────┘    └─────────────┘    └─────────────┘         │
└─────────────────────────────────────────────────────────────────┘
```

### Security Architecture

```
Request → Middleware (session refresh)
        → Layout (auth check)
        → Server Action (user validation)
        → Supabase RLS (policy enforcement)
        → Response
```

**Security Layers:**
| Layer | Implementation | Purpose |
|-------|----------------|---------|
| 1. Middleware | `middleware.ts` | Session refresh, route protection |
| 2. Layout | `(dashboard)/layout.tsx` | Role-based access control |
| 3. Server Action | `auth.getUser()` check | User authentication |
| 4. Database | RLS Policies | Row-level data isolation |

### State Management Strategy

**Philosophy:** Server-first, minimal client state

| State Type | Location | Example |
|------------|----------|---------|
| Auth | `useAuth()` hook | Session, user info |
| Server Data | Server Actions | Profiles, leads, portfolios |
| UI State | Component `useState` | Forms, modals, tabs |
| Theme | `next-themes` | Dark/light mode |

**No Redux/Zustand** - Server Actions + ISR caching reduce need for complex state management

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

**18 migrations total** (run in order via Supabase CLI):

| Migration | Purpose |
|-----------|---------|
| 001-005 | Core: themes, studios, leads, portfolio sections, chat archive |
| 006-010 | Features: lessons, scheduler, calendar, refunds |
| 011-015 | Billing pivot, profile fields, lead tracking enhancements |
| 016-018 | Booking requests, studio members, latest features |

```bash
# Apply migrations
supabase db push

# Check status
supabase db status
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

## Development Principles

### Core Principles

| 섹션 | 핵심 원칙 |
|------|-----------|
| 1. TDD | 테스트 먼저 → Red/Green/Refactor 사이클 |
| 2. 외부 설정 | 수동 설정 필요 시 GitHub Issue 등록 필수 |
| 3. 설계 원칙 | Clean Architecture, DI, Event-Driven |
| 4. 커밋 메시지 | Conventional Commits, AI 언급 금지 |
| 5. 코드 스타일 | ESLint, TypeScript strict, 단일 책임 원칙 |
| 6. 응답 원칙 | CTO 관점, 객관적, 근거 필수 |
| 7. PR 체크리스트 | 7개 항목 체크 후 머지 |

### Response Principles (응답 원칙)

**CTO 관점:**
- 결정 중심 (옵션 나열 X)
- 트레이드오프/리스크/ROI 명시
- P0/P1/P2 우선순위 분류
- 간결함 유지

**객관성:**
- 감정 배제
- 사실 기반
- 정량적 표현

**근거 확보:**
- 공식 문서 참조
- 코드 라인 명시 (예: `profiles.ts:123`)
- 테스트 결과 포함
- 벤치마크 데이터

**금지 표현:**
- ❌ "아마도...", "~일 것 같습니다"
- ❌ "보통은...", "일반적으로..."
- ❌ 출처 없는 주장

### Business Mindset (비즈니스 마인드셋)

| 항목 | 내용 |
|------|------|
| 소비자 중심 사고 | 리서치/피드백은 최종 사용자 관점 |
| 비즈니스 임팩트 | 수익/비용/시장 영향 고려 |
| 가치 전달 | 기술 ≠ 비즈니스 구분 |
| 시장 현실 | 이상 < 실용 |

B2C/B2B/B2G 전 영역 적용.

### PR Checklist (7개 항목)

```markdown
- [ ] 테스트 통과 (unit + e2e)
- [ ] 타입 체크 통과 (`npm run type-check`)
- [ ] 린트 통과 (`npm run lint`)
- [ ] 변경사항 문서화 (필요시)
- [ ] 보안 검토 (인증/권한/입력 검증)
- [ ] 성능 영향 검토
- [ ] 롤백 계획 확인
```

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

## Known Limitations & Technical Debt

### Critical (P0)
| Issue | Impact | Recommended Fix |
|-------|--------|-----------------|
| Generic error handling | Production debugging difficult | Add Sentry + structured error codes |
| No input validation schema | Security risk, poor error messages | Add Zod validation to all actions |

### High Priority (P1)
| Issue | Impact | Recommended Fix |
|-------|--------|-----------------|
| Limited unit tests | Risky refactoring | Add Jest tests for action layer |
| Monetization logic scattered | Revenue tracking gaps | Centralize billing in single module |
| RLS policies undocumented | Security audit difficult | Document policy intentions |

### Medium Priority (P2)
| Issue | Impact | Recommended Fix |
|-------|--------|-----------------|
| No query optimization | Potential N+1 queries | Add indexing strategy, batch queries |
| No caching layer | Higher latency | Add Redis for hot data |
| Vendor lock-in (Supabase) | Migration difficulty | Abstract database layer |

### Low Priority (P3)
| Issue | Impact | Recommended Fix |
|-------|--------|-----------------|
| No feature flags | Deployment risk | Add feature flag system |
| No APM instrumentation | Performance blind spots | Add OpenTelemetry |

## Improvement Roadmap

### Phase 1: Hardening (1-2 sprints)
- [ ] Sentry integration for error tracking
- [ ] Zod validation schemas for all Server Actions
- [ ] Unit tests for critical action paths
- [ ] Document RLS policy intentions

### Phase 2: Performance (1-2 months)
- [ ] Redis caching for profiles/portfolios
- [ ] Query optimization audit
- [ ] Bundle size analysis
- [ ] Core Web Vitals monitoring

### Phase 3: Scale (3-6 months)
- [ ] Multi-tenant studio support
- [ ] Analytics pipeline
- [ ] Feature flag system
- [ ] Real-time notifications (Supabase Realtime)

## Architecture Assessment

**Overall Grade: B+ (Production-Ready with Improvements Needed)**

| Area | Grade | Notes |
|------|-------|-------|
| Simplicity | A | Server Actions eliminate REST complexity |
| Security | A- | 4-layer security, but RLS needs audit |
| Type Safety | A | Strict TS, ActionResult<T> pattern |
| Testing | B | Strong E2E, weak unit coverage |
| Observability | C | No centralized logging/monitoring |
| Performance | B+ | ISR caching, but no query optimization |

## Recent Changes

- 2025-12: Vercel 자동 배포 설정 (CI workflow에 deploy job 추가)
- 2025-12: Cron job 제거 (Vercel Hobby 플랜 제한)
- 2025-12: 아키텍처 문서화 (데이터 흐름, 보안 아키텍처, 기술 부채)
- 2025-12: GitHub 기능 설정 (Branch Protection, Dependabot, Labels)
- 2025-12: 독점 라이선스 명시 (CONTRIBUTING.md, CODE_OF_CONDUCT.md 제거)
- Portfolio SaaS Pivot: Express.js 제거, Next.js Server Actions 전환
- 3종 포트폴리오 템플릿 (Visual, Curriculum, Social)
- 리드 추적 및 과금 시스템 구현
- 스튜디오/아카데미 페이지 추가
