-- Fix email constraint issues in Supabase
-- Run this to fix the existing database

-- Step 1: Drop existing tables if they exist (in correct order)
DROP TABLE IF EXISTS contact_interactions CASCADE;
DROP TABLE IF EXISTS user_registrations CASCADE;
DROP TABLE IF EXISTS email_logs CASCADE;
DROP TABLE IF EXISTS support_responses CASCADE;
DROP TABLE IF EXISTS support_tickets CASCADE;
DROP TABLE IF EXISTS support_faqs CASCADE;
DROP TABLE IF EXISTS customers CASCADE;

-- Step 2: Drop the update function if it exists
DROP FUNCTION IF EXISTS update_modified_column();

-- Step 3: Create customers table with simplified email (NO REGEX)
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    company TEXT,
    phone TEXT,
    tier TEXT DEFAULT 'basic',
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 4: Create support_tickets table
CREATE TABLE support_tickets (
    id TEXT PRIMARY KEY DEFAULT ('TICKET-' || EXTRACT(EPOCH FROM NOW()) || '-' || substr(md5(random()::text), 1, 6)),
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    category TEXT NOT NULL,
    severity TEXT NOT NULL,
    subject TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'open',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 5: Create support_responses table
CREATE TABLE support_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id TEXT REFERENCES support_tickets(id) ON DELETE CASCADE,
    responder_name TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 6: Create support_faqs table
CREATE TABLE support_faqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 7: Add basic indexes
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_support_tickets_status ON support_tickets(status);
CREATE INDEX idx_support_tickets_customer_email ON support_tickets(customer_email);

-- Step 8: Insert sample data
INSERT INTO customers (name, email, company, tier) VALUES
    ('John Doe', 'john@acme.com', 'Acme Corp', 'enterprise'),
    ('Jane Smith', 'jane@startup.com', 'StartupCo', 'premium'),
    ('Test User', 'test@example.com', 'Test Company', 'basic');

-- Step 9: Insert sample FAQ
INSERT INTO support_faqs (question, answer, category) VALUES
    ('How do I get started?', 'Welcome! Check out our getting started guide.', 'general');

-- Step 10: Create sample ticket
INSERT INTO support_tickets (customer_name, customer_email, category, severity, subject, description) VALUES
    ('John Doe', 'john@acme.com', 'technical', 'medium', 'Test Issue', 'This is a test support ticket.');

-- Success message
SELECT 'Database Fixed Successfully! 🎉' as status;
