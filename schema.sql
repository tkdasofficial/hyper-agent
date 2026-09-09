-- ==============================================================================
-- HYPER AGENT (v1) - Database Schema & Storage
-- ==============================================================================

-- 1. Create render_status ENUM if it does not exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'render_status') THEN
        CREATE TYPE render_status AS ENUM ('queued', 'processing', 'completed', 'failed');
    END IF;
END $$;

-- 2. Create 'renders' table
CREATE TABLE IF NOT EXISTS public.renders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    status render_status NOT NULL DEFAULT 'queued',
    prompt TEXT NOT NULL,
    script JSONB DEFAULT '{}'::jsonb,
    media_urls JSONB DEFAULT '[]'::jsonb,
    video_url TEXT,
    error_log TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Index for faster query lookups by user and status
CREATE INDEX IF NOT EXISTS idx_renders_user_id ON public.renders(user_id);
CREATE INDEX IF NOT EXISTS idx_renders_status ON public.renders(status);
CREATE INDEX IF NOT EXISTS idx_renders_created_at ON public.renders(created_at DESC);

-- 3. Automatic updated_at timestamp trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_renders_updated_at ON public.renders;
CREATE TRIGGER set_renders_updated_at
    BEFORE UPDATE ON public.renders
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.renders ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to view their own renders
CREATE POLICY "Users can select own renders"
    ON public.renders
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- Allow authenticated users to create renders
CREATE POLICY "Users can insert own renders"
    ON public.renders
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Allow authenticated users to update their own renders
CREATE POLICY "Users can update own renders"
    ON public.renders
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Allow Service Role full access to renders (for Edge Functions and Python backend workers)
CREATE POLICY "Service role full access on renders"
    ON public.renders
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- 5. Storage: Create public bucket 'renders'
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'renders',
    'renders',
    true,
    104857600, -- 100MB limit
    ARRAY['video/mp4', 'image/png', 'image/jpeg', 'audio/mpeg', 'audio/mp3']
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 104857600,
    allowed_mime_types = ARRAY['video/mp4', 'image/png', 'image/jpeg', 'audio/mpeg', 'audio/mp3'];

-- Storage RLS Policies for 'renders' bucket
CREATE POLICY "Public read access on renders storage"
    ON storage.objects
    FOR SELECT
    TO public
    USING (bucket_id = 'renders');

CREATE POLICY "Authenticated users can upload to renders storage"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'renders');

CREATE POLICY "Service role full access on renders storage"
    ON storage.objects
    FOR ALL
    TO service_role
    USING (bucket_id = 'renders')
    WITH CHECK (bucket_id = 'renders');

-- ==============================================================================
-- 6. PROFILES TABLE & TRIGGER
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT,
    avatar_url TEXT,
    plan_tier TEXT NOT NULL DEFAULT 'free' CHECK (plan_tier IN ('free', 'pro', 'enterprise')),
    credits INTEGER NOT NULL DEFAULT 10,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone"
    ON public.profiles FOR SELECT
    USING (true);

CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Service role full access on profiles"
    ON public.profiles FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- ==============================================================================
-- 7. USER SETTINGS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.user_settings (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    aspect_ratio TEXT NOT NULL DEFAULT '9:16',
    theme TEXT NOT NULL DEFAULT 'dark',
    email_notifications BOOLEAN NOT NULL DEFAULT true,
    auto_captions BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can select own settings"
    ON public.user_settings FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings"
    ON public.user_settings FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own settings"
    ON public.user_settings FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role full access on user_settings"
    ON public.user_settings FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- ==============================================================================
-- 8. SUBSCRIPTIONS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_tier TEXT NOT NULL DEFAULT 'pro',
    status TEXT NOT NULL DEFAULT 'active',
    current_period_start TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    current_period_end TIMESTAMPTZ NOT NULL DEFAULT (timezone('utc'::text, now()) + interval '30 days'),
    cancel_at_period_end BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscriptions"
    ON public.subscriptions FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Service role full access on subscriptions"
    ON public.subscriptions FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- ==============================================================================
-- 9. TERMS & PRIVACY ACCEPTANCES AUDIT TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.terms_acceptances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    accepted_terms BOOLEAN NOT NULL DEFAULT true,
    accepted_privacy BOOLEAN NOT NULL DEFAULT true,
    version TEXT NOT NULL DEFAULT '1.0',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.terms_acceptances ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert acceptance logs"
    ON public.terms_acceptances FOR INSERT
    TO public
    WITH CHECK (true);

CREATE POLICY "Users can view own acceptance logs"
    ON public.terms_acceptances FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Service role full access on terms_acceptances"
    ON public.terms_acceptances FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- ==============================================================================
-- 10. AUTH USER TRIGGER
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url, plan_tier, credits)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', ''),
        'free',
        10
    )
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO public.user_settings (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();
