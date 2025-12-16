-- Migration 006: SaaS Pivot - Sites, Themes, and Events
-- TEE:UP Portfolio SaaS - "프로 홈페이지 + 리드/예약 + 과금"
--
-- 핵심 변경:
-- 1. sites: 사이트 인스턴스 (프로/스튜디오 공통)
-- 2. theme_presets: 무드 프리셋 토큰 (JSON)
-- 3. site_theme: 사이트 적용 토큰
-- 4. site_theme_answers: 온보딩 답변 로그
-- 5. site_events: 이벤트 로그 (과금/분석의 핵심)
-- 6. rate_limits + RPC 함수

-- ============================================
-- Step 1: Create enum types
-- ============================================

CREATE TYPE site_type AS ENUM ('pro', 'studio');
CREATE TYPE site_status AS ENUM ('draft', 'published', 'suspended');
CREATE TYPE event_type AS ENUM (
    'page_view',           -- 페이지 조회
    'contact_reveal',      -- 연락처 보기 클릭 (과금 이벤트)
    'contact_form',        -- 문의 폼 제출
    'kakao_click',         -- 카카오톡 클릭
    'phone_click',         -- 전화 클릭
    'booking_click',       -- 예약 버튼 클릭
    'cta_click'            -- 기타 CTA 클릭
);

-- ============================================
-- Step 2: Create sites table
-- ============================================

CREATE TABLE IF NOT EXISTS public.sites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Owner info
    owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    site_type site_type NOT NULL DEFAULT 'pro',

    -- Identity
    handle VARCHAR(63) UNIQUE NOT NULL,  -- URL handle: teeup.kr/@{handle}
    title VARCHAR(255) NOT NULL,
    tagline VARCHAR(500),

    -- Status
    status site_status NOT NULL DEFAULT 'draft',

    -- Contact (마스킹됨, contact_reveal 이벤트로만 노출)
    phone VARCHAR(20),
    email VARCHAR(255),
    kakao_url TEXT,
    booking_url TEXT,

    -- Media
    hero_image_url TEXT,
    profile_image_url TEXT,
    gallery_images TEXT[] DEFAULT '{}',
    video_url TEXT,

    -- Social
    instagram_username VARCHAR(255),
    youtube_channel_id VARCHAR(255),

    -- Subscription
    subscription_tier subscription_tier DEFAULT 'free',
    subscription_expires_at TIMESTAMP WITH TIME ZONE,

    -- Metrics (캐시, 실제 데이터는 site_events에서 계산)
    total_views INTEGER DEFAULT 0,
    total_leads INTEGER DEFAULT 0,
    monthly_lead_count INTEGER DEFAULT 0,

    -- Timestamps
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_sites_owner_id ON public.sites(owner_id);
CREATE INDEX IF NOT EXISTS idx_sites_handle ON public.sites(handle);
CREATE INDEX IF NOT EXISTS idx_sites_status ON public.sites(status);
CREATE INDEX IF NOT EXISTS idx_sites_type ON public.sites(site_type);

-- ============================================
-- Step 3: Create theme_presets table
-- ============================================

CREATE TABLE IF NOT EXISTS public.theme_presets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Identity
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL,  -- classic, editorial, air
    description TEXT,

    -- Preview
    preview_image_url TEXT,

    -- Tokens (JSON)
    tokens JSONB NOT NULL DEFAULT '{}',

    -- Variants (light/dark 등)
    variants JSONB DEFAULT '{"light": {}, "dark": {}}',

    -- Metadata
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ============================================
-- Step 4: Create site_theme table
-- ============================================

