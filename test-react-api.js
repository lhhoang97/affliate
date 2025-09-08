const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

console.log('🔍 Testing React API simulation...');
console.log('URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
console.log('Key:', supabaseKey ? '✅ Set (length: ' + supabaseKey.length + ')' : '❌ Missing');

if (!supabaseUrl || !supabaseKey) {
  console.log('❌ Missing credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Simulate the exact same query that React app uses
async function testReactQuery() {
  try {
    console.log('\n🏠 Testing homepage products query (same as React app)...');
    
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(36);
    
    if (error) {
      console.log('❌ Query error:', error.message);
      console.log('❌ Error details:', error);
    } else {
      console.log('✅ Query successful!');
      console.log('📊 Products found:', data?.length || 0);
      
      if (data && data.length > 0) {
        console.log('📝 Sample products:');
        data.slice(0, 3).forEach((product, index) => {
          console.log(`  ${index + 1}. ${product.title || product.name} - $${product.price}`);
        });
      } else {
        console.log('⚠️  No products found - this explains why React app shows loading!');
      }
    }
    
  } catch (err) {
    console.log('❌ Unexpected error:', err.message);
  }
}

testReactQuery();

