-- Supabase SQL Schema - Basic Version (No RLS)
-- Run this first to create core tables without complexity

-- Create customers table (main contact storage)
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL CHECK (length(trim(name)) > 0),
    email TEXT UNIQUE NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    company TEXT,
    phone TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    zip_code TEXT,
    country TEXT DEFAULT 'US',
    tier TEXT DEFAULT 'basic' CHECK (tier IN ('basic', 'premium', 'enterprise')),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    total_tickets INTEGER DEFAULT 0 CHECK (total_tickets >= 0),
    open_tickets INTEGER DEFAULT 0 CHECK (open_tickets >= 0),
    avg_response_time DECIMAL DEFAULT 0 CHECK (avg_response_time >= 0),
    satisfaction_score DECIMAL DEFAULT 0 CHECK (satisfaction_score >= 0 AND satisfaction_score <= 5),
    join_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE,
    registration_source TEXT DEFAULT 'app',
    notes TEXT,
    tags TEXT[],
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
    assigned_to TEXT,
    resolution TEXT,
    internal_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create support_responses table
CREATE TABLE IF NOT EXISTS support_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id TEXT REFERENCES support_tickets(id) ON DELETE CASCADE,
    responder_name TEXT NOT NULL,
    responder_email TEXT NOT NULL,
    message TEXT NOT NULL,
    is_internal BOOLEAN DEFAULT FALSE,
    is_admin_response BOOLEAN DEFAULT FALSE,
    attachments TEXT[],
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

-- Create email_logs table
CREATE TABLE IF NOT EXISTS email_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    email_to TEXT NOT NULL,
    email_from TEXT NOT NULL,
    subject TEXT NOT NULL,
    email_type TEXT NOT NULL,
    template_used TEXT,
    status TEXT DEFAULT 'sent',
    resend_email_id TEXT,
    error_message TEXT,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    delivered_at TIMESTAMP WITH TIME ZONE,
    opened_at TIMESTAMP WITH TIME ZONE,
    clicked_at TIMESTAMP WITH TIME ZONE
);

-- Create contact_interactions table
CREATE TABLE IF NOT EXISTS contact_interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    interaction_type TEXT NOT NULL,
    interaction_data JSONB,
    email_sent_to TEXT,
    email_subject TEXT,
    email_type TEXT,
    page_visited TEXT,
    feature_used TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_registrations table
CREATE TABLE IF NOT EXISTS user_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    company TEXT,
    phone TEXT,
    registration_type TEXT DEFAULT 'standard',
    registration_source TEXT DEFAULT 'app',
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    referrer_url TEXT,
    ip_address TEXT,
    user_agent TEXT,
    device_type TEXT,
    browser TEXT,
    location_country TEXT,
    location_city TEXT,
    email_verified BOOLEAN DEFAULT FALSE,
    terms_accepted BOOLEAN DEFAULT FALSE,
    marketing_consent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create basic indexes
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_company ON customers(company);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_support_tickets_customer_email ON support_tickets(customer_email);
CREATE INDEX IF NOT EXISTS idx_support_tickets_created_at ON support_tickets(created_at);
CREATE INDEX IF NOT EXISTS idx_support_responses_ticket_id ON support_responses(ticket_id);
CREATE INDEX IF NOT EXISTS idx_support_responses_created_at ON support_responses(created_at);
CREATE INDEX IF NOT EXISTS idx_contact_interactions_customer_id ON contact_interactions(customer_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_customer_id ON email_logs(customer_id);

-- Create GIN index for tags array (better performance for array operations)
CREATE INDEX IF NOT EXISTS idx_customers_tags ON customers USING GIN(tags);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for automatic updated_at updates
CREATE TRIGGER update_customers_modtime
    BEFORE UPDATE ON customers
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_support_tickets_modtime
    BEFORE UPDATE ON support_tickets
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_support_faqs_modtime
    BEFORE UPDATE ON support_faqs
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

-- Insert sample data
INSERT INTO customers (name, email, company, tier) VALUES
    ('John Doe', 'john@acme.com', 'Acme Corp', 'enterprise'),
    ('Jane Smith', 'jane@startup.com', 'StartupCo', 'premium'),
    ('Bob Wilson', 'bob@enterprise.com', 'Enterprise Ltd', 'enterprise'),
    ('Alice Johnson', 'alice@techstart.io', 'TechStart', 'basic'),
    ('Mike Davis', 'mike@consulting.com', 'Davis Consulting', 'premium')
ON CONFLICT (email) DO NOTHING;

-- Insert sample FAQs
INSERT INTO support_faqs (question, answer, category) VALUES
('How do I integrate the API?', 'You can integrate our API by following the documentation in our developer portal. Start with authentication, then explore our endpoints.', 'integration'),
('What are the billing cycles?', 'We offer monthly and annual billing cycles. Annual subscriptions come with a 15% discount.', 'billing'),
('How do I reset my password?', 'Click on the "Forgot Password" link on the login page and follow the instructions sent to your email.', 'account'),
('What browsers are supported?', 'We support all modern browsers including Chrome, Firefox, Safari, and Edge. Internet Explorer is not supported.', 'technical'),
('How do I upgrade my plan?', 'You can upgrade your plan from the billing section in your account settings. Changes take effect immediately.', 'billing'),
('What is your SLA for support response?', 'Enterprise customers receive responses within 4 hours, Premium within 24 hours, and Basic within 48 hours.', 'general')
ON CONFLICT (question) DO NOTHING;

-- Create a sample support ticket
INSERT INTO support_tickets (customer_name, customer_email, company, category, severity, subject, description) VALUES
('John Doe', 'john@acme.com', 'Acme Corp', 'technical', 'medium', 'API Authentication Issue', 'Having trouble authenticating with the API. Getting 401 errors consistently.')
ON CONFLICT (id) DO NOTHING;

-- Success message
SELECT 'Ship_fix Basic Database Schema Applied Successfully! 🎉' as status;
