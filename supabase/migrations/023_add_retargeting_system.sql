-- Migration: 023_add_retargeting_system.sql
-- Description: Retargeting system for re-engaging users who dropped off

-- ============================================================
-- User Activity Events (for tracking drop-off points)
-- ============================================================

CREATE TABLE IF NOT EXISTS user_activity_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- User identification (nullable for anonymous users)
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  session_id VARCHAR(100),
  email VARCHAR(255),
  phone VARCHAR(20),

  -- Event details
  event_type VARCHAR(50) NOT NULL CHECK (event_type IN (
    'quiz_start',
    'quiz_abandon',
    'quiz_complete',
    'form_start',
    'form_abandon',
    'form_submit',
    'profile_view',
    'signup_start',
    'signup_abandon',
    'signup_complete',
    'consultation_start',
    'consultation_abandon'
  )),

  -- Context
  pro_id UUID REFERENCES pro_profiles(id) ON DELETE SET NULL,
  page_url TEXT,
  referrer TEXT,
  metadata JSONB DEFAULT '{}',

  -- Retargeting status
  retarget_eligible BOOLEAN DEFAULT true,
  retarget_sent_at TIMESTAMPTZ,
  retarget_count INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_activity_events_user ON user_activity_events(user_id);
CREATE INDEX idx_activity_events_session ON user_activity_events(session_id);
CREATE INDEX idx_activity_events_type ON user_activity_events(event_type);
CREATE INDEX idx_activity_events_eligible ON user_activity_events(retarget_eligible, retarget_sent_at);
CREATE INDEX idx_activity_events_created ON user_activity_events(created_at DESC);

-- ============================================================
-- Retargeting Campaigns
-- ============================================================

CREATE TABLE IF NOT EXISTS retargeting_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  name VARCHAR(100) NOT NULL,
  description TEXT,

  -- Trigger conditions
  trigger_event VARCHAR(50) NOT NULL,
  delay_minutes INTEGER NOT NULL DEFAULT 60,
  max_sends INTEGER DEFAULT 1,

  -- Channel
  channel VARCHAR(20) NOT NULL CHECK (channel IN ('email', 'push', 'kakao', 'sms')),

  -- Content
  subject VARCHAR(255),
  template_id VARCHAR(100),
  content_template TEXT,

  -- Status
  is_active BOOLEAN DEFAULT true,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed default campaigns
INSERT INTO retargeting_campaigns (name, trigger_event, delay_minutes, max_sends, channel, subject, content_template) VALUES
  ('퀴즈 이어하기', 'quiz_abandon', 1440, 1, 'email', '아직 완료되지 않은 프로 매칭이 있어요!', '{{user_name}}님, 맞춤 프로를 찾기 위한 퀴즈가 아직 완료되지 않았어요. 지금 이어서 진행해 보세요!'),
  ('상담 대기 중', 'form_abandon', 60, 1, 'email', '상담 신청이 대기 중이에요', '{{pro_name}} 프로에게 상담을 신청하려고 하셨나요? 지금 바로 상담을 완료해 보세요.'),
  ('프로 인기 급상승', 'profile_view', 2880, 1, 'email', '{{pro_name}} 프로가 인기 급상승 중이에요!', '{{user_name}}님이 관심을 보인 {{pro_name}} 프로의 문의가 증가하고 있어요. 지금 상담을 신청해 보세요!'),
  ('가입 완료하기', 'signup_abandon', 1440, 2, 'email', '가입이 거의 완료되었어요!', '{{user_name}}님, TEE:UP 가입이 90% 완료되었어요. 지금 마무리하고 최고의 프로를 만나보세요.')
ON CONFLICT DO NOTHING;

-- ============================================================
-- Sent Notifications Log
-- ============================================================

CREATE TABLE IF NOT EXISTS retargeting_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  campaign_id UUID NOT NULL REFERENCES retargeting_campaigns(id) ON DELETE CASCADE,
  activity_event_id UUID NOT NULL REFERENCES user_activity_events(id) ON DELETE CASCADE,

  -- Recipient
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  recipient_email VARCHAR(255),
  recipient_phone VARCHAR(20),

  -- Delivery status
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'opened', 'clicked', 'failed', 'unsubscribed')),

  -- Tracking
  sent_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  opened_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ,

  -- Error handling
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_retarget_notif_campaign ON retargeting_notifications(campaign_id);
CREATE INDEX idx_retarget_notif_activity ON retargeting_notifications(activity_event_id);
CREATE INDEX idx_retarget_notif_status ON retargeting_notifications(status);
CREATE INDEX idx_retarget_notif_user ON retargeting_notifications(user_id);

