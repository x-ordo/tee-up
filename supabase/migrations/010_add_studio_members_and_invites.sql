-- Migration 009: Create studio_members and studio_invites tables
-- TEE:UP Portfolio SaaS - Studio dashboard and invite system

-- ============================================
-- Step 1: Create ENUM types
-- ============================================
CREATE TYPE studio_member_role AS ENUM ('owner', 'member');
CREATE TYPE invite_status AS ENUM ('pending', 'accepted', 'expired', 'revoked');

-- ============================================
-- Step 2: Create studio_members table
-- Links pros to studios with role-based access
-- ============================================
CREATE TABLE IF NOT EXISTS public.studio_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    studio_id UUID REFERENCES public.studios(id) ON DELETE CASCADE NOT NULL,
    pro_profile_id UUID REFERENCES public.pro_profiles(id) ON DELETE CASCADE NOT NULL,

    -- Role in the studio
    role studio_member_role NOT NULL DEFAULT 'member',

    -- Member info
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    invited_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,

    -- Activity tracking (for dashboard stats)
    last_active_at TIMESTAMP WITH TIME ZONE,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

    -- Constraints
    UNIQUE(studio_id, pro_profile_id)
);

-- ============================================
-- Step 3: Create studio_invites table
-- Invitation links for pros to join studios
-- ============================================
CREATE TABLE IF NOT EXISTS public.studio_invites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    studio_id UUID REFERENCES public.studios(id) ON DELETE CASCADE NOT NULL,

    -- Invite token (URL-safe random string)
    token VARCHAR(64) UNIQUE NOT NULL,

    -- Invite details
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL NOT NULL,
    email VARCHAR(255), -- Optional: pre-filled email for specific invites

    -- Status tracking
    status invite_status NOT NULL DEFAULT 'pending',

    -- Expiration
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,

    -- Usage tracking
    used_by UUID REFERENCES public.pro_profiles(id) ON DELETE SET NULL,
    used_at TIMESTAMP WITH TIME ZONE,

    -- Limits
    max_uses INTEGER DEFAULT 1, -- NULL for unlimited
    use_count INTEGER DEFAULT 0,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ============================================
-- Step 4: Create indexes
-- ============================================
CREATE INDEX idx_studio_members_studio_id ON public.studio_members(studio_id);
CREATE INDEX idx_studio_members_pro_profile_id ON public.studio_members(pro_profile_id);
CREATE INDEX idx_studio_members_role ON public.studio_members(role);

CREATE INDEX idx_studio_invites_studio_id ON public.studio_invites(studio_id);
CREATE INDEX idx_studio_invites_token ON public.studio_invites(token);
CREATE INDEX idx_studio_invites_status ON public.studio_invites(status);
CREATE INDEX idx_studio_invites_expires_at ON public.studio_invites(expires_at);

-- ============================================
-- Step 5: Enable RLS
-- ============================================
ALTER TABLE public.studio_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.studio_invites ENABLE ROW LEVEL SECURITY;

-- ============================================
-- Step 6: RLS Policies for studio_members
-- ============================================

-- Anyone can view members of public studios (for studio pages)
CREATE POLICY "Public can view members of public studios"
    ON public.studio_members FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.studios
            WHERE id = studio_members.studio_id
            AND is_public = true
        )
    );

-- Studio owners can view all their studio members
CREATE POLICY "Studio owners can view their members"
    ON public.studio_members FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.studios
            WHERE id = studio_members.studio_id
            AND owner_id = auth.uid()
        )
    );

-- Members can view their own membership
CREATE POLICY "Members can view own membership"
    ON public.studio_members FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.pro_profiles
            WHERE id = studio_members.pro_profile_id
            AND user_id = auth.uid()
        )
    );

-- Studio owners can add members
CREATE POLICY "Studio owners can add members"
    ON public.studio_members FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.studios
            WHERE id = studio_members.studio_id
            AND owner_id = auth.uid()
        )
    );

-- Pros can add themselves via invite (handled via function)
CREATE POLICY "Pros can join via invite"
    ON public.studio_members FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.pro_profiles
            WHERE id = studio_members.pro_profile_id
            AND user_id = auth.uid()
        )
    );

-- Studio owners can update member info
CREATE POLICY "Studio owners can update members"
    ON public.studio_members FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.studios
            WHERE id = studio_members.studio_id
            AND owner_id = auth.uid()
        )
    );

-- Studio owners can remove members (not owners)
CREATE POLICY "Studio owners can remove members"
    ON public.studio_members FOR DELETE
    USING (
        role = 'member' AND
        EXISTS (
            SELECT 1 FROM public.studios
            WHERE id = studio_members.studio_id
            AND owner_id = auth.uid()
        )
    );

