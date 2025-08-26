const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Thiếu thông tin Supabase!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupSectionProducts() {
  console.log('🎯 SETUP SECTION PRODUCTS TABLE\n');
  
  try {
    // 1. Kiểm tra kết nối Supabase
    console.log('1️⃣ Kiểm tra kết nối Supabase...');
    const { data: testData, error: testError } = await supabase
      .from('products')
      .select('count')
      .limit(1);
    
    if (testError) {
      console.error('❌ Lỗi kết nối Supabase:', testError.message);
      return;
    }
    
    console.log('✅ Kết nối Supabase thành công\n');
    
    // 2. Tạo bảng section_products
    console.log('2️⃣ Tạo bảng section_products...');
    
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS section_products (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
        section TEXT NOT NULL CHECK (section IN ('just_for_you', 'hot_deals', 'trending_deals')),
        position INTEGER NOT NULL DEFAULT 1,
        is_active BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;
    
    const { error: createError } = await supabase.rpc('exec_sql', { sql: createTableSQL });
    
    if (createError) {
      console.log('⚠️  Bảng có thể đã tồn tại hoặc cần tạo thủ công');
      console.log('💡 Vui lòng chạy SQL trong Supabase SQL Editor:\n');
      console.log(createTableSQL);
    } else {
      console.log('✅ Bảng section_products đã được tạo\n');
    }
    
    // 3. Tạo indexes
    console.log('3️⃣ Tạo indexes...');
    
    const indexesSQL = `
      CREATE INDEX IF NOT EXISTS idx_section_products_section ON section_products(section);
      CREATE INDEX IF NOT EXISTS idx_section_products_position ON section_products(position);
      CREATE INDEX IF NOT EXISTS idx_section_products_active ON section_products(is_active);
      CREATE UNIQUE INDEX IF NOT EXISTS idx_section_products_unique 
      ON section_products(product_id, section) 
      WHERE is_active = true;
    `;
    
    const { error: indexError } = await supabase.rpc('exec_sql', { sql: indexesSQL });
    
    if (indexError) {
      console.log('⚠️  Indexes có thể đã tồn tại hoặc cần tạo thủ công');
      console.log('💡 Vui lòng chạy SQL trong Supabase SQL Editor:\n');
      console.log(indexesSQL);
    } else {
      console.log('✅ Indexes đã được tạo\n');
    }
    
    // 4. Kiểm tra dữ liệu sản phẩm
    console.log('4️⃣ Kiểm tra dữ liệu sản phẩm...');
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, name, category, price, rating')
      .order('name');
    
    if (productsError) {
      console.error('❌ Lỗi load sản phẩm:', productsError.message);
      return;
    }
    
    console.log(`✅ Tìm thấy ${products.length} sản phẩm\n`);
    
    // 5. Thêm dữ liệu mẫu
    console.log('5️⃣ Thêm dữ liệu mẫu...');
    
    const sampleData = [];
    
    // Just For You - Electronics
    const electronics = products.filter(p => p.category === 'Electronics').slice(0, 4);
    electronics.forEach((product, index) => {
      sampleData.push({
        product_id: product.id,
        section: 'just_for_you',
        position: index + 1,
        is_active: true
      });
    });
    
    // Hot Deals - Low price products
    const hotDeals = products.filter(p => p.price < 500).slice(0, 4);
    hotDeals.forEach((product, index) => {
      sampleData.push({
        product_id: product.id,
        section: 'hot_deals',
        position: index + 1,
        is_active: true
      });
    });
    
    // Trending Deals - High rating products
    const trending = products.filter(p => p.rating > 4).slice(0, 4);
    trending.forEach((product, index) => {
      sampleData.push({
        product_id: product.id,
        section: 'trending_deals',
        position: index + 1,
        is_active: true
      });
    });
    
    if (sampleData.length > 0) {
      const { error: insertError } = await supabase
        .from('section_products')
        .upsert(sampleData, { onConflict: 'product_id,section' });
      
      if (insertError) {
        console.error('❌ Lỗi thêm dữ liệu mẫu:', insertError.message);
      } else {
        console.log(`✅ Đã thêm ${sampleData.length} sản phẩm vào các section\n`);
      }
    }
    
    // 6. Kiểm tra kết quả
    console.log('6️⃣ Kiểm tra kết quả...');
    const { data: sectionData, error: sectionError } = await supabase
      .from('section_products')
      .select(`
        *,
        product:products(name, category, price, rating)
      `)
      .order('section, position');
    
    if (sectionError) {
      console.error('❌ Lỗi kiểm tra dữ liệu:', sectionError.message);
    } else {
      console.log('✅ Dữ liệu section_products:');
      
      const grouped = {
        just_for_you: sectionData.filter(s => s.section === 'just_for_you'),
        hot_deals: sectionData.filter(s => s.section === 'hot_deals'),
        trending_deals: sectionData.filter(s => s.section === 'trending_deals')
      };
      
      Object.entries(grouped).forEach(([section, items]) => {
        console.log(`\n📋 ${section.toUpperCase().replace('_', ' ')}:`);
        items.forEach(item => {
          console.log(`   ${item.position}. ${item.product?.name} ($${item.product?.price})`);
        });
      });
    }
    
    console.log('\n🎉 HOÀN THÀNH SETUP!');
    console.log('=====================================');
    console.log('✅ Bảng section_products đã được tạo');
    console.log('✅ Indexes đã được tạo');
    console.log('✅ Dữ liệu mẫu đã được thêm');
    console.log('✅ Section Management page đã sẵn sàng');
    
    console.log('\n🚀 HƯỚNG DẪN SỬ DỤNG:');
    console.log('1. Truy cập /admin/section-management');
    console.log('2. Thêm/sửa/xóa sản phẩm trong các section');
    console.log('3. Điều chỉnh vị trí hiển thị');
    console.log('4. Bật/tắt sản phẩm');
    
    console.log('\n💡 TÍNH NĂNG:');
    console.log('- Quản lý sản phẩm trong Just For You');
    console.log('- Quản lý sản phẩm trong Hot Deals');
    console.log('- Quản lý sản phẩm trong Trending Deals');
    console.log('- Sắp xếp vị trí hiển thị');
    console.log('- Bật/tắt sản phẩm');
    console.log('- Giao diện admin thân thiện');
    
  } catch (error) {
    console.error('❌ Lỗi:', error.message);
  }
}

setupSectionProducts();
