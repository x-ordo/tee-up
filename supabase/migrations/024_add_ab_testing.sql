-- ============================================================
-- A/B Testing System
-- TEE:UP Portfolio SaaS
--
-- Provides infrastructure for running experiments and tracking
-- conversion rates across different variants.
-- ============================================================

-- ============================================================
-- Experiments Table
-- ============================================================
-- Stores experiment definitions

CREATE TABLE IF NOT EXISTS experiments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Identification
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,

  -- Configuration
  status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'running', 'paused', 'completed')),
  traffic_percentage INTEGER NOT NULL DEFAULT 100 CHECK (traffic_percentage BETWEEN 1 AND 100),

  -- Targeting (optional filters)
  target_audience JSONB DEFAULT '{}',  -- e.g., {"user_type": "new", "device": "mobile"}

  -- Goals
  primary_metric VARCHAR(100) NOT NULL,  -- e.g., "signup_complete", "consultation_submit"
  secondary_metrics TEXT[],  -- Additional metrics to track

  -- Statistical settings
  min_sample_size INTEGER DEFAULT 100,
  confidence_level DECIMAL(3,2) DEFAULT 0.95,

  -- Timing
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Owner
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL
);

-- ============================================================
-- Experiment Variants Table
-- ============================================================
-- Stores variants for each experiment

CREATE TABLE IF NOT EXISTS experiment_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  experiment_id UUID NOT NULL REFERENCES experiments(id) ON DELETE CASCADE,

  -- Variant info
  name VARCHAR(50) NOT NULL,  -- e.g., "control", "variant_a", "variant_b"
  description TEXT,

  -- Traffic allocation (must sum to 100 across experiment)
  weight INTEGER NOT NULL DEFAULT 50 CHECK (weight BETWEEN 1 AND 100),

  -- Variant configuration
  config JSONB DEFAULT '{}',  -- Variant-specific settings

  -- Control flag
  is_control BOOLEAN DEFAULT false,

  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(experiment_id, name)
);

-- ============================================================
-- Experiment Assignments Table
-- ============================================================
-- Tracks which users/sessions are assigned to which variants

CREATE TABLE IF NOT EXISTS experiment_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  experiment_id UUID NOT NULL REFERENCES experiments(id) ON DELETE CASCADE,
  variant_id UUID NOT NULL REFERENCES experiment_variants(id) ON DELETE CASCADE,

  -- User identification (at least one required)
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  session_id VARCHAR(100),

  -- Context
  device_type VARCHAR(20),  -- mobile, tablet, desktop
  user_agent TEXT,
  ip_hash VARCHAR(64),  -- Hashed for privacy

  -- Timing
  assigned_at TIMESTAMPTZ DEFAULT NOW(),

  -- Ensure one assignment per user/session per experiment
  UNIQUE(experiment_id, user_id),
  UNIQUE(experiment_id, session_id)
);

-- ============================================================
-- Experiment Conversions Table
-- ============================================================
-- Tracks conversion events for experiments

CREATE TABLE IF NOT EXISTS experiment_conversions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID NOT NULL REFERENCES experiment_assignments(id) ON DELETE CASCADE,
  experiment_id UUID NOT NULL REFERENCES experiments(id) ON DELETE CASCADE,
  variant_id UUID NOT NULL REFERENCES experiment_variants(id) ON DELETE CASCADE,

  -- Conversion details
  metric_name VARCHAR(100) NOT NULL,  -- e.g., "signup_complete", "lead_submit"
  value DECIMAL(10,2) DEFAULT 1,  -- For revenue or other numeric metrics

  -- Context
  metadata JSONB DEFAULT '{}',

  -- Timing
  converted_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Indexes
-- ============================================================

-- Experiments
CREATE INDEX IF NOT EXISTS idx_experiments_status ON experiments(status);
CREATE INDEX IF NOT EXISTS idx_experiments_name ON experiments(name);

