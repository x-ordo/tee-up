-- Migration 014: Enhance studio N:M relationship
-- TEE:UP Portfolio SaaS - Multi-studio support for pros

-- ============================================
-- Step 1: Add is_primary column to studio_members
-- Indicates the primary studio for a pro (shown in portfolio)
-- ============================================
ALTER TABLE public.studio_members
ADD COLUMN IF NOT EXISTS is_primary BOOLEAN DEFAULT false;

-- ============================================
-- Step 2: Add guest role to enum (for temporary associations)
-- ============================================
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_enum
        WHERE enumlabel = 'guest'
        AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'studio_member_role')
    ) THEN
        ALTER TYPE studio_member_role ADD VALUE 'guest';
    END IF;
END$$;

-- ============================================
-- Step 3: Set is_primary=true for existing records where
-- pro_profiles.studio_id matches studio_members.studio_id
-- ============================================
UPDATE public.studio_members sm
SET is_primary = true
FROM public.pro_profiles pp
WHERE sm.pro_profile_id = pp.id
AND sm.studio_id = pp.studio_id;

-- ============================================
-- Step 4: Ensure exactly one primary studio per pro
-- (Create a partial unique index)
-- ============================================
CREATE UNIQUE INDEX IF NOT EXISTS idx_studio_members_primary_per_pro
    ON public.studio_members(pro_profile_id)
    WHERE is_primary = true;

-- ============================================
-- Step 5: Create trigger to sync is_primary with pro_profiles.studio_id
-- When is_primary changes, update pro_profiles.studio_id for backward compatibility
-- ============================================
CREATE OR REPLACE FUNCTION public.sync_primary_studio()
RETURNS TRIGGER AS $$
BEGIN
    -- When a studio membership is marked as primary
    IF NEW.is_primary = true AND (OLD.is_primary IS NULL OR OLD.is_primary = false) THEN
        -- Unset any other primary for this pro
        UPDATE public.studio_members
        SET is_primary = false
        WHERE pro_profile_id = NEW.pro_profile_id
        AND id != NEW.id
        AND is_primary = true;

        -- Update pro_profiles.studio_id for backward compatibility
        UPDATE public.pro_profiles
        SET studio_id = NEW.studio_id
        WHERE id = NEW.pro_profile_id;
    END IF;

    -- When is_primary is removed and no other primary exists
    IF NEW.is_primary = false AND OLD.is_primary = true THEN
        -- Check if there's another studio for this pro
        -- If not, clear the pro_profiles.studio_id
        IF NOT EXISTS (
            SELECT 1 FROM public.studio_members
            WHERE pro_profile_id = NEW.pro_profile_id
            AND id != NEW.id
            AND is_primary = true
        ) THEN
            UPDATE public.pro_profiles
            SET studio_id = NULL
            WHERE id = NEW.pro_profile_id;
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS sync_primary_studio_trigger ON public.studio_members;
CREATE TRIGGER sync_primary_studio_trigger
    AFTER UPDATE OF is_primary ON public.studio_members
    FOR EACH ROW
    EXECUTE FUNCTION public.sync_primary_studio();

-- ============================================
-- Step 6: Create trigger for INSERT
-- When first studio membership is created, make it primary
-- ============================================
CREATE OR REPLACE FUNCTION public.set_first_studio_as_primary()
RETURNS TRIGGER AS $$
BEGIN
    -- If this is the first studio for the pro, make it primary
    IF NOT EXISTS (
        SELECT 1 FROM public.studio_members
        WHERE pro_profile_id = NEW.pro_profile_id
        AND id != NEW.id
    ) THEN
        NEW.is_primary := true;
    END IF;

    -- If explicitly set as primary, update pro_profiles
    IF NEW.is_primary = true THEN
        UPDATE public.pro_profiles
        SET studio_id = NEW.studio_id
        WHERE id = NEW.pro_profile_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_first_studio_as_primary_trigger ON public.studio_members;
CREATE TRIGGER set_first_studio_as_primary_trigger
    BEFORE INSERT ON public.studio_members
    FOR EACH ROW
    EXECUTE FUNCTION public.set_first_studio_as_primary();

-- ============================================
-- Step 7: Create helper functions for N:M relationships
-- ============================================

