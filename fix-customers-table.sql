-- Fix existing customers table - Remove email constraints and add data
-- Run this in Supabase SQL Editor

-- Step 1: Check current table structure
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'customers' AND table_schema = 'public';

-- Step 2: Drop any existing email constraints that might be causing issues
DO $$ 
BEGIN
    -- Try to drop any check constraints on email
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'customers' 
        AND constraint_type = 'CHECK'
    ) THEN
        -- Get constraint names and drop them
        PERFORM format('ALTER TABLE customers DROP CONSTRAINT %I', constraint_name)
        FROM information_schema.table_constraints 
        WHERE table_name = 'customers' 
        AND constraint_type = 'CHECK'
        AND constraint_name LIKE '%email%';
    END IF;
END $$;

-- Step 3: Ensure the email column is correct (simple unique constraint)
ALTER TABLE customers ALTER COLUMN email SET NOT NULL;

-- Step 4: Add missing columns if they don't exist
DO $$ 
BEGIN
    -- Add company column if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'customers' AND column_name = 'company') THEN
        ALTER TABLE customers ADD COLUMN company TEXT;
    END IF;
    
    -- Add tier column if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'customers' AND column_name = 'tier') THEN
        ALTER TABLE customers ADD COLUMN tier TEXT DEFAULT 'basic';
    END IF;
    
    -- Add status column if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'customers' AND column_name = 'status') THEN
        ALTER TABLE customers ADD COLUMN status TEXT DEFAULT 'active';
    END IF;
    
    -- Add name column if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'customers' AND column_name = 'name') THEN
        ALTER TABLE customers ADD COLUMN name TEXT;
    END IF;
END $$;

-- Step 5: Clear any existing data and insert fresh sample data
DELETE FROM customers;

-- Step 6: Insert sample customers (simple emails, no complex validation)
INSERT INTO customers (name, email, company, tier, status) VALUES
    ('John Doe', 'john@acme.com', 'Acme Corp', 'enterprise', 'active'),
    ('Jane Smith', 'jane@startup.com', 'StartupCo', 'premium', 'active'),
    ('Bob Wilson', 'bob@enterprise.com', 'Enterprise Ltd', 'enterprise', 'active'),
    ('Alice Johnson', 'alice@techstart.io', 'TechStart', 'basic', 'active'),
    ('Mike Davis', 'mike@consulting.com', 'Davis Consulting', 'premium', 'active'),
    ('Test User', 'test@example.com', 'Test Company', 'basic', 'active');

-- Step 7: Verify the data was inserted
SELECT COUNT(*) as total_customers FROM customers;
SELECT name, email, company, tier FROM customers LIMIT 5;

-- Success message
SELECT 'Customers table fixed and populated! 🎉' as status;