-- Variants
CREATE INDEX IF NOT EXISTS idx_variants_experiment ON experiment_variants(experiment_id);

-- Assignments
CREATE INDEX IF NOT EXISTS idx_assignments_experiment ON experiment_assignments(experiment_id);
CREATE INDEX IF NOT EXISTS idx_assignments_variant ON experiment_assignments(variant_id);
CREATE INDEX IF NOT EXISTS idx_assignments_user ON experiment_assignments(user_id);
CREATE INDEX IF NOT EXISTS idx_assignments_session ON experiment_assignments(session_id);

-- Conversions
CREATE INDEX IF NOT EXISTS idx_conversions_experiment ON experiment_conversions(experiment_id);
CREATE INDEX IF NOT EXISTS idx_conversions_variant ON experiment_conversions(variant_id);
CREATE INDEX IF NOT EXISTS idx_conversions_metric ON experiment_conversions(metric_name);
CREATE INDEX IF NOT EXISTS idx_conversions_date ON experiment_conversions(converted_at);

-- ============================================================
-- Helper Functions
-- ============================================================

-- Get variant for a user/session (deterministic assignment)
CREATE OR REPLACE FUNCTION get_experiment_variant(
  p_experiment_name VARCHAR(100),
  p_user_id UUID DEFAULT NULL,
  p_session_id VARCHAR(100) DEFAULT NULL
)
RETURNS TABLE (
  experiment_id UUID,
  variant_id UUID,
  variant_name VARCHAR(50),
  variant_config JSONB,
  is_new_assignment BOOLEAN
) AS $$
DECLARE
  v_experiment_id UUID;
  v_experiment_status VARCHAR(20);
  v_traffic_percentage INTEGER;
  v_existing_variant_id UUID;
  v_selected_variant_id UUID;
  v_variant_name VARCHAR(50);
  v_variant_config JSONB;
  v_hash_input TEXT;
  v_hash_value BIGINT;
  v_cumulative_weight INTEGER;
BEGIN
  -- Get experiment info
  SELECT e.id, e.status, e.traffic_percentage
  INTO v_experiment_id, v_experiment_status, v_traffic_percentage
  FROM experiments e
  WHERE e.name = p_experiment_name;

  -- Check if experiment exists and is running
  IF v_experiment_id IS NULL OR v_experiment_status != 'running' THEN
    RETURN;
  END IF;

  -- Check for existing assignment
  SELECT ea.variant_id INTO v_existing_variant_id
  FROM experiment_assignments ea
  WHERE ea.experiment_id = v_experiment_id
    AND (
      (p_user_id IS NOT NULL AND ea.user_id = p_user_id)
      OR (p_session_id IS NOT NULL AND ea.session_id = p_session_id)
    )
  LIMIT 1;

  IF v_existing_variant_id IS NOT NULL THEN
    -- Return existing assignment
    SELECT ev.id, ev.name, ev.config
    INTO v_selected_variant_id, v_variant_name, v_variant_config
    FROM experiment_variants ev
    WHERE ev.id = v_existing_variant_id;

    RETURN QUERY SELECT
      v_experiment_id,
      v_selected_variant_id,
      v_variant_name,
      v_variant_config,
      false;
    RETURN;
  END IF;

  -- Create deterministic hash for assignment
  v_hash_input := COALESCE(p_user_id::TEXT, '') || COALESCE(p_session_id, '') || p_experiment_name;
  v_hash_value := abs(('x' || substr(md5(v_hash_input), 1, 8))::bit(32)::int);

  -- Check if user is in traffic percentage
  IF (v_hash_value % 100) >= v_traffic_percentage THEN
    RETURN;  -- User not in experiment
  END IF;

  -- Select variant based on weights
  v_cumulative_weight := 0;
  FOR v_selected_variant_id, v_variant_name, v_variant_config IN
    SELECT ev.id, ev.name, ev.config
    FROM experiment_variants ev
    WHERE ev.experiment_id = v_experiment_id
    ORDER BY ev.is_control DESC, ev.created_at
  LOOP
    SELECT v_cumulative_weight + ev.weight INTO v_cumulative_weight
    FROM experiment_variants ev
    WHERE ev.id = v_selected_variant_id;

    IF (v_hash_value % 100) < v_cumulative_weight THEN
      EXIT;
    END IF;
  END LOOP;

  -- Create assignment
  INSERT INTO experiment_assignments (
    experiment_id,
    variant_id,
    user_id,
    session_id
  ) VALUES (
    v_experiment_id,
    v_selected_variant_id,
    p_user_id,
    p_session_id
  ) ON CONFLICT DO NOTHING;

  RETURN QUERY SELECT
    v_experiment_id,
    v_selected_variant_id,
    v_variant_name,
    v_variant_config,
    true;
