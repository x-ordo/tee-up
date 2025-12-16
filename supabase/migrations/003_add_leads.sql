-- Migration 003: Create leads table with billing trigger
-- TEE:UP Portfolio SaaS Pivot - Lead-based billing

-- Step 1: Create leads table
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pro_id UUID REFERENCES public.pro_profiles(id) ON DELETE CASCADE NOT NULL,

    -- Contact info (anonymized for privacy)
    contact_name VARCHAR(255),
    contact_method contact_method NOT NULL,

    -- Tracking
    source_url TEXT,              -- Which page they came from
    referrer TEXT,                -- External referrer

    -- Billing
    is_billable BOOLEAN DEFAULT true,
    billed_at TIMESTAMP WITH TIME ZONE,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Step 2: Create indexes
CREATE INDEX IF NOT EXISTS idx_leads_pro_id ON public.leads(pro_id);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_billable ON public.leads(is_billable);
CREATE INDEX IF NOT EXISTS idx_leads_contact_method ON public.leads(contact_method);

-- Step 3: Enable RLS
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Step 4: Create RLS policies for leads
-- Pros can view their own leads
CREATE POLICY "Pros can view their leads"
    ON public.leads FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.pro_profiles
            WHERE id = leads.pro_id AND user_id = auth.uid()
        )
    );

-- Anyone can create leads (for contact forms)
CREATE POLICY "Anyone can create leads"
    ON public.leads FOR INSERT
    WITH CHECK (true);

-- Step 5: Create billing trigger function
-- This replaces the old chat_room creation billing trigger
CREATE OR REPLACE FUNCTION public.handle_new_lead()
RETURNS TRIGGER AS $$
BEGIN
    -- Only count billable leads
    IF NEW.is_billable = true THEN
        UPDATE public.pro_profiles
        SET
            monthly_lead_count = monthly_lead_count + 1,
            total_leads = total_leads + 1
        WHERE id = NEW.pro_id;

        -- Mark lead as billed
        NEW.billed_at = NOW();
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 6: Create trigger for lead billing
CREATE TRIGGER on_lead_created
    BEFORE INSERT ON public.leads
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_lead();

-- Step 7: Update reset_monthly function to use new column name
CREATE OR REPLACE FUNCTION public.reset_monthly_lead_counts()
RETURNS void AS $$
BEGIN
    UPDATE public.pro_profiles
    SET monthly_lead_count = 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON TABLE public.leads IS 'Lead tracking for billing purposes - replaces chat-based billing';
COMMENT ON COLUMN public.leads.is_billable IS 'Whether this lead should count toward monthly billing';
COMMENT ON COLUMN public.leads.billed_at IS 'Timestamp when the lead was counted for billing';
COMMENT ON FUNCTION public.handle_new_lead() IS 'Billing trigger: increments lead counts when a billable lead is created';
