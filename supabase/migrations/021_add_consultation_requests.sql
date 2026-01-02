-- Migration: 021_add_consultation_requests.sql
-- Description: Store consultation form submissions with contact details

CREATE TABLE IF NOT EXISTS consultation_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pro_id UUID NOT NULL REFERENCES pro_profiles(id) ON DELETE CASCADE,

  requester_name VARCHAR(100) NOT NULL,
  requester_phone VARCHAR(20) NOT NULL,
  message TEXT,

  source_url TEXT,
  referrer TEXT,

  status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'converted', 'closed')),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_consultation_requests_pro_id ON consultation_requests(pro_id);
CREATE INDEX IF NOT EXISTS idx_consultation_requests_status ON consultation_requests(status);
CREATE INDEX IF NOT EXISTS idx_consultation_requests_created_at ON consultation_requests(created_at DESC);

ALTER TABLE consultation_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Pros can view own consultation requests"
  ON consultation_requests
  FOR SELECT
  USING (
    pro_id IN (
      SELECT id FROM pro_profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Pros can update own consultation requests"
  ON consultation_requests
  FOR UPDATE
  USING (
    pro_id IN (
      SELECT id FROM pro_profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can create consultation requests"
  ON consultation_requests
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins have full access to consultation requests"
  ON consultation_requests
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE OR REPLACE FUNCTION update_consultation_requests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER consultation_requests_updated_at
  BEFORE UPDATE ON consultation_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_consultation_requests_updated_at();

COMMENT ON TABLE consultation_requests IS 'Consumer consultation form submissions with contact details';
