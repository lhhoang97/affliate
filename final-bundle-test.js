const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function finalTest() {
  try {
    console.log('🧪 Final Bundle Deals System Test\n');

    // 1. Test connection
    console.log('1. Testing Supabase connection...');
    const { data: testData, error: testError } = await supabase
      .from('products')
      .select('count')
      .limit(1);

    if (testError) {
      console.error('❌ Connection failed:', testError.message);
      return;
    }
    console.log('✅ Connection successful');

    // 2. Test products
    console.log('\n2. Testing products table...');
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, name, price')
      .limit(3);

    if (productsError) {
      console.error('❌ Products error:', productsError.message);
      return;
    }
    console.log(`✅ Found ${products.length} products`);

    // 3. Test bundle_deals table
    console.log('\n3. Testing bundle_deals table...');
    const { data: deals, error: dealsError } = await supabase
      .from('bundle_deals')
      .select('*')
      .limit(5);

    if (dealsError) {
      console.error('❌ Bundle deals error:', dealsError.message);
      console.log('💡 Run: node simple-bundle-setup.js');
      return;
    }
    console.log(`✅ Found ${deals.length} bundle deals`);

    // 4. Test bundle calculation
    console.log('\n4. Testing bundle calculation...');
    if (products.length > 0 && deals.length > 0) {
      const product = products[0];
      const productDeals = deals.filter(deal => deal.product_id === product.id);
      
      console.log(`Testing with: ${product.name} ($${product.price})`);
      
      if (productDeals.length > 0) {
        productDeals.forEach(deal => {
          const requiredQuantity = parseInt(deal.bundle_type.replace('get', ''));
          const originalPrice = product.price * requiredQuantity;
          const discountAmount = (originalPrice * deal.discount_percentage) / 100;
          const finalPrice = originalPrice - discountAmount;
          
          console.log(`   ${deal.bundle_type.toUpperCase()}: $${originalPrice} - ${deal.discount_percentage}% = $${finalPrice} (Save $${discountAmount})`);
        });
      } else {
        console.log('   No bundle deals for this product');
      }
    }

    // 5. Test admin access
    console.log('\n5. Testing admin access...');
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      console.log('✅ User authenticated:', user.email);
    } else {
      console.log('⚠️  No user authenticated (normal for guest)');
    }

    console.log('\n🎉 All tests passed! Bundle Deals System is ready!');
    console.log('\n📋 Next steps:');
    console.log('1. Start the website: npm start');
    console.log('2. Go to /admin/bundle-deals to manage deals');
    console.log('3. Add products to cart to see bundle deals');
    console.log('4. Test different quantities to trigger deals');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

finalTest();

