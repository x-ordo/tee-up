# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TEE:UP is a premium golf lesson matching platform connecting VIP golfers with verified professional golf instructors. The platform uses a magazine-style, visual-first design following Korean Luxury Minimalism principles.

**Status:** Phase 1 MVP (Active Development)
**Tech Stack:** Next.js 14 (App Router) + Express.js + Supabase (PostgreSQL)
**Design Philosophy:** "Calm Control" (차분한 통제) — 90% neutrals, 10% accent blue (#2563EB)

## Development Commands

### Frontend (Next.js)
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
```

### Backend (Express.js)
```bash
cd api
npm install              # Install dependencies
npm run dev             # Start dev server with nodemon (http://localhost:5000)
npm run build           # Compile TypeScript
npm start               # Start production server
npm test                # Run Jest unit tests
npm run test:watch      # Run Jest in watch mode
npm run test:coverage   # Run tests with coverage
npm run lint            # Run ESLint
npm run lint:fix        # Auto-fix ESLint issues
npm run type-check      # Check TypeScript types
```

## Architecture

### Monorepo Structure
- **`/web`** - Next.js 14 frontend (App Router, TypeScript strict mode)
- **`/api`** - Express.js backend (RESTful API, currently serving mock data)
- **`/supabase`** - Database schema and setup guides
- **`/docs`** - High-level documentation
- **`/guides`** - Development guides and strategies
- **`/specs`** - Technical specifications
- **`/business`** - Product requirements and business plans

### Frontend Architecture (`/web`)

**Key Directories:**
- `src/app/` - Next.js App Router pages and layouts
  - `page.tsx` - Homepage with pro directory
  - `profile/[slug]/` - Dynamic pro profile pages
  - `admin/` - Admin dashboard (pros, chats, analytics, users)
  - `components/` - Shared UI components (BookingModal, ProsDirectory, etc.)
- `src/lib/` - Utility libraries
  - `supabase/` - Supabase client, server, and middleware
  - `api/` - API client utilities
- `src/hooks/` - React hooks (useAdminAuth, useProManagement, useFlaggedMessages, useTimePeriod)
- `e2e/` - Playwright end-to-end tests
- `global.css` - Design system CSS variables and utility classes

**Routing Pattern:**
- Server components by default (leverage Next.js 14 RSC)
- Client components marked with `"use client"` directive
- Dynamic routes use `[slug]` or `[id]` patterns
- Middleware handles Supabase session management for all routes

**Path Aliases:**
- `@/*` maps to `./src/*` (configured in tsconfig.json)

### Backend Architecture (`/api`)

**Current State (Phase 1):**
- Express.js serving mock profile data from `profile-data.ts`
- Endpoints:
  - `GET /api/profiles` - List all pro profiles (summary)
  - `GET /api/profiles/:slug` - Get single profile by slug

**Phase 2 Plan:**
- Replace mock data with Supabase queries
- Add authentication endpoints
- Implement chat and subscription endpoints

### Database (Supabase)

**Setup:**
1. Create Supabase project at https://app.supabase.com
2. Run `/supabase/schema.sql` in SQL Editor
3. Copy credentials to `web/.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

**Core Tables:**
- `profiles` - User information (extends auth.users, role: golfer/pro/admin)
- `pro_profiles` - Pro instructor details, media, metrics, subscription status
- `chat_rooms` - 1:1 conversations (status: active/matched/closed)
- `messages` - Individual chat messages

**Security:**
- Row Level Security (RLS) enabled on all tables
- Policies enforce participant-only access to chats
- Public profiles require `is_approved = true`

## Design System

### Color Philosophy
**"Monochrome + Single Accent"** - 90% calm neutrals, 10% accent blue

```css
/* Base Neutrals */
--calm-white: #FAFAF9      /* Page backgrounds */
--calm-cloud: #F4F4F2      /* Card backgrounds */
--calm-stone: #E8E8E5      /* Borders, dividers */
--calm-charcoal: #52524E   /* Body text */
--calm-obsidian: #1A1A17   /* Headings */

/* Accent */
--calm-accent: #3B82F6     /* Primary actions (blue) */
--calm-accent-light: #DBEAFE
--calm-accent-dark: #1E40AF
```

### Typography
- **Display:** Pretendard (Korean excellence) - Import from `@fontsource/pretendard`
- **Body:** Inter (global standard) - Tailwind default
- **Mono:** JetBrains Mono (metrics/data) - Use `font-mono` class

### Component Patterns
- Use utility classes from `global.css`: `.btn-primary`, `.card`, `.input`, `.stat-card`
- Prefer Tailwind utilities over custom CSS
- Functional components with React hooks
- Server components by default, client components only when needed (interactivity, hooks, browser APIs)

### Design Principles
1. **Show, Don't Tell** - Visual storytelling over text
2. **Calm Control** - Reduce cognitive load, maintain transparency
3. **Data Clarity** - Metrics scannable at a glance
4. **No Unnecessary Copy** - Let data and visuals speak

## Testing Strategy

### Unit Tests (Jest)
- Located in `__tests__/` directories alongside source files
- Test files: `*.test.ts` or `*.test.tsx`
- Run with `npm test` (frontend or backend)

### E2E Tests (Playwright)
- Located in `web/e2e/`
- Test critical user flows: admin authentication, pro verification
- Configured for multiple browsers (Chrome, Firefox, Safari, Mobile)
- Run with `npm run test:e2e` (starts dev server automatically)

### Test Philosophy
- Test behavior, not implementation
- Focus on user-facing functionality
- E2E tests for critical paths, unit tests for utilities/hooks

## Important Context

### Phase 1 MVP Status
- ✅ Pro profile pages with mock data
- ✅ Pro directory with search/filter
- ✅ Korean Luxury Minimalism design system
- ✅ Admin dashboard structure
- ✅ E2E test infrastructure
- 🚧 Supabase integration (schema ready, needs frontend implementation)
- ⏳ KakaoTalk link integration (temporary chat solution)
- ⏳ Real-time chat (Phase 2)

### Business Constraints
- **Free Entry for Pros** - No upfront cost to register
- **Off-Platform Payments** - Lesson fees paid directly (cash/transfer)
- **Lead-Based Subscription** - 3 free inquiries/month, then ₩49,000/month
- **No Commission on Lessons** - Revenue from subscriptions only

### Key Documents (Read These for Context)
- `CONTEXT.md` - System source of truth
- `README.md` - Quick start and overview
- `specs/DESIGN_SYSTEM.md` - Complete design specifications
- `supabase/README.md` - Database setup guide
- `business/PRD.md` - Product requirements

## Common Patterns

### Adding a New Page
1. Create page in `web/src/app/[route]/page.tsx`
2. Use Server Components by default
3. Add `"use client"` only if needed (state, effects, browser APIs)
4. Import design tokens from `global.css`
5. Follow Korean Luxury Minimalism (whitespace, minimal decoration)

### Working with Supabase
```typescript
// Client component (browser)
import { createClient } from '@/lib/supabase/client'
const supabase = createClient()

// Server component/action
import { createClient } from '@/lib/supabase/server'
const supabase = await createClient()

// Middleware (session management)
// Already configured in src/middleware.ts
```

### API Endpoints
```typescript
// Current (Phase 1) - Mock data
GET /api/profiles           // List profiles
GET /api/profiles/:slug     // Get single profile

// Phase 2 - Supabase-backed
// Will add: auth, chat, subscriptions
```

### Admin Routes
All admin routes under `/admin` require authentication:
- `/admin` - Dashboard overview
- `/admin/pros` - Pro verification and management
- `/admin/chats` - Flagged messages moderation
- `/admin/users` - User management
- `/admin/analytics` - Platform metrics

## TypeScript Configuration

Both frontend and backend use **strict mode**.

**Frontend (`web/tsconfig.json`):**
- Target: ES5
- Module: ESNext (bundler resolution)
- JSX: preserve (Next.js handles transformation)
- Path alias: `@/*` → `./src/*`

**Backend (`api/tsconfig.json`):**
- Target: ES2016
- Module: CommonJS
- Root: `./src`, Out: `./dist`
- Strict type checking enabled

## Git Workflow

**Main Branch:** `main`
**Status:** Modified file: `web/e2e/admin-pro-verification.spec.ts`

**Important Files to NEVER Commit:**
- `.env`, `.env.local`, `.env.*.local` (credentials)
- `node_modules/`
- `.next/`, `dist/`, `build/`
- `test-results/`, `playwright-report/`
- `*.pem`, `*.key` (certificates)

**Exception:** `.env.example` files SHOULD be committed (templates)

## Quick Troubleshooting

### "Module not found" errors
- Check path alias: `@/` should resolve to `src/`
- Verify `tsconfig.json` includes the file
- Run `npm install` if dependency is missing

### Supabase connection issues
- Verify `.env.local` has correct credentials
- Restart dev server after changing environment variables
- Check Supabase project is running (not paused)

### Build warnings about Edge Runtime
- Expected with Supabase middleware
- Safe to ignore (warnings don't affect functionality)

### E2E tests failing
- Ensure dev server is running on port 3000
- Check `playwright.config.ts` baseURL matches
- Run `npx playwright install` if browsers are missing

## Performance Standards

**Target Metrics (from CONTEXT.md):**
- Page Load Time (LCP): < 2.5s
- API Response (p95): < 200ms
- Uptime: 99.5% (Phase 1), 99.9% (Phase 2)
- Error Rate: < 1% of user sessions

## Additional Notes

- **Deployment:** Planned for Vercel (frontend) + Railway/Fly.io (backend)
- **Payments:** Toss Payments for subscriptions (Phase 2)
- **Media Storage:** Cloudinary or AWS S3 (Phase 2)
- **Accessibility:** WCAG AA compliance required (test with automated tools)
- **Localization:** Primary language is Korean, English as secondary

## Active Technologies
- TypeScript 5.x, Next.js 14 (App Router) + React 18, Tailwind CSS 3.x, existing global.css design tokens (001-ux-a11y-fixes)
- N/A (프론트엔드 전용 변경) (001-ux-a11y-fixes)
- TypeScript 5.9, React 18.2, Next.js 14.0 + Tailwind CSS 3.4, @fontsource/pretendard, clsx, tailwind-merge (002-ui-ux-color)
- localStorage (테마 설정 저장) (002-ui-ux-color)

## Recent Changes
- 001-ux-a11y-fixes: Added TypeScript 5.x, Next.js 14 (App Router) + React 18, Tailwind CSS 3.x, existing global.css design tokens
