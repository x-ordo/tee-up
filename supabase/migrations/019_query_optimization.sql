-- ============================================
-- Migration: Query Optimization
-- Description: Add missing indexes and RPC functions for performance
-- Date: 2025-01
-- ============================================

-- ============================================
-- MISSING INDEXES
-- ============================================

-- lesson_logs: Frequently queried by pro_id
CREATE INDEX IF NOT EXISTS idx_lesson_logs_pro_id
ON public.lesson_logs(pro_id);

-- lesson_logs: Student queries with sharing filter
CREATE INDEX IF NOT EXISTS idx_lesson_logs_student_shared
ON public.lesson_logs(student_id, is_shared_with_student)
WHERE is_shared_with_student = true;

-- booking_requests: Composite index for filtered queries
CREATE INDEX IF NOT EXISTS idx_booking_requests_pro_status
ON public.booking_requests(pro_id, status);

-- booking_requests: Time-based queries
CREATE INDEX IF NOT EXISTS idx_booking_requests_created
ON public.booking_requests(created_at DESC);

-- sites: Composite index for owner queries with status filter
CREATE INDEX IF NOT EXISTS idx_sites_owner_status
ON public.sites(owner_id, status);

-- leads: Time-based queries for analytics
CREATE INDEX IF NOT EXISTS idx_leads_created
ON public.leads(created_at DESC);

-- leads: Composite for pro queries with time filter
CREATE INDEX IF NOT EXISTS idx_leads_pro_created
ON public.leads(pro_id, created_at DESC);

-- portfolio_sections: Order queries
CREATE INDEX IF NOT EXISTS idx_portfolio_sections_profile_order
ON public.portfolio_sections(pro_profile_id, display_order);

-- ============================================
-- RPC FUNCTIONS FOR COMMON QUERY PATTERNS
-- ============================================

-- Function: Get leads with pro profile in single query
-- Replaces: getMyLeads() two-query pattern
CREATE OR REPLACE FUNCTION get_user_leads(
  p_user_id UUID,
  p_limit INTEGER DEFAULT 50,
  p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  pro_id UUID,
  contact_name VARCHAR(255),
  contact_method VARCHAR(50),
  source_url TEXT,
  referrer TEXT,
  is_billable BOOLEAN,
  billed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ
)
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT
    l.id,
    l.pro_id,
    l.contact_name,
    l.contact_method,
    l.source_url,
    l.referrer,
    l.is_billable,
    l.billed_at,
    l.created_at
  FROM public.leads l
  INNER JOIN public.pro_profiles pp ON l.pro_id = pp.id
  WHERE pp.user_id = p_user_id
  ORDER BY l.created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
$$;

-- Function: Get booking settings via pro_id in single query
-- Replaces: getBookingSettingsByProId() two-query pattern
CREATE OR REPLACE FUNCTION get_booking_settings_by_pro(p_pro_id UUID)
RETURNS JSONB
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT COALESCE(s.booking_settings, '{"deposit_enabled": false, "deposit_amount": 30000}'::jsonb)
  FROM public.sites s
  INNER JOIN public.pro_profiles pp ON s.owner_id = pp.user_id
  WHERE pp.id = p_pro_id
  AND s.status = 'published'
  LIMIT 1;
$$;

-- Function: Get lesson logs with student info in single query
-- Replaces: getMyLessonLogs() two-query pattern
CREATE OR REPLACE FUNCTION get_user_lesson_logs(
  p_user_id UUID,
  p_limit INTEGER DEFAULT 50,
  p_offset INTEGER DEFAULT 0,
  p_student_id UUID DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  pro_id UUID,
  booking_id UUID,
  student_id UUID,
  lesson_date DATE,
  duration_minutes INTEGER,
  lesson_type VARCHAR(100),
  notes TEXT,
  goals TEXT,
  achievements TEXT,
  areas_for_improvement TEXT,
  homework TEXT,
  is_shared_with_student BOOLEAN,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  student_name TEXT,
  student_avatar TEXT
)
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT
    ll.id,
    ll.pro_id,
    ll.booking_id,
    ll.student_id,
    ll.lesson_date,
    ll.duration_minutes,
    ll.lesson_type,
    ll.notes,
    ll.goals,
    ll.achievements,
    ll.areas_for_improvement,
    ll.homework,
    ll.is_shared_with_student,
    ll.created_at,
    ll.updated_at,
    p.full_name AS student_name,
    p.avatar_url AS student_avatar
  FROM public.lesson_logs ll
  INNER JOIN public.pro_profiles pp ON ll.pro_id = pp.id
  LEFT JOIN public.profiles p ON ll.student_id = p.id
  WHERE pp.user_id = p_user_id
    AND (p_student_id IS NULL OR ll.student_id = p_student_id)
  ORDER BY ll.lesson_date DESC, ll.created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
