require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testHomepageProducts() {
  console.log('🔍 Testing homepage products query...');
  
  try {
    // Test the exact query from getHomepageProducts
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(36);
    
    if (error) {
      console.error('❌ Error:', error);
      return;
    }
    
    console.log('✅ Found', data?.length || 0, 'products');
    
    if (data && data.length > 0) {
      console.log('📝 Sample products:');
      data.slice(0, 3).forEach((product, index) => {
        console.log(`  ${index + 1}. ${product.name} - $${product.price}`);
      });
    } else {
      console.log('⚠️  No products found in database');
    }
    
  } catch (err) {
    console.error('❌ Unexpected error:', err);
  }
}

testHomepageProducts();
