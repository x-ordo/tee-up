-- Migration 002: Create studios table
-- TEE:UP Portfolio SaaS Pivot - Team/Academy Pages

-- Step 1: Create studios table
CREATE TABLE IF NOT EXISTS public.studios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    logo_url TEXT,
    cover_image_url TEXT,
    location VARCHAR(255),

    -- Contact info
    website_url TEXT,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),

    -- Social links
    instagram_url TEXT,
    youtube_url TEXT,
    kakao_channel_url TEXT,

    -- Settings
    is_public BOOLEAN DEFAULT true,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Step 2: Add studio_id to pro_profiles
ALTER TABLE public.pro_profiles
    ADD COLUMN IF NOT EXISTS studio_id UUID REFERENCES public.studios(id) ON DELETE SET NULL;

-- Step 3: Create indexes
CREATE INDEX IF NOT EXISTS idx_studios_owner_id ON public.studios(owner_id);
CREATE INDEX IF NOT EXISTS idx_studios_slug ON public.studios(slug);
CREATE INDEX IF NOT EXISTS idx_pro_profiles_studio_id ON public.pro_profiles(studio_id);

-- Step 4: Enable RLS
ALTER TABLE public.studios ENABLE ROW LEVEL SECURITY;

-- Step 5: Create RLS policies for studios
CREATE POLICY "Public studios are viewable by everyone"
    ON public.studios FOR SELECT
    USING (is_public = true OR owner_id = auth.uid());

CREATE POLICY "Owners can insert their studios"
    ON public.studios FOR INSERT
    WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Owners can update their studios"
    ON public.studios FOR UPDATE
    USING (owner_id = auth.uid());

CREATE POLICY "Owners can delete their studios"
    ON public.studios FOR DELETE
    USING (owner_id = auth.uid());

-- Step 6: Create updated_at trigger for studios
CREATE TRIGGER handle_updated_at_studios
    BEFORE UPDATE ON public.studios
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

COMMENT ON TABLE public.studios IS 'Team/Academy pages for groups of golf pros';
COMMENT ON COLUMN public.studios.slug IS 'URL-friendly unique identifier';
COMMENT ON COLUMN public.pro_profiles.studio_id IS 'Optional association with a studio/academy';
