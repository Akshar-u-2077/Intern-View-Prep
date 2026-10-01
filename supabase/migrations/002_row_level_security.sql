-- Migration: Row Level Security (RLS) Policies
-- Run this in your Supabase SQL Editor after 001_initial_schema.sql

-- Enable RLS on all tables
ALTER TABLE sprints ENABLE ROW LEVEL SECURITY;
ALTER TABLE days ENABLE ROW LEVEL SECURITY;
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE topic_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE topic_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE topic_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE revision_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE share_links ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- CURRICULUM (Public Read-Only)
-- ============================================================

CREATE POLICY "Anyone can read sprints" ON sprints
  FOR SELECT USING (true);

CREATE POLICY "Anyone can read days" ON days
  FOR SELECT USING (true);

CREATE POLICY "Anyone can read topics" ON topics
  FOR SELECT USING (true);

CREATE POLICY "Anyone can read topic_content" ON topic_content
  FOR SELECT USING (true);

-- ============================================================
-- PROFILES
-- ============================================================

CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Public can read profiles with active share link" ON profiles
  FOR SELECT USING (sharing_enabled = true);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- ============================================================
-- TOPIC PROGRESS
-- ============================================================

CREATE POLICY "Users can CRUD own progress" ON topic_progress
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Read-only progress for public share links (ONLY completed topics, status, readiness — NO notes)
CREATE POLICY "Public read progress if sharing enabled" ON topic_progress
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = topic_progress.user_id
        AND profiles.sharing_enabled = true
    )
  );

-- ============================================================
-- TOPIC NOTES (STRICTLY PRIVATE — NEVER PUBLIC)
-- ============================================================

CREATE POLICY "Users can CRUD own notes" ON topic_notes
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- INTERVIEW ANSWERS & SESSIONS (STRICTLY PRIVATE)
-- ============================================================

CREATE POLICY "Users can CRUD own interview answers" ON interview_answers
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can CRUD own interview sessions" ON interview_sessions
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- REVISION ITEMS (STRICTLY PRIVATE)
-- ============================================================

CREATE POLICY "Users can CRUD own revision items" ON revision_items
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- STUDY SESSIONS & DAILY TASKS (STRICTLY PRIVATE)
-- ============================================================

CREATE POLICY "Users can CRUD own study sessions" ON study_sessions
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can CRUD own daily tasks" ON daily_tasks
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- SHARE LINKS
-- ============================================================

CREATE POLICY "Users can CRUD own share link" ON share_links
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Public can view enabled share links" ON share_links
  FOR SELECT USING (enabled = true);

-- ============================================================
-- SECURE PUBLIC SHARE FUNCTION (No leak of private notes)
-- ============================================================

CREATE OR REPLACE FUNCTION get_public_share_data(target_slug TEXT)
RETURNS JSON AS $$
DECLARE
  result JSON;
  target_user_id UUID;
  profile_data RECORD;
BEGIN
  -- Find user with matching share slug and sharing enabled
  SELECT id, username, display_name INTO target_user_id, profile_data.username, profile_data.display_name
  FROM profiles
  WHERE (share_slug = target_slug OR username = target_slug)
    AND sharing_enabled = true;

  IF target_user_id IS NULL THEN
    RETURN json_build_object('error', 'Profile not found or sharing is disabled');
  END IF;

  SELECT json_build_object(
    'username', profile_data.username,
    'displayName', profile_data.display_name,
    'totalTopics', (SELECT COUNT(*) FROM topics),
    'completedTopics', (
      SELECT COUNT(*) FROM topic_progress
      WHERE user_id = target_user_id AND (status = 'interview_ready' OR status = 'practiced' OR status = 'completed')
    ),
    'interviewReady', (
      SELECT COUNT(*) FROM topic_progress
      WHERE user_id = target_user_id AND status = 'interview_ready'
    ),
    'subjectStats', (
      SELECT json_agg(s) FROM (
        SELECT
          t.subject,
          COUNT(t.id) as total,
          COUNT(CASE WHEN tp.status IN ('interview_ready', 'practiced') THEN 1 END) as completed
        FROM topics t
        LEFT JOIN topic_progress tp ON tp.topic_id = t.id AND tp.user_id = target_user_id
        GROUP BY t.subject
      ) s
    ),
    'recentCompleted', (
      SELECT json_agg(r) FROM (
        SELECT t.title, t.subject, tp.completed_at, tp.status
        FROM topic_progress tp
        JOIN topics t ON t.id = tp.topic_id
        WHERE tp.user_id = target_user_id AND tp.completed_at IS NOT NULL
        ORDER BY tp.completed_at DESC
        LIMIT 10
      ) r
    )
  ) INTO result;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
