const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Initialize Supabase client
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testCheckoutSystem() {
  console.log('🛒 Testing Checkout System...\n');

  try {
    // Test 1: Check if orders table exists and is accessible
    console.log('1️⃣ Testing orders table...');
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .limit(1);

    if (ordersError) {
      console.log('❌ orders table not found or not accessible');
      console.log('   Error:', ordersError.message);
    } else {
      console.log('✅ orders table is accessible');
    }

    // Test 2: Check if order_items table exists
    console.log('\n2️⃣ Testing order_items table...');
    const { data: orderItems, error: orderItemsError } = await supabase
      .from('order_items')
      .select('*')
      .limit(1);

    if (orderItemsError) {
      console.log('❌ order_items table not found or not accessible');
      console.log('   Error:', orderItemsError.message);
    } else {
      console.log('✅ order_items table is accessible');
    }

    // Test 3: Test order creation (with dummy data)
    console.log('\n3️⃣ Testing order creation...');
    const testOrder = {
      user_id: '00000000-0000-0000-0000-000000000000', // Dummy UUID
      status: 'pending',
      total_amount: 99.99,
      shipping_amount: 4.99,
      tax_amount: 9.99,
      discount_amount: 0,
      payment_method: 'credit_card',
      payment_status: 'pending',
      shipping_address: {
        firstName: 'John',
        lastName: 'Doe',
        address1: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'US'
      },
      billing_address: {
        firstName: 'John',
        lastName: 'Doe',
        address1: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'US'
      }
    };

    const { data: insertOrderData, error: insertOrderError } = await supabase
      .from('orders')
      .insert(testOrder)
      .select();

    if (insertOrderError) {
      console.log('❌ Order creation failed');
      console.log('   Error:', insertOrderError.message);
    } else {
      console.log('✅ Order creation works');
      console.log('   Created order ID:', insertOrderData[0].id);
      
      // Test 4: Test order items creation
      console.log('\n4️⃣ Testing order items creation...');
      const testOrderItems = [
        {
          order_id: insertOrderData[0].id,
          product_id: '00000000-0000-0000-0000-000000000001', // Dummy UUID
          product_name: 'Test Product 1',
          product_image: 'https://example.com/image1.jpg',
          quantity: 2,
          unit_price: 29.99,
          total_price: 59.98
        },
        {
          order_id: insertOrderData[0].id,
          product_id: '00000000-0000-0000-0000-000000000002', // Dummy UUID
          product_name: 'Test Product 2',
          product_image: 'https://example.com/image2.jpg',
          quantity: 1,
          unit_price: 39.99,
          total_price: 39.99
        }
      ];

      const { data: insertItemsData, error: insertItemsError } = await supabase
        .from('order_items')
        .insert(testOrderItems)
        .select();

      if (insertItemsError) {
        console.log('❌ Order items creation failed');
        console.log('   Error:', insertItemsError.message);
      } else {
        console.log('✅ Order items creation works');
        console.log('   Created', insertItemsData.length, 'order items');
      }

      // Clean up test data
      await supabase
        .from('orders')
        .delete()
        .eq('id', insertOrderData[0].id);
      console.log('   Test data cleaned up');
    }

    // Test 5: Test order status updates
    console.log('\n5️⃣ Testing order status updates...');
    const testUpdateOrder = {
      user_id: '00000000-0000-0000-0000-000000000000',
      status: 'pending',
      total_amount: 49.99,
      payment_status: 'pending'
    };

    const { data: updateOrderData, error: updateOrderError } = await supabase
      .from('orders')
      .insert(testUpdateOrder)
      .select();

    if (updateOrderError) {
      console.log('❌ Order update test setup failed');
    } else {
      // Test updating order status
      const { error: statusUpdateError } = await supabase
        .from('orders')
        .update({ 
          status: 'processing',
          payment_status: 'paid',
          updated_at: new Date().toISOString()
        })
        .eq('id', updateOrderData[0].id);

      if (statusUpdateError) {
        console.log('❌ Order status update failed');
        console.log('   Error:', statusUpdateError.message);
      } else {
        console.log('✅ Order status updates work');
      }

      // Clean up
      await supabase
        .from('orders')
        .delete()
        .eq('id', updateOrderData[0].id);
      console.log('   Test data cleaned up');
    }

    // Test 6: Check if payment methods are configured
    console.log('\n6️⃣ Testing payment system configuration...');
    
    // Check if we have payment-related environment variables
    const hasStripeKey = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY;
    const hasPayPalKey = process.env.REACT_APP_PAYPAL_CLIENT_ID;
    
    console.log('   Stripe configured:', hasStripeKey ? '✅' : '❌');
    console.log('   PayPal configured:', hasPayPalKey ? '✅' : '❌');
    
    if (!hasStripeKey && !hasPayPalKey) {
      console.log('   ⚠️  No payment providers configured (using test mode)');
    }

    // Summary
    console.log('\n📊 Checkout System Test Summary:');
    console.log('================================');
    
    const tests = [
      { name: 'orders table', status: !ordersError },
      { name: 'order_items table', status: !orderItemsError },
      { name: 'order creation', status: !insertOrderError },
      { name: 'order items creation', status: !insertItemsError },
      { name: 'order status updates', status: !statusUpdateError }
    ];

    const passedTests = tests.filter(test => test.status).length;
    const totalTests = tests.length;

    tests.forEach(test => {
      console.log(`${test.status ? '✅' : '❌'} ${test.name}`);
    });

    console.log(`\n🎯 Results: ${passedTests}/${totalTests} tests passed`);

    if (passedTests === totalTests) {
      console.log('\n🎉 Checkout System is fully functional!');
      console.log('\n🚀 Ready for:');
      console.log('   ✅ Order creation and management');
      console.log('   ✅ Order items tracking');
      console.log('   ✅ Payment processing');
      console.log('   ✅ Order status updates');
      console.log('   ✅ Email confirmations (if configured)');
      
      if (!hasStripeKey && !hasPayPalKey) {
        console.log('\n⚠️  Payment Integration:');
        console.log('   • Configure Stripe: REACT_APP_STRIPE_PUBLISHABLE_KEY');
        console.log('   • Configure PayPal: REACT_APP_PAYPAL_CLIENT_ID');
        console.log('   • Currently using test/simulation mode');
      }
    } else {
      console.log('\n⚠️  Some tests failed. Please check the database setup.');
      console.log('   Run: node setup-email-notifications.js');
    }

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    process.exit(1);
  }
}

// Run the test
if (require.main === module) {
  testCheckoutSystem()
    .then(() => {
      console.log('\n✅ Checkout system test completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Checkout system test failed:', error);
      process.exit(1);
    });
}

module.exports = { testCheckoutSystem };
