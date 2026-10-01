-- Migration: Create all base tables
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- CURRICULUM STRUCTURE (Static — owner-only insert via seed)
-- ============================================================

CREATE TABLE IF NOT EXISTS sprints (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sprint_number INTEGER NOT NULL UNIQUE,
  title       TEXT NOT NULL,
  duration    TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS days (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sprint_id   UUID NOT NULL REFERENCES sprints(id) ON DELETE CASCADE,
  day_number  INTEGER NOT NULL,
  title       TEXT NOT NULL,
  duration    TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(sprint_id, day_number)
);

CREATE TABLE IF NOT EXISTS topics (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  day_id      UUID NOT NULL REFERENCES days(id) ON DELETE CASCADE,
  sprint_id   UUID NOT NULL REFERENCES sprints(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  duration    TEXT,
  subject     TEXT NOT NULL DEFAULT 'Other',
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- GENERATED LEARNING CONTENT (per topic — AI-generated/editable)
-- ============================================================

CREATE TABLE IF NOT EXISTS topic_content (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  topic_id             UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE UNIQUE,
  what_is_it           TEXT,
  why_it_matters       TEXT,
  core_ideas           JSONB DEFAULT '[]',          -- array of strings
  what_should_i_know   TEXT,
  common_mistakes      JSONB DEFAULT '[]',          -- array of strings
  example_intuition    TEXT,
  practice_exercise    TEXT,
  interview_questions  JSONB DEFAULT '[]',          -- array of {level, question}
  resources            JSONB DEFAULT '[]',          -- array of {title, url, type: LEARN|PRACTICE|REFERENCE}
  created_at           TIMESTAMPTZ DEFAULT NOW(),
  updated_at           TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- USER PROGRESS (per user per topic)
-- ============================================================

CREATE TABLE IF NOT EXISTS profiles (
  id           UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username     TEXT UNIQUE,
  display_name TEXT,
  share_slug   TEXT UNIQUE,
  sharing_enabled BOOLEAN DEFAULT FALSE,
  daily_target INTEGER DEFAULT 3,
  terminal_intensity TEXT DEFAULT 'medium',  -- low|medium|high
  reduced_motion BOOLEAN DEFAULT FALSE,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS topic_progress (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  topic_id        UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  status          TEXT NOT NULL DEFAULT 'not_started',
                  -- not_started | learning | practiced | interview_ready | needs_revision
  content_done    BOOLEAN DEFAULT FALSE,
  practice_done   BOOLEAN DEFAULT FALSE,
  recall_done     BOOLEAN DEFAULT FALSE,
  interview_done  BOOLEAN DEFAULT FALSE,
  confidence      INTEGER DEFAULT 0,    -- 0-5
  completed_at    TIMESTAMPTZ,
  last_activity   TIMESTAMPTZ DEFAULT NOW(),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, topic_id)
);

CREATE TABLE IF NOT EXISTS topic_notes (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  topic_id   UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  content    TEXT NOT NULL DEFAULT '',
  is_public  BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, topic_id)
);

-- Interview question answers/ratings per user
CREATE TABLE IF NOT EXISTS interview_answers (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  topic_id    UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  question    TEXT NOT NULL,
  level       TEXT NOT NULL DEFAULT 'intermediate',  -- beginner|intermediate|interview|deep
  seen        BOOLEAN DEFAULT FALSE,
  attempted   BOOLEAN DEFAULT FALSE,
  can_answer  BOOLEAN DEFAULT FALSE,
  confidence  INTEGER DEFAULT 0,  -- 1-5
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- REVISION SYSTEM
-- ============================================================

CREATE TABLE IF NOT EXISTS revision_items (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id        UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  topic_id       UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  scheduled_for  DATE NOT NULL,
  interval_days  INTEGER NOT NULL DEFAULT 2,   -- 2, 7, 21 spacing
  repetition     INTEGER NOT NULL DEFAULT 1,   -- which review iteration
  last_result    TEXT,   -- done | snoozed | needs_work
  done_at        TIMESTAMPTZ,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- STUDY SESSIONS
-- ============================================================

CREATE TABLE IF NOT EXISTS study_sessions (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  started_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ended_at     TIMESTAMPTZ,
  topics_worked JSONB DEFAULT '[]',   -- array of topic ids touched
  session_type TEXT DEFAULT 'study'  -- study | revision | interview
);

-- ============================================================
-- DAILY TODO / TODAY'S PLAN
-- ============================================================

CREATE TABLE IF NOT EXISTS daily_tasks (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  topic_id   UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  task_date  DATE NOT NULL DEFAULT CURRENT_DATE,
  task_type  TEXT NOT NULL DEFAULT 'learn',  -- learn | practice | revise | interview
  completed  BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, topic_id, task_date, task_type)
);

-- ============================================================
-- INTERVIEW MODE SESSIONS
-- ============================================================

CREATE TABLE IF NOT EXISTS interview_sessions (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  started_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ended_at     TIMESTAMPTZ,
  questions    JSONB DEFAULT '[]',   -- array of {topic_id, question, confidence}
  total_score  NUMERIC DEFAULT 0
);

-- ============================================================
-- SHARE LINKS
-- ============================================================

CREATE TABLE IF NOT EXISTS share_links (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  slug       TEXT NOT NULL UNIQUE,
  enabled    BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_topics_day_id ON topics(day_id);
CREATE INDEX IF NOT EXISTS idx_topics_sprint_id ON topics(sprint_id);
CREATE INDEX IF NOT EXISTS idx_topics_subject ON topics(subject);
CREATE INDEX IF NOT EXISTS idx_topic_progress_user_id ON topic_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_topic_progress_topic_id ON topic_progress(topic_id);
CREATE INDEX IF NOT EXISTS idx_topic_progress_status ON topic_progress(status);
CREATE INDEX IF NOT EXISTS idx_revision_items_user_date ON revision_items(user_id, scheduled_for);
CREATE INDEX IF NOT EXISTS idx_topic_notes_user_topic ON topic_notes(user_id, topic_id);

-- Full text search on topics
CREATE INDEX IF NOT EXISTS idx_topics_title_fts ON topics USING gin(to_tsvector('english', title));

-- ============================================================
-- UPDATED_AT TRIGGER FUNCTION
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_topic_progress_updated_at
  BEFORE UPDATE ON topic_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_topic_notes_updated_at
  BEFORE UPDATE ON topic_notes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_topic_content_updated_at
  BEFORE UPDATE ON topic_content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-create profile on user create
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, username, display_name)
  VALUES (
    NEW.id,
    SPLIT_PART(NEW.email, '@', 1),
    COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
