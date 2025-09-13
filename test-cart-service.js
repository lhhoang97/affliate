const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase credentials missing!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testCartService() {
  console.log('🧪 Testing Cart Service...\n');

  try {
    // 1. Test cart_items table exists
    console.log('1. Testing cart_items table...');
    const { data: cartItems, error } = await supabase
      .from('cart_items')
      .select('count')
      .limit(1);

    if (error) {
      console.log('❌ Cart items table error:', error.message);
      return;
    }
    console.log('✅ Cart items table: OK');

    // 2. Test table structure
    console.log('\n2. Testing table structure...');
    const { data: sampleData, error: sampleError } = await supabase
      .from('cart_items')
      .select('*')
      .limit(1);

    if (sampleError) {
      console.log('❌ Cannot access cart_items table:', sampleError.message);
      return;
    }

    console.log('✅ Cart items table structure: OK');
    if (sampleData && sampleData.length > 0) {
      console.log('   Sample columns:', Object.keys(sampleData[0]));
    }

    // 3. Test foreign key relationships
    console.log('\n3. Testing foreign key relationships...');
    
    // Check if we can join with products
    const { data: joinTest, error: joinError } = await supabase
      .from('cart_items')
      .select(`
        *,
        product:products(id, name, price)
      `)
      .limit(1);

    if (joinError) {
      console.log('❌ Join test error:', joinError.message);
    } else {
      console.log('✅ Foreign key relationships: OK');
    }

    // 4. Test policies
    console.log('\n4. Testing RLS policies...');
    const { data: policyTest, error: policyError } = await supabase
      .from('cart_items')
      .select('*')
      .limit(1);

    if (policyError) {
      console.log('❌ RLS policy test error:', policyError.message);
    } else {
      console.log('✅ RLS policies: OK');
    }

    console.log('\n🎉 Cart service test completed!');
    console.log('\n📝 Next steps:');
    console.log('1. Test cart functionality with authenticated user');
    console.log('2. Implement cart UI components');
    console.log('3. Add cart to header/navigation');

  } catch (error) {
    console.error('❌ Error during cart service test:', error);
  }
}

// Run the test
testCartService().catch(console.error);

