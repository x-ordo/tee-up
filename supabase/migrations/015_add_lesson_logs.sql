-- Migration 015: Create lesson logs and media tables
-- TEE:UP Portfolio SaaS - Lesson journal system for data lock-in

-- ============================================
-- Step 1: Create lesson_logs table
-- Pro's lesson journal entries
-- ============================================
CREATE TABLE IF NOT EXISTS public.lesson_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
    pro_id UUID REFERENCES public.pro_profiles(id) ON DELETE CASCADE NOT NULL,
    student_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,

    -- Guest student support (non-member students)
    guest_name VARCHAR(255),
    guest_phone VARCHAR(20),

    -- Lesson details
    lesson_date DATE NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    lesson_type VARCHAR(50), -- 'individual', 'group', 'online', 'on_course'

    -- Content
    topic VARCHAR(255),
    notes TEXT,
    homework TEXT,

    -- Performance metrics (JSONB for flexibility)
    metrics JSONB DEFAULT '{}',
    -- Example: {
    --   "drive_distance": 230,
    --   "putting_accuracy": 0.7,
    --   "handicap": 18,
    --   "swing_speed": 95,
    --   "ball_speed": 140
    -- }

    -- Progress tracking
    skill_level VARCHAR(20), -- 'beginner', 'intermediate', 'advanced', 'pro'
    progress_notes TEXT,

    -- Visibility
    is_shared_with_student BOOLEAN DEFAULT true,

    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

    -- Constraints
    CONSTRAINT student_or_guest CHECK (
        student_id IS NOT NULL OR guest_name IS NOT NULL
    )
);

-- ============================================
-- Step 2: Create lesson_media table
-- Media attachments for lesson logs
-- ============================================
CREATE TABLE IF NOT EXISTS public.lesson_media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lesson_log_id UUID REFERENCES public.lesson_logs(id) ON DELETE CASCADE NOT NULL,

    -- Media info
    media_type VARCHAR(20) NOT NULL, -- 'image', 'video'
    url TEXT NOT NULL,
    thumbnail_url TEXT,
    storage_path TEXT, -- Supabase Storage path

    -- File metadata
    file_name VARCHAR(255),
    file_size INTEGER, -- bytes
    mime_type VARCHAR(100),
    duration_seconds INTEGER, -- for videos

    -- Content metadata
    title VARCHAR(255),
    description TEXT,
    tags TEXT[], -- Array of tags for categorization

    -- Analysis data (for future AI features)
    analysis_data JSONB DEFAULT '{}',
    -- Example: { "swing_phase": "backswing", "detected_issues": ["early extension"] }

    -- Ordering
    display_order INTEGER DEFAULT 0,

    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ============================================
-- Step 3: Create indexes
-- ============================================
CREATE INDEX idx_lesson_logs_pro_id ON public.lesson_logs(pro_id);
CREATE INDEX idx_lesson_logs_student_id ON public.lesson_logs(student_id);
CREATE INDEX idx_lesson_logs_booking_id ON public.lesson_logs(booking_id);
CREATE INDEX idx_lesson_logs_lesson_date ON public.lesson_logs(lesson_date DESC);
CREATE INDEX idx_lesson_logs_pro_date ON public.lesson_logs(pro_id, lesson_date DESC);

CREATE INDEX idx_lesson_media_lesson_log_id ON public.lesson_media(lesson_log_id);
CREATE INDEX idx_lesson_media_type ON public.lesson_media(media_type);

-- ============================================
-- Step 4: Enable RLS
-- ============================================
ALTER TABLE public.lesson_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_media ENABLE ROW LEVEL SECURITY;

-- ============================================
-- Step 5: RLS Policies for lesson_logs
-- ============================================

-- Pros can view their own lesson logs
CREATE POLICY "Pros can view own lesson logs"
    ON public.lesson_logs FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.pro_profiles
            WHERE id = lesson_logs.pro_id
            AND user_id = auth.uid()
        )
    );

-- Students can view lesson logs shared with them
CREATE POLICY "Students can view shared lesson logs"
    ON public.lesson_logs FOR SELECT
    USING (
        student_id = auth.uid()
        AND is_shared_with_student = true
    );

-- Pros can create lesson logs
CREATE POLICY "Pros can create lesson logs"
    ON public.lesson_logs FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.pro_profiles
            WHERE id = lesson_logs.pro_id
            AND user_id = auth.uid()
        )
    );

-- Pros can update their own lesson logs
CREATE POLICY "Pros can update own lesson logs"
    ON public.lesson_logs FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.pro_profiles
            WHERE id = lesson_logs.pro_id
            AND user_id = auth.uid()
        )
    );

-- Pros can delete their own lesson logs
CREATE POLICY "Pros can delete own lesson logs"
    ON public.lesson_logs FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.pro_profiles
            WHERE id = lesson_logs.pro_id
            AND user_id = auth.uid()
        )
    );

-- ============================================
-- Step 6: RLS Policies for lesson_media
-- ============================================

-- Pros can view media for their lesson logs
CREATE POLICY "Pros can view own lesson media"
    ON public.lesson_media FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.lesson_logs ll
            JOIN public.pro_profiles pp ON pp.id = ll.pro_id
            WHERE ll.id = lesson_media.lesson_log_id
            AND pp.user_id = auth.uid()
        )
    );