CREATE TABLE IF NOT EXISTS public.site_theme (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID REFERENCES public.sites(id) ON DELETE CASCADE NOT NULL UNIQUE,

    -- Selected preset
    preset_id UUID REFERENCES public.theme_presets(id),
    preset_slug VARCHAR(50),  -- 캐시된 slug

    -- Variant
    variant VARCHAR(20) DEFAULT 'light',  -- light, dark

    -- Custom overrides (제한적)
    accent_color VARCHAR(7),  -- #RRGGBB (포인트 컬러 1개만)

    -- Computed tokens (preset + variant + overrides 병합)
    computed_tokens JSONB DEFAULT '{}',

    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ============================================
-- Step 5: Create site_theme_answers table
-- ============================================

CREATE TABLE IF NOT EXISTS public.site_theme_answers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID REFERENCES public.sites(id) ON DELETE CASCADE NOT NULL,

    -- Onboarding answers (JSON)
    answers JSONB NOT NULL DEFAULT '{}',
    -- Example: {
    --   "mood": "professional",
    --   "target": "beginners",
    --   "style": "minimal",
    --   "color_preference": "blue"
    -- }

    -- Generated recommendations
    recommended_presets TEXT[] DEFAULT '{}',  -- ['classic', 'editorial']
    selected_preset VARCHAR(50),

    -- Metadata
    completed_at TIMESTAMP WITH TIME ZONE,
    duration_seconds INTEGER,  -- 온보딩 소요 시간

    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_site_theme_answers_site_id ON public.site_theme_answers(site_id);

-- ============================================
-- Step 6: Create site_events table (과금의 심장)
-- ============================================

CREATE TABLE IF NOT EXISTS public.site_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID REFERENCES public.sites(id) ON DELETE CASCADE NOT NULL,

    -- Event info
    event_type event_type NOT NULL,

    -- Visitor info (익명)
    visitor_id VARCHAR(100),  -- 익명 식별자 (쿠키/핑거프린트)
    ip_hash VARCHAR(64),      -- IP 해시 (rate limit용)
    user_agent TEXT,
    referrer TEXT,

    -- Additional data
    metadata JSONB DEFAULT '{}',
    -- Example for contact_reveal: { "masked_phone": "010-****-1234" }

    -- Billing
    is_billable BOOLEAN DEFAULT false,  -- contact_reveal만 true
    billed_at TIMESTAMP WITH TIME ZONE,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Indexes for site_events
CREATE INDEX IF NOT EXISTS idx_site_events_site_id ON public.site_events(site_id);
CREATE INDEX IF NOT EXISTS idx_site_events_type ON public.site_events(event_type);
CREATE INDEX IF NOT EXISTS idx_site_events_created_at ON public.site_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_site_events_billable ON public.site_events(is_billable) WHERE is_billable = true;
CREATE INDEX IF NOT EXISTS idx_site_events_visitor ON public.site_events(site_id, visitor_id);

-- ============================================
-- Step 7: Create rate_limits table
-- ============================================

CREATE TABLE IF NOT EXISTS public.rate_limits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Key (composite unique)
    key_type VARCHAR(50) NOT NULL,  -- 'ip', 'visitor', 'site'
    key_value VARCHAR(255) NOT NULL,
    action VARCHAR(50) NOT NULL,    -- 'contact_reveal', 'form_submit'

    -- Limits
    count INTEGER DEFAULT 0,
    window_start TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),

    -- Metadata
    last_hit_at TIMESTAMP WITH TIME ZONE,

    UNIQUE(key_type, key_value, action)
);

CREATE INDEX IF NOT EXISTS idx_rate_limits_key ON public.rate_limits(key_type, key_value, action);
CREATE INDEX IF NOT EXISTS idx_rate_limits_window ON public.rate_limits(window_start);

-- ============================================
-- Step 8: Enable RLS
-- ============================================

ALTER TABLE public.sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.theme_presets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_theme ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_theme_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- ============================================
-- Step 9: RLS Policies
-- ============================================

-- theme_presets: 모든 사용자 읽기 가능
CREATE POLICY "Anyone can read active theme presets"
    ON public.theme_presets FOR SELECT
    USING (is_active = true);

-- sites: published만 공개 읽기, 소유자는 모든 상태 읽기/쓰기
CREATE POLICY "Published sites are viewable by everyone"
    ON public.sites FOR SELECT
    USING (status = 'published' OR owner_id = auth.uid());

CREATE POLICY "Users can manage their own sites"
    ON public.sites FOR ALL
    USING (owner_id = auth.uid());

-- site_theme: sites와 동일한 접근 권한
CREATE POLICY "Site themes follow site access"
    ON public.site_theme FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.sites
            WHERE id = site_theme.site_id
            AND (status = 'published' OR owner_id = auth.uid())
        )
    );

CREATE POLICY "Users can manage their site theme"
    ON public.site_theme FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.sites
            WHERE id = site_theme.site_id AND owner_id = auth.uid()
        )
    );

-- site_theme_answers: 소유자만
CREATE POLICY "Users can manage their theme answers"
    ON public.site_theme_answers FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.sites
            WHERE id = site_theme_answers.site_id AND owner_id = auth.uid()
        )
    );

-- site_events: 소유자만 조회 가능, INSERT는 RPC로만
CREATE POLICY "Users can view their site events"
    ON public.site_events FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.sites
            WHERE id = site_events.site_id AND owner_id = auth.uid()
        )
    );

