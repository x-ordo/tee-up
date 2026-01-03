-- Migration: Add saved_pros table for consumer favorites
-- Created: 2025-01-02

-- Create saved_pros table for users to save their favorite pros
CREATE TABLE IF NOT EXISTS saved_pros (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pro_id UUID NOT NULL REFERENCES pro_profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Ensure a user can only save a pro once
  CONSTRAINT unique_saved_pro UNIQUE (user_id, pro_id)
);

-- Create indexes for efficient lookups
CREATE INDEX IF NOT EXISTS idx_saved_pros_user_id ON saved_pros(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_pros_pro_id ON saved_pros(pro_id);
CREATE INDEX IF NOT EXISTS idx_saved_pros_created_at ON saved_pros(created_at DESC);

-- Enable RLS
ALTER TABLE saved_pros ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can view their own saved pros
CREATE POLICY "Users can view own saved pros"
  ON saved_pros FOR SELECT
  USING (auth.uid() = user_id);

-- Users can save pros
CREATE POLICY "Users can save pros"
  ON saved_pros FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can unsave pros
CREATE POLICY "Users can unsave pros"
  ON saved_pros FOR DELETE
  USING (auth.uid() = user_id);

-- Grant permissions
GRANT SELECT, INSERT, DELETE ON saved_pros TO authenticated;

COMMENT ON TABLE saved_pros IS 'User favorites - saved/bookmarked pro profiles';
COMMENT ON COLUMN saved_pros.user_id IS 'The user who saved the pro';
COMMENT ON COLUMN saved_pros.pro_id IS 'The saved pro profile';
