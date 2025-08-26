const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Thiếu thông tin Supabase!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSectionProducts() {
  console.log('🎯 KIỂM TRA BẢNG SECTION_PRODUCTS\n');
  
  try {
    // 1. Kiểm tra bảng section_products có tồn tại không
    console.log('1️⃣ Kiểm tra bảng section_products...');
    
    const { data: tableCheck, error: tableError } = await supabase
      .from('section_products')
      .select('count')
      .limit(1);
    
    if (tableError) {
      console.log('❌ Bảng section_products chưa tồn tại');
      console.log('💡 Vui lòng chạy SQL trong Supabase SQL Editor:');
      console.log('   - Mở file SIMPLE_SETUP_SECTION_PRODUCTS.sql');
      console.log('   - Copy và paste vào Supabase SQL Editor');
      console.log('   - Chạy từng phần một');
      return;
    }
    
    console.log('✅ Bảng section_products đã tồn tại\n');
    
    // 2. Kiểm tra dữ liệu trong bảng
    console.log('2️⃣ Kiểm tra dữ liệu...');
    
    const { data: sectionData, error: dataError } = await supabase
      .from('section_products')
      .select(`
        *,
        product:products(name, category, price, rating)
      `)
      .order('section, position');
    
    if (dataError) {
      console.error('❌ Lỗi load dữ liệu:', dataError.message);
      return;
    }
    
    console.log(`✅ Tìm thấy ${sectionData.length} bản ghi trong section_products\n`);
    
    // 3. Phân tích dữ liệu theo section
    console.log('3️⃣ Phân tích dữ liệu theo section...');
    
    const grouped = {
      just_for_you: sectionData.filter(s => s.section === 'just_for_you'),
      hot_deals: sectionData.filter(s => s.section === 'hot_deals'),
      trending_deals: sectionData.filter(s => s.section === 'trending_deals')
    };
    
    Object.entries(grouped).forEach(([section, items]) => {
      const sectionName = section.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
      console.log(`\n📋 ${sectionName}:`);
      if (items.length === 0) {
        console.log('   ❌ Chưa có sản phẩm nào');
      } else {
        items.forEach(item => {
          console.log(`   ${item.position}. ${item.product?.name || 'N/A'} ($${item.product?.price || 'N/A'})`);
        });
      }
    });
    
    // 4. Kiểm tra HomePage có load được không
    console.log('\n4️⃣ Kiểm tra HomePage...');
    
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .limit(5);
    
    if (productsError) {
      console.error('❌ Lỗi load products:', productsError.message);
    } else {
      console.log(`✅ Products table: ${products.length} sản phẩm có sẵn`);
    }
    
    // 5. Kết quả cuối cùng
    console.log('\n🎉 KẾT QUẢ KIỂM TRA:');
    console.log('=====================================');
    
    const totalItems = sectionData.length;
    const activeItems = sectionData.filter(s => s.is_active).length;
    
    if (totalItems > 0) {
      console.log('✅ Bảng section_products đã được tạo thành công!');
      console.log(`✅ Tổng số bản ghi: ${totalItems}`);
      console.log(`✅ Bản ghi active: ${activeItems}`);
      console.log('✅ Section Management page đã sẵn sàng');
      
      console.log('\n🚀 HƯỚNG DẪN TIẾP THEO:');
      console.log('1. Truy cập http://localhost:3000/admin/section-management');
      console.log('2. Đăng nhập với tài khoản admin');
      console.log('3. Quản lý sản phẩm trong các section');
      console.log('4. Thêm/sửa/xóa sản phẩm');
      console.log('5. Điều chỉnh vị trí hiển thị');
      
    } else {
      console.log('⚠️  Bảng đã tạo nhưng chưa có dữ liệu');
      console.log('💡 Vui lòng chạy phần INSERT trong SQL Editor');
    }
    
  } catch (error) {
    console.error('❌ Lỗi:', error.message);
  }
}

checkSectionProducts();
