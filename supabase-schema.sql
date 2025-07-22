-- Supabase SQL Schema for Complete App Data Storage
-- Run this in your Supabase SQL Editor

-- Note: JWT secret is automatically managed by Supabase
-- No need to set app.jwt_secret manually

-- Create customers table (main contact storage)
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    company TEXT,
    phone TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    zip_code TEXT,
    country TEXT DEFAULT 'US',
    tier TEXT DEFAULT 'basic' CHECK (tier IN ('basic', 'premium', 'enterprise')),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    total_tickets INTEGER DEFAULT 0,
    open_tickets INTEGER DEFAULT 0,
    avg_response_time DECIMAL DEFAULT 0,
    satisfaction_score DECIMAL DEFAULT 0,
    join_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE,
    registration_source TEXT DEFAULT 'app', -- 'app', 'website', 'referral', etc.
    notes TEXT,
    tags TEXT[], -- Array of tags for categorization
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create support_tickets table
CREATE TABLE IF NOT EXISTS support_tickets (
    id TEXT PRIMARY KEY DEFAULT ('TICKET-' || EXTRACT(EPOCH FROM NOW()) || '-' || substr(md5(random()::text), 1, 9)),
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    company TEXT,
    category TEXT NOT NULL CHECK (category IN ('billing', 'technical', 'account', 'integration', 'general')),
    severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    subject TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in-progress', 'resolved', 'closed')),
    priority INTEGER NOT NULL DEFAULT 5,
    assigned_to TEXT, -- Admin/support person assigned
    resolution TEXT, -- Resolution description when closed
    internal_notes TEXT, -- Private notes for admin
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create support_responses table for ticket responses
CREATE TABLE IF NOT EXISTS support_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id TEXT REFERENCES support_tickets(id) ON DELETE CASCADE,
    responder_name TEXT NOT NULL,
    responder_email TEXT NOT NULL,
    message TEXT NOT NULL,
    is_internal BOOLEAN DEFAULT FALSE,
    is_admin_response BOOLEAN DEFAULT FALSE,
    attachments TEXT[], -- Array of file URLs
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_registrations table to track all app registrations
CREATE TABLE IF NOT EXISTS user_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    company TEXT,
    phone TEXT,
    registration_type TEXT DEFAULT 'standard', -- 'standard', 'trial', 'demo', etc.
    registration_source TEXT DEFAULT 'app', -- 'app', 'website', 'marketing', etc.
    utm_source TEXT, -- Marketing tracking
    utm_medium TEXT,
    utm_campaign TEXT,
    referrer_url TEXT,
    ip_address TEXT,
    user_agent TEXT,
    device_type TEXT, -- 'desktop', 'mobile', 'tablet'
    browser TEXT,
    location_country TEXT,
    location_city TEXT,
    email_verified BOOLEAN DEFAULT FALSE,
    terms_accepted BOOLEAN DEFAULT FALSE,
    marketing_consent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create contact_interactions table for tracking all customer interactions
CREATE TABLE IF NOT EXISTS contact_interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    interaction_type TEXT NOT NULL, -- 'email', 'support_ticket', 'login', 'feature_usage', etc.
    interaction_data JSONB, -- Flexible data storage
    email_sent_to TEXT,
    email_subject TEXT,
    email_type TEXT, -- 'welcome', 'support', 'marketing', 'notification'
    page_visited TEXT,
    feature_used TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create support_faqs table
CREATE TABLE IF NOT EXISTS support_faqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category TEXT NOT NULL,
    is_public BOOLEAN DEFAULT TRUE,
    view_count INTEGER DEFAULT 0,
    helpful_votes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create email_logs table to track all emails sent
CREATE TABLE IF NOT EXISTS email_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    email_to TEXT NOT NULL,
    email_from TEXT NOT NULL,
    subject TEXT NOT NULL,
    email_type TEXT NOT NULL, -- 'welcome', 'support', 'notification', 'marketing'
    template_used TEXT,
    status TEXT DEFAULT 'sent', -- 'sent', 'delivered', 'opened', 'clicked', 'bounced', 'failed'
    resend_email_id TEXT, -- ID from Resend service
    error_message TEXT,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    delivered_at TIMESTAMP WITH TIME ZONE,
    opened_at TIMESTAMP WITH TIME ZONE,
    clicked_at TIMESTAMP WITH TIME ZONE
);

