-- Migration 011: Monetization Setup
-- TEE:UP Portfolio SaaS - 수익화 모델 전환
--
-- 변경사항:
-- 1. memberships 테이블 생성 (기존 subscriptions와 별도)
-- 2. sites.booking_settings JSONB 컬럼 추가
-- 3. bookings.payment_status enum에 'deposit_paid' 추가
-- 4. bookings.deposit_amount 컬럼 추가
--
-- 배경: "문의 횟수 제한" → "구독 + 예약금" 모델로 전환

-- ============================================
-- Step 1: Create enum types for memberships
-- ============================================

CREATE TYPE membership_plan_tier AS ENUM ('free', 'prestige');
CREATE TYPE membership_status AS ENUM ('active', 'past_due', 'cancelled');

-- ============================================
-- Step 2: Create memberships table
-- ============================================

CREATE TABLE IF NOT EXISTS public.memberships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Owner (pro or studio owner)
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,

    -- Plan info
    plan_tier membership_plan_tier NOT NULL DEFAULT 'free',
    status membership_status NOT NULL DEFAULT 'active',

    -- Toss Payments 자동결제
    billing_key TEXT,                    -- 토스 billingKey for recurring payments
    customer_key TEXT,                   -- 토스 customerKey

    -- Period tracking
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,

    -- Cancellation
    cancel_at_period_end BOOLEAN DEFAULT false,
    cancelled_at TIMESTAMP WITH TIME ZONE,

    -- Metadata
    metadata JSONB DEFAULT '{}',

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

    -- Constraints
    UNIQUE(user_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_memberships_user_id ON public.memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_memberships_status ON public.memberships(status);
CREATE INDEX IF NOT EXISTS idx_memberships_plan_tier ON public.memberships(plan_tier);
CREATE INDEX IF NOT EXISTS idx_memberships_period_end ON public.memberships(current_period_end);

-- ============================================
-- Step 3: Add booking_settings to sites table
-- ============================================

ALTER TABLE public.sites
ADD COLUMN IF NOT EXISTS booking_settings JSONB
DEFAULT '{"deposit_enabled": false, "deposit_amount": 30000}'::jsonb;

COMMENT ON COLUMN public.sites.booking_settings IS 'Booking configuration: deposit_enabled (bool), deposit_amount (integer in KRW, default 30000)';

-- ============================================
-- Step 4: Extend payment_status enum for bookings
-- ============================================

-- Note: ALTER TYPE ... ADD VALUE is safe for existing data
ALTER TYPE payment_status ADD VALUE IF NOT EXISTS 'deposit_paid';

-- ============================================
-- Step 5: Add deposit_amount to bookings table
-- ============================================

ALTER TABLE public.bookings
ADD COLUMN IF NOT EXISTS deposit_amount INTEGER DEFAULT 0;

COMMENT ON COLUMN public.bookings.deposit_amount IS 'Deposit amount in KRW (0 if no deposit required)';

-- ============================================
-- Step 6: Enable RLS for memberships
-- ============================================

ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;

-- ============================================
-- Step 7: RLS Policies for memberships
-- ============================================

-- Users can view their own membership
CREATE POLICY "Users can view own membership"
    ON public.memberships FOR SELECT
    USING (user_id = auth.uid());

-- Users can insert their own membership (for initial signup)
CREATE POLICY "Users can create own membership"
    ON public.memberships FOR INSERT
    WITH CHECK (user_id = auth.uid());

-- Users can update their own membership (for cancellation)
CREATE POLICY "Users can update own membership"
    ON public.memberships FOR UPDATE
    USING (user_id = auth.uid());

-- Note: Service role bypasses RLS for webhook processing

-- ============================================
-- Step 8: Triggers
-- ============================================

-- Updated_at trigger for memberships
CREATE TRIGGER handle_updated_at_memberships
    BEFORE UPDATE ON public.memberships
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- Step 9: Helper function for membership check
-- ============================================

CREATE OR REPLACE FUNCTION public.get_membership_tier(p_user_id UUID)
RETURNS membership_plan_tier AS $$
DECLARE
    v_tier membership_plan_tier;
BEGIN
    SELECT plan_tier INTO v_tier
    FROM public.memberships
    WHERE user_id = p_user_id
    AND status = 'active'
    AND (current_period_end IS NULL OR current_period_end > NOW());

    -- Return 'free' if no active membership found
    RETURN COALESCE(v_tier, 'free');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.get_membership_tier IS 'Returns the active membership tier for a user, defaults to free';

-- ============================================
-- Step 10: Comments
-- ============================================

COMMENT ON TABLE public.memberships IS 'User memberships for TEE:UP SaaS billing - separate from legacy subscriptions table';
COMMENT ON COLUMN public.memberships.billing_key IS 'Toss Payments billingKey for automatic recurring payments';
COMMENT ON COLUMN public.memberships.customer_key IS 'Toss Payments customerKey for customer identification';
COMMENT ON COLUMN public.memberships.plan_tier IS 'Membership tier: free (default), prestige (paid premium)';
COMMENT ON COLUMN public.memberships.status IS 'Membership status: active, past_due (payment failed), cancelled';
