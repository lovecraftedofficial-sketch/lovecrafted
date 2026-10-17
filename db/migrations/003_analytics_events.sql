-- ============================================================
-- 003_analytics_events.sql
-- Table for tracking visits and keepsakes across all devices
-- ============================================================

CREATE TABLE IF NOT EXISTS public.analytics_events (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    event_type TEXT NOT NULL, -- 'page_view' | 'keepsake_created' | 'keepsake_published'
    visitor_id TEXT,
    path TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON public.analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON public.analytics_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_events_visitor ON public.analytics_events(visitor_id);

-- Enable Row Level Security
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Allow anonymous insertions via Netlify functions
CREATE POLICY "Allow service role full access on analytics" 
ON public.analytics_events FOR ALL 
USING (auth.role() = 'service_role');
