import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://exwngratmprvuqnibtey.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4d25ncmF0bXBydnVxbmlidGV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3NDU1NDYsImV4cCI6MjA2NDMyMTU0Nn0.6CS11twsK4RMYEKnc25M_TaLLSDNE-bknXR-40WJx6M'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  try {
    console.log('🔗 Testing Supabase connection...')
    
    // Test basic connection
    const { data, error } = await supabase
      .from('customers')
      .select('name, email, company')
      .limit(3)
    
    if (error) {
      console.error('❌ Connection error:', error.message)
      return
    }
    
    console.log('✅ Connection successful!')
    console.log('📊 Sample customers:', data)
    
    // Test inserting a test record
    const { data: insertData, error: insertError } = await supabase
      .from('customers')
      .insert([
        { name: 'Connection Test', email: 'test-connection@example.com', company: 'Test Co' }
      ])
      .select()
    
    if (insertError) {
      console.log('⚠️ Insert test failed:', insertError.message)
    } else {
      console.log('✅ Insert test successful:', insertData)
    }
    
  } catch (err) {
    console.error('❌ Unexpected error:', err)
  }
}

testConnection()
