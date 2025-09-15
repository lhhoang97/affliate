const { createClient } = require('@supabase/supabase-js');
const { mockProducts, mockCategories } = require('./src/utils/mockData');

// Load environment variables
require('dotenv').config();

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase URL và ANON KEY chưa được cấu hình!');
  console.log('📝 Vui lòng tạo file .env với:');
  console.log('REACT_APP_SUPABASE_URL=your_supabase_url');
  console.log('REACT_APP_SUPABASE_ANON_KEY=your_anon_key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to map mock product to database format
function mapProductToDb(product) {
  return {
    name: product.name,
    description: product.description,
    price: product.price,
    original_price: product.originalPrice,
    image: product.image,
    rating: product.rating,
    review_count: product.reviewCount,
    category: product.category,
    brand: product.brand,
    retailer: product.retailer,
    in_stock: product.inStock,
    features: product.features,
    specifications: product.specifications,
    images: product.images,
    tags: product.tags,
    external_url: product.externalUrl,
    affiliate_link: product.affiliateLink,
    created_at: product.createdAt,
    updated_at: product.updatedAt
  };
}

// Helper function to map mock category to database format
function mapCategoryToDb(category) {
  return {
    name: category.name,
    description: category.description,
    image: category.image,
    slug: category.slug,
    product_count: category.productCount
  };
}

async function migrateData() {
  console.log('🚀 Bắt đầu migration dữ liệu từ mock sang Supabase...\n');

  try {
    // 1. Migrate Categories
    console.log('📂 Đang migrate categories...');
    const categoriesToInsert = mockCategories.map(mapCategoryToDb);
    
    const { data: categoriesData, error: categoriesError } = await supabase
      .from('categories')
      .insert(categoriesToInsert)
      .select();

    if (categoriesError) {
      console.error('❌ Lỗi khi migrate categories:', categoriesError);
    } else {
      console.log(`✅ Đã migrate ${categoriesData.length} categories thành công!`);
    }

    // 2. Migrate Products
    console.log('\n📦 Đang migrate products...');
    const productsToInsert = mockProducts.map(mapProductToDb);
    
    const { data: productsData, error: productsError } = await supabase
      .from('products')
      .insert(productsToInsert)
      .select();

    if (productsError) {
      console.error('❌ Lỗi khi migrate products:', productsError);
    } else {
      console.log(`✅ Đã migrate ${productsData.length} products thành công!`);
    }

    // 3. Summary
    console.log('\n📊 Tóm tắt migration:');
    console.log(`   - Categories: ${categoriesData?.length || 0} records`);
    console.log(`   - Products: ${productsData?.length || 0} records`);
    
    console.log('\n🎉 Migration hoàn tất!');
    console.log('🌐 Truy cập Supabase Dashboard để kiểm tra dữ liệu:');
    console.log(`   ${supabaseUrl.replace('/rest/v1', '')}`);

  } catch (error) {
    console.error('❌ Lỗi trong quá trình migration:', error);
  }
}

// Check if tables exist
async function checkTables() {
  console.log('🔍 Kiểm tra cấu trúc database...\n');

  try {
    // Check categories table
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('count')
      .limit(1);

    if (categoriesError) {
      console.error('❌ Bảng categories chưa tồn tại hoặc có lỗi:', categoriesError.message);
      console.log('📝 Vui lòng chạy SQL script để tạo bảng trước khi migration!');
      return false;
    }

    // Check products table
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('count')
      .limit(1);

    if (productsError) {
      console.error('❌ Bảng products chưa tồn tại hoặc có lỗi:', productsError.message);
      console.log('📝 Vui lòng chạy SQL script để tạo bảng trước khi migration!');
      return false;
    }

    console.log('✅ Cấu trúc database đã sẵn sàng!');
    return true;

  } catch (error) {
    console.error('❌ Lỗi khi kiểm tra database:', error);
    return false;
  }
}

// Main execution
async function main() {
  console.log('🔧 Supabase Migration Tool');
  console.log('========================\n');

  const tablesReady = await checkTables();
  
  if (tablesReady) {
    await migrateData();
  } else {
    console.log('\n📋 Hướng dẫn tạo bảng:');
    console.log('1. Vào Supabase Dashboard → SQL Editor');
    console.log('2. Chạy SQL script từ file SUPABASE_SETUP_GUIDE.md');
    console.log('3. Chạy lại script này: node migrate-to-supabase.js');
  }
}

// Run migration
main().catch(console.error);





