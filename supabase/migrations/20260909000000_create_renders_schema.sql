-- Migration: 20260909000000_create_renders_schema.sql
-- Description: Create renders table, RLS policies, and public storage bucket for Hyper Agent

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

-- Indexes for performance
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

-- Allow Service Role full access to renders
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
