# Supabase Setup Guide

This guide walks through setting up Supabase for the TEE:UP Portfolio SaaS platform.

## Prerequisites

- Supabase account (sign up at https://supabase.com)
- Node.js and npm installed
- Git repository initialized

## Migrations

마이그레이션을 순서대로 실행하세요:

```sql
-- 기본 스키마
schema.sql

-- 마이그레이션 (순서대로)
migrations/001_add_theme_and_new_columns.sql
migrations/002_add_studios.sql
migrations/003_add_leads.sql
migrations/004_add_portfolio_sections.sql
migrations/005_archive_chat.sql
migrations/006_saas_pivot_sites_and_events.sql  -- SaaS 피봇 핵심!
migrations/007_seed_theme_presets.sql           -- 테마 프리셋 시드
```

### 마이그레이션 006 핵심 테이블

| 테이블 | 설명 |
|--------|------|
| `sites` | 사이트 인스턴스 (프로/스튜디오 공통) |
| `theme_presets` | 무드 프리셋 토큰 (Classic, Editorial, Air) |
| `site_theme` | 사이트 적용 테마 설정 |
| `site_theme_answers` | 온보딩 답변 로그 (분석용) |
| `site_events` | 이벤트 로그 (과금/분석의 핵심) |
| `rate_limits` | Rate limiting |

### 핵심 RPC 함수

```sql
-- 이벤트 로깅 (anon 허용, published만, rate limit 포함)
tup_log_site_event(site_id, event_type, visitor_id, ip_hash, ...)

-- 테마 설정 (인증된 소유자만)
tup_set_site_theme(site_id, preset_slug, variant, accent_color)

-- Rate limit 체크
tup_rate_limit_hit(key_type, key_value, action, limit, window_minutes)
```

## Step 1: Create Supabase Project

1. Go to https://app.supabase.com
2. Click "New Project"
3. Fill in project details:
   - **Name**: tee-up-prod (or tee-up-dev for development)
   - **Database Password**: Generate a strong password (save this!)
   - **Region**: Choose closest to Seoul (e.g., Northeast Asia - Seoul)
   - **Pricing Plan**: Free tier for development

## Step 2: Run Database Schema

1. In your Supabase project dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy the entire contents of `/supabase/schema.sql`
4. Paste into the SQL editor
5. Click "Run" to execute

This creates:
- Custom types (user_role, chat_status, subscription_tier)
- Tables: profiles, pro_profiles, chat_rooms, messages
- Indexes for performance
- Row Level Security (RLS) policies
- Triggers and functions

## Step 3: Get API Credentials

1. In Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public key** (starts with `eyJ...`)

## Step 4: Configure Environment Variables

1. In the `/web` directory, create `.env.local`:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

2. Replace the placeholder values with your actual Supabase credentials

3. **IMPORTANT**: Never commit `.env.local` to Git (already in `.gitignore`)

## Step 5: Verify Installation

Run the development server:

```bash
cd web
npm run dev
```

The middleware will now attempt to connect to Supabase. If credentials are correct, the app will load without errors.

## Step 6: Create Test Data (Optional)

For development, you can add test data through the Supabase dashboard:

1. Go to **Table Editor**
2. Select the `profiles` table
3. Insert test records

Or use the SQL Editor to run seed scripts.

## Database Schema Overview

### Core Tables

**profiles** - User information (extends Supabase auth.users)
- Links to Supabase authentication
- Role: golfer, pro, or admin
- Basic profile information

**pro_profiles** - Professional golf instructor profiles
- Extended pro information (bio, specialties, etc.)
- Media URLs (hero image, gallery, video)
- Social media handles
- Metrics (views, leads, matched lessons)
- Subscription tier and status

**chat_rooms** - 1:1 conversations between golfers and pros
- Status: active, matched, or closed
- Tracks when matched or closed

**messages** - Individual chat messages
- Links to chat room and sender
- Read status and flagging capability

### Security

All tables have **Row Level Security (RLS)** enabled with policies:

- **Profiles**: Public read, users can update their own
- **Pro Profiles**: Only approved profiles are public, pros can update their own
- **Chat Rooms**: Only participants can view/update
- **Messages**: Only chat participants can view/send

### Functions

- `handle_new_user()` - Auto-creates profile when user signs up
- `handle_updated_at()` - Auto-updates timestamp on changes
- `increment_profile_views()` - Tracks profile view count
- `increment_chat_count()` - Tracks lead generation

## Next Steps

After setup is complete:

1. **Implement Authentication UI** - Login/signup pages using Supabase Auth
2. **Connect Pro Profiles** - Replace mock data with Supabase queries
3. **Build Real-time Chat** - Implement chat UI with Supabase Realtime
4. **Add File Upload** - Integrate Supabase Storage for images
5. **Payment Integration** - Add Toss Payments for subscriptions

## Useful Supabase CLI Commands

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link local project to remote
supabase link --project-ref your-project-ref

# Pull schema changes
supabase db pull

# Push local schema changes
supabase db push
```

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js + Supabase Guide](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Realtime Subscriptions](https://supabase.com/docs/guides/realtime)

## Troubleshooting

**Issue**: Build warnings about Edge Runtime
- **Solution**: This is expected with Supabase middleware. Warnings don't affect functionality.

**Issue**: Authentication errors
- **Solution**: Verify environment variables are set correctly and restart dev server

**Issue**: RLS policy errors
- **Solution**: Check that policies in schema.sql were created successfully

**Issue**: Connection refused
- **Solution**: Verify project URL and anon key are correct in `.env.local`
