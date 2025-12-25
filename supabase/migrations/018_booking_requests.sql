-- Migration: 018_booking_requests.sql
-- Description: Add booking_requests table for simple lesson inquiry system
-- PRD v1.2: "무료 홍보 페이지 중심" 전략 - 간단한 예약 요청

-- Create booking_requests table
CREATE TABLE IF NOT EXISTS booking_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pro_id UUID NOT NULL REFERENCES pro_profiles(id) ON DELETE CASCADE,

  -- Requester info
  requester_name VARCHAR(100) NOT NULL,
  requester_phone VARCHAR(20) NOT NULL,
  requester_email VARCHAR(255),

  -- Request details
  preferred_time_text TEXT,  -- "평일 저녁", "토요일 오후" 등 자유 텍스트
  message TEXT,

  -- Status tracking
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'confirmed', 'cancelled', 'completed')),

  -- Notification tracking
  notification_sent_at TIMESTAMPTZ,
  notification_type VARCHAR(20), -- 'kakao', 'sms', 'email'

  -- Pro's response
  pro_notes TEXT,
  responded_at TIMESTAMPTZ,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_booking_requests_pro_id ON booking_requests(pro_id);
CREATE INDEX idx_booking_requests_status ON booking_requests(status);
CREATE INDEX idx_booking_requests_created_at ON booking_requests(created_at DESC);

-- Enable RLS
ALTER TABLE booking_requests ENABLE ROW LEVEL SECURITY;

-- Policy: Pros can view their own booking requests
CREATE POLICY "Pros can view own booking requests"
  ON booking_requests
  FOR SELECT
  USING (
    pro_id IN (
      SELECT id FROM pro_profiles WHERE user_id = auth.uid()
    )
  );

-- Policy: Pros can update their own booking requests
CREATE POLICY "Pros can update own booking requests"
  ON booking_requests
  FOR UPDATE
  USING (
    pro_id IN (
      SELECT id FROM pro_profiles WHERE user_id = auth.uid()
    )
  );

-- Policy: Anyone can insert booking requests (public form)
CREATE POLICY "Anyone can create booking requests"
  ON booking_requests
  FOR INSERT
  WITH CHECK (true);

-- Policy: Admins can do everything
CREATE POLICY "Admins have full access to booking requests"
  ON booking_requests
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_booking_requests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER booking_requests_updated_at
  BEFORE UPDATE ON booking_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_booking_requests_updated_at();

-- Add comment
COMMENT ON TABLE booking_requests IS 'Simple booking/inquiry requests from potential students to pros';
