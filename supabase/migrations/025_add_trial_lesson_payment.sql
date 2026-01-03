-- Migration: Add Trial Lesson Payment Support
-- TEE:UP Portfolio SaaS
--
-- Adds support for full trial lesson payment (체험 레슨 결제)
-- in addition to existing deposit payment flow

-- ============================================================
-- 1. Add payment_type column to bookings table
-- ============================================================
DO $$
BEGIN
    -- Create payment type enum if not exists
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'booking_payment_type') THEN
        CREATE TYPE public.booking_payment_type AS ENUM ('none', 'deposit', 'full');
    END IF;
END$$;

-- Add payment_type column to bookings
ALTER TABLE public.bookings
ADD COLUMN IF NOT EXISTS payment_type public.booking_payment_type DEFAULT 'none';

-- Add payment_key column to store Toss payment reference
ALTER TABLE public.bookings
ADD COLUMN IF NOT EXISTS payment_key text;

-- Add order_id column for payment tracking
ALTER TABLE public.bookings
ADD COLUMN IF NOT EXISTS order_id text;

-- ============================================================
-- 2. Update existing bookings based on deposit_amount
-- ============================================================
UPDATE public.bookings
SET payment_type = 'deposit'
WHERE deposit_amount > 0 AND payment_type = 'none';

-- ============================================================
-- 3. Add trial_lesson_price to sites.booking_settings
-- (This is done via JSONB, no schema change needed)
-- Documentation of expected structure:
-- booking_settings JSONB = {
--   deposit_enabled: boolean,
--   deposit_amount: number,
--   trial_lesson_enabled: boolean,  -- NEW
--   trial_lesson_price: number      -- NEW (in KRW)
-- }
-- ============================================================

-- ============================================================
-- 4. Create index for payment lookups
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_bookings_payment_key
ON public.bookings(payment_key)
WHERE payment_key IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_bookings_order_id
ON public.bookings(order_id)
WHERE order_id IS NOT NULL;

-- ============================================================
-- 5. Add function to get booking by order_id
-- ============================================================
CREATE OR REPLACE FUNCTION public.get_booking_by_order_id(p_order_id text)
RETURNS public.bookings
LANGUAGE sql
STABLE
AS $$
    SELECT *
    FROM public.bookings
    WHERE order_id = p_order_id
    LIMIT 1;
$$;

-- ============================================================
-- 6. Update RLS policies for new columns
-- ============================================================
-- No additional RLS needed as existing policies cover all columns

COMMENT ON COLUMN public.bookings.payment_type IS 'Type of payment: none (free), deposit (예약금), full (전액결제)';
COMMENT ON COLUMN public.bookings.payment_key IS 'Toss Payments payment key for refunds and tracking';
COMMENT ON COLUMN public.bookings.order_id IS 'Unique order ID for payment reference';