-- Get all studios for a pro
CREATE OR REPLACE FUNCTION public.get_pro_studios(p_pro_id UUID)
RETURNS TABLE (
    studio_id UUID,
    studio_name VARCHAR(255),
    studio_slug VARCHAR(255),
    studio_logo_url TEXT,
    role studio_member_role,
    is_primary BOOLEAN,
    joined_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        s.id AS studio_id,
        s.name AS studio_name,
        s.slug AS studio_slug,
        s.logo_url AS studio_logo_url,
        sm.role,
        sm.is_primary,
        sm.joined_at
    FROM public.studio_members sm
    JOIN public.studios s ON s.id = sm.studio_id
    WHERE sm.pro_profile_id = p_pro_id
    ORDER BY sm.is_primary DESC, sm.joined_at ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get all pros for a studio
CREATE OR REPLACE FUNCTION public.get_studio_pros(p_studio_id UUID)
RETURNS TABLE (
    pro_id UUID,
    pro_name VARCHAR(255),
    pro_slug VARCHAR(255),
    profile_image_url TEXT,
    role studio_member_role,
    is_primary BOOLEAN,
    joined_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        pp.id AS pro_id,
        pp.title AS pro_name,
        pp.slug AS pro_slug,
        pp.profile_image_url,
        sm.role,
        sm.is_primary,
        sm.joined_at
    FROM public.studio_members sm
    JOIN public.pro_profiles pp ON pp.id = sm.pro_profile_id
    WHERE sm.studio_id = p_studio_id
    ORDER BY sm.role DESC, sm.joined_at ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add a pro to a studio
CREATE OR REPLACE FUNCTION public.add_pro_to_studio(
    p_pro_id UUID,
    p_studio_id UUID,
    p_role studio_member_role DEFAULT 'member'
)
RETURNS JSON AS $$
DECLARE
    v_user_id UUID;
    v_is_owner BOOLEAN;
    v_existing_member UUID;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RETURN json_build_object('success', false, 'error', 'Not authenticated');
    END IF;

    -- Check if user is studio owner
    SELECT EXISTS (
        SELECT 1 FROM public.studios
        WHERE id = p_studio_id AND owner_id = v_user_id
    ) INTO v_is_owner;

    IF NOT v_is_owner THEN
        RETURN json_build_object('success', false, 'error', 'Only studio owners can add members');
    END IF;

    -- Check if already a member
    SELECT id INTO v_existing_member
    FROM public.studio_members
    WHERE studio_id = p_studio_id AND pro_profile_id = p_pro_id;

    IF v_existing_member IS NOT NULL THEN
        RETURN json_build_object('success', false, 'error', 'Pro is already a member of this studio');
    END IF;

    -- Add the member
    INSERT INTO public.studio_members (studio_id, pro_profile_id, role, invited_by)
    VALUES (p_studio_id, p_pro_id, p_role, v_user_id);

    RETURN json_build_object('success', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Remove a pro from a studio
CREATE OR REPLACE FUNCTION public.remove_pro_from_studio(
    p_pro_id UUID,
    p_studio_id UUID
)
RETURNS JSON AS $$
DECLARE
    v_user_id UUID;
    v_is_owner BOOLEAN;
    v_member_role studio_member_role;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RETURN json_build_object('success', false, 'error', 'Not authenticated');
    END IF;

    -- Check if user is studio owner
    SELECT EXISTS (
        SELECT 1 FROM public.studios
        WHERE id = p_studio_id AND owner_id = v_user_id
    ) INTO v_is_owner;

    -- Get member's role
    SELECT role INTO v_member_role
    FROM public.studio_members
    WHERE studio_id = p_studio_id AND pro_profile_id = p_pro_id;

    IF v_member_role IS NULL THEN
        RETURN json_build_object('success', false, 'error', 'Pro is not a member of this studio');
    END IF;

    -- Can't remove the owner
    IF v_member_role = 'owner' THEN
        RETURN json_build_object('success', false, 'error', 'Cannot remove studio owner');
    END IF;

    -- Only owner can remove others
    IF NOT v_is_owner THEN
        -- Check if removing self
        IF NOT EXISTS (
            SELECT 1 FROM public.pro_profiles
            WHERE id = p_pro_id AND user_id = v_user_id
        ) THEN
            RETURN json_build_object('success', false, 'error', 'Only studio owners can remove other members');
        END IF;
    END IF;

    -- Remove the member
    DELETE FROM public.studio_members
    WHERE studio_id = p_studio_id AND pro_profile_id = p_pro_id;

    RETURN json_build_object('success', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Set primary studio for a pro
CREATE OR REPLACE FUNCTION public.set_primary_studio(
    p_pro_id UUID,
    p_studio_id UUID
)
RETURNS JSON AS $$
DECLARE
    v_user_id UUID;
    v_is_pro_owner BOOLEAN;
    v_is_member BOOLEAN;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RETURN json_build_object('success', false, 'error', 'Not authenticated');
    END IF;

    -- Check if user owns this pro profile
    SELECT EXISTS (
        SELECT 1 FROM public.pro_profiles
        WHERE id = p_pro_id AND user_id = v_user_id
    ) INTO v_is_pro_owner;

    IF NOT v_is_pro_owner THEN
        RETURN json_build_object('success', false, 'error', 'You can only set primary studio for your own profile');
    END IF;

    -- Check if member of this studio
    SELECT EXISTS (
        SELECT 1 FROM public.studio_members
        WHERE studio_id = p_studio_id AND pro_profile_id = p_pro_id
    ) INTO v_is_member;

    IF NOT v_is_member THEN
        RETURN json_build_object('success', false, 'error', 'You are not a member of this studio');
    END IF;

    -- Unset other primaries
    UPDATE public.studio_members
    SET is_primary = false
    WHERE pro_profile_id = p_pro_id AND is_primary = true;

    -- Set new primary
    UPDATE public.studio_members
    SET is_primary = true
    WHERE studio_id = p_studio_id AND pro_profile_id = p_pro_id;

    RETURN json_build_object('success', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- Step 8: Add comments
-- ============================================
COMMENT ON COLUMN public.studio_members.is_primary IS 'Indicates the primary studio for a pro (shown in portfolio, one per pro)';
COMMENT ON FUNCTION public.get_pro_studios IS 'Returns all studios a pro is associated with';
COMMENT ON FUNCTION public.get_studio_pros IS 'Returns all pros associated with a studio';
COMMENT ON FUNCTION public.add_pro_to_studio IS 'Adds a pro to a studio (owner only)';
COMMENT ON FUNCTION public.remove_pro_from_studio IS 'Removes a pro from a studio';
COMMENT ON FUNCTION public.set_primary_studio IS 'Sets the primary studio for a pro';
