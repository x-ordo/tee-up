-- Migration 001: Add theme_type and new columns to pro_profiles
-- TEE:UP Portfolio SaaS Pivot

-- Step 1: Create new enum types (IF NOT EXISTS for idempotency)
DO $$ BEGIN
    CREATE TYPE theme_type AS ENUM ('visual', 'curriculum', 'social');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE contact_method AS ENUM ('kakao', 'phone', 'email', 'form');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Step 2: Add 'free' to subscription_tier enum if not exists
-- First check if 'free' already exists
DO $$
BEGIN
    -- Try to add 'free' value to existing enum
    ALTER TYPE subscription_tier ADD VALUE IF NOT EXISTS 'free' BEFORE 'basic';
EXCEPTION
    WHEN others THEN
        -- If enum doesn't exist, create it
        CREATE TYPE subscription_tier AS ENUM ('free', 'basic', 'pro');
END $$;

-- Step 3: Add new columns to pro_profiles
ALTER TABLE public.pro_profiles
    ADD COLUMN IF NOT EXISTS theme_type theme_type DEFAULT 'visual',
    ADD COLUMN IF NOT EXISTS payment_link TEXT,
    ADD COLUMN IF NOT EXISTS open_chat_url TEXT,
    ADD COLUMN IF NOT EXISTS booking_url TEXT,
    ADD COLUMN IF NOT EXISTS theme_settings JSONB DEFAULT '{}',
    ADD COLUMN IF NOT EXISTS monthly_lead_count INTEGER DEFAULT 0,
    ADD COLUMN IF NOT EXISTS studio_id UUID;

-- Step 4: Create new indexes
CREATE INDEX IF NOT EXISTS idx_pro_profiles_theme ON public.pro_profiles(theme_type);

-- Step 5: Update increment_profile_views to use slug instead of id
CREATE OR REPLACE FUNCTION public.increment_profile_views(profile_slug TEXT)
RETURNS void AS $$
BEGIN
    UPDATE public.pro_profiles
    SET profile_views = profile_views + 1
    WHERE slug = profile_slug;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 6: Add text search index for pro profiles
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX IF NOT EXISTS idx_pro_profiles_search
    ON public.pro_profiles
    USING gin((title || ' ' || COALESCE(bio, '')) gin_trgm_ops);

-- Comments
COMMENT ON COLUMN public.pro_profiles.theme_type IS 'Portfolio template style: visual, curriculum, or social';
COMMENT ON COLUMN public.pro_profiles.payment_link IS 'External payment page URL (Toss, Stripe link, etc.)';
COMMENT ON COLUMN public.pro_profiles.open_chat_url IS 'KakaoTalk open chat URL for direct contact';
COMMENT ON COLUMN public.pro_profiles.booking_url IS 'External booking system URL';
COMMENT ON COLUMN public.pro_profiles.monthly_lead_count IS 'Number of leads received this month (for billing)';
