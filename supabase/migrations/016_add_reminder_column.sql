-- Migration 016: Add reminder_sent_at column to bookings
-- TEE:UP - Track when reminder notifications are sent

-- ============================================
-- Step 1: Add reminder column to bookings
-- ============================================
ALTER TABLE public.bookings
ADD COLUMN IF NOT EXISTS reminder_sent_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;

-- ============================================
-- Step 2: Create index for reminder queries
-- ============================================
CREATE INDEX IF NOT EXISTS idx_bookings_reminder_pending
ON public.bookings (start_at)
WHERE status = 'confirmed' AND reminder_sent_at IS NULL;

-- ============================================
-- Step 3: Add comment
-- ============================================
COMMENT ON COLUMN public.bookings.reminder_sent_at IS 'Timestamp when the 24-hour reminder notification was sent';
