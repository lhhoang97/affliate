const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase credentials missing!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testOrderService() {
  console.log('🧪 Testing Order Service...\n');

  try {
    // 1. Test orders table exists
    console.log('1. Testing orders table...');
    const { data: orders, error } = await supabase
      .from('orders')
      .select('count')
      .limit(1);

    if (error) {
      console.log('❌ Orders table error:', error.message);
      return;
    }
    console.log('✅ Orders table: OK');

    // 2. Test order_items table exists
    console.log('\n2. Testing order_items table...');
    const { data: orderItems, error: orderItemsError } = await supabase
      .from('order_items')
      .select('count')
      .limit(1);

    if (orderItemsError) {
      console.log('❌ Order items table error:', orderItemsError.message);
      return;
    }
    console.log('✅ Order items table: OK');

    // 3. Test table structure
    console.log('\n3. Testing table structures...');
    
    // Test orders structure
    const { data: orderSample, error: orderSampleError } = await supabase
      .from('orders')
      .select('*')
      .limit(1);

    if (orderSampleError) {
      console.log('❌ Cannot access orders table:', orderSampleError.message);
    } else {
      console.log('✅ Orders table structure: OK');
      if (orderSample && orderSample.length > 0) {
        console.log('   Sample columns:', Object.keys(orderSample[0]));
      }
    }

    // Test order_items structure
    const { data: itemSample, error: itemSampleError } = await supabase
      .from('order_items')
      .select('*')
      .limit(1);

    if (itemSampleError) {
      console.log('❌ Cannot access order_items table:', itemSampleError.message);
    } else {
      console.log('✅ Order items table structure: OK');
      if (itemSample && itemSample.length > 0) {
        console.log('   Sample columns:', Object.keys(itemSample[0]));
      }
    }

    // 4. Test foreign key relationships
    console.log('\n4. Testing foreign key relationships...');
    
    // Check if we can join orders with order_items
    const { data: joinTest, error: joinError } = await supabase
      .from('orders')
      .select(`
        *,
        order_items(*)
      `)
      .limit(1);

    if (joinError) {
      console.log('❌ Join test error:', joinError.message);
    } else {
      console.log('✅ Foreign key relationships: OK');
    }

    // 5. Test order statistics
    console.log('\n5. Testing order statistics...');
    const { data: statsData, error: statsError } = await supabase
      .from('orders')
      .select('status, total_amount');

    if (statsError) {
      console.log('❌ Order stats error:', statsError.message);
    } else {
      const stats = {
        totalOrders: statsData?.length || 0,
        pendingOrders: statsData?.filter(o => o.status === 'pending').length || 0,
        completedOrders: statsData?.filter(o => o.status === 'delivered').length || 0,
        totalRevenue: statsData?.reduce((sum, o) => sum + o.total_amount, 0) || 0
      };
      
      console.log('✅ Order statistics:', stats);
    }

    console.log('\n🎉 Order service test completed!');
    console.log('\n📝 Next steps:');
    console.log('1. Test order creation with authenticated user');
    console.log('2. Implement order UI components');
    console.log('3. Add order management to admin panel');

  } catch (error) {
    console.error('❌ Error during order service test:', error);
  }
}

// Run the test
testOrderService().catch(console.error);
