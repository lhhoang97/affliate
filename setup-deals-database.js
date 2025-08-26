const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase configuration. Please check your .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupDealsDatabase() {
  console.log('Setting up deals database...');

  try {
    // Check if tables exist by trying to select from them
    const { data: existingCategories } = await supabase
      .from('deal_categories')
      .select('id')
      .limit(1);

    if (!existingCategories) {
      console.log('Tables do not exist. Please run the SQL manually in your Supabase dashboard:');
      console.log(`
        -- Create deal_categories table
        CREATE TABLE IF NOT EXISTS deal_categories (
          id SERIAL PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          icon VARCHAR(50) NOT NULL,
          display_order INTEGER DEFAULT 0,
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        -- Create deal_subcategories table
        CREATE TABLE IF NOT EXISTS deal_subcategories (
          id SERIAL PRIMARY KEY,
          category_id INTEGER REFERENCES deal_categories(id) ON DELETE CASCADE,
          name VARCHAR(100) NOT NULL,
          slug VARCHAR(100) NOT NULL,
          display_order INTEGER DEFAULT 0,
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
    } else {
      console.log('✅ Tables already exist');
    }

    // Insert sample data
    const { data: categories } = await supabase
      .from('deal_categories')
      .select('*');

    if (!categories || categories.length === 0) {
      console.log('Inserting sample categories...');
      const { data: newCategories, error: categoriesError } = await supabase
        .from('deal_categories')
        .insert([
          { name: 'Flash Deals', icon: '⚡', display_order: 1, is_active: true },
          { name: 'Featured Deals', icon: '⭐', display_order: 2, is_active: true },
          { name: 'Seasonal Deals', icon: '🎉', display_order: 3, is_active: true }
        ])
        .select();

      if (categoriesError) {
        console.error('Error inserting categories:', categoriesError);
      } else if (newCategories) {
        console.log('✅ Sample categories inserted');
        
        // Insert subcategories
        const { error: subcategoriesError } = await supabase
          .from('deal_subcategories')
          .insert([
            { category_id: newCategories[0].id, name: 'Limited Time Offers', slug: 'limited-time-offers', display_order: 1, is_active: true },
            { category_id: newCategories[0].id, name: 'Daily Deals', slug: 'daily-deals', display_order: 2, is_active: true },
            { category_id: newCategories[0].id, name: 'Weekend Specials', slug: 'weekend-specials', display_order: 3, is_active: true },
            { category_id: newCategories[1].id, name: 'Best Sellers', slug: 'best-sellers', display_order: 1, is_active: true },
            { category_id: newCategories[1].id, name: 'Trending Now', slug: 'trending-now', display_order: 2, is_active: true },
            { category_id: newCategories[1].id, name: 'Editor\'s Picks', slug: 'editors-picks', display_order: 3, is_active: true },
            { category_id: newCategories[2].id, name: 'Black Friday', slug: 'black-friday', display_order: 1, is_active: true },
            { category_id: newCategories[2].id, name: 'Cyber Monday', slug: 'cyber-monday', display_order: 2, is_active: true },
            { category_id: newCategories[2].id, name: 'Holiday Sales', slug: 'holiday-sales', display_order: 3, is_active: true }
          ]);

        if (subcategoriesError) {
          console.error('Error inserting subcategories:', subcategoriesError);
        } else {
          console.log('✅ Sample subcategories inserted');
        }
      }
    } else {
      console.log('✅ Sample data already exists');
    }

    console.log('🎉 Deals database setup completed!');
    console.log('You can now access the Deal Management page at /admin/deal-management');

  } catch (error) {
    console.error('Error setting up deals database:', error);
  }
}

// Run the setup
setupDealsDatabase();
