-- Complete the Ship_fix support system - Add remaining tables
-- Run this after customers table is working

-- Create support_tickets table
CREATE TABLE IF NOT EXISTS support_tickets (
    id TEXT PRIMARY KEY DEFAULT ('TICKET-' || EXTRACT(EPOCH FROM NOW()) || '-' || substr(md5(random()::text), 1, 6)),
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

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_support_tickets_customer_email ON support_tickets(customer_email);
CREATE INDEX IF NOT EXISTS idx_support_tickets_created_at ON support_tickets(created_at);
CREATE INDEX IF NOT EXISTS idx_support_responses_ticket_id ON support_responses(ticket_id);
CREATE INDEX IF NOT EXISTS idx_support_responses_created_at ON support_responses(created_at);
CREATE INDEX IF NOT EXISTS idx_contact_interactions_customer_id ON contact_interactions(customer_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_customer_id ON email_logs(customer_id);

-- Insert sample support FAQs
INSERT INTO support_faqs (question, answer, category) VALUES
('How do I integrate the API?', 'You can integrate our API by following the documentation in our developer portal. Start with authentication, then explore our endpoints.', 'integration'),
('What are the billing cycles?', 'We offer monthly and annual billing cycles. Annual subscriptions come with a 15% discount.', 'billing'),
('How do I reset my password?', 'Click on the "Forgot Password" link on the login page and follow the instructions sent to your email.', 'account'),
('What browsers are supported?', 'We support all modern browsers including Chrome, Firefox, Safari, and Edge. Internet Explorer is not supported.', 'technical'),
('How do I upgrade my plan?', 'You can upgrade your plan from the billing section in your account settings. Changes take effect immediately.', 'billing'),
('What is your SLA for support response?', 'Enterprise customers receive responses within 4 hours, Premium within 24 hours, and Basic within 48 hours.', 'general')
ON CONFLICT (question) DO NOTHING;

-- Create sample support tickets
INSERT INTO support_tickets (customer_name, customer_email, company, category, severity, subject, description) VALUES
('John Doe', 'john@acme.com', 'Acme Corp', 'technical', 'medium', 'API Authentication Issue', 'Having trouble authenticating with the API. Getting 401 errors consistently.'),
('Jane Smith', 'jane@startup.com', 'StartupCo', 'billing', 'low', 'Invoice Question', 'I have a question about my latest invoice charges.'),
('Bob Wilson', 'bob@enterprise.com', 'Enterprise Ltd', 'integration', 'high', 'Webhook Setup', 'Need help setting up webhooks for our enterprise integration.')
ON CONFLICT (id) DO NOTHING;

-- Create sample responses for the first ticket
DO $$
DECLARE 
    ticket_id_var TEXT;
BEGIN
    -- Get the first ticket ID
    SELECT id INTO ticket_id_var FROM support_tickets LIMIT 1;
    
    IF ticket_id_var IS NOT NULL THEN
        INSERT INTO support_responses (ticket_id, responder_name, responder_email, message, is_admin_response) VALUES
        (ticket_id_var, 'Support Team', 'support@yourcompany.com', 'Thank you for contacting us. We are looking into your API authentication issue and will get back to you shortly.', true),
        (ticket_id_var, 'John Doe', 'john@acme.com', 'Thanks for the quick response. I am still getting the same error. Here are the exact steps I am taking...', false);
    END IF;
END $$;

-- Verify all tables were created
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('customers', 'support_tickets', 'support_responses', 'support_faqs', 'email_logs', 'contact_interactions')
ORDER BY table_name;

-- Show counts of sample data
SELECT 
    'customers' as table_name, COUNT(*) as record_count FROM customers
UNION ALL
SELECT 
    'support_tickets' as table_name, COUNT(*) as record_count FROM support_tickets
UNION ALL
SELECT 
    'support_responses' as table_name, COUNT(*) as record_count FROM support_responses
UNION ALL
SELECT 
    'support_faqs' as table_name, COUNT(*) as record_count FROM support_faqs;

-- Success message
SELECT 'Ship_fix Support System Database Complete! 🚀' as status;