-- Members can remove themselves
CREATE POLICY "Members can leave studio"
    ON public.studio_members FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.pro_profiles
            WHERE id = studio_members.pro_profile_id
            AND user_id = auth.uid()
        )
        AND role = 'member' -- Owners cannot leave
    );

-- ============================================
-- Step 7: RLS Policies for studio_invites
-- ============================================

-- Studio owners can view their invites
CREATE POLICY "Studio owners can view invites"
    ON public.studio_invites FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.studios
            WHERE id = studio_invites.studio_id
            AND owner_id = auth.uid()
        )
    );

-- Anyone can view invite by token (for validation)
CREATE POLICY "Anyone can view invite by token"
    ON public.studio_invites FOR SELECT
    USING (status = 'pending' AND expires_at > NOW());

-- Studio owners can create invites
CREATE POLICY "Studio owners can create invites"
    ON public.studio_invites FOR INSERT
    WITH CHECK (
        created_by = auth.uid() AND
        EXISTS (
            SELECT 1 FROM public.studios
            WHERE id = studio_invites.studio_id
            AND owner_id = auth.uid()
        )
    );

-- Studio owners can update invites (revoke)
CREATE POLICY "Studio owners can update invites"
    ON public.studio_invites FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.studios
            WHERE id = studio_invites.studio_id
            AND owner_id = auth.uid()
        )
    );

-- Studio owners can delete invites
CREATE POLICY "Studio owners can delete invites"
    ON public.studio_invites FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.studios
            WHERE id = studio_invites.studio_id
            AND owner_id = auth.uid()
        )
    );

-- ============================================
-- Step 8: Create triggers
-- ============================================
CREATE TRIGGER handle_updated_at_studio_members
    BEFORE UPDATE ON public.studio_members
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- Step 9: Helper functions
-- ============================================

-- Function to validate and use an invite token
CREATE OR REPLACE FUNCTION public.use_studio_invite(
    p_token VARCHAR(64),
    p_pro_profile_id UUID
)
RETURNS JSON AS $$
DECLARE
    v_invite RECORD;
    v_user_id UUID;
    v_existing_member UUID;
