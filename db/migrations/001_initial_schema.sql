-- ============================================================
-- LOVECRAFTED PRODUCTION POSTGRESQL SCHEMA MIGRATION 001
-- ============================================================

-- Enable UUID & Cryptographic functions extension if available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. STORIES DATABASE TABLE
CREATE TABLE IF NOT EXISTS stories (
    id VARCHAR(64) PRIMARY KEY,
    template_slug VARCHAR(64) NOT NULL,
    title VARCHAR(255) NOT NULL,
    content JSONB NOT NULL,
    owner_phone VARCHAR(32),
    payment_id VARCHAR(128),
    invoice_ref VARCHAR(128),
    status VARCHAR(32) DEFAULT 'published',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Index for instant story lookup by cryptographically secure story ID
CREATE INDEX IF NOT EXISTS idx_stories_id ON stories(id);
CREATE INDEX IF NOT EXISTS idx_stories_owner_phone ON stories(owner_phone);
CREATE INDEX IF NOT EXISTS idx_stories_created_at ON stories(created_at DESC);

-- 2. DRAFTS DATABASE TABLE (Server-side draft autosave)
CREATE TABLE IF NOT EXISTS drafts (
    id VARCHAR(64) PRIMARY KEY,
    user_session_id VARCHAR(128) NOT NULL,
    template_slug VARCHAR(64) NOT NULL,
    content JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_template_draft UNIQUE (user_session_id, template_slug)
);

CREATE INDEX IF NOT EXISTS idx_drafts_session_template ON drafts(user_session_id, template_slug);

-- 3. MEDIA ASSETS DATABASE TABLE (Media tracking & garbage collection)
CREATE TABLE IF NOT EXISTS media_assets (
    id VARCHAR(64) PRIMARY KEY,
    story_id VARCHAR(64) REFERENCES stories(id) ON DELETE SET NULL,
    permanent_url TEXT NOT NULL,
    mime_type VARCHAR(64) NOT NULL,
    file_size BIGINT NOT NULL,
    status VARCHAR(32) DEFAULT 'unassigned', -- 'unassigned' | 'active' | 'abandoned'
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_media_assets_story_id ON media_assets(story_id);
CREATE INDEX IF NOT EXISTS idx_media_assets_status ON media_assets(status);
