-- Migration 012: Add theme_config JSONB column to pro_profiles
-- TEE:UP Design System Integration - User Story 3: Portfolio White-Label Theming
--
-- Purpose: Enable pro portfolios to display custom accent colors, logos, and fonts
--
-- Schema:
-- theme_config JSONB {
--   accentColor: string (hex color, default '#0A362B')
--   logoUrl: string | null
--   fontPreset: 'default' | 'modern' | 'classic'
--   darkModeEnabled: boolean (default true)
-- }

-- ============================================
-- Step 1: Add theme_config column to pro_profiles
-- ============================================

ALTER TABLE public.pro_profiles
ADD COLUMN IF NOT EXISTS theme_config JSONB
DEFAULT '{"accentColor": "#0A362B", "logoUrl": null, "fontPreset": "default", "darkModeEnabled": true}'::jsonb;

COMMENT ON COLUMN public.pro_profiles.theme_config IS 'Portfolio white-label theming: accentColor (hex), logoUrl (nullable), fontPreset (default|modern|classic), darkModeEnabled (bool)';

-- ============================================
-- Step 2: Create index for theme_config queries
-- ============================================

-- Index for filtering by darkModeEnabled
CREATE INDEX IF NOT EXISTS idx_pro_profiles_theme_dark_mode
ON public.pro_profiles ((theme_config->>'darkModeEnabled'));

-- ============================================
-- Step 3: Add validation function for theme_config
-- ============================================

CREATE OR REPLACE FUNCTION public.validate_theme_config()
RETURNS TRIGGER AS $$
DECLARE
  accent_color TEXT;
  font_preset TEXT;
BEGIN
  -- Skip validation if theme_config is null
  IF NEW.theme_config IS NULL THEN
    RETURN NEW;
  END IF;

  -- Validate accentColor format (hex color)
  accent_color := NEW.theme_config->>'accentColor';
  IF accent_color IS NOT NULL AND accent_color !~ '^#[0-9A-Fa-f]{6}$' THEN
    RAISE EXCEPTION 'Invalid accentColor format. Must be hex format like #0A362B';
  END IF;

  -- Validate fontPreset
  font_preset := NEW.theme_config->>'fontPreset';
  IF font_preset IS NOT NULL AND font_preset NOT IN ('default', 'modern', 'classic') THEN
    RAISE EXCEPTION 'Invalid fontPreset. Must be one of: default, modern, classic';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- Step 4: Create trigger for validation
-- ============================================

DROP TRIGGER IF EXISTS validate_theme_config_trigger ON public.pro_profiles;

CREATE TRIGGER validate_theme_config_trigger
  BEFORE INSERT OR UPDATE ON public.pro_profiles
  FOR EACH ROW
  WHEN (NEW.theme_config IS NOT NULL)
  EXECUTE FUNCTION public.validate_theme_config();

-- ============================================
-- Step 5: Backfill existing rows with default theme
-- ============================================

UPDATE public.pro_profiles
SET theme_config = '{"accentColor": "#0A362B", "logoUrl": null, "fontPreset": "default", "darkModeEnabled": true}'::jsonb
WHERE theme_config IS NULL;
