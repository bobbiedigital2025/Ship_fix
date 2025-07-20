import { supabase } from './src/lib/supabase.js';

console.log('🔗 Testing Supabase connection...');

async function testConnection() {
  try {
    const { data, error } = await supabase.from('customers').select('count').limit(1);
    
    if (error) {
      console.log('⚠️  Database tables may not exist yet.');
      console.log('Error:', error.message);
      console.log('\n📋 Next steps:');
      console.log('1. Go to your Supabase dashboard');
      console.log('2. Run the SQL schema from supabase-schema.sql');
      console.log('3. Test again');
    } else {
      console.log('✅ Successfully connected to Supabase database!');
      console.log('📊 Database is ready to use.');
    }
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
  }
}

testConnection();
