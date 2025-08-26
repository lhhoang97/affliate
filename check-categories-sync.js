const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Categories data from src/data/categories.ts
const expectedCategories = [
  'electronics', 'computers-laptops', 'smartphones', 'gaming', 'home-appliances',
  'fashion', 'beauty-personal-care', 'health-fitness', 'books-media', 'toys-hobbies',
  'sports-outdoors', 'automotive', 'baby-kids', 'pet-supplies', 'office-supplies',
  'tools-hardware', 'furniture'
];

// Initialize Supabase client
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCategoriesSync() {
  console.log('🔍 Checking Categories Synchronization Status...');
  console.log('================================================\n');
  
  try {
    // Fetch categories from database
    const { data: dbCategories, error } = await supabase
      .from('categories')
      .select('*');
    
    if (error) {
      console.error('❌ Error fetching categories:', error);
      return;
    }
    
    console.log(`📊 Database Categories: ${dbCategories?.length || 0}`);
    console.log(`📊 Expected Categories: ${expectedCategories.length}`);
    
    if (!dbCategories || dbCategories.length === 0) {
      console.log('\n❌ No categories found in database!');
      console.log('💡 Run the sync script to populate categories.');
      return;
    }
    
    // Check if all expected categories are present
    const dbCategoryIds = dbCategories.map(c => c.id);
    const missingCategories = expectedCategories.filter(id => !dbCategoryIds.includes(id));
    const extraCategories = dbCategoryIds.filter(id => !expectedCategories.includes(id));
    
    console.log('\n📋 Categories in Database:');
    dbCategories.forEach((category, index) => {
      const status = expectedCategories.includes(category.id) ? '✅' : '⚠️';
      console.log(`${index + 1}. ${status} ${category.name} (${category.id})`);
      console.log(`   Slug: ${category.slug}`);
      console.log(`   Products: ${category.product_count || 0}`);
      console.log(`   Subcategories: ${category.subcategories?.length || 0}`);
      console.log('');
    });
    
    if (missingCategories.length > 0) {
      console.log('❌ Missing Categories:');
      missingCategories.forEach(id => console.log(`   - ${id}`));
    }
    
    if (extraCategories.length > 0) {
      console.log('⚠️ Extra Categories (not in local data):');
      extraCategories.forEach(id => console.log(`   - ${id}`));
    }
    
    // Check schema
    console.log('\n🔧 Schema Check:');
    const firstCategory = dbCategories[0];
    const requiredFields = ['id', 'name', 'description', 'image', 'slug', 'product_count', 'icon', 'letter', 'subcategories'];
    const missingFields = requiredFields.filter(field => !(field in firstCategory));
    
    if (missingFields.length > 0) {
      console.log('❌ Missing fields in schema:');
      missingFields.forEach(field => console.log(`   - ${field}`));
    } else {
      console.log('✅ All required fields present');
    }
    
    // Summary
    console.log('\n📈 Summary:');
    console.log(`   Total Categories: ${dbCategories.length}/${expectedCategories.length}`);
    console.log(`   Missing: ${missingCategories.length}`);
    console.log(`   Extra: ${extraCategories.length}`);
    console.log(`   Schema Complete: ${missingFields.length === 0 ? 'Yes' : 'No'}`);
    
    if (missingCategories.length === 0 && extraCategories.length === 0 && missingFields.length === 0) {
      console.log('\n🎉 Categories are fully synchronized!');
    } else {
      console.log('\n⚠️ Categories need attention. Check the details above.');
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run the check
checkCategoriesSync();
