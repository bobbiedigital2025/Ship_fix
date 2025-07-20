#!/bin/bash

# Supabase Setup Script for Ship_fix Support System
# This script helps you complete the Supabase database setup

echo "🚀 Setting up Supabase database for Ship_fix Support System..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo -e "${RED}❌ .env file not found. Please create one first.${NC}"
    exit 1
fi

# Source environment variables
source .env

# Check required environment variables
if [ -z "$VITE_SUPABASE_URL" ] || [ -z "$VITE_SUPABASE_ANON_KEY" ]; then
    echo -e "${RED}❌ Missing Supabase environment variables in .env file${NC}"
    echo "Please ensure you have:"
    echo "- VITE_SUPABASE_URL"
    echo "- VITE_SUPABASE_ANON_KEY"
    echo "- SUPABASE_SERVICE_ROLE_KEY (optional but recommended)"
    exit 1
fi

echo -e "${GREEN}✅ Environment variables found${NC}"
echo "Supabase URL: $VITE_SUPABASE_URL"

# Test connection to Supabase
echo -e "${YELLOW}🔗 Testing Supabase connection...${NC}"

# Create a simple test to verify connection
cat > test_supabase_connection.js << 'EOF'
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    const { data, error } = await supabase.from('customers').select('count').limit(1);
    if (error) {
      console.log('⚠️  Database tables may not exist yet. Error:', error.message);
      console.log('📋 You need to run the SQL schema in your Supabase dashboard.');
    } else {
      console.log('✅ Successfully connected to Supabase database!');
      console.log('📊 Database is ready to use.');
    }
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
  }
}

testConnection();
EOF

# Run the connection test
node test_supabase_connection.js

# Clean up test file
rm test_supabase_connection.js

echo ""
echo -e "${YELLOW}📋 Next Steps:${NC}"
echo "1. 🌐 Go to your Supabase dashboard: https://supabase.com/dashboard/projects"
echo "2. 📁 Select your project (URL: $VITE_SUPABASE_URL)"
echo "3. 🔧 Go to SQL Editor"
echo "4. 📋 Copy and paste the contents of 'supabase-schema.sql' file"
echo "5. ▶️  Run the SQL script to create all tables and functions"
echo ""
echo -e "${GREEN}🎯 Your database will include:${NC}"
echo "   • customers table - Store customer information"
echo "   • support_tickets table - Manage support requests"
echo "   • support_responses table - Track ticket responses"
echo "   • support_faqs table - FAQ management"
echo "   • email_logs table - Email tracking"
echo "   • contact_interactions table - Customer interaction history"
echo "   • user_registrations table - Registration tracking"
echo ""
echo -e "${YELLOW}🔐 Security Features:${NC}"
echo "   • Row Level Security (RLS) enabled"
echo "   • Automatic triggers for customer creation"
echo "   • Timestamp management"
echo "   • Data validation constraints"
echo ""
echo -e "${GREEN}🎉 After running the SQL schema, your support system will be fully operational!${NC}"
