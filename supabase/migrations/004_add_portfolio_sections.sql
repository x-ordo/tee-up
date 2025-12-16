-- Migration 004: Create portfolio_sections table
-- TEE:UP Portfolio SaaS Pivot - Customizable portfolio sections

-- Step 1: Create portfolio_sections table
CREATE TABLE IF NOT EXISTS public.portfolio_sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pro_profile_id UUID REFERENCES public.pro_profiles(id) ON DELETE CASCADE NOT NULL,

    section_type VARCHAR(50) NOT NULL, -- 'hero', 'stats', 'gallery', 'testimonials', etc.
    title VARCHAR(255),
    content JSONB DEFAULT '{}',        -- Flexible content storage
    display_order INTEGER DEFAULT 0,
    is_visible BOOLEAN DEFAULT true,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Step 2: Create indexes
CREATE INDEX IF NOT EXISTS idx_portfolio_sections_profile
    ON public.portfolio_sections(pro_profile_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_sections_order
    ON public.portfolio_sections(pro_profile_id, display_order);
CREATE INDEX IF NOT EXISTS idx_portfolio_sections_type
    ON public.portfolio_sections(section_type);

-- Step 3: Enable RLS
ALTER TABLE public.portfolio_sections ENABLE ROW LEVEL SECURITY;

-- Step 4: Create RLS policies for portfolio_sections
-- Public sections are viewable for approved profiles
CREATE POLICY "Portfolio sections are public for approved profiles"
    ON public.portfolio_sections FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.pro_profiles
            WHERE id = portfolio_sections.pro_profile_id
            AND (is_approved = true OR user_id = auth.uid())
        )
    );

-- Pros can insert their own sections
CREATE POLICY "Pros can insert their portfolio sections"
    ON public.portfolio_sections FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.pro_profiles
            WHERE id = portfolio_sections.pro_profile_id AND user_id = auth.uid()
        )
    );

-- Pros can update their own sections
CREATE POLICY "Pros can update their portfolio sections"
    ON public.portfolio_sections FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.pro_profiles
            WHERE id = portfolio_sections.pro_profile_id AND user_id = auth.uid()
        )
    );

-- Pros can delete their own sections
CREATE POLICY "Pros can delete their portfolio sections"
    ON public.portfolio_sections FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.pro_profiles
            WHERE id = portfolio_sections.pro_profile_id AND user_id = auth.uid()
        )
    );

-- Step 5: Create updated_at trigger for portfolio_sections
CREATE TRIGGER handle_updated_at_portfolio_sections
    BEFORE UPDATE ON public.portfolio_sections
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

COMMENT ON TABLE public.portfolio_sections IS 'Customizable portfolio sections for pro profile pages';
COMMENT ON COLUMN public.portfolio_sections.section_type IS 'Type of section: hero, stats, gallery, testimonials, curriculum, pricing, faq, contact, instagram_feed, youtube_embed';
COMMENT ON COLUMN public.portfolio_sections.content IS 'JSON content for the section - structure varies by section_type';
COMMENT ON COLUMN public.portfolio_sections.display_order IS 'Order in which sections appear on the portfolio page';

-- Step 6: Document default sections by theme type
COMMENT ON TABLE public.portfolio_sections IS
'Customizable portfolio sections for pro profile pages.

Default sections by theme_type:
- visual: hero, gallery, stats, testimonials, contact
- curriculum: hero, curriculum, pricing, faq, contact
- social: hero, instagram_feed, youtube_embed, testimonials, contact

Content JSONB structure examples:
- hero: { "headline": "...", "subheadline": "...", "cta_text": "..." }
- stats: { "items": [{ "label": "Students", "value": "500+" }] }
- testimonials: { "items": [{ "name": "...", "quote": "...", "avatar": "..." }] }
- pricing: { "plans": [{ "name": "Basic", "price": 100000, "features": [...] }] }
';