$$;

-- Function: Batch update portfolio section order
-- Replaces: N+1 update pattern in reorderPortfolioSections()
CREATE OR REPLACE FUNCTION batch_update_portfolio_order(
  p_profile_id UUID,
  p_user_id UUID,
  p_section_orders JSONB  -- [{"id": "uuid", "order": 0}, ...]
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_section JSONB;
BEGIN
  -- Verify ownership
  IF NOT EXISTS (
    SELECT 1 FROM public.pro_profiles
    WHERE id = p_profile_id AND user_id = p_user_id
  ) THEN
    RAISE EXCEPTION 'Profile not found or not owned by user';
  END IF;

  -- Batch update using CASE statement
  UPDATE public.portfolio_sections ps
  SET
    display_order = (elem->>'order')::INTEGER,
    updated_at = NOW()
  FROM jsonb_array_elements(p_section_orders) AS elem
  WHERE ps.id = (elem->>'id')::UUID
    AND ps.pro_profile_id = p_profile_id;

  RETURN TRUE;
END;
$$;

-- Function: Get studio affiliations with studio info in single query
-- Replaces: getMyStudioAffiliations() two-query pattern
CREATE OR REPLACE FUNCTION get_user_studio_affiliations(p_user_id UUID)
RETURNS TABLE (
  membership_id UUID,
  studio_id UUID,
  role VARCHAR(20),
  joined_at TIMESTAMPTZ,
  studio_name VARCHAR(255),
  studio_slug VARCHAR(100),
  studio_logo_url TEXT,
  studio_is_public BOOLEAN,
  member_count BIGINT
)
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT
    sm.id AS membership_id,
    sm.studio_id,
    sm.role,
    sm.joined_at,
    s.name AS studio_name,
    s.slug AS studio_slug,
    s.logo_url AS studio_logo_url,
    s.is_public AS studio_is_public,
    (SELECT COUNT(*) FROM public.studio_members WHERE studio_id = s.id) AS member_count
  FROM public.studio_members sm
  INNER JOIN public.studios s ON sm.studio_id = s.id
  INNER JOIN public.pro_profiles pp ON sm.pro_profile_id = pp.id
  WHERE pp.user_id = p_user_id
  ORDER BY sm.joined_at DESC;
$$;

-- ============================================
-- GRANT PERMISSIONS
-- ============================================

GRANT EXECUTE ON FUNCTION get_user_leads TO authenticated;
GRANT EXECUTE ON FUNCTION get_booking_settings_by_pro TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_lesson_logs TO authenticated;
GRANT EXECUTE ON FUNCTION batch_update_portfolio_order TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_studio_affiliations TO authenticated;

-- ============================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================

COMMENT ON FUNCTION get_user_leads IS
'Get leads for the authenticated user in a single query.
Replaces the two-query pattern (profile lookup + leads query).
Parameters: p_user_id (user UUID), p_limit (default 50), p_offset (default 0)';

COMMENT ON FUNCTION get_booking_settings_by_pro IS
'Get booking settings for a pro by their profile ID.
Returns default settings if no site is configured.
Replaces the two-query pattern (pro_profiles → sites).';

COMMENT ON FUNCTION get_user_lesson_logs IS
'Get lesson logs with student info in a single query.
Replaces the two-query pattern (profile lookup + lesson logs).
Parameters: p_user_id, p_limit, p_offset, p_student_id (optional filter)';

COMMENT ON FUNCTION batch_update_portfolio_order IS
'Batch update portfolio section display order.
Replaces N+1 update pattern with single batch operation.
Parameters: p_profile_id, p_user_id (for ownership check), p_section_orders (JSON array)';

COMMENT ON FUNCTION get_user_studio_affiliations IS
'Get user studio memberships with studio details.
Replaces the two-query pattern (pro_profiles → studio_members + studios).';

-- ============================================
-- INDEX COMMENTS
-- ============================================

COMMENT ON INDEX idx_lesson_logs_pro_id IS 'Optimizes lesson log queries by pro_id';
COMMENT ON INDEX idx_booking_requests_pro_status IS 'Optimizes filtered booking request queries';
COMMENT ON INDEX idx_sites_owner_status IS 'Optimizes site queries by owner with status filter';
COMMENT ON INDEX idx_leads_pro_created IS 'Optimizes lead analytics queries by pro with time filter';
