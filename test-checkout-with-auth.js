const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://rlgjpejeulxvfatwvniq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJsZ2pwZWpldWx4dmZhdHd2bmlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3MDk0ODAsImV4cCI6MjA3MTI4NTQ4MH0.2d3RgtqDg-3PSuK85smraSgo7Zt2WYymQzRa8bgNltg';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testCheckoutWithAuth() {
  try {
    console.log('🛒 Testing Checkout System with Authentication...\n');
    
    // Step 1: Login as hoang user
    console.log('1. Logging in as hoang user...');
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'hoang@shopwithus.com',
      password: 'hoang123@'
    });
    
    if (authError) {
      console.error('❌ Login failed:', authError.message);
      return;
    }
    
    console.log('✅ Login successful!');
    console.log('🆔 User ID:', authData.user.id);
    
    // Step 2: Test order creation
    console.log('\n2. Testing order creation...');
    const testOrder = {
      user_id: authData.user.id,
      status: 'pending',
      total: 99.99,
      items: [
        {
          product_id: '62762597-9f72-44ca-89c6-15808e5b570a',
          product_name: 'Samsung Galaxy S21',
          quantity: 1,
          price: 799.00
        }
      ],
      shipping_amount: 4.99,
      tax_amount: 9.99,
      discount_amount: 0,
      payment_method: 'credit_card',
      payment_status: 'pending',
      shipping_address: {
        firstName: 'Hoang',
        lastName: 'Admin',
        address1: '123 Test St',
        city: 'Ho Chi Minh',
        state: 'HCM',
        zipCode: '70000',
        country: 'VN'
      },
      billing_address: {
        firstName: 'Hoang',
        lastName: 'Admin',
        address1: '123 Test St',
        city: 'Ho Chi Minh',
        state: 'HCM',
        zipCode: '70000',
        country: 'VN'
      }
    };

    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert(testOrder)
      .select();

    if (orderError) {
      console.error('❌ Order creation failed:', orderError.message);
    } else {
      console.log('✅ Order creation successful!');
      console.log('📦 Created order ID:', orderData[0].id);
      
      // Step 3: Test order items creation
      console.log('\n3. Testing order items creation...');
      const testOrderItems = [
        {
          order_id: orderData[0].id,
          product_id: '62762597-9f72-44ca-89c6-15808e5b570a', // Samsung Galaxy S21
          product_name: 'Samsung Galaxy S21',
          product_image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400',
          quantity: 1,
          unit_price: 799.00,
          total_price: 799.00
        }
      ];

      const { data: itemsData, error: itemsError } = await supabase
        .from('order_items')
        .insert(testOrderItems)
        .select();

      if (itemsError) {
        console.error('❌ Order items creation failed:', itemsError.message);
      } else {
        console.log('✅ Order items creation successful!');
        console.log('📦 Created', itemsData.length, 'order items');
      }
      
      // Step 4: Test order status update
      console.log('\n4. Testing order status update...');
      const { error: updateError } = await supabase
        .from('orders')
        .update({ 
          status: 'processing',
          payment_status: 'paid',
          updated_at: new Date().toISOString()
        })
        .eq('id', orderData[0].id);

      if (updateError) {
        console.error('❌ Order status update failed:', updateError.message);
      } else {
        console.log('✅ Order status update successful!');
      }
      
      // Step 5: Test reading orders
      console.log('\n5. Testing orders read...');
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', authData.user.id);

      if (ordersError) {
        console.error('❌ Orders read failed:', ordersError.message);
      } else {
        console.log('✅ Orders read successful!');
        console.log('📊 Found', ordersData.length, 'orders');
      }
      
      // Clean up test data
      console.log('\n6. Cleaning up test data...');
      await supabase
        .from('orders')
        .delete()
        .eq('id', orderData[0].id);
      console.log('✅ Test data cleaned up');
    }
    
    console.log('\n🎉 Checkout System Test with Authentication Completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testCheckoutWithAuth();