-- Students can view media for shared lessons
CREATE POLICY "Students can view shared lesson media"
    ON public.lesson_media FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.lesson_logs ll
            WHERE ll.id = lesson_media.lesson_log_id
            AND ll.student_id = auth.uid()
            AND ll.is_shared_with_student = true
        )
    );

-- Pros can insert media for their lesson logs
CREATE POLICY "Pros can create lesson media"
    ON public.lesson_media FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.lesson_logs ll
            JOIN public.pro_profiles pp ON pp.id = ll.pro_id
            WHERE ll.id = lesson_media.lesson_log_id
            AND pp.user_id = auth.uid()
        )
    );

-- Pros can update media for their lesson logs
CREATE POLICY "Pros can update own lesson media"
    ON public.lesson_media FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.lesson_logs ll
            JOIN public.pro_profiles pp ON pp.id = ll.pro_id
            WHERE ll.id = lesson_media.lesson_log_id
            AND pp.user_id = auth.uid()
        )
    );

-- Pros can delete media for their lesson logs
CREATE POLICY "Pros can delete own lesson media"
    ON public.lesson_media FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.lesson_logs ll
            JOIN public.pro_profiles pp ON pp.id = ll.pro_id
            WHERE ll.id = lesson_media.lesson_log_id
            AND pp.user_id = auth.uid()
        )
    );

-- ============================================
-- Step 7: Create triggers for updated_at
-- ============================================
CREATE TRIGGER handle_updated_at_lesson_logs
    BEFORE UPDATE ON public.lesson_logs
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- Step 8: Helper functions
-- ============================================

-- Get student's lesson history with a pro
CREATE OR REPLACE FUNCTION public.get_student_lesson_history(
    p_pro_id UUID,
    p_student_id UUID DEFAULT NULL,
    p_guest_name VARCHAR DEFAULT NULL
)
RETURNS TABLE (
    id UUID,
    lesson_date DATE,
    duration_minutes INTEGER,
    topic VARCHAR(255),
    notes TEXT,
    homework TEXT,
    metrics JSONB,
    media_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        ll.id,
        ll.lesson_date,
        ll.duration_minutes,
        ll.topic,
        ll.notes,
        ll.homework,
        ll.metrics,
        COUNT(lm.id) as media_count
    FROM public.lesson_logs ll
    LEFT JOIN public.lesson_media lm ON lm.lesson_log_id = ll.id
    WHERE ll.pro_id = p_pro_id
    AND (
        (p_student_id IS NOT NULL AND ll.student_id = p_student_id)
        OR (p_guest_name IS NOT NULL AND ll.guest_name = p_guest_name)
    )
    GROUP BY ll.id
    ORDER BY ll.lesson_date DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get lesson statistics for a pro
CREATE OR REPLACE FUNCTION public.get_pro_lesson_stats(p_pro_id UUID)
RETURNS JSON AS $$
DECLARE
    v_total_lessons INTEGER;
    v_total_students INTEGER;
    v_total_hours NUMERIC;
    v_this_month_lessons INTEGER;
    v_avg_metrics JSON;
BEGIN
    -- Total lessons
    SELECT COUNT(*) INTO v_total_lessons
    FROM public.lesson_logs WHERE pro_id = p_pro_id;

    -- Total unique students
    SELECT COUNT(DISTINCT COALESCE(student_id::text, guest_name)) INTO v_total_students
    FROM public.lesson_logs WHERE pro_id = p_pro_id;

    -- Total hours
    SELECT COALESCE(SUM(duration_minutes) / 60.0, 0) INTO v_total_hours
    FROM public.lesson_logs WHERE pro_id = p_pro_id;

    -- This month's lessons
    SELECT COUNT(*) INTO v_this_month_lessons
    FROM public.lesson_logs
    WHERE pro_id = p_pro_id
    AND lesson_date >= date_trunc('month', CURRENT_DATE);

    RETURN json_build_object(
        'total_lessons', v_total_lessons,
        'total_students', v_total_students,
        'total_hours', ROUND(v_total_hours::numeric, 1),
        'this_month_lessons', v_this_month_lessons
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- Step 9: Add comments
-- ============================================
COMMENT ON TABLE public.lesson_logs IS 'Pro lesson journal entries - tracks lessons with students';
COMMENT ON COLUMN public.lesson_logs.metrics IS 'JSONB field for flexible performance metrics (drive_distance, putting_accuracy, etc.)';
COMMENT ON COLUMN public.lesson_logs.guest_name IS 'For students who are not registered users';
COMMENT ON COLUMN public.lesson_logs.is_shared_with_student IS 'Whether the student can view this lesson log';

COMMENT ON TABLE public.lesson_media IS 'Media attachments (images/videos) for lesson logs';
COMMENT ON COLUMN public.lesson_media.storage_path IS 'Path in Supabase Storage bucket';
COMMENT ON COLUMN public.lesson_media.analysis_data IS 'JSONB field for AI analysis results (swing detection, etc.)';

COMMENT ON FUNCTION public.get_student_lesson_history IS 'Get all lesson logs for a student with a specific pro';
COMMENT ON FUNCTION public.get_pro_lesson_stats IS 'Get lesson statistics for a pro (total lessons, students, hours)';