-- ============================================================
-- User Notification Preferences
-- ============================================================

CREATE TABLE IF NOT EXISTS notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,

  -- Email preferences
  email_marketing BOOLEAN DEFAULT true,
  email_transactional BOOLEAN DEFAULT true,
  email_retargeting BOOLEAN DEFAULT true,

  -- Push preferences
  push_enabled BOOLEAN DEFAULT true,
  push_marketing BOOLEAN DEFAULT true,

  -- Unsubscribe tracking
  unsubscribed_at TIMESTAMPTZ,
  unsubscribe_reason TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notif_prefs_user ON notification_preferences(user_id);

-- ============================================================
-- RLS Policies
-- ============================================================

ALTER TABLE user_activity_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE retargeting_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE retargeting_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;

-- Activity events: Users can view their own, admins can view all
CREATE POLICY "Users can view own activity events"
  ON user_activity_events FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Admins have full access to activity events"
  ON user_activity_events FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Anyone can insert activity events"
  ON user_activity_events FOR INSERT
  WITH CHECK (true);

-- Campaigns: Admin only
CREATE POLICY "Admins can manage campaigns"
  ON retargeting_campaigns FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Anyone can view active campaigns"
  ON retargeting_campaigns FOR SELECT
  USING (is_active = true);

-- Notifications: Admin and user's own
CREATE POLICY "Users can view own notifications"
  ON retargeting_notifications FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Admins have full access to notifications"
  ON retargeting_notifications FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Preferences: Users can manage their own
CREATE POLICY "Users can manage own notification preferences"
  ON notification_preferences FOR ALL
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all preferences"
  ON notification_preferences FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- ============================================================
-- Helper Functions
-- ============================================================

-- Function to get pending retargeting events
CREATE OR REPLACE FUNCTION get_pending_retargets(p_limit INTEGER DEFAULT 100)
RETURNS TABLE (
  event_id UUID,
  campaign_id UUID,
  event_type VARCHAR,
  user_id UUID,
  email VARCHAR,
  phone VARCHAR,
  pro_id UUID,
  metadata JSONB,
  campaign_name VARCHAR,
  channel VARCHAR,
  subject VARCHAR,
  content_template TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    e.id as event_id,
    c.id as campaign_id,
    e.event_type,
    e.user_id,
    COALESCE(e.email, p.email) as email,
    COALESCE(e.phone, p.phone) as phone,
    e.pro_id,
    e.metadata,
    c.name as campaign_name,
    c.channel,
    c.subject,
    c.content_template
  FROM user_activity_events e
  JOIN retargeting_campaigns c ON c.trigger_event = e.event_type AND c.is_active = true
  LEFT JOIN profiles p ON p.id = e.user_id
  LEFT JOIN notification_preferences np ON np.user_id = e.user_id
  WHERE e.retarget_eligible = true
    AND e.retarget_sent_at IS NULL
    AND e.retarget_count < c.max_sends
    AND e.created_at <= NOW() - (c.delay_minutes || ' minutes')::INTERVAL
    AND (np.email_retargeting IS NULL OR np.email_retargeting = true)
    AND (COALESCE(e.email, p.email) IS NOT NULL OR COALESCE(e.phone, p.phone) IS NOT NULL)
  ORDER BY e.created_at ASC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to mark event as retargeted
CREATE OR REPLACE FUNCTION mark_event_retargeted(p_event_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE user_activity_events
  SET
    retarget_sent_at = NOW(),
    retarget_count = retarget_count + 1
  WHERE id = p_event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Updated at trigger for campaigns
CREATE OR REPLACE FUNCTION update_retargeting_campaigns_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER retargeting_campaigns_updated_at
  BEFORE UPDATE ON retargeting_campaigns
  FOR EACH ROW
  EXECUTE FUNCTION update_retargeting_campaigns_updated_at();

CREATE TRIGGER notification_preferences_updated_at
  BEFORE UPDATE ON notification_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_retargeting_campaigns_updated_at();

COMMENT ON TABLE user_activity_events IS 'Tracks user actions for retargeting purposes';
COMMENT ON TABLE retargeting_campaigns IS 'Defines automated retargeting campaigns';
COMMENT ON TABLE retargeting_notifications IS 'Logs all sent retargeting notifications';
COMMENT ON TABLE notification_preferences IS 'User notification opt-in/opt-out preferences';
