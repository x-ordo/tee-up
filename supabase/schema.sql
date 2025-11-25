-- TEE:UP Database Schema
-- Phase 2: Real-time Features

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_role AS ENUM ('golfer', 'pro', 'admin');
CREATE TYPE chat_status AS ENUM ('active', 'matched', 'closed');
CREATE TYPE subscription_tier AS ENUM ('basic', 'pro');

-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    role user_role NOT NULL DEFAULT 'golfer',
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Pro profiles table
CREATE TABLE public.pro_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    bio TEXT,
    specialties TEXT[] DEFAULT '{}',
    location VARCHAR(255),
    tour_experience TEXT,
    certifications TEXT[] DEFAULT '{}',

    -- Media
    hero_image_url TEXT,
    profile_image_url TEXT,
    gallery_images TEXT[] DEFAULT '{}',
    video_url TEXT,

    -- Social
    instagram_username VARCHAR(255),
    youtube_channel_id VARCHAR(255),
    kakao_talk_id VARCHAR(255),

    -- Metrics
    profile_views INTEGER DEFAULT 0,
    monthly_chat_count INTEGER DEFAULT 0,
    total_leads INTEGER DEFAULT 0,
    matched_lessons INTEGER DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0,

    -- Subscription
    subscription_tier subscription_tier DEFAULT 'basic',
    subscription_expires_at TIMESTAMP WITH TIME ZONE,

    -- Status
    is_approved BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    approved_at TIMESTAMP WITH TIME ZONE,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

    UNIQUE(user_id)
);

-- Chat rooms table
CREATE TABLE public.chat_rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pro_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    golfer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    status chat_status DEFAULT 'active' NOT NULL,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    matched_at TIMESTAMP WITH TIME ZONE,
    closed_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

    UNIQUE(pro_id, golfer_id)
);

-- Messages table
CREATE TABLE public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_id UUID REFERENCES public.chat_rooms(id) ON DELETE CASCADE NOT NULL,
    sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,

    -- Status
    is_read BOOLEAN DEFAULT false,
    is_flagged BOOLEAN DEFAULT false,
    flag_reason TEXT,

    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Indexes for performance
CREATE INDEX idx_pro_profiles_user_id ON public.pro_profiles(user_id);
CREATE INDEX idx_pro_profiles_slug ON public.pro_profiles(slug);
CREATE INDEX idx_pro_profiles_approved ON public.pro_profiles(is_approved);
CREATE INDEX idx_chat_rooms_pro_id ON public.chat_rooms(pro_id);
CREATE INDEX idx_chat_rooms_golfer_id ON public.chat_rooms(golfer_id);
CREATE INDEX idx_chat_rooms_status ON public.chat_rooms(status);
CREATE INDEX idx_messages_room_id ON public.messages(room_id);
CREATE INDEX idx_messages_created_at ON public.messages(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pro_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Public profiles are viewable by everyone"
    ON public.profiles FOR SELECT
    USING (true);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- RLS Policies for pro_profiles
CREATE POLICY "Approved pro profiles are viewable by everyone"
    ON public.pro_profiles FOR SELECT
    USING (is_approved = true OR user_id = auth.uid());

CREATE POLICY "Pros can update own profile"
    ON public.pro_profiles FOR UPDATE
    USING (user_id = auth.uid());

-- RLS Policies for chat_rooms
CREATE POLICY "Users can view own chat rooms"
    ON public.chat_rooms FOR SELECT
    USING (pro_id = auth.uid() OR golfer_id = auth.uid());

CREATE POLICY "Golfers can create chat rooms"
    ON public.chat_rooms FOR INSERT
    WITH CHECK (golfer_id = auth.uid());

CREATE POLICY "Participants can update chat rooms"
    ON public.chat_rooms FOR UPDATE
    USING (pro_id = auth.uid() OR golfer_id = auth.uid());

-- RLS Policies for messages
CREATE POLICY "Users can view messages in their chat rooms"
    ON public.messages FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.chat_rooms
            WHERE id = room_id
            AND (pro_id = auth.uid() OR golfer_id = auth.uid())
        )
    );

