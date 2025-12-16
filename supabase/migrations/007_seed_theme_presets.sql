-- Migration 007: Seed Theme Presets
-- TEE:UP Portfolio SaaS - 3 Initial Presets (Classic, Editorial, Air)

-- ============================================
-- Insert Theme Presets
-- ============================================

INSERT INTO public.theme_presets (name, slug, description, display_order, tokens, variants) VALUES

-- 1. Classic: 클래식하고 신뢰감 있는 스타일
(
    'Classic',
    'classic',
    '클래식하고 신뢰감 있는 스타일. 전통적인 레슨 프로에게 적합합니다.',
    1,
    '{
        "fontFamily": "Pretendard, Inter, sans-serif",
        "fontSizeBase": "16px",
        "fontSizeH1": "2.5rem",
        "fontSizeH2": "2rem",
        "fontSizeH3": "1.5rem",
        "fontWeightHeading": "600",
        "fontWeightBody": "400",

        "colorBackground": "#FAFAF9",
        "colorSurface": "#FFFFFF",
        "colorBorder": "#E8E8E5",
        "colorTextPrimary": "#1A1A17",
        "colorTextSecondary": "#52524E",
        "colorTextMuted": "#8A8A87",
        "accentColor": "#3B82F6",
        "accentColorLight": "#DBEAFE",
        "accentColorDark": "#1E40AF",

        "borderRadius": "8px",
        "borderRadiusLarge": "12px",
        "borderRadiusSmall": "4px",

        "spacingUnit": "8px",
        "spacingSection": "64px",

        "shadowSmall": "0 1px 2px rgba(0,0,0,0.05)",
        "shadowMedium": "0 4px 6px -1px rgba(0,0,0,0.1)",
        "shadowLarge": "0 10px 15px -3px rgba(0,0,0,0.1)",

        "heroStyle": "centered",
        "cardStyle": "elevated",
        "buttonStyle": "solid"
    }',
    '{
        "light": {},
        "dark": {
            "colorBackground": "#0A0A0A",
            "colorSurface": "#1A1A1A",
            "colorBorder": "#2A2A2A",
            "colorTextPrimary": "#FAFAFA",
            "colorTextSecondary": "#A0A0A0",
            "colorTextMuted": "#707070"
        }
    }'
),

-- 2. Editorial: 매거진 스타일, 시각적으로 임팩트 있는 레이아웃
(
    'Editorial',
    'editorial',
    '매거진 스타일의 시각적 임팩트. 미디어 중심 프로에게 적합합니다.',
    2,
    '{
        "fontFamily": "Pretendard, Inter, sans-serif",
        "fontSizeBase": "17px",
        "fontSizeH1": "3.5rem",
        "fontSizeH2": "2.5rem",
        "fontSizeH3": "1.75rem",
        "fontWeightHeading": "700",
        "fontWeightBody": "400",

        "colorBackground": "#FFFFFF",
        "colorSurface": "#F8F8F8",
        "colorBorder": "#EEEEEE",
        "colorTextPrimary": "#111111",
        "colorTextSecondary": "#444444",
        "colorTextMuted": "#888888",
        "accentColor": "#000000",
        "accentColorLight": "#F0F0F0",
        "accentColorDark": "#000000",

        "borderRadius": "0px",
        "borderRadiusLarge": "0px",
        "borderRadiusSmall": "0px",

        "spacingUnit": "8px",
        "spacingSection": "80px",

        "shadowSmall": "none",
        "shadowMedium": "none",
        "shadowLarge": "none",

        "heroStyle": "fullwidth",
        "cardStyle": "flat",
        "buttonStyle": "outlined"
    }',
    '{
        "light": {},
        "dark": {
            "colorBackground": "#000000",
            "colorSurface": "#111111",
            "colorBorder": "#222222",
            "colorTextPrimary": "#FFFFFF",
            "colorTextSecondary": "#BBBBBB",
            "colorTextMuted": "#777777",
            "accentColor": "#FFFFFF"
        }
    }'
),

-- 3. Air: 깨끗하고 가벼운 스타일, 여백 중심
(
    'Air',
    'air',
    '깨끗하고 가벼운 여백 중심 스타일. 미니멀한 느낌을 원하는 프로에게 적합합니다.',
    3,
    '{
        "fontFamily": "Inter, Pretendard, sans-serif",
        "fontSizeBase": "15px",
        "fontSizeH1": "2rem",
        "fontSizeH2": "1.5rem",
        "fontSizeH3": "1.25rem",
        "fontWeightHeading": "500",
        "fontWeightBody": "400",

        "colorBackground": "#FFFFFF",
        "colorSurface": "#FAFAFA",
        "colorBorder": "#F0F0F0",
        "colorTextPrimary": "#333333",
        "colorTextSecondary": "#666666",
        "colorTextMuted": "#999999",
        "accentColor": "#2563EB",
        "accentColorLight": "#EFF6FF",
        "accentColorDark": "#1D4ED8",

        "borderRadius": "16px",
        "borderRadiusLarge": "24px",
        "borderRadiusSmall": "8px",

        "spacingUnit": "8px",
        "spacingSection": "96px",

        "shadowSmall": "0 1px 3px rgba(0,0,0,0.04)",
        "shadowMedium": "0 4px 12px rgba(0,0,0,0.06)",
        "shadowLarge": "0 12px 24px rgba(0,0,0,0.08)",

        "heroStyle": "minimal",
        "cardStyle": "glassmorphism",
        "buttonStyle": "soft"
    }',
    '{
        "light": {},
        "dark": {
            "colorBackground": "#0F0F0F",
            "colorSurface": "#1A1A1A",
            "colorBorder": "#2A2A2A",
            "colorTextPrimary": "#F5F5F5",
            "colorTextSecondary": "#A0A0A0",
            "colorTextMuted": "#6A6A6A",
            "shadowSmall": "0 1px 3px rgba(0,0,0,0.2)",
            "shadowMedium": "0 4px 12px rgba(0,0,0,0.3)",
            "shadowLarge": "0 12px 24px rgba(0,0,0,0.4)"
        }
    }'
);

-- ============================================
-- Verify Insert
-- ============================================

-- Check that all presets are inserted
DO $$
DECLARE
    preset_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO preset_count FROM public.theme_presets;
    IF preset_count < 3 THEN
        RAISE EXCEPTION 'Expected at least 3 theme presets, got %', preset_count;
    END IF;
END $$;

COMMENT ON TABLE public.theme_presets IS 'Theme presets seeded with Classic, Editorial, and Air styles';
