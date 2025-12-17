-- Migration 008: Create scheduler tables for booking system
-- TEE:UP Portfolio SaaS - Pro scheduling and booking feature

-- ============================================
-- Step 1: Enable btree_gist extension for exclusion constraints
-- This allows us to prevent overlapping time ranges at the DB level
-- ============================================
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- ============================================
-- Step 2: Create ENUM types for booking status
-- ============================================
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');
CREATE TYPE payment_status AS ENUM ('unpaid', 'paid', 'refunded');

-- ============================================
-- Step 3: Create availability_schedules table
-- Pro's recurring weekly availability
-- ============================================
CREATE TABLE IF NOT EXISTS public.availability_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pro_id UUID REFERENCES public.pro_profiles(id) ON DELETE CASCADE NOT NULL,

    -- Schedule definition
    day_of_week SMALLINT NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_recurring BOOLEAN DEFAULT true NOT NULL,

    -- Optional: specific date for non-recurring availability
    specific_date DATE,

    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

    -- Constraints
    CONSTRAINT valid_time_range CHECK (start_time < end_time),
    CONSTRAINT recurring_or_specific CHECK (
        (is_recurring = true AND specific_date IS NULL) OR
        (is_recurring = false AND specific_date IS NOT NULL)
    )
);

-- Prevent overlapping schedules for the same pro on the same day
CREATE INDEX idx_availability_schedules_pro_day
    ON public.availability_schedules(pro_id, day_of_week);

-- For non-recurring, prevent overlaps on specific dates
CREATE INDEX idx_availability_schedules_specific_date
    ON public.availability_schedules(pro_id, specific_date)
    WHERE specific_date IS NOT NULL;

-- ============================================
-- Step 4: Create blocked_slots table
-- Time slots blocked by pro (vacations, personal time)
-- ============================================
CREATE TABLE IF NOT EXISTS public.blocked_slots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pro_id UUID REFERENCES public.pro_profiles(id) ON DELETE CASCADE NOT NULL,

    -- Block definition
    start_at TIMESTAMP WITH TIME ZONE NOT NULL,
    end_at TIMESTAMP WITH TIME ZONE NOT NULL,

    -- Optional reason
    reason VARCHAR(255),

    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

    -- Constraints
    CONSTRAINT valid_block_range CHECK (start_at < end_at)
);

-- Prevent overlapping blocked slots for the same pro
ALTER TABLE public.blocked_slots
    ADD CONSTRAINT no_overlapping_blocked_slots
    EXCLUDE USING gist (
        pro_id WITH =,
        tstzrange(start_at, end_at, '[)') WITH &&
    );

CREATE INDEX idx_blocked_slots_pro_id ON public.blocked_slots(pro_id);
CREATE INDEX idx_blocked_slots_time_range ON public.blocked_slots(start_at, end_at);

-- ============================================
-- Step 5: Create bookings table
-- Actual lesson bookings
-- ============================================
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pro_id UUID REFERENCES public.pro_profiles(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,

    -- For non-member bookings
    guest_name VARCHAR(255),
    guest_phone VARCHAR(20),
    guest_email VARCHAR(255),

    -- Booking time
    start_at TIMESTAMP WITH TIME ZONE NOT NULL,
    end_at TIMESTAMP WITH TIME ZONE NOT NULL,

    -- Status tracking
    status booking_status DEFAULT 'pending' NOT NULL,
    payment_status payment_status DEFAULT 'unpaid' NOT NULL,

    -- Pricing (stored at booking time for historical accuracy)
    price_amount INTEGER,
    price_currency VARCHAR(3) DEFAULT 'KRW',

    -- Notes
    customer_notes TEXT,
    pro_notes TEXT,

    -- Cancellation
    cancelled_at TIMESTAMP WITH TIME ZONE,
    cancellation_reason TEXT,

    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

    -- Constraints
    CONSTRAINT valid_booking_range CHECK (start_at < end_at),
    CONSTRAINT guest_info_required CHECK (
        user_id IS NOT NULL OR
        (guest_name IS NOT NULL AND (guest_phone IS NOT NULL OR guest_email IS NOT NULL))
    )
);

-- Prevent double-booking: no overlapping confirmed bookings for the same pro
-- Only applies to non-cancelled bookings
ALTER TABLE public.bookings
    ADD CONSTRAINT no_double_booking
    EXCLUDE USING gist (
        pro_id WITH =,
        tstzrange(start_at, end_at, '[)') WITH &&
    ) WHERE (status NOT IN ('cancelled'));

