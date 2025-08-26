const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Initialize Supabase client
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function finalStatusCheck() {
  console.log('🎯 Final Status Check - Categories Synchronization');
  console.log('==================================================\n');
  
  try {
    // Check categories in database
    console.log('📊 Checking Database Categories...');
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('*');
    
    if (categoriesError) {
      console.error('❌ Error fetching categories:', categoriesError);
      return;
    }
    
    console.log(`✅ Database Categories: ${categories?.length || 0}`);
    
    // Check products in database
    console.log('\n📦 Checking Database Products...');
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*');
    
    if (productsError) {
      console.error('❌ Error fetching products:', productsError);
    } else {
      console.log(`✅ Database Products: ${products?.length || 0}`);
    }
    
    // Check web app status
    console.log('\n🌐 Checking Web App Status...');
    try {
      const response = await fetch('http://localhost:3000');
      if (response.ok) {
        console.log('✅ Web app is running on http://localhost:3000');
      } else {
        console.log(`⚠️ Web app returned status: ${response.status}`);
      }
    } catch (error) {
      console.log('❌ Web app is not running or not accessible');
    }
    
    // Summary
    console.log('\n📈 Summary:');
    console.log('==========');
    console.log(`✅ Categories synchronized: ${categories?.length || 0}/17`);
    console.log(`✅ Products in database: ${products?.length || 0}`);
    console.log(`✅ Web app status: ${categories?.length === 17 ? 'Ready' : 'Needs attention'}`);
    
    if (categories?.length === 17) {
      console.log('\n🎉 SUCCESS: Categories are fully synchronized!');
      console.log('\n📋 Next Steps:');
      console.log('1. Visit http://localhost:3000 to see the updated categories');
      console.log('2. Check http://localhost:3000/categories for the categories page');
      console.log('3. Visit http://localhost:3000/admin/categories for admin management');
      console.log('4. Add products to see them appear in categories');
    } else {
      console.log('\n⚠️ Categories need attention. Check the details above.');
    }
    
    // Display categories if available
    if (categories && categories.length > 0) {
      console.log('\n📋 Categories in Database:');
      categories.forEach((category, index) => {
        console.log(`${index + 1}. ${category.name} (${category.slug})`);
      });
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run the check
finalStatusCheck();