CREATE POLICY "Chat participants can send messages"
    ON public.messages FOR INSERT
    WITH CHECK (
        sender_id = auth.uid()
        AND EXISTS (
            SELECT 1 FROM public.chat_rooms
            WHERE id = room_id
            AND (pro_id = auth.uid() OR golfer_id = auth.uid())
        )
    );

-- Functions
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
        COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'golfer')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER handle_updated_at_profiles
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_pro_profiles
    BEFORE UPDATE ON public.pro_profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_chat_rooms
    BEFORE UPDATE ON public.chat_rooms
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Function to increment profile views
CREATE OR REPLACE FUNCTION public.increment_profile_views(profile_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE public.pro_profiles
    SET profile_views = profile_views + 1
    WHERE id = profile_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment monthly chat count
CREATE OR REPLACE FUNCTION public.increment_chat_count(profile_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE public.pro_profiles
    SET monthly_chat_count = monthly_chat_count + 1,
        total_leads = total_leads + 1
    WHERE user_id = profile_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment matched lessons
CREATE OR REPLACE FUNCTION public.increment_matched_lessons(profile_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE public.pro_profiles
    SET matched_lessons = matched_lessons + 1
    WHERE user_id = profile_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- Phase 2: Subscriptions & Payments
-- ============================================

CREATE TYPE subscription_status AS ENUM ('active', 'cancelled', 'expired');

-- Subscriptions table
CREATE TABLE public.subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
    tier subscription_tier NOT NULL DEFAULT 'basic',
    status subscription_status NOT NULL DEFAULT 'active',

    -- Billing
    payment_key TEXT,
    billing_key TEXT,

    -- Period
    current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
    current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    cancel_at_period_end BOOLEAN DEFAULT false,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Payment history table
CREATE TABLE public.payment_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE SET NULL,

    -- Payment details
    payment_key TEXT NOT NULL,
    order_id TEXT NOT NULL,
    amount INTEGER NOT NULL,
    currency VARCHAR(3) DEFAULT 'KRW',
    status VARCHAR(50) NOT NULL,
    method VARCHAR(50),

    -- Toss response
    receipt_url TEXT,
    failure_code TEXT,
    failure_message TEXT,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Indexes for subscriptions
CREATE INDEX idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX idx_subscriptions_period_end ON public.subscriptions(current_period_end);
CREATE INDEX idx_payment_history_user_id ON public.payment_history(user_id);

-- Enable RLS for subscriptions
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for subscriptions
CREATE POLICY "Users can view own subscription"
    ON public.subscriptions FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can insert own subscription"
    ON public.subscriptions FOR INSERT
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own subscription"
    ON public.subscriptions FOR UPDATE
    USING (user_id = auth.uid());

-- RLS Policies for payment_history
CREATE POLICY "Users can view own payment history"
    ON public.payment_history FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can insert own payment history"
    ON public.payment_history FOR INSERT
    WITH CHECK (user_id = auth.uid());

-- Trigger for subscriptions updated_at
CREATE TRIGGER handle_updated_at_subscriptions
    BEFORE UPDATE ON public.subscriptions
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Function to reset monthly chat count (run monthly via cron)
CREATE OR REPLACE FUNCTION public.reset_monthly_chat_counts()
RETURNS void AS $$
BEGIN
    UPDATE public.pro_profiles
    SET monthly_chat_count = 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check and expire subscriptions (run daily via cron)
CREATE OR REPLACE FUNCTION public.check_expired_subscriptions()
RETURNS void AS $$
BEGIN
    -- Mark expired subscriptions
    UPDATE public.subscriptions
    SET status = 'expired'
    WHERE status = 'active'
    AND current_period_end < NOW()
    AND cancel_at_period_end = true;

    -- Update pro_profiles for expired subscriptions
    UPDATE public.pro_profiles pp
    SET subscription_tier = 'basic',
        subscription_expires_at = NULL
    FROM public.subscriptions s
    WHERE pp.user_id = s.user_id
    AND s.status = 'expired';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
