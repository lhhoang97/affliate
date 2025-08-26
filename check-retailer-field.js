const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkRetailerField() {
  try {
    console.log('🔍 Checking retailer field in products table...');
    
    // Get all products to check their structure
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .limit(5);
    
    if (error) {
      console.error('❌ Error fetching products:', error);
      return;
    }
    
    if (!data || data.length === 0) {
      console.log('⚠️  No products found in database');
      return;
    }
    
    console.log(`✅ Found ${data.length} products`);
    console.log('\n📋 Product structure:');
    
    // Check the first product's structure
    const firstProduct = data[0];
    console.log('First product fields:', Object.keys(firstProduct));
    
    console.log('\n🔍 Checking retailer field specifically:');
    data.forEach((product, index) => {
      console.log(`Product ${index + 1}:`);
      console.log(`  - ID: ${product.id}`);
      console.log(`  - Name: ${product.name}`);
      console.log(`  - Brand: ${product.brand}`);
      console.log(`  - Retailer: ${product.retailer || 'NULL/UNDEFINED'}`);
      console.log(`  - Has retailer field: ${'retailer' in product}`);
      console.log('');
    });
    
    // Check if we need to add retailer field
    const hasRetailerField = 'retailer' in firstProduct;
    
    if (!hasRetailerField) {
      console.log('❌ Retailer field is missing from database schema');
      console.log('💡 You need to add the retailer column to your products table');
      console.log('\nSQL command to add retailer field:');
      console.log('ALTER TABLE products ADD COLUMN retailer TEXT;');
    } else {
      console.log('✅ Retailer field exists in database schema');
      
      // Check how many products have retailer data
      const productsWithRetailer = data.filter(p => p.retailer && p.retailer !== null);
      console.log(`📊 Products with retailer data: ${productsWithRetailer.length}/${data.length}`);
      
      if (productsWithRetailer.length === 0) {
        console.log('⚠️  No products have retailer data yet');
        console.log('💡 You can add retailer data through the admin panel');
      }
    }
    
  } catch (err) {
    console.error('❌ Error:', err);
  }
}

checkRetailerField();
