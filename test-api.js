const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

console.log('🔍 Testing API endpoints...');
console.log('URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
console.log('Key:', supabaseKey ? '✅ Set (length: ' + supabaseKey.length + ')' : '❌ Missing');

if (!supabaseUrl || !supabaseKey) {
  console.log('❌ Missing credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testAPIs() {
  try {
    // Test 1: Products count
    console.log('\n📦 Test 1: Products count...');
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*');
    
    if (productsError) {
      console.log('❌ Products error:', productsError.message);
    } else {
      console.log('✅ Products found:', products?.length || 0);
      if (products && products.length > 0) {
        console.log('📝 Sample products:');
        products.slice(0, 3).forEach((product, index) => {
          console.log(`  ${index + 1}. ${product.title} - $${product.price}`);
        });
      }
    }

    // Test 2: Homepage products (same as app uses)
    console.log('\n🏠 Test 2: Homepage products query...');
    const { data: homepageProducts, error: homepageError } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(36);
    
    if (homepageError) {
      console.log('❌ Homepage products error:', homepageError.message);
    } else {
      console.log('✅ Homepage products found:', homepageProducts?.length || 0);
    }

    // Test 3: Categories
    console.log('\n📂 Test 3: Categories...');
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('*');
    
    if (categoriesError) {
      console.log('❌ Categories error:', categoriesError.message);
    } else {
      console.log('✅ Categories found:', categories?.length || 0);
    }

    // Test 4: Auth
    console.log('\n🔐 Test 4: Auth...');
    const { data: authData, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.log('❌ Auth error:', authError.message);
    } else {
      console.log('✅ Auth OK, user:', authData.user ? authData.user.email : 'None');
    }

  } catch (error) {
    console.log('❌ Unexpected error:', error.message);
  }
}

testAPIs();

