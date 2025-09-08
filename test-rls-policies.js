require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testRLSPolicies() {
  console.log('🔍 Testing RLS policies...');
  
  try {
    // Test 1: Check if we can read products as anonymous user
    console.log('\n📦 Test 1: Reading products as anonymous user...');
    const { data, error } = await supabase.from('products').select('*');
    
    if (error) {
      console.error('❌ RLS Error:', error);
      console.log('💡 This suggests RLS policies are blocking anonymous access');
      return;
    }
    
    console.log('✅ RLS policies allow anonymous read access');
    console.log('📊 Products found:', data?.length || 0);
    
    if (data && data.length > 0) {
      console.log('📝 Sample product:', data[0].name);
    }
    
    // Test 2: Check if we can read specific columns
    console.log('\n🔍 Test 2: Reading specific columns...');
    const { data: limitedData, error: limitedError } = await supabase
      .from('products')
      .select('id, name, price, category')
      .limit(5);
    
    if (limitedError) {
      console.error('❌ Limited query error:', limitedError);
    } else {
      console.log('✅ Limited query successful');
      console.log('📊 Limited products found:', limitedData?.length || 0);
    }
    
  } catch (err) {
    console.error('❌ Unexpected error:', err);
  }
}

testRLSPolicies();
