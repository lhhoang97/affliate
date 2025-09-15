const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = 'https://rlgjpejeulxvfatwvniq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJsZ2pwZWpldWx4dmZhdHd2bmlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3MDk0ODAsImV4cCI6MjA3MTI4NTQ4MH0.2d3RgtqDg-3PSuK85smraSgo7Zt2WYymQzRa8bgNltg';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testBundleDeals() {
  try {
    console.log('Testing Bundle Deals System...\n');

    // 1. Test creating bundle deals table
    console.log('1. Creating bundle deals table...');
    const fs = require('fs');
    const sql = fs.readFileSync('CREATE_BUNDLE_DEALS_TABLE.sql', 'utf8');
    
    const { data: createResult, error: createError } = await supabase.rpc('exec_sql', { 
      sql_query: sql 
    });
    
    if (createError) {
      console.log('Table might already exist or error:', createError.message);
    } else {
      console.log('✅ Bundle deals table created successfully');
    }

    // 2. Test fetching products
    console.log('\n2. Fetching products...');
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, name, price')
      .limit(5);

    if (productsError) {
      console.error('❌ Error fetching products:', productsError);
      return;
    }

    console.log(`✅ Found ${products.length} products`);
    products.forEach(product => {
      console.log(`   - ${product.name}: $${product.price}`);
    });

    // 3. Test creating bundle deals
    console.log('\n3. Creating test bundle deals...');
    if (products.length > 0) {
      const testDeals = [
        {
          product_id: products[0].id,
          bundle_type: 'get2',
          discount_percentage: 20.00,
          is_active: true
        },
        {
          product_id: products[0].id,
          bundle_type: 'get3',
          discount_percentage: 30.00,
          is_active: true
        }
      ];

      const { data: dealsData, error: dealsError } = await supabase
        .from('bundle_deals')
        .insert(testDeals)
        .select();

      if (dealsError) {
        console.log('❌ Error creating deals:', dealsError.message);
      } else {
        console.log('✅ Created test bundle deals:', dealsData.length);
      }
    }

    // 4. Test fetching bundle deals
    console.log('\n4. Fetching bundle deals...');
    const { data: bundleDeals, error: bundleError } = await supabase
      .from('bundle_deals')
      .select(`
        *,
        products (
          id,
          name,
          price
        )
      `)
      .eq('is_active', true);

    if (bundleError) {
      console.error('❌ Error fetching bundle deals:', bundleError);
    } else {
      console.log(`✅ Found ${bundleDeals.length} active bundle deals`);
      bundleDeals.forEach(deal => {
        const product = deal.products;
        console.log(`   - ${product?.name}: ${deal.bundle_type} - ${deal.discount_percentage}% off`);
      });
    }

    // 5. Test bundle calculation
    console.log('\n5. Testing bundle calculation...');
    if (products.length > 0 && bundleDeals.length > 0) {
      const product = products[0];
      const productDeals = bundleDeals.filter(deal => deal.product_id === product.id);
      
      console.log(`Testing with product: ${product.name} ($${product.price})`);
      
      productDeals.forEach(deal => {
        const requiredQuantity = parseInt(deal.bundle_type.replace('get', ''));
        const originalPrice = product.price * requiredQuantity;
        const discountAmount = (originalPrice * deal.discount_percentage) / 100;
        const finalPrice = originalPrice - discountAmount;
        
        console.log(`   ${deal.bundle_type.toUpperCase()}: $${originalPrice} - ${deal.discount_percentage}% = $${finalPrice} (Save $${discountAmount})`);
      });
    }

    console.log('\n✅ Bundle Deals System Test Completed!');
    console.log('\nNext steps:');
    console.log('1. Go to /admin/bundle-deals to manage bundle deals');
    console.log('2. Add products to cart to see bundle deals in action');
    console.log('3. Test different quantities to trigger different bundle deals');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testBundleDeals();

