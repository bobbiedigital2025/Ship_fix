/**
 * Database Initialization and Setup Script
 * Run this to verify and initialize your Supabase database
 */

import { createClient } from '@supabase/supabase-js';

// Configuration from environment
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://ujzedaxzqpglrccqojbh.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqemVkYXh6cXBnbHJjY3FvamJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2ODA2NzUsImV4cCI6MjA2ODI1NjY3NX0.Dfi19uVCKcFa51XVFA2QqeHSyQKckLVcvLKnSd6-YQc';

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase configuration in environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Test data for initialization
const sampleCustomers = [
  {
    name: 'John Doe',
    email: 'john@acme.com',
    company: 'Acme Corp',
    tier: 'enterprise',
    phone: '+1-555-0101'
  },
  {
    name: 'Jane Smith',
    email: 'jane@startup.com',
    company: 'StartupCo',
    tier: 'premium',
    phone: '+1-555-0102'
  },
  {
    name: 'Bob Wilson',
    email: 'bob@enterprise.com',
    company: 'Enterprise Ltd',
    tier: 'enterprise',
    phone: '+1-555-0103'
  }
];

const sampleFAQs = [
  {
    question: 'How do I integrate the API?',
    answer: 'You can integrate our API by following the documentation in our developer portal. Start with authentication, then explore our endpoints.',
    category: 'integration'
  },
  {
    question: 'What are the billing cycles?',
    answer: 'We offer monthly and annual billing cycles. Annual subscriptions come with a 15% discount.',
    category: 'billing'
  },
  {
    question: 'How do I reset my password?',
    answer: 'Click on the "Forgot Password" link on the login page and follow the instructions sent to your email.',
    category: 'account'
  },
  {
    question: 'What browsers are supported?',
    answer: 'We support all modern browsers including Chrome, Firefox, Safari, and Edge. Internet Explorer is not supported.',
    category: 'technical'
  },
  {
    question: 'How do I upgrade my plan?',
    answer: 'You can upgrade your plan from the billing section in your account settings. Changes take effect immediately.',
    category: 'billing'
  }
];

async function checkDatabaseConnection() {
  console.log('🔗 Testing Supabase connection...');
  
  try {
    const { data, error } = await supabase.from('customers').select('count').limit(1);
    
    if (error) {
      console.log('⚠️  Database tables may not exist yet.');
      console.log('Error:', error.message);
      return false;
    }
    
    console.log('✅ Successfully connected to Supabase database!');
    return true;
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
    return false;
  }
}

async function checkTables() {
  console.log('\n📋 Checking database tables...');
  
  const tables = [
    'customers',
    'support_tickets',
    'support_responses',
    'support_faqs',
    'email_logs',
    'contact_interactions',
    'user_registrations'
  ];
  
  const results = {};
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase.from(table).select('*').limit(1);
      if (error) {
        results[table] = { exists: false, error: error.message };
      } else {
        results[table] = { exists: true, recordCount: data.length };
      }
    } catch (err) {
      results[table] = { exists: false, error: err.message };
    }
  }
  
  console.log('\nTable Status:');
  for (const [table, status] of Object.entries(results)) {
    if (status.exists) {
      console.log(`  ✅ ${table} - Ready`);
    } else {
      console.log(`  ❌ ${table} - Missing (${status.error})`);
    }
  }
  
  return results;
}

async function seedDatabase() {
  console.log('\n🌱 Seeding database with sample data...');
  
  try {
    // Insert sample customers
    console.log('👥 Inserting sample customers...');
    const { data: customers, error: customerError } = await supabase
      .from('customers')
      .upsert(sampleCustomers, { onConflict: 'email' })
      .select();
    
    if (customerError) {
      console.error('❌ Error inserting customers:', customerError.message);
    } else {
      console.log(`✅ Inserted ${customers?.length || 0} customers`);
    }
    
    // Insert sample FAQs
    console.log('❓ Inserting sample FAQs...');
    const { data: faqs, error: faqError } = await supabase
      .from('support_faqs')
      .upsert(sampleFAQs, { onConflict: 'question' })
      .select();
    
    if (faqError) {
      console.error('❌ Error inserting FAQs:', faqError.message);
    } else {
      console.log(`✅ Inserted ${faqs?.length || 0} FAQs`);
    }
    
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
  }
}

