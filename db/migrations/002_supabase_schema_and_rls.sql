-- ============================================================
-- LOVECRAFTED SUPABASE PRODUCTION DATABASE SCHEMA & RLS POLICIES
-- Project URL: https://jkszpflktmicbwfkowqx.supabase.co
-- ============================================================

-- 1. STORIES TABLE
CREATE TABLE IF NOT EXISTS public.stories (
    id TEXT PRIMARY KEY,
    template_slug TEXT NOT NULL,
    title TEXT NOT NULL,
    content JSONB NOT NULL,
    owner_phone TEXT,
    payment_id TEXT,
    invoice_ref TEXT,
    status TEXT DEFAULT 'published',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexing for high performance
CREATE INDEX IF NOT EXISTS idx_stories_id ON public.stories(id);
CREATE INDEX IF NOT EXISTS idx_stories_created_at ON public.stories(created_at DESC);

-- Enable RLS on Stories Table
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;

-- Allow public read access to published stories
CREATE POLICY "Public published stories are viewable by everyone" 
ON public.stories FOR SELECT 
USING (status = 'published');

-- Allow service role full access
CREATE POLICY "Service role full access on stories" 
ON public.stories FOR ALL 
USING (auth.role() = 'service_role');

-- 2. DRAFTS TABLE (Access restricted to service_role via Netlify Functions)
CREATE TABLE IF NOT EXISTS public.drafts (
    id TEXT PRIMARY KEY,
    user_session_id TEXT NOT NULL,
    template_slug TEXT NOT NULL,
    content JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_user_template_draft UNIQUE (user_session_id, template_slug)
);

CREATE INDEX IF NOT EXISTS idx_drafts_session_template ON public.drafts(user_session_id, template_slug);

-- Enable RLS on Drafts Table
ALTER TABLE public.drafts ENABLE ROW LEVEL SECURITY;

-- Service role full access on drafts
CREATE POLICY "Service role full access on drafts" 
ON public.drafts FOR ALL 
USING (auth.role() = 'service_role');

-- 3. MEDIA ASSETS TABLE
CREATE TABLE IF NOT EXISTS public.media_assets (
    id TEXT PRIMARY KEY,
    story_id TEXT REFERENCES public.stories(id) ON DELETE SET NULL,
    permanent_url TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_media_assets_story ON public.media_assets(story_id);

-- Enable RLS on Media Assets Table
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public media assets viewable by everyone" 
ON public.media_assets FOR SELECT 
USING (true);

CREATE POLICY "Service role full access on media assets" 
ON public.media_assets FOR ALL 
USING (auth.role() = 'service_role');

-- ============================================================
-- 4. SUPABASE STORAGE BUCKET CONFIGURATION
-- ============================================================
INSERT INTO storage.buckets (id, name, public) 
VALUES ('lovecrafted-media', 'lovecrafted-media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Allow public access to view media in lovecrafted-media bucket
CREATE POLICY "Public Access for lovecrafted-media" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'lovecrafted-media');

-- Allow service_role upload access to lovecrafted-media bucket
CREATE POLICY "Service Role Uploads for lovecrafted-media" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'lovecrafted-media');