-- Indexes for bookings
CREATE INDEX idx_bookings_pro_id ON public.bookings(pro_id);
CREATE INDEX idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX idx_bookings_status ON public.bookings(status);
CREATE INDEX idx_bookings_start_at ON public.bookings(start_at);
CREATE INDEX idx_bookings_pro_time ON public.bookings(pro_id, start_at, end_at);

-- ============================================
-- Step 6: Enable Row Level Security
-- ============================================
ALTER TABLE public.availability_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocked_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- ============================================
-- Step 7: RLS Policies for availability_schedules
-- ============================================

-- Anyone can view approved pro's schedules (for booking UI)
CREATE POLICY "Public can view approved pro schedules"
    ON public.availability_schedules FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.pro_profiles
            WHERE id = availability_schedules.pro_id
            AND is_approved = true
        )
    );

-- Pros can view their own schedules (even if not approved)
CREATE POLICY "Pros can view own schedules"
    ON public.availability_schedules FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.pro_profiles
            WHERE id = availability_schedules.pro_id
            AND user_id = auth.uid()
        )
    );

-- Pros can create their own schedules
CREATE POLICY "Pros can create own schedules"
    ON public.availability_schedules FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.pro_profiles
            WHERE id = availability_schedules.pro_id
            AND user_id = auth.uid()
        )
    );

-- Pros can update their own schedules
CREATE POLICY "Pros can update own schedules"
    ON public.availability_schedules FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.pro_profiles
            WHERE id = availability_schedules.pro_id
            AND user_id = auth.uid()
        )
    );

-- Pros can delete their own schedules
CREATE POLICY "Pros can delete own schedules"
    ON public.availability_schedules FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.pro_profiles
            WHERE id = availability_schedules.pro_id
            AND user_id = auth.uid()
        )
    );

-- ============================================
-- Step 8: RLS Policies for blocked_slots
-- ============================================

-- Public can view blocked slots (needed for booking UI)
CREATE POLICY "Public can view blocked slots"
    ON public.blocked_slots FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.pro_profiles
            WHERE id = blocked_slots.pro_id
            AND is_approved = true
        )
    );

-- Pros can view their own blocked slots
CREATE POLICY "Pros can view own blocked slots"
    ON public.blocked_slots FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.pro_profiles
            WHERE id = blocked_slots.pro_id
            AND user_id = auth.uid()
        )
    );

-- Pros can create blocked slots
CREATE POLICY "Pros can create blocked slots"
    ON public.blocked_slots FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.pro_profiles
            WHERE id = blocked_slots.pro_id
            AND user_id = auth.uid()
        )
    );

-- Pros can update their own blocked slots
CREATE POLICY "Pros can update own blocked slots"
    ON public.blocked_slots FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.pro_profiles
            WHERE id = blocked_slots.pro_id
            AND user_id = auth.uid()
        )
    );

-- Pros can delete their own blocked slots
CREATE POLICY "Pros can delete own blocked slots"
    ON public.blocked_slots FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.pro_profiles
            WHERE id = blocked_slots.pro_id
            AND user_id = auth.uid()
        )
    );

-- ============================================
-- Step 9: RLS Policies for bookings
-- ============================================

-- Pros can view their bookings
CREATE POLICY "Pros can view their bookings"
    ON public.bookings FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.pro_profiles
            WHERE id = bookings.pro_id
            AND user_id = auth.uid()
        )
    );

-- Users can view their own bookings
CREATE POLICY "Users can view own bookings"
    ON public.bookings FOR SELECT
    USING (user_id = auth.uid());

-- Anyone can create bookings (including guests)
CREATE POLICY "Anyone can create bookings"
    ON public.bookings FOR INSERT
    WITH CHECK (true);

-- Pros can update bookings (confirm, complete, add notes)
CREATE POLICY "Pros can update their bookings"
    ON public.bookings FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.pro_profiles
            WHERE id = bookings.pro_id
            AND user_id = auth.uid()
        )
    );

-- Users can update their own bookings (cancel)
CREATE POLICY "Users can update own bookings"
    ON public.bookings FOR UPDATE
    USING (user_id = auth.uid());

-- ============================================
-- Step 10: Create triggers for updated_at
-- ============================================
CREATE TRIGGER handle_updated_at_availability_schedules
    BEFORE UPDATE ON public.availability_schedules
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_bookings
    BEFORE UPDATE ON public.bookings
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- Step 11: Helper functions
-- ============================================

