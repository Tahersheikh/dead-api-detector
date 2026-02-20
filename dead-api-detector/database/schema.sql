-- Dead API Detector - Database Schema
-- Run this in your Supabase SQL editor

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- Table: apis
-- ============================================================
CREATE TABLE IF NOT EXISTS apis (
    id              UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(255) NOT NULL,
    url             VARCHAR(500) NOT NULL UNIQUE,
    category        VARCHAR(100) NOT NULL,
    status          VARCHAR(20)  NOT NULL DEFAULT 'unknown',
    response_time_ms INTEGER     NOT NULL DEFAULT 0,
    last_checked    TIMESTAMPTZ  NULL,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_apis_category     ON apis(category);
CREATE INDEX IF NOT EXISTS idx_apis_status       ON apis(status);
CREATE INDEX IF NOT EXISTS idx_apis_last_checked ON apis(last_checked);

-- ============================================================
-- Table: status_history (Post-MVP)
-- ============================================================
CREATE TABLE IF NOT EXISTS status_history (
    id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    api_id           UUID        NOT NULL REFERENCES apis(id) ON DELETE CASCADE,
    status           VARCHAR(20) NOT NULL,
    response_time_ms INTEGER     NULL,
    checked_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_status_history_api_id      ON status_history(api_id);
CREATE INDEX IF NOT EXISTS idx_status_history_checked_at  ON status_history(checked_at);
CREATE INDEX IF NOT EXISTS idx_status_history_api_checked ON status_history(api_id, checked_at);
