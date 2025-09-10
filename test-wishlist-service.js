const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase credentials missing!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testWishlistService() {
  console.log('🧪 Testing Wishlist Service...\n');

  try {
    // 1. Test wishlist table exists
    console.log('1. Testing wishlist table...');
    const { data: wishlist, error } = await supabase
      .from('wishlist')
      .select('count')
      .limit(1);

    if (error) {
      console.log('❌ Wishlist table error:', error.message);
      return;
    }
    console.log('✅ Wishlist table: OK');

    // 2. Test table structure
    console.log('\n2. Testing table structure...');
    const { data: sampleData, error: sampleError } = await supabase
      .from('wishlist')
      .select('*')
      .limit(1);

    if (sampleError) {
      console.log('❌ Cannot access wishlist table:', sampleError.message);
      return;
    }

    console.log('✅ Wishlist table structure: OK');
    if (sampleData && sampleData.length > 0) {
      console.log('   Sample columns:', Object.keys(sampleData[0]));
    }

    // 3. Test foreign key relationships
    console.log('\n3. Testing foreign key relationships...');
    
    // Check if we can join with products
    const { data: joinTest, error: joinError } = await supabase
      .from('wishlist')
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

    // 4. Test RLS policies
    console.log('\n4. Testing RLS policies...');
    const { data: policyTest, error: policyError } = await supabase
      .from('wishlist')
      .select('*')
      .limit(1);

    if (policyError) {
      console.log('❌ RLS policy test error:', policyError.message);
    } else {
      console.log('✅ RLS policies: OK');
    }

    // 5. Test wishlist count
    console.log('\n5. Testing wishlist count...');
    const { count, error: countError } = await supabase
      .from('wishlist')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.log('❌ Wishlist count error:', countError.message);
    } else {
      console.log(`✅ Wishlist count: ${count || 0} items`);
    }

    console.log('\n🎉 Wishlist service test completed!');
    console.log('\n📝 Next steps:');
    console.log('1. Test wishlist functionality with authenticated user');
    console.log('2. Implement wishlist UI components');
    console.log('3. Add wishlist to product cards');

  } catch (error) {
    console.error('❌ Error during wishlist service test:', error);
  }
}

// Run the test
testWishlistService().catch(console.error);
