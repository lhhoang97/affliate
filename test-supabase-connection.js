const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

console.log('🔧 Supabase Connection Test');
console.log('==========================\n');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase chưa được cấu hình!');
  console.log('📝 Vui lòng tạo file .env với:');
  console.log('REACT_APP_SUPABASE_URL=your_supabase_url');
  console.log('REACT_APP_SUPABASE_ANON_KEY=your_anon_key');
  process.exit(1);
}

console.log('✅ Environment variables đã được cấu hình');
console.log(`🌐 URL: ${supabaseUrl}`);
console.log(`🔑 Key: ${supabaseAnonKey.substring(0, 20)}...\n`);

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  try {
    console.log('🔍 Đang test kết nối...');
    
    // Test basic connection
    const { data, error } = await supabase.from('products').select('count').limit(1);
    
    if (error) {
      console.error('❌ Lỗi kết nối:', error.message);
      
      if (error.message.includes('relation "products" does not exist')) {
        console.log('\n📋 Bảng products chưa tồn tại!');
        console.log('🔧 Vui lòng chạy SQL script để tạo bảng:');
        console.log('1. Vào Supabase Dashboard → SQL Editor');
        console.log('2. Copy và chạy nội dung từ file SUPABASE_SETUP.sql');
        console.log('3. Chạy lại script này');
      }
      
      return false;
    }
    
    console.log('✅ Kết nối thành công!');
    console.log('📊 Database đã sẵn sàng sử dụng');
    
    // Test tables
    await testTables();
    
    return true;
    
  } catch (error) {
    console.error('❌ Lỗi không mong đợi:', error);
    return false;
  }
}

async function testTables() {
  console.log('\n📋 Kiểm tra các bảng...');
  
  const tables = ['products', 'categories', 'profiles', 'reviews', 'orders', 'wishlist'];
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase.from(table).select('count').limit(1);
      
      if (error) {
        console.log(`❌ ${table}: ${error.message}`);
      } else {
        console.log(`✅ ${table}: OK`);
      }
    } catch (error) {
      console.log(`❌ ${table}: ${error.message}`);
    }
  }
}

async function testDataInsertion() {
  console.log('\n🧪 Test thêm dữ liệu...');
  
  try {
    // Test insert a sample product
    const testProduct = {
      name: 'Test Product',
      description: 'This is a test product',
      price: 99.99,
      category: 'Electronics',
      brand: 'Test Brand',
      retailer: 'Test Store',
      in_stock: true
    };
    
    const { data, error } = await supabase
      .from('products')
      .insert(testProduct)
      .select();
    
    if (error) {
      console.error('❌ Lỗi khi thêm sản phẩm:', error.message);
      return false;
    }
    
    console.log('✅ Thêm sản phẩm thành công!');
    
    // Clean up - delete test product
    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .eq('name', 'Test Product');
    
    if (deleteError) {
      console.warn('⚠️ Không thể xóa sản phẩm test:', deleteError.message);
    } else {
      console.log('🧹 Đã xóa sản phẩm test');
    }
    
    return true;
    
  } catch (error) {
    console.error('❌ Lỗi khi test thêm dữ liệu:', error);
    return false;
  }
}

async function main() {
  const connectionOk = await testConnection();
  
  if (connectionOk) {
    await testDataInsertion();
    
    console.log('\n🎉 Tất cả test đã hoàn thành!');
    console.log('🚀 Website đã sẵn sàng sử dụng Supabase');
    console.log('\n📝 Bước tiếp theo:');
    console.log('1. Chạy: node migrate-to-supabase.js');
    console.log('2. Restart development server: npm start');
    console.log('3. Test website tại: http://localhost:3000');
  } else {
    console.log('\n❌ Cần khắc phục lỗi trước khi tiếp tục');
  }
}

main().catch(console.error);