-- Function to check if a time slot is available for booking
CREATE OR REPLACE FUNCTION public.is_slot_available(
    p_pro_id UUID,
    p_start_at TIMESTAMP WITH TIME ZONE,
    p_end_at TIMESTAMP WITH TIME ZONE
)
RETURNS BOOLEAN AS $$
DECLARE
    v_day_of_week SMALLINT;
    v_start_time TIME;
    v_end_time TIME;
    v_has_availability BOOLEAN;
    v_is_blocked BOOLEAN;
    v_has_booking BOOLEAN;
BEGIN
    -- Extract day of week and times
    v_day_of_week := EXTRACT(DOW FROM p_start_at)::SMALLINT;
    v_start_time := p_start_at::TIME;
    v_end_time := p_end_at::TIME;

    -- Check if pro has availability for this time slot
    SELECT EXISTS (
        SELECT 1 FROM public.availability_schedules
        WHERE pro_id = p_pro_id
        AND day_of_week = v_day_of_week
        AND start_time <= v_start_time
        AND end_time >= v_end_time
        AND (is_recurring = true OR specific_date = p_start_at::DATE)
    ) INTO v_has_availability;

    IF NOT v_has_availability THEN
        RETURN FALSE;
    END IF;

    -- Check if slot is blocked
    SELECT EXISTS (
        SELECT 1 FROM public.blocked_slots
        WHERE pro_id = p_pro_id
        AND tstzrange(start_at, end_at, '[)') && tstzrange(p_start_at, p_end_at, '[)')
    ) INTO v_is_blocked;

    IF v_is_blocked THEN
        RETURN FALSE;
    END IF;

    -- Check if there's already a booking (non-cancelled)
    SELECT EXISTS (
        SELECT 1 FROM public.bookings
        WHERE pro_id = p_pro_id
        AND status NOT IN ('cancelled')
        AND tstzrange(start_at, end_at, '[)') && tstzrange(p_start_at, p_end_at, '[)')
    ) INTO v_has_booking;

    RETURN NOT v_has_booking;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get available slots for a pro on a specific date
CREATE OR REPLACE FUNCTION public.get_available_slots(
    p_pro_id UUID,
    p_date DATE,
    p_slot_duration_minutes INTEGER DEFAULT 60
)
RETURNS TABLE (
    slot_start TIMESTAMP WITH TIME ZONE,
    slot_end TIMESTAMP WITH TIME ZONE
) AS $$
DECLARE
    v_day_of_week SMALLINT;
    v_schedule RECORD;
    v_current_start TIMESTAMP WITH TIME ZONE;
    v_current_end TIMESTAMP WITH TIME ZONE;
BEGIN
    v_day_of_week := EXTRACT(DOW FROM p_date)::SMALLINT;

    -- Loop through all availability schedules for this day
    FOR v_schedule IN
        SELECT * FROM public.availability_schedules
        WHERE pro_id = p_pro_id
        AND day_of_week = v_day_of_week
        AND (is_recurring = true OR specific_date = p_date)
    LOOP
        -- Generate slots within this schedule
        v_current_start := p_date + v_schedule.start_time;

        WHILE (v_current_start + (p_slot_duration_minutes || ' minutes')::INTERVAL)::TIME <= v_schedule.end_time LOOP
            v_current_end := v_current_start + (p_slot_duration_minutes || ' minutes')::INTERVAL;

            -- Check if this slot is available
            IF public.is_slot_available(p_pro_id, v_current_start, v_current_end) THEN
                slot_start := v_current_start;
                slot_end := v_current_end;
                RETURN NEXT;
            END IF;

            v_current_start := v_current_end;
        END LOOP;
    END LOOP;

    RETURN;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- Step 12: Add comments for documentation
-- ============================================
COMMENT ON TABLE public.availability_schedules IS 'Pro weekly availability schedules for booking';
COMMENT ON COLUMN public.availability_schedules.day_of_week IS 'Day of week (0=Sunday, 6=Saturday)';
COMMENT ON COLUMN public.availability_schedules.is_recurring IS 'If true, repeats weekly. If false, specific_date must be set';

COMMENT ON TABLE public.blocked_slots IS 'Time slots blocked by pro (vacations, personal time)';
COMMENT ON CONSTRAINT no_overlapping_blocked_slots ON public.blocked_slots IS 'Prevents overlapping blocked slots';

COMMENT ON TABLE public.bookings IS 'Lesson bookings - supports both registered users and guests';
COMMENT ON CONSTRAINT no_double_booking ON public.bookings IS 'Prevents double-booking at DB level';
COMMENT ON COLUMN public.bookings.guest_name IS 'For non-member bookings - name required if user_id is null';

COMMENT ON FUNCTION public.is_slot_available IS 'Checks if a time slot is available for booking';
COMMENT ON FUNCTION public.get_available_slots IS 'Returns all available booking slots for a pro on a given date';