BEGIN
    -- Get current user
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RETURN json_build_object('success', false, 'error', 'Not authenticated');
    END IF;

    -- Verify pro_profile belongs to current user
    IF NOT EXISTS (
        SELECT 1 FROM public.pro_profiles
        WHERE id = p_pro_profile_id AND user_id = v_user_id
    ) THEN
        RETURN json_build_object('success', false, 'error', 'Invalid pro profile');
    END IF;

    -- Find valid invite
    SELECT * INTO v_invite
    FROM public.studio_invites
    WHERE token = p_token
    AND status = 'pending'
    AND expires_at > NOW()
    AND (max_uses IS NULL OR use_count < max_uses);

    IF v_invite IS NULL THEN
        RETURN json_build_object('success', false, 'error', 'Invalid or expired invite');
    END IF;

    -- Check if already a member
    SELECT id INTO v_existing_member
    FROM public.studio_members
    WHERE studio_id = v_invite.studio_id
    AND pro_profile_id = p_pro_profile_id;

    IF v_existing_member IS NOT NULL THEN
        RETURN json_build_object('success', false, 'error', 'Already a member of this studio');
    END IF;

    -- Create membership
    INSERT INTO public.studio_members (studio_id, pro_profile_id, role, invited_by)
    VALUES (v_invite.studio_id, p_pro_profile_id, 'member', v_invite.created_by);

    -- Update invite usage
    UPDATE public.studio_invites
    SET use_count = use_count + 1,
        used_by = p_pro_profile_id,
        used_at = NOW(),
        status = CASE
            WHEN max_uses IS NOT NULL AND use_count + 1 >= max_uses THEN 'accepted'::invite_status
            ELSE status
        END
    WHERE id = v_invite.id;

    -- Update pro_profile with studio_id (for backward compatibility)
    UPDATE public.pro_profiles
    SET studio_id = v_invite.studio_id
    WHERE id = p_pro_profile_id;

    RETURN json_build_object(
        'success', true,
        'studio_id', v_invite.studio_id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to generate a random invite token
CREATE OR REPLACE FUNCTION public.generate_invite_token()
RETURNS VARCHAR(64) AS $$
DECLARE
    v_token VARCHAR(64);
    v_exists BOOLEAN;
BEGIN
    LOOP
        -- Generate URL-safe random token
        v_token := encode(gen_random_bytes(32), 'base64');
        v_token := replace(replace(replace(v_token, '+', '-'), '/', '_'), '=', '');
        v_token := substring(v_token from 1 for 32);

        -- Check uniqueness
        SELECT EXISTS (
            SELECT 1 FROM public.studio_invites WHERE token = v_token
        ) INTO v_exists;

        EXIT WHEN NOT v_exists;
    END LOOP;

    RETURN v_token;
END;
$$ LANGUAGE plpgsql;

-- Function to get studio dashboard stats
CREATE OR REPLACE FUNCTION public.get_studio_dashboard_stats(p_studio_id UUID)
RETURNS JSON AS $$
DECLARE
    v_owner_id UUID;
    v_total_members INTEGER;
    v_total_bookings_this_month INTEGER;
    v_total_revenue_estimate INTEGER;
    v_member_stats JSON;
BEGIN
    -- Verify ownership
    SELECT owner_id INTO v_owner_id FROM public.studios WHERE id = p_studio_id;
    IF v_owner_id IS NULL OR v_owner_id != auth.uid() THEN
        RETURN json_build_object('success', false, 'error', 'Unauthorized');
    END IF;

    -- Get total members count
    SELECT COUNT(*) INTO v_total_members
    FROM public.studio_members
    WHERE studio_id = p_studio_id;

    -- Get this month's bookings for all studio members
    SELECT COALESCE(COUNT(*), 0) INTO v_total_bookings_this_month
    FROM public.bookings b
    JOIN public.studio_members sm ON sm.pro_profile_id = b.pro_id
    WHERE sm.studio_id = p_studio_id
    AND b.start_at >= date_trunc('month', CURRENT_DATE)
    AND b.start_at < date_trunc('month', CURRENT_DATE) + INTERVAL '1 month'
    AND b.status != 'cancelled';

    -- Estimate revenue (assuming average 100,000 KRW per booking)
    v_total_revenue_estimate := v_total_bookings_this_month * 100000;

    -- Get per-member stats
    SELECT json_agg(
        json_build_object(
            'pro_profile_id', sm.pro_profile_id,
            'pro_name', pp.title,
            'pro_slug', pp.slug,
            'profile_image_url', pp.profile_image_url,
            'role', sm.role,
            'joined_at', sm.joined_at,
            'bookings_this_month', (
                SELECT COUNT(*)
                FROM public.bookings b
                WHERE b.pro_id = sm.pro_profile_id
                AND b.start_at >= date_trunc('month', CURRENT_DATE)
                AND b.start_at < date_trunc('month', CURRENT_DATE) + INTERVAL '1 month'
                AND b.status != 'cancelled'
            ),
            'revenue_estimate', (
                SELECT COALESCE(SUM(COALESCE(b.price_amount, 100000)), 0)
                FROM public.bookings b
                WHERE b.pro_id = sm.pro_profile_id
                AND b.start_at >= date_trunc('month', CURRENT_DATE)
                AND b.start_at < date_trunc('month', CURRENT_DATE) + INTERVAL '1 month'
                AND b.status IN ('confirmed', 'completed')
            )
        )
    ) INTO v_member_stats
    FROM public.studio_members sm
    JOIN public.pro_profiles pp ON pp.id = sm.pro_profile_id
    WHERE sm.studio_id = p_studio_id;

    RETURN json_build_object(
        'success', true,
        'total_members', v_total_members,
        'bookings_this_month', v_total_bookings_this_month,
        'revenue_estimate', v_total_revenue_estimate,
        'members', COALESCE(v_member_stats, '[]'::json)
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- Step 10: Migrate existing studio associations
-- Create studio_members for existing pro_profiles with studio_id
-- ============================================
INSERT INTO public.studio_members (studio_id, pro_profile_id, role)
SELECT pp.studio_id, pp.id, 'member'
FROM public.pro_profiles pp
WHERE pp.studio_id IS NOT NULL
ON CONFLICT (studio_id, pro_profile_id) DO NOTHING;

-- Add owner as a member for each studio
INSERT INTO public.studio_members (studio_id, pro_profile_id, role)
SELECT s.id, pp.id, 'owner'
FROM public.studios s
JOIN public.pro_profiles pp ON pp.user_id = s.owner_id
ON CONFLICT (studio_id, pro_profile_id) DO UPDATE SET role = 'owner';

-- ============================================
-- Step 11: Add comments
-- ============================================
COMMENT ON TABLE public.studio_members IS 'Links pros to studios with role-based access (owner/member)';
COMMENT ON COLUMN public.studio_members.role IS 'owner: full control, member: basic access';

COMMENT ON TABLE public.studio_invites IS 'Invitation tokens for pros to join studios';
COMMENT ON COLUMN public.studio_invites.token IS 'URL-safe unique token for invite links';
COMMENT ON COLUMN public.studio_invites.max_uses IS 'NULL for unlimited uses';

COMMENT ON FUNCTION public.use_studio_invite IS 'Validates invite token and creates studio membership';
COMMENT ON FUNCTION public.get_studio_dashboard_stats IS 'Returns dashboard stats for studio owners';
