const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

console.log('Testing Supabase connection...');
console.log('VITE_SUPABASE_URL:', process.env.VITE_SUPABASE_URL);
console.log('VITE_SUPABASE_ANON_KEY:', process.env.VITE_SUPABASE_ANON_KEY ? 'Set' : 'Not set');

if (!process.env.VITE_SUPABASE_URL || !process.env.VITE_SUPABASE_ANON_KEY) {
  console.error('❌ Missing Supabase credentials in .env file');
  console.log('Please update .env with:');
  console.log('VITE_SUPABASE_URL=https://your-project-id.supabase.co');
  console.log('VITE_SUPABASE_ANON_KEY=your-anon-key');
  process.exit(1);
}

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function testConnection() {
  try {
    console.log('\n1. Testing basic connection...');
    const { data, error } = await supabase.from('products').select('count').limit(1);
    
    if (error) {
      console.error('❌ Connection failed:', error.message);
      return;
    }
    
    console.log('✅ Supabase connection successful!');
    
    console.log('\n2. Testing products table...');
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, name, price')
      .limit(3);
    
    if (productsError) {
      console.error('❌ Products table error:', productsError.message);
      return;
    }
    
    console.log(`✅ Found ${products.length} products:`);
    products.forEach(p => console.log(`   - ${p.name}: $${p.price}`));
    
    console.log('\n3. Testing bundle_deals table...');
    const { data: deals, error: dealsError } = await supabase
      .from('bundle_deals')
      .select('count');
    
    if (dealsError) {
      console.log('⚠️  Bundle deals table not found, will create it...');
      return;
    }
    
    console.log('✅ Bundle deals table exists');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testConnection();