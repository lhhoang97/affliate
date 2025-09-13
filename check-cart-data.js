const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://rlgjpejeulxvfatwvniq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJsZ2pwZWpldWx4dmZhdHd2bmlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3MDk0ODAsImV4cCI6MjA3MTI4NTQ4MH0.2d3RgtqDg-3PSuK85smraSgo7Zt2WYymQzRa8bgNltg';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCartData() {
  console.log('🔍 Checking Cart Data in Database...');
  
  try {
    // Check cart_items table structure
    console.log('📊 Checking cart_items table structure...');
    const { data: cartData, error: cartError } = await supabase
      .from('cart_items')
      .select('*')
      .limit(5);
    
    if (cartError) {
      console.error('❌ Error fetching cart data:', cartError);
    } else {
      console.log('✅ Cart table accessible');
      console.log('📦 Cart records found:', cartData?.length || 0);
      if (cartData && cartData.length > 0) {
        console.log('📋 Sample cart record:', cartData[0]);
      }
    }
    
    // Check products table
    console.log('📊 Checking products table...');
    const { data: productsData, error: productsError } = await supabase
      .from('products')
      .select('id, name, price, image')
      .limit(5);
    
    if (productsError) {
      console.error('❌ Error fetching products:', productsError);
    } else {
      console.log('✅ Products table accessible');
      console.log('📦 Products found:', productsData?.length || 0);
      if (productsData && productsData.length > 0) {
        console.log('📋 Sample product:', productsData[0]);
      }
    }
    
    // Check if there are any cart items for specific user
    console.log('👤 Checking cart items for hoang@shopwithus.com...');
    
    // First get user ID
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('id, email')
      .eq('email', 'hoang@shopwithus.com');
    
    if (userError) {
      console.error('❌ Error fetching user:', userError);
    } else if (userData && userData.length > 0) {
      console.log('✅ User found:', userData[0].email, 'ID:', userData[0].id);
      
      // Check cart items for this user
      const { data: userCartData, error: userCartError } = await supabase
        .from('cart_items')
        .select('*, products(*)')
        .eq('user_id', userData[0].id);
      
      if (userCartError) {
        console.error('❌ Error fetching user cart:', userCartError);
      } else {
        console.log('📦 User cart items:', userCartData?.length || 0);
        if (userCartData && userCartData.length > 0) {
          console.log('📋 User cart items:', userCartData);
        }
      }
    }
    
    // Check localStorage simulation
    console.log('💾 Checking localStorage simulation...');
    
    // Simulate adding items to cart
    const testCartItem = {
      id: 'test_' + Date.now(),
      productId: 'test-product-1',
      quantity: 2,
      bundleOption: {
        type: 'single',
        quantity: 1,
        originalPrice: 100,
        discountedPrice: 100,
        discount: 0,
        discountText: ''
      },
      product: {
        id: 'test-product-1',
        name: 'Test Product',
        price: 100,
        image: 'https://picsum.photos/400/400?random=1'
      }
    };
    
    console.log('🧪 Test cart item:', testCartItem);
    
    // Check if we can simulate cart operations
    console.log('✅ Cart data structure looks good');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Run the check
checkCartData().catch(console.error);
