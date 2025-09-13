const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

console.log('Testing product loading...');
console.log('URL:', supabaseUrl ? 'Set' : 'Missing');
console.log('Key:', supabaseKey ? 'Set' : 'Missing');

const supabase = createClient(supabaseUrl, supabaseKey);

async function testProductLoading() {
  try {
    console.log('\n1. Testing products table...');
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, name, price, category')
      .limit(5);
    
    if (productsError) {
      console.error('Products error:', productsError);
    } else {
      console.log('Products found:', products.length);
      console.log('Sample products:', products);
    }

    console.log('\n2. Testing fallback_products table...');
    const { data: fallback, error: fallbackError } = await supabase
      .from('fallback_products')
      .select('id, name, price, category')
      .limit(3);
    
    if (fallbackError) {
      console.error('Fallback error:', fallbackError);
    } else {
      console.log('Fallback products found:', fallback.length);
      console.log('Sample fallback:', fallback);
    }

    console.log('\n3. Testing full product query...');
    const { data: allProducts, error: allError } = await supabase
      .from('products')
      .select('*');
    
    if (allError) {
      console.error('All products error:', allError);
    } else {
      console.log('All products found:', allProducts.length);
      if (allProducts.length > 0) {
        console.log('First product details:', {
          id: allProducts[0].id,
          name: allProducts[0].name,
          price: allProducts[0].price,
          category: allProducts[0].category,
          image: allProducts[0].image
        });
      }
    }

  } catch (err) {
    console.error('Test failed:', err);
  }
}

testProductLoading();