-- Direct INSERT 금지 (RPC로만)
CREATE POLICY "No direct insert to site_events"
    ON public.site_events FOR INSERT
    WITH CHECK (false);

-- rate_limits: 시스템 전용
CREATE POLICY "Rate limits are system managed"
    ON public.rate_limits FOR ALL
    USING (false);

-- ============================================
-- Step 10: RPC Functions
-- ============================================

-- tup_rate_limit_hit: Rate limit 체크 및 증가
CREATE OR REPLACE FUNCTION public.tup_rate_limit_hit(
    p_key_type VARCHAR(50),
    p_key_value VARCHAR(255),
    p_action VARCHAR(50),
    p_limit INTEGER DEFAULT 10,
    p_window_minutes INTEGER DEFAULT 60
)
RETURNS BOOLEAN AS $$
DECLARE
    v_count INTEGER;
    v_window_start TIMESTAMP WITH TIME ZONE;
BEGIN
    v_window_start := NOW() - (p_window_minutes || ' minutes')::INTERVAL;

    -- Upsert rate limit record
    INSERT INTO public.rate_limits (key_type, key_value, action, count, window_start, last_hit_at)
    VALUES (p_key_type, p_key_value, p_action, 1, NOW(), NOW())
    ON CONFLICT (key_type, key_value, action)
    DO UPDATE SET
        count = CASE
            WHEN rate_limits.window_start < v_window_start THEN 1
            ELSE rate_limits.count + 1
        END,
        window_start = CASE
            WHEN rate_limits.window_start < v_window_start THEN NOW()
            ELSE rate_limits.window_start
        END,
        last_hit_at = NOW()
    RETURNING count INTO v_count;

    -- Return true if limit exceeded
    RETURN v_count > p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- tup_log_site_event: 이벤트 로깅 (anon 허용, published만, rate limit 포함)
CREATE OR REPLACE FUNCTION public.tup_log_site_event(
    p_site_id UUID,
    p_event_type event_type,
    p_visitor_id VARCHAR(100) DEFAULT NULL,
    p_ip_hash VARCHAR(64) DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL,
    p_referrer TEXT DEFAULT NULL,
    p_metadata JSONB DEFAULT '{}'
)
RETURNS JSONB AS $$
DECLARE
    v_site RECORD;
    v_is_billable BOOLEAN := false;
    v_rate_limited BOOLEAN := false;
    v_event_id UUID;
