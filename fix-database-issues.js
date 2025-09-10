const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase credentials missing!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function fixDatabaseIssues() {
  console.log('🔧 Fixing database issues...\n');

  try {
    // 1. Check if reviews table exists
    console.log('1. Checking reviews table...');
    const { data: reviewsCheck, error: reviewsError } = await supabase
      .from('reviews')
      .select('count')
      .limit(1);

    if (reviewsError) {
      console.log('❌ Reviews table issue:', reviewsError.message);
      
      // Try to create reviews table if it doesn't exist
      console.log('🔨 Creating reviews table...');
      const createReviewsSQL = `
        CREATE TABLE IF NOT EXISTS reviews (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          product_id UUID REFERENCES products(id) ON DELETE CASCADE,
          user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
          user_name VARCHAR(255) NOT NULL,
          user_avatar TEXT,
          rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
          title VARCHAR(255),
          content TEXT,
          helpful INTEGER DEFAULT 0,
          not_helpful INTEGER DEFAULT 0,
          verified BOOLEAN DEFAULT false,
          images JSONB DEFAULT '[]',
          is_approved BOOLEAN DEFAULT true,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `;
      
      const { error: createError } = await supabase.rpc('exec_sql', { sql: createReviewsSQL });
      if (createError) {
        console.log('⚠️  Cannot create table via RPC, please run SQL manually in Supabase Dashboard');
      } else {
        console.log('✅ Reviews table created successfully');
      }
    } else {
      console.log('✅ Reviews table exists');
    }

    // 2. Check all tables
    console.log('\n2. Checking all tables...');
    const tables = ['profiles', 'categories', 'products', 'reviews', 'orders', 'order_items', 'wishlist'];
    
    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select('count')
        .limit(1);
      
      if (error) {
        console.log(`❌ ${table}: ${error.message}`);
      } else {
        console.log(`✅ ${table}: OK`);
      }
    }

    // 3. Test basic operations
    console.log('\n3. Testing basic operations...');
    
    // Test products
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, name')
      .limit(1);
    
    if (productsError) {
      console.log('❌ Products query failed:', productsError.message);
    } else {
      console.log('✅ Products query: OK');
    }

    // Test categories
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('id, name')
      .limit(1);
    
    if (categoriesError) {
      console.log('❌ Categories query failed:', categoriesError.message);
    } else {
      console.log('✅ Categories query: OK');
    }

    console.log('\n🎉 Database check completed!');
    console.log('\n📝 If you see any errors above:');
    console.log('1. Go to Supabase Dashboard → SQL Editor');
    console.log('2. Run the COMPLETE_DATABASE_SETUP.sql script');
    console.log('3. Or run the FIX_REVIEWS_TABLE.sql script for specific fixes');

  } catch (error) {
    console.error('❌ Error during database check:', error);
  }
}

// Run the fix
fixDatabaseIssues().catch(console.error);
