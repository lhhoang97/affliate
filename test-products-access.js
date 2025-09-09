require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testProductsAccess() {
  console.log('🔍 Testing products access...');
  
  try {
    // Test the exact same query as React app
    const { data, error } = await supabase.from('products').select('*');
    
    if (error) {
      console.error('❌ RLS Error:', error);
      console.log('💡 This means RLS policies are blocking access');
      console.log('📝 You need to run the SQL script in Supabase SQL Editor');
      return;
    }
    
    console.log('✅ RLS policies allow access');
    console.log('📊 Products found:', data?.length || 0);
    
    if (data && data.length > 0) {
      console.log('📝 Sample product:', data[0].name);
      console.log('🎉 Products should now display on the website!');
    } else {
      console.log('❌ No products found in database');
    }
    
  } catch (err) {
    console.error('❌ Unexpected error:', err);
  }
}

testProductsAccess();
