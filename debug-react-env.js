require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

console.log('🔍 Debugging React environment...');

// Check environment variables
console.log('REACT_APP_SUPABASE_URL:', process.env.REACT_APP_SUPABASE_URL ? 'Set' : 'Not set');
console.log('REACT_APP_SUPABASE_ANON_KEY:', process.env.REACT_APP_SUPABASE_ANON_KEY ? 'Set' : 'Not set');

if (!process.env.REACT_APP_SUPABASE_URL || !process.env.REACT_APP_SUPABASE_ANON_KEY) {
  console.error('❌ Missing environment variables!');
  process.exit(1);
}

// Test Supabase connection
const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

async function testConnection() {
  try {
    console.log('🔍 Testing Supabase connection...');
    
    // Test products query
    const { data, error } = await supabase.from('products').select('*').limit(5);
    
    if (error) {
      console.error('❌ Database error:', error);
      return;
    }
    
    console.log('✅ Database connection successful!');
    console.log('📦 Products found:', data?.length || 0);
    
    if (data && data.length > 0) {
      console.log('📝 Sample product:', data[0].name);
    }
    
  } catch (err) {
    console.error('❌ Connection error:', err);
  }
}

testConnection();