async function createSampleTicket() {
  console.log('\n🎫 Creating a sample support ticket...');
  
  try {
    const sampleTicket = {
      customer_name: 'John Doe',
      customer_email: 'john@acme.com',
      company: 'Acme Corp',
      category: 'technical',
      severity: 'medium',
      subject: 'API Integration Help',
      description: 'I need help integrating your API with our system. Getting authentication errors.',
      status: 'open',
      priority: 3
    };
    
    const { data, error } = await supabase
      .from('support_tickets')
      .insert([sampleTicket])
      .select()
      .single();
    
    if (error) {
      console.error('❌ Error creating sample ticket:', error.message);
    } else {
      console.log(`✅ Created sample ticket: ${data.id}`);
      return data;
    }
  } catch (error) {
    console.error('❌ Error creating sample ticket:', error.message);
  }
}

async function testMCPInkyIntegration() {
  console.log('\n🤖 Testing MCP Inky integration...');
  
  const mcpEnabled = process.env.VITE_MCP_ENABLED === 'true';
  const mcpEndpoint = process.env.VITE_MCP_ENDPOINT;
  
  if (!mcpEnabled) {
    console.log('⚠️  MCP Inky is disabled in environment variables');
    return;
  }
  
  if (!mcpEndpoint) {
    console.log('⚠️  MCP endpoint not configured');
    return;
  }
  
  console.log(`🔗 MCP Endpoint: ${mcpEndpoint}`);
  console.log('✅ MCP Inky configuration found');
}

async function generateReport() {
  console.log('\n📊 Generating database report...');
  
  try {
    const [customers, tickets, faqs] = await Promise.all([
      supabase.from('customers').select('count').single(),
      supabase.from('support_tickets').select('count').single(),
      supabase.from('support_faqs').select('count').single()
    ]);
    
    console.log('\n📈 Database Statistics:');
    console.log(`  👥 Customers: ${customers.data?.count || 0}`);
    console.log(`  🎫 Support Tickets: ${tickets.data?.count || 0}`);
    console.log(`  ❓ FAQs: ${faqs.data?.count || 0}`);
    
  } catch (error) {
    console.error('❌ Error generating report:', error.message);
  }
}

async function main() {
  console.log('🚀 Ship_fix Supabase Database Initialization');
  console.log('================================================\n');
  
  // Step 1: Check connection
  const connected = await checkDatabaseConnection();
  if (!connected) {
    console.log('\n❌ Database connection failed. Please check your Supabase configuration.');
    console.log('\n📋 Next steps:');
    console.log('1. Verify your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env');
    console.log('2. Run the SQL schema in your Supabase dashboard');
    console.log('3. Run this script again');
    return;
  }
  
  // Step 2: Check tables
  const tableStatus = await checkTables();
  const allTablesExist = Object.values(tableStatus).every(status => status.exists);
  
  if (!allTablesExist) {
    console.log('\n❌ Some database tables are missing.');
    console.log('\n📋 Please run the SQL schema from supabase-schema.sql in your Supabase dashboard:');
    console.log('1. Go to https://supabase.com/dashboard/projects');
    console.log('2. Select your project');
    console.log('3. Go to SQL Editor');
    console.log('4. Copy and paste the contents of supabase-schema.sql');
    console.log('5. Run the script');
    console.log('6. Run this initialization script again');
    return;
  }
  
  // Step 3: Seed database
  await seedDatabase();
  
  // Step 4: Create sample ticket
  await createSampleTicket();
  
  // Step 5: Test MCP integration
  await testMCPInkyIntegration();
  
  // Step 6: Generate report
  await generateReport();
  
  console.log('\n🎉 Database initialization completed successfully!');
  console.log('\n✅ Your Ship_fix support system is ready to use!');
  console.log('\n🔗 Access your database at:', supabaseUrl.replace('https://', 'https://supabase.com/dashboard/project/').replace('.supabase.co', ''));
}

// Run the initialization
main().catch(console.error);