END;
$$ LANGUAGE plpgsql;

-- Get experiment statistics
CREATE OR REPLACE FUNCTION get_experiment_stats(p_experiment_id UUID)
RETURNS TABLE (
  variant_id UUID,
  variant_name VARCHAR(50),
  is_control BOOLEAN,
  total_assignments BIGINT,
  total_conversions BIGINT,
  conversion_rate DECIMAL(5,4),
  total_value DECIMAL(12,2)
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    ev.id as variant_id,
    ev.name as variant_name,
    ev.is_control,
    COUNT(DISTINCT ea.id) as total_assignments,
    COUNT(DISTINCT ec.id) as total_conversions,
    CASE
      WHEN COUNT(DISTINCT ea.id) > 0
      THEN ROUND(COUNT(DISTINCT ec.id)::DECIMAL / COUNT(DISTINCT ea.id), 4)
      ELSE 0
    END as conversion_rate,
    COALESCE(SUM(ec.value), 0) as total_value
  FROM experiment_variants ev
  LEFT JOIN experiment_assignments ea ON ea.variant_id = ev.id
  LEFT JOIN experiment_conversions ec ON ec.assignment_id = ea.id
    AND ec.metric_name = (
      SELECT e.primary_metric FROM experiments e WHERE e.id = p_experiment_id
    )
  WHERE ev.experiment_id = p_experiment_id
  GROUP BY ev.id, ev.name, ev.is_control
  ORDER BY ev.is_control DESC, ev.created_at;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- RLS Policies
-- ============================================================

ALTER TABLE experiments ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiment_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiment_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiment_conversions ENABLE ROW LEVEL SECURITY;

-- Experiments: Admins can manage, all can read running experiments
CREATE POLICY experiments_select ON experiments FOR SELECT
  USING (status = 'running' OR auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  ));

CREATE POLICY experiments_admin ON experiments FOR ALL
  USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

-- Variants: Same as experiments
CREATE POLICY variants_select ON experiment_variants FOR SELECT
  USING (experiment_id IN (
    SELECT id FROM experiments WHERE status = 'running'
  ) OR auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  ));

CREATE POLICY variants_admin ON experiment_variants FOR ALL
  USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

-- Assignments: Users can see their own, admins can see all
CREATE POLICY assignments_user ON experiment_assignments FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY assignments_insert ON experiment_assignments FOR INSERT
  WITH CHECK (true);  -- Allow system to create assignments

CREATE POLICY assignments_admin ON experiment_assignments FOR ALL
  USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

-- Conversions: Similar to assignments
CREATE POLICY conversions_user ON experiment_conversions FOR SELECT
  USING (assignment_id IN (
    SELECT id FROM experiment_assignments WHERE user_id = auth.uid()
  ));

CREATE POLICY conversions_insert ON experiment_conversions FOR INSERT
  WITH CHECK (true);  -- Allow system to track conversions

CREATE POLICY conversions_admin ON experiment_conversions FOR ALL
  USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

-- ============================================================
-- Triggers
-- ============================================================

-- Update timestamp trigger
CREATE TRIGGER update_experiments_updated_at
  BEFORE UPDATE ON experiments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
