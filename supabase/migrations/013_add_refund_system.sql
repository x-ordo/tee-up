-- Migration 013: Add refund and dispute system to bookings
-- TEE:UP Portfolio SaaS - Refund and dispute management

-- ============================================
-- Step 1: Add refund columns to bookings table
-- ============================================
ALTER TABLE public.bookings
ADD COLUMN IF NOT EXISTS refund_amount INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS refund_reason TEXT,
ADD COLUMN IF NOT EXISTS refund_requested_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS refund_processed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS dispute_status VARCHAR(20) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS dispute_opened_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS dispute_resolved_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS dispute_resolution TEXT;

-- ============================================
-- Step 2: Add comments for documentation
-- ============================================
COMMENT ON COLUMN public.bookings.refund_amount IS 'Amount refunded in KRW (0 if no refund)';
COMMENT ON COLUMN public.bookings.refund_reason IS 'Reason for refund request';
COMMENT ON COLUMN public.bookings.refund_requested_at IS 'Timestamp when refund was requested';
COMMENT ON COLUMN public.bookings.refund_processed_at IS 'Timestamp when refund was processed';
COMMENT ON COLUMN public.bookings.dispute_status IS 'null=normal, opened=dispute filed, pro_responded=pro response submitted, resolved_pro=resolved in favor of pro, resolved_customer=resolved in favor of customer, escalated=admin intervention required';
COMMENT ON COLUMN public.bookings.dispute_opened_at IS 'Timestamp when dispute was opened';
COMMENT ON COLUMN public.bookings.dispute_resolved_at IS 'Timestamp when dispute was resolved';
COMMENT ON COLUMN public.bookings.dispute_resolution IS 'Admin resolution notes';

-- ============================================
-- Step 3: Create dispute_status check constraint
-- ============================================
ALTER TABLE public.bookings
ADD CONSTRAINT valid_dispute_status CHECK (
    dispute_status IS NULL OR
    dispute_status IN ('opened', 'pro_responded', 'resolved_pro', 'resolved_customer', 'escalated')
);

-- ============================================
-- Step 4: Create indexes for refund/dispute queries
-- ============================================
CREATE INDEX IF NOT EXISTS idx_bookings_dispute_status
    ON public.bookings(dispute_status)
    WHERE dispute_status IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_bookings_refund_requested
    ON public.bookings(refund_requested_at)
    WHERE refund_requested_at IS NOT NULL;

-- ============================================
-- Step 5: Create dispute_logs table for tracking dispute history
-- ============================================
CREATE TABLE IF NOT EXISTS public.dispute_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE NOT NULL,

    -- Actor info
    actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    actor_role VARCHAR(20) NOT NULL, -- 'customer', 'pro', 'admin'

    -- Action details
    action VARCHAR(50) NOT NULL, -- 'opened', 'responded', 'escalated', 'resolved', 'evidence_added'
    message TEXT,
    evidence_urls TEXT[], -- Array of uploaded evidence URLs

    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Index for fetching dispute history
CREATE INDEX IF NOT EXISTS idx_dispute_logs_booking_id ON public.dispute_logs(booking_id);

-- ============================================
-- Step 6: Enable RLS on dispute_logs
-- ============================================
ALTER TABLE public.dispute_logs ENABLE ROW LEVEL SECURITY;

-- Admins can view all dispute logs
CREATE POLICY "Admins can view all dispute logs"
    ON public.dispute_logs FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid()
            AND role = 'admin'
        )
    );

-- Pros can view dispute logs for their bookings
CREATE POLICY "Pros can view dispute logs for their bookings"
    ON public.dispute_logs FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.bookings b
            JOIN public.pro_profiles pp ON pp.id = b.pro_id
            WHERE b.id = dispute_logs.booking_id
            AND pp.user_id = auth.uid()
        )
    );

-- Users can view dispute logs for their bookings
CREATE POLICY "Users can view dispute logs for their bookings"
    ON public.dispute_logs FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.bookings
            WHERE id = dispute_logs.booking_id
            AND user_id = auth.uid()
        )
    );

-- Users can create dispute logs for their bookings
CREATE POLICY "Users can create dispute logs for their bookings"
    ON public.dispute_logs FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.bookings
            WHERE id = dispute_logs.booking_id
            AND user_id = auth.uid()
        )
    );

-- Pros can create dispute logs for their bookings
CREATE POLICY "Pros can create dispute logs for their bookings"
    ON public.dispute_logs FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.bookings b
            JOIN public.pro_profiles pp ON pp.id = b.pro_id
            WHERE b.id = dispute_logs.booking_id
            AND pp.user_id = auth.uid()
        )
    );

-- Admins can create dispute logs
CREATE POLICY "Admins can create dispute logs"
    ON public.dispute_logs FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid()
            AND role = 'admin'
        )
    );

-- ============================================
-- Step 7: Helper function to calculate refund amount
-- Based on cancellation timing policy (제4조)
-- ============================================
CREATE OR REPLACE FUNCTION public.calculate_refund_amount(
    p_booking_id UUID,
    p_cancellation_time TIMESTAMP WITH TIME ZONE DEFAULT NOW()
)
RETURNS INTEGER AS $$
DECLARE
    v_booking RECORD;
    v_hours_until_lesson NUMERIC;
    v_refund_percentage NUMERIC;
BEGIN
    -- Get booking details
    SELECT * INTO v_booking
    FROM public.bookings
    WHERE id = p_booking_id;

    IF NOT FOUND THEN
        RETURN 0;
    END IF;

    -- If no payment, no refund
    IF v_booking.price_amount IS NULL OR v_booking.price_amount = 0 THEN
        RETURN 0;
    END IF;

    -- If already refunded, return 0
    IF v_booking.payment_status = 'refunded' THEN
        RETURN 0;
    END IF;

    -- Calculate hours until lesson
    v_hours_until_lesson := EXTRACT(EPOCH FROM (v_booking.start_at - p_cancellation_time)) / 3600;

    -- Apply refund policy (제4조)
    IF v_hours_until_lesson >= 24 THEN
        -- 24시간 전: 100% 환불
        v_refund_percentage := 1.0;
    ELSIF v_hours_until_lesson >= 12 THEN
        -- 12시간 전: 50% 환불
        v_refund_percentage := 0.5;
    ELSE
        -- 12시간 이내: 환불 불가
        v_refund_percentage := 0.0;
    END IF;

    RETURN FLOOR(v_booking.price_amount * v_refund_percentage);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.calculate_refund_amount IS
    'Calculates refund amount based on 제4조 cancellation policy: 24h=100%, 12h=50%, <12h=0%';

-- ============================================
-- Step 8: Add comments for table
-- ============================================
COMMENT ON TABLE public.dispute_logs IS 'History of actions taken during a booking dispute';
