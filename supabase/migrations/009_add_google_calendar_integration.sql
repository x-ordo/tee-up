-- Migration 009: Add Google Calendar integration support
-- TEE:UP Portfolio SaaS - Pro scheduling feature

-- ============================================
-- Step 1: Add Google Calendar event ID to bookings
-- This allows us to update/delete Google Calendar events
-- when bookings are modified
-- ============================================
ALTER TABLE public.bookings
ADD COLUMN IF NOT EXISTS google_calendar_event_id VARCHAR(255);

-- Index for looking up bookings by Google Calendar event ID
CREATE INDEX IF NOT EXISTS idx_bookings_google_calendar_event_id
    ON public.bookings(google_calendar_event_id)
    WHERE google_calendar_event_id IS NOT NULL;

-- ============================================
-- Step 2: Add calendar sync preferences to pro_profiles
-- ============================================
ALTER TABLE public.pro_profiles
ADD COLUMN IF NOT EXISTS google_calendar_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS google_calendar_id VARCHAR(255) DEFAULT 'primary';

-- ============================================
-- Step 3: Comments for documentation
-- ============================================
COMMENT ON COLUMN public.bookings.google_calendar_event_id IS
    'Google Calendar event ID for synced bookings. NULL if not synced.';

COMMENT ON COLUMN public.pro_profiles.google_calendar_enabled IS
    'Whether the pro has enabled Google Calendar sync.';

COMMENT ON COLUMN public.pro_profiles.google_calendar_id IS
    'Google Calendar ID to sync events to (default: primary).';