-- ============================================================================
-- TARIFF CONTROL & PREDICTION SECTION
-- Automated monitoring and resolution for Trump tariff impacts on supply chain
-- ============================================================================

-- Table to log tariff events, predictions, and customer impacts
CREATE TABLE IF NOT EXISTS tariff_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type TEXT NOT NULL CHECK (event_type IN ('tariff_change', 'prediction', 'impact', 'cost_spike', 'resolution')),
    product_category TEXT, -- 'electronics', 'textiles', 'automotive', etc.
    origin_country TEXT, -- 'China', 'Mexico', 'Canada', etc.
    destination_country TEXT DEFAULT 'US',
    tariff_rate_old DECIMAL,
    tariff_rate_new DECIMAL,
    cost_impact_percentage DECIMAL, -- How much costs increased
    cost_impact_dollars DECIMAL, -- Dollar amount impact
    description TEXT,
    affected_customers UUID[], -- Array of customer IDs impacted
    trump_policy_reference TEXT, -- Reference to specific Trump tariff policy
    mitigation_strategy TEXT, -- How we're addressing it
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table to automate tariff-related resolutions using MCP auth and A2A
CREATE TABLE IF NOT EXISTS tariff_resolutions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tariff_event_id UUID REFERENCES tariff_events(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    resolution_type TEXT NOT NULL CHECK (resolution_type IN (
        'notification', 'pricing_update', 'a2a_credit', 'cost_analysis', 
        'route_optimization', 'supplier_switch', 'inventory_adjustment'
    )),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'failed')),
    action_details JSONB, -- Flexible storage for action data
    mcp_auth_id TEXT, -- MCP authentication tracking
    a2a_transaction_id TEXT, -- Account-to-account transaction ID for credits
    cost_savings DECIMAL, -- How much we saved the customer
    customer_notification_sent BOOLEAN DEFAULT FALSE,
    automated BOOLEAN DEFAULT TRUE, -- Whether this was automated or manual
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- Table for tracking supply chain alternatives to mitigate tariff costs
CREATE TABLE IF NOT EXISTS supply_chain_alternatives (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_category TEXT NOT NULL,
    original_country TEXT NOT NULL,
    alternative_country TEXT NOT NULL,
    cost_difference DECIMAL, -- Percentage difference in cost
    quality_rating DECIMAL CHECK (quality_rating >= 1 AND quality_rating <= 5),
    lead_time_days INTEGER,
    reliability_score DECIMAL CHECK (reliability_score >= 0 AND reliability_score <= 1),
    trump_tariff_exempt BOOLEAN DEFAULT FALSE, -- Whether this alternative avoids Trump tariffs
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- SUPPLY CHAIN EVENTS TABLE (for MCP automation logging)
-- ============================================================================

-- Table to log all supply chain automation events
CREATE TABLE IF NOT EXISTS supply_chain_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type TEXT NOT NULL, -- 'cost_analysis', 'route_optimization', 'procurement_alert', etc.
    event_data JSONB, -- Flexible storage for event details
    source TEXT DEFAULT 'mcp_automation', -- Source of the event
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for supply chain events
CREATE INDEX IF NOT EXISTS idx_supply_chain_events_type ON supply_chain_events(event_type);
CREATE INDEX IF NOT EXISTS idx_supply_chain_events_timestamp ON supply_chain_events(timestamp);
CREATE INDEX IF NOT EXISTS idx_supply_chain_events_source ON supply_chain_events(source);

-- Enable RLS for supply chain events
ALTER TABLE supply_chain_events ENABLE ROW LEVEL SECURITY;

-- Create policy for supply chain events
CREATE POLICY "Allow all operations on supply_chain_events" ON supply_chain_events FOR ALL USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_company ON customers(company);
CREATE INDEX IF NOT EXISTS idx_customers_join_date ON customers(join_date);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_support_tickets_severity ON support_tickets(severity);
CREATE INDEX IF NOT EXISTS idx_support_tickets_customer_email ON support_tickets(customer_email);
CREATE INDEX IF NOT EXISTS idx_support_tickets_created_at ON support_tickets(created_at);
CREATE INDEX IF NOT EXISTS idx_user_registrations_email ON user_registrations(email);
CREATE INDEX IF NOT EXISTS idx_user_registrations_created_at ON user_registrations(created_at);
CREATE INDEX IF NOT EXISTS idx_contact_interactions_customer_id ON contact_interactions(customer_id);
CREATE INDEX IF NOT EXISTS idx_contact_interactions_type ON contact_interactions(interaction_type);
CREATE INDEX IF NOT EXISTS idx_email_logs_customer_id ON email_logs(customer_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_email_type ON email_logs(email_type);

-- Create functions for automatic updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_support_tickets_updated_at BEFORE UPDATE ON support_tickets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_support_faqs_updated_at BEFORE UPDATE ON support_faqs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically create customer record when ticket is created
CREATE OR REPLACE FUNCTION create_customer_from_ticket()
RETURNS TRIGGER AS $$
DECLARE
    customer_exists BOOLEAN := FALSE;
    customer_uuid UUID;
BEGIN
    -- Only proceed if customer_email is provided
    IF NEW.customer_email IS NOT NULL AND NEW.customer_email != '' THEN
        -- Check if customer exists
        SELECT EXISTS(SELECT 1 FROM customers WHERE email = NEW.customer_email) INTO customer_exists;
        
        IF NOT customer_exists THEN
            -- Create new customer record
            INSERT INTO customers (name, email, company, registration_source, total_tickets, open_tickets)
            VALUES (
                COALESCE(NEW.customer_name, 'Unknown'), 
                NEW.customer_email, 
                NEW.company, 
                'support_ticket', 
                1, 
                1
            )
            RETURNING id INTO customer_uuid;
            
            -- Update the ticket with customer_id
            NEW.customer_id = customer_uuid;
        ELSE
            -- Update existing customer
            UPDATE customers 
            SET 
                total_tickets = total_tickets + 1,
                open_tickets = open_tickets + 1,
                last_activity = NOW()
            WHERE email = NEW.customer_email
            RETURNING id INTO customer_uuid;
            
            -- Set customer_id on ticket
            NEW.customer_id = customer_uuid;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for automatic customer creation
CREATE TRIGGER auto_create_customer_from_ticket
    BEFORE INSERT ON support_tickets
    FOR EACH ROW EXECUTE FUNCTION create_customer_from_ticket();

-- Function to update customer ticket counts when ticket status changes
CREATE OR REPLACE FUNCTION update_customer_ticket_counts()
RETURNS TRIGGER AS $$
BEGIN
    -- Only proceed if customer_email exists
    IF NEW.customer_email IS NOT NULL THEN
        -- If ticket is being closed
        IF OLD.status != 'closed' AND NEW.status = 'closed' THEN
            UPDATE customers 
            SET open_tickets = GREATEST(open_tickets - 1, 0),
                last_activity = NOW()
            WHERE email = NEW.customer_email;
        END IF;
        
        -- If ticket is being reopened
        IF OLD.status = 'closed' AND NEW.status != 'closed' THEN
            UPDATE customers 
            SET open_tickets = open_tickets + 1,
                last_activity = NOW()
            WHERE email = NEW.customer_email;
        END IF;
        
        -- Always update last activity for any status change
        IF OLD.status != NEW.status THEN
            UPDATE customers 
            SET last_activity = NOW()
            WHERE email = NEW.customer_email;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for ticket status updates
CREATE TRIGGER update_customer_on_ticket_status_change
    AFTER UPDATE ON support_tickets
    FOR EACH ROW EXECUTE FUNCTION update_customer_ticket_counts();

-- Enable Row Level Security (optional - for multi-tenant apps)
-- ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE user_registrations ENABLE ROW LEVEL SECURITY;

-- Insert some sample data for testing
INSERT INTO customers (name, email, company, tier) VALUES
    ('John Doe', 'john@acme.com', 'Acme Corp', 'enterprise'),
    ('Jane Smith', 'jane@startup.com', 'StartupCo', 'premium'),
    ('Bob Wilson', 'bob@enterprise.com', 'Enterprise Ltd', 'enterprise')
ON CONFLICT (email) DO NOTHING;

-- Add missing indexes for support_responses
CREATE INDEX IF NOT EXISTS idx_support_responses_ticket_id ON support_responses(ticket_id);
CREATE INDEX IF NOT EXISTS idx_support_responses_created_at ON support_responses(created_at);

-- Insert some sample FAQs
INSERT INTO support_faqs (question, answer, category) VALUES
('How do I integrate the API?', 'You can integrate our API by following the documentation in our developer portal. Start with authentication, then explore our endpoints.', 'integration'),
('What are the billing cycles?', 'We offer monthly and annual billing cycles. Annual subscriptions come with a 15% discount.', 'billing'),
('How do I reset my password?', 'Click on the "Forgot Password" link on the login page and follow the instructions sent to your email.', 'account'),
('What browsers are supported?', 'We support all modern browsers including Chrome, Firefox, Safari, and Edge. Internet Explorer is not supported.', 'technical'),
('How do I upgrade my plan?', 'You can upgrade your plan from the billing section in your account settings. Changes take effect immediately.', 'billing')
ON CONFLICT (question) DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE tariff_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE tariff_resolutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE supply_chain_alternatives ENABLE ROW LEVEL SECURITY;
ALTER TABLE supply_chain_events ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (you may want to restrict these in production)
CREATE POLICY "Allow all operations on support_tickets" ON support_tickets FOR ALL USING (true);
CREATE POLICY "Allow all operations on support_responses" ON support_responses FOR ALL USING (true);
CREATE POLICY "Allow all operations on customers" ON customers FOR ALL USING (true);
CREATE POLICY "Allow all operations on support_faqs" ON support_faqs FOR ALL USING (true);
CREATE POLICY "Allow all operations on email_logs" ON email_logs FOR ALL USING (true);
CREATE POLICY "Allow all operations on contact_interactions" ON contact_interactions FOR ALL USING (true);
CREATE POLICY "Allow all operations on user_registrations" ON user_registrations FOR ALL USING (true);
CREATE POLICY "Allow all operations on tariff_events" ON tariff_events FOR ALL USING (true);
CREATE POLICY "Allow all operations on tariff_resolutions" ON tariff_resolutions FOR ALL USING (true);
CREATE POLICY "Allow all operations on supply_chain_alternatives" ON supply_chain_alternatives FOR ALL USING (true);
CREATE POLICY "Allow all operations on supply_chain_events" ON supply_chain_events FOR ALL USING (true);

-- Grant permissions (adjust as needed for your setup)
-- GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
-- GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- ============================================================================
-- TARIFF CONTROL & PREDICTION SECTION
-- Automated monitoring and resolution for Trump tariff impacts on supply chain
-- ============================================================================

-- Table to log tariff events, predictions, and customer impacts
CREATE TABLE IF NOT EXISTS tariff_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type TEXT NOT NULL CHECK (event_type IN ('tariff_change', 'prediction', 'impact', 'cost_spike', 'resolution')),
    product_category TEXT, -- 'electronics', 'textiles', 'automotive', etc.
    origin_country TEXT, -- 'China', 'Mexico', 'Canada', etc.
    destination_country TEXT DEFAULT 'US',
    tariff_rate_old DECIMAL,
    tariff_rate_new DECIMAL,
    cost_impact_percentage DECIMAL, -- How much costs increased
    cost_impact_dollars DECIMAL, -- Dollar amount impact
    description TEXT,
    affected_customers UUID[], -- Array of customer IDs impacted
    trump_policy_reference TEXT, -- Reference to specific Trump tariff policy
    mitigation_strategy TEXT, -- How we're addressing it
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table to automate tariff-related resolutions using MCP auth and A2A
CREATE TABLE IF NOT EXISTS tariff_resolutions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tariff_event_id UUID REFERENCES tariff_events(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    resolution_type TEXT NOT NULL CHECK (resolution_type IN (
        'notification', 'pricing_update', 'a2a_credit', 'cost_analysis', 
        'route_optimization', 'supplier_switch', 'inventory_adjustment'
    )),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'failed')),
    action_details JSONB, -- Flexible storage for action data
    mcp_auth_id TEXT, -- MCP authentication tracking
    a2a_transaction_id TEXT, -- Account-to-account transaction ID for credits
    cost_savings DECIMAL, -- How much we saved the customer
    customer_notification_sent BOOLEAN DEFAULT FALSE,
    automated BOOLEAN DEFAULT TRUE, -- Whether this was automated or manual
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- Table for tracking supply chain alternatives to mitigate tariff costs
CREATE TABLE IF NOT EXISTS supply_chain_alternatives (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_category TEXT NOT NULL,
    original_country TEXT NOT NULL,
    alternative_country TEXT NOT NULL,
    cost_difference DECIMAL, -- Percentage difference in cost
    quality_rating DECIMAL CHECK (quality_rating >= 1 AND quality_rating <= 5),
    lead_time_days INTEGER,
    reliability_score DECIMAL CHECK (reliability_score >= 0 AND reliability_score <= 1),
    trump_tariff_exempt BOOLEAN DEFAULT FALSE, -- Whether this alternative avoids Trump tariffs
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- SUPPLY CHAIN EVENTS TABLE (for MCP automation logging)
-- ============================================================================

-- Table to log all supply chain automation events
CREATE TABLE IF NOT EXISTS supply_chain_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type TEXT NOT NULL, -- 'cost_analysis', 'route_optimization', 'procurement_alert', etc.
    event_data JSONB, -- Flexible storage for event details
    source TEXT DEFAULT 'mcp_automation', -- Source of the event
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for supply chain events
CREATE INDEX IF NOT EXISTS idx_supply_chain_events_type ON supply_chain_events(event_type);
CREATE INDEX IF NOT EXISTS idx_supply_chain_events_timestamp ON supply_chain_events(timestamp);
CREATE INDEX IF NOT EXISTS idx_supply_chain_events_source ON supply_chain_events(source);

-- Enable RLS for supply chain events
ALTER TABLE supply_chain_events ENABLE ROW LEVEL SECURITY;

-- Create policy for supply chain events
CREATE POLICY "Allow all operations on supply_chain_events" ON supply_chain_events FOR ALL USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_company ON customers(company);
CREATE INDEX IF NOT EXISTS idx_customers_join_date ON customers(join_date);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_support_tickets_severity ON support_tickets(severity);
CREATE INDEX IF NOT EXISTS idx_support_tickets_customer_email ON support_tickets(customer_email);
CREATE INDEX IF NOT EXISTS idx_support_tickets_created_at ON support_tickets(created_at);
CREATE INDEX IF NOT EXISTS idx_user_registrations_email ON user_registrations(email);
CREATE INDEX IF NOT EXISTS idx_user_registrations_created_at ON user_registrations(created_at);
CREATE INDEX IF NOT EXISTS idx_contact_interactions_customer_id ON contact_interactions(customer_id);
CREATE INDEX IF NOT EXISTS idx_contact_interactions_type ON contact_interactions(interaction_type);
CREATE INDEX IF NOT EXISTS idx_email_logs_customer_id ON email_logs(customer_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_email_type ON email_logs(email_type);

-- Create functions for automatic updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_support_tickets_updated_at BEFORE UPDATE ON support_tickets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_support_faqs_updated_at BEFORE UPDATE ON support_faqs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically create customer record when ticket is created
CREATE OR REPLACE FUNCTION create_customer_from_ticket()
RETURNS TRIGGER AS $$
DECLARE
    customer_exists BOOLEAN := FALSE;
    customer_uuid UUID;
BEGIN
    -- Only proceed if customer_email is provided
    IF NEW.customer_email IS NOT NULL AND NEW.customer_email != '' THEN
        -- Check if customer exists
        SELECT EXISTS(SELECT 1 FROM customers WHERE email = NEW.customer_email) INTO customer_exists;
        
        IF NOT customer_exists THEN
            -- Create new customer record
            INSERT INTO customers (name, email, company, registration_source, total_tickets, open_tickets)
            VALUES (
                COALESCE(NEW.customer_name, 'Unknown'), 
                NEW.customer_email, 
                NEW.company, 
                'support_ticket', 
                1, 
                1
            )
            RETURNING id INTO customer_uuid;
            
            -- Update the ticket with customer_id
            NEW.customer_id = customer_uuid;
        ELSE
            -- Update existing customer
            UPDATE customers 
            SET 
                total_tickets = total_tickets + 1,
                open_tickets = open_tickets + 1,
                last_activity = NOW()
            WHERE email = NEW.customer_email
            RETURNING id INTO customer_uuid;
            
            -- Set customer_id on ticket
            NEW.customer_id = customer_uuid;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for automatic customer creation
CREATE TRIGGER auto_create_customer_from_ticket
    BEFORE INSERT ON support_tickets
    FOR EACH ROW EXECUTE FUNCTION create_customer_from_ticket();

-- Function to update customer ticket counts when ticket status changes
CREATE OR REPLACE FUNCTION update_customer_ticket_counts()
RETURNS TRIGGER AS $$
BEGIN
    -- Only proceed if customer_email exists
    IF NEW.customer_email IS NOT NULL THEN
        -- If ticket is being closed
        IF OLD.status != 'closed' AND NEW.status = 'closed' THEN
            UPDATE customers 
            SET open_tickets = GREATEST(open_tickets - 1, 0),
                last_activity = NOW()
            WHERE email = NEW.customer_email;
        END IF;
        
        -- If ticket is being reopened
        IF OLD.status = 'closed' AND NEW.status != 'closed' THEN
            UPDATE customers 
            SET open_tickets = open_tickets + 1,
                last_activity = NOW()
            WHERE email = NEW.customer_email;
        END IF;
        
        -- Always update last activity for any status change
        IF OLD.status != NEW.status THEN
            UPDATE customers 
            SET last_activity = NOW()
            WHERE email = NEW.customer_email;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for ticket status updates
CREATE TRIGGER update_customer_on_ticket_status_change
    AFTER UPDATE ON support_tickets
    FOR EACH ROW EXECUTE FUNCTION update_customer_ticket_counts();

-- Enable Row Level Security (optional - for multi-tenant apps)
-- ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE user_registrations ENABLE ROW LEVEL SECURITY;

-- Insert some sample data for testing
INSERT INTO customers (name, email, company, tier) VALUES
    ('John Doe', 'john@acme.com', 'Acme Corp', 'enterprise'),
    ('Jane Smith', 'jane@startup.com', 'StartupCo', 'premium'),
    ('Bob Wilson', 'bob@enterprise.com', 'Enterprise Ltd', 'enterprise')
ON CONFLICT (email) DO NOTHING;

-- Add missing indexes for support_responses
CREATE INDEX IF NOT EXISTS idx_support_responses_ticket_id ON support_responses(ticket_id);
CREATE INDEX IF NOT EXISTS idx_support_responses_created_at ON support_responses(created_at);

-- Insert some sample FAQs
INSERT INTO support_faqs (question, answer, category) VALUES
('How do I integrate the API?', 'You can integrate our API by following the documentation in our developer portal. Start with authentication, then explore our endpoints.', 'integration'),
('What are the billing cycles?', 'We offer monthly and annual billing cycles. Annual subscriptions come with a 15% discount.', 'billing'),
('How do I reset my password?', 'Click on the "Forgot Password" link on the login page and follow the instructions sent to your email.', 'account'),
('What browsers are supported?', 'We support all modern browsers including Chrome, Firefox, Safari, and Edge. Internet Explorer is not supported.', 'technical'),
('How do I upgrade my plan?', 'You can upgrade your plan from the billing section in your account settings. Changes take effect immediately.', 'billing')
ON CONFLICT (question) DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE tariff_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE tariff_resolutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE supply_chain_alternatives ENABLE ROW LEVEL SECURITY;
ALTER TABLE supply_chain_events ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (you may want to restrict these in production)
CREATE POLICY "Allow all operations on support_tickets" ON support_tickets FOR ALL USING (true);
CREATE POLICY "Allow all operations on support_responses" ON support_responses FOR ALL USING (true);
CREATE POLICY "Allow all operations on customers" ON customers FOR ALL USING (true);
CREATE POLICY "Allow all operations on support_faqs" ON support_faqs FOR ALL USING (true);
CREATE POLICY "Allow all operations on email_logs" ON email_logs FOR ALL USING (true);
CREATE POLICY "Allow all operations on contact_interactions" ON contact_interactions FOR ALL USING (true);
CREATE POLICY "Allow all operations on user_registrations" ON user_registrations FOR ALL USING (true);
CREATE POLICY "Allow all operations on tariff_events" ON tariff_events FOR ALL USING (true);
CREATE POLICY "Allow all operations on tariff_resolutions" ON tariff_resolutions FOR ALL USING (true);
CREATE POLICY "Allow all operations on supply_chain_alternatives" ON supply_chain_alternatives FOR ALL USING (true);
CREATE POLICY "Allow all operations on supply_chain_events" ON supply_chain_events FOR ALL USING (true);

-- Grant permissions (adjust as needed for your setup)
-- GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
-- GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- ============================================================================
-- TARIFF CONTROL & PREDICTION SECTION
-- Automated monitoring and resolution for Trump tariff impacts on supply chain
-- ============================================================================

-- Table to log tariff events, predictions, and customer impacts
CREATE TABLE IF NOT EXISTS tariff_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type TEXT NOT NULL CHECK (event_type IN ('tariff_change', 'prediction', 'impact', 'cost_spike', 'resolution')),
    product_category TEXT, -- 'electronics', 'textiles', 'automotive', etc.
    origin_country TEXT, -- 'China', 'Mexico', 'Canada', etc.
    destination_country TEXT DEFAULT 'US',
    tariff_rate_old DECIMAL,
    tariff_rate_new DECIMAL,
    cost_impact_percentage DECIMAL, -- How much costs increased
    cost_impact_dollars DECIMAL, -- Dollar amount impact
    description TEXT,
    affected_customers UUID[], -- Array of customer IDs impacted
    trump_policy_reference TEXT, -- Reference to specific Trump tariff policy
    mitigation_strategy TEXT, -- How we're addressing it
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table to automate tariff-related resolutions using MCP auth and A2A
CREATE TABLE IF NOT EXISTS tariff_resolutions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tariff_event_id UUID REFERENCES tariff_events(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    resolution_type TEXT NOT NULL CHECK (resolution_type IN (
        'notification', 'pricing_update', 'a2a_credit', 'cost_analysis', 
        'route_optimization', 'supplier_switch', 'inventory_adjustment'
    )),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'failed')),
    action_details JSONB, -- Flexible storage for action data
    mcp_auth_id TEXT, -- MCP authentication tracking
    a2a_transaction_id TEXT, -- Account-to-account transaction ID for credits
    cost_savings DECIMAL, -- How much we saved the customer
    customer_notification_sent BOOLEAN DEFAULT FALSE,
    automated BOOLEAN DEFAULT TRUE, -- Whether this was automated or manual
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- Table for tracking supply chain alternatives to mitigate tariff costs
CREATE TABLE IF NOT EXISTS supply_chain_alternatives (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_category TEXT NOT NULL,
    original_country TEXT NOT NULL,
    alternative_country TEXT NOT NULL,
    cost_difference DECIMAL, -- Percentage difference in cost
    quality_rating DECIMAL CHECK (quality_rating >= 1 AND quality_rating <= 5),
    lead_time_days INTEGER,
    reliability_score DECIMAL CHECK (reliability_score >= 0 AND reliability_score <= 1),
    trump_tariff_exempt BOOLEAN DEFAULT FALSE, -- Whether this alternative avoids Trump tariffs
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- SUPPLY CHAIN EVENTS TABLE (for MCP automation logging)
-- ============================================================================

-- Table to log all supply chain automation events
CREATE TABLE IF NOT EXISTS supply_chain_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type TEXT NOT NULL, -- 'cost_analysis', 'route_optimization', 'procurement_alert', etc.
    event_data JSONB, -- Flexible storage for event details
    source TEXT DEFAULT 'mcp_automation', -- Source of the event
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for supply chain events
CREATE INDEX IF NOT EXISTS idx_supply_chain_events_type ON supply_chain_events(event_type);
CREATE INDEX IF NOT EXISTS idx_supply_chain_events_timestamp ON supply_chain_events(timestamp);
CREATE INDEX IF NOT EXISTS idx_supply_chain_events_source ON supply_chain_events(source);

-- Enable RLS for supply chain events
ALTER TABLE supply_chain_events ENABLE ROW LEVEL SECURITY;

-- Create policy for supply chain events
CREATE POLICY "Allow all operations on supply_chain_events" ON supply_chain_events FOR ALL USING (true);

-- Success message
SELECT 'Ship_fix Support System Database Schema Applied Successfully! 🎉 (with Trump Tariff Control & Prediction)' as status;