BEGIN
    -- 1. 사이트 확인 (published만)
    SELECT * INTO v_site
    FROM public.sites
    WHERE id = p_site_id AND status = 'published';

    IF v_site.id IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Site not found or not published');
    END IF;

    -- 2. Rate limit 체크 (contact_reveal에만 적용)
    IF p_event_type = 'contact_reveal' THEN
        -- IP 기반 rate limit (시간당 10회)
        IF p_ip_hash IS NOT NULL THEN
            v_rate_limited := public.tup_rate_limit_hit('ip', p_ip_hash, 'contact_reveal', 10, 60);
        END IF;

        -- Visitor 기반 rate limit (일당 3회)
        IF NOT v_rate_limited AND p_visitor_id IS NOT NULL THEN
            v_rate_limited := public.tup_rate_limit_hit('visitor', p_visitor_id, 'contact_reveal', 3, 1440);
        END IF;

        IF v_rate_limited THEN
            RETURN jsonb_build_object('success', false, 'error', 'Rate limited', 'retry_after', 3600);
        END IF;

        v_is_billable := true;
    END IF;

    -- 3. 이벤트 삽입 (RLS 우회)
    INSERT INTO public.site_events (
        site_id, event_type, visitor_id, ip_hash, user_agent, referrer, metadata, is_billable
    )
    VALUES (
        p_site_id, p_event_type, p_visitor_id, p_ip_hash, p_user_agent, p_referrer, p_metadata, v_is_billable
    )
    RETURNING id INTO v_event_id;

    -- 4. Billable 이벤트면 사이트 카운터 업데이트
    IF v_is_billable THEN
        UPDATE public.sites
        SET
            monthly_lead_count = monthly_lead_count + 1,
            total_leads = total_leads + 1
        WHERE id = p_site_id;

        -- 이벤트에 billed_at 설정
        UPDATE public.site_events
        SET billed_at = NOW()
        WHERE id = v_event_id;
    END IF;

    -- 5. page_view면 total_views 업데이트
    IF p_event_type = 'page_view' THEN
        UPDATE public.sites
        SET total_views = total_views + 1
        WHERE id = p_site_id;
    END IF;

    RETURN jsonb_build_object(
        'success', true,
        'event_id', v_event_id,
        'is_billable', v_is_billable
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- tup_set_site_theme: 테마 설정 (인증된 사용자만)
CREATE OR REPLACE FUNCTION public.tup_set_site_theme(
    p_site_id UUID,
    p_preset_slug VARCHAR(50),
    p_variant VARCHAR(20) DEFAULT 'light',
    p_accent_color VARCHAR(7) DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
    v_site RECORD;
    v_preset RECORD;
    v_computed_tokens JSONB;
BEGIN
    -- 1. 소유권 확인
    SELECT * INTO v_site
    FROM public.sites
    WHERE id = p_site_id AND owner_id = auth.uid();

    IF v_site.id IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Site not found or not owned');
    END IF;

    -- 2. 프리셋 조회
    SELECT * INTO v_preset
    FROM public.theme_presets
    WHERE slug = p_preset_slug AND is_active = true;

    IF v_preset.id IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Preset not found');
    END IF;

    -- 3. 토큰 계산 (preset + variant + accent_color)
    v_computed_tokens := v_preset.tokens;

    IF v_preset.variants ? p_variant THEN
        v_computed_tokens := v_computed_tokens || (v_preset.variants -> p_variant);
    END IF;

    IF p_accent_color IS NOT NULL THEN
        v_computed_tokens := v_computed_tokens || jsonb_build_object('accentColor', p_accent_color);
    END IF;

    -- 4. Upsert site_theme
    INSERT INTO public.site_theme (site_id, preset_id, preset_slug, variant, accent_color, computed_tokens)
    VALUES (p_site_id, v_preset.id, p_preset_slug, p_variant, p_accent_color, v_computed_tokens)
    ON CONFLICT (site_id)
    DO UPDATE SET
        preset_id = v_preset.id,
        preset_slug = p_preset_slug,
        variant = p_variant,
        accent_color = p_accent_color,
        computed_tokens = v_computed_tokens,
        updated_at = NOW();

    RETURN jsonb_build_object(
        'success', true,
        'computed_tokens', v_computed_tokens
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- Step 11: Triggers
-- ============================================

-- Updated_at trigger for sites
CREATE TRIGGER handle_updated_at_sites
    BEFORE UPDATE ON public.sites
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Updated_at trigger for site_theme
CREATE TRIGGER handle_updated_at_site_theme
    BEFORE UPDATE ON public.site_theme
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Updated_at trigger for theme_presets
CREATE TRIGGER handle_updated_at_theme_presets
    BEFORE UPDATE ON public.theme_presets
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- Step 12: Comments
-- ============================================

COMMENT ON TABLE public.sites IS 'Site instances for pros and studios - the core entity for portfolio SaaS';
COMMENT ON COLUMN public.sites.handle IS 'URL handle for the site: teeup.kr/@{handle}';
COMMENT ON COLUMN public.sites.phone IS 'Contact phone (masked, only revealed via contact_reveal event)';

COMMENT ON TABLE public.theme_presets IS 'Pre-defined theme templates (Classic, Editorial, Air)';
COMMENT ON COLUMN public.theme_presets.tokens IS 'CSS variable tokens as JSON';
COMMENT ON COLUMN public.theme_presets.variants IS 'Light/dark variants for the preset';

COMMENT ON TABLE public.site_theme IS 'Applied theme configuration for each site';
COMMENT ON COLUMN public.site_theme.accent_color IS 'Single accent color override (7-char hex)';
COMMENT ON COLUMN public.site_theme.computed_tokens IS 'Merged tokens: preset + variant + overrides';

COMMENT ON TABLE public.site_theme_answers IS 'Onboarding wizard answers for analytics';

COMMENT ON TABLE public.site_events IS 'Event log for billing and analytics - the billing heart';
COMMENT ON COLUMN public.site_events.is_billable IS 'Only contact_reveal events are billable';

COMMENT ON TABLE public.rate_limits IS 'Rate limiting for spam/abuse prevention';

COMMENT ON FUNCTION public.tup_rate_limit_hit IS 'Check and increment rate limit counter';
COMMENT ON FUNCTION public.tup_log_site_event IS 'Log site event (anon allowed, published sites only, rate limited)';
COMMENT ON FUNCTION public.tup_set_site_theme IS 'Set site theme (authenticated owner only)';
