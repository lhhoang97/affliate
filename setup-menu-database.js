const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase configuration. Please check your .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupMenuDatabase() {
  console.log('Setting up menu database...');

  try {
    // Create menu_categories table
    console.log('Creating menu_categories table...');
    const { error: categoriesError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS menu_categories (
          id SERIAL PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          icon VARCHAR(50) NOT NULL,
          display_order INTEGER DEFAULT 0,
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `
    });

    if (categoriesError) {
      console.error('Error creating menu_categories table:', categoriesError);
    } else {
      console.log('✅ menu_categories table created successfully');
    }

    // Create menu_subcategories table
    console.log('Creating menu_subcategories table...');
    const { error: subcategoriesError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS menu_subcategories (
          id SERIAL PRIMARY KEY,
          category_id INTEGER REFERENCES menu_categories(id) ON DELETE CASCADE,
          name VARCHAR(100) NOT NULL,
          slug VARCHAR(100) NOT NULL,
          display_order INTEGER DEFAULT 0,
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `
    });

    if (subcategoriesError) {
      console.error('Error creating menu_subcategories table:', subcategoriesError);
    } else {
      console.log('✅ menu_subcategories table created successfully');
    }

    // Insert sample data
    console.log('Inserting sample data...');
    
    // Insert categories
    const { data: categoriesData, error: categoriesInsertError } = await supabase
      .from('menu_categories')
      .insert([
        { name: 'Electronics', icon: '📱', display_order: 1, is_active: true },
        { name: 'Home & Kitchen', icon: '🏠', display_order: 2, is_active: true },
        { name: 'Fashion', icon: '👕', display_order: 3, is_active: true }
      ])
      .select();

    if (categoriesInsertError) {
      console.error('Error inserting categories:', categoriesInsertError);
    } else {
      console.log('✅ Sample categories inserted successfully');
      
      // Insert subcategories
      if (categoriesData && categoriesData.length > 0) {
        const { error: subcategoriesInsertError } = await supabase
          .from('menu_subcategories')
          .insert([
            { category_id: categoriesData[0].id, name: 'Phones', slug: 'smartphones', display_order: 1, is_active: true },
            { category_id: categoriesData[0].id, name: 'Laptops', slug: 'computers-laptops', display_order: 2, is_active: true },
            { category_id: categoriesData[0].id, name: 'Gaming', slug: 'gaming', display_order: 3, is_active: true },
            { category_id: categoriesData[1].id, name: 'Appliances', slug: 'home-appliances', display_order: 1, is_active: true },
            { category_id: categoriesData[1].id, name: 'Furniture', slug: 'furniture', display_order: 2, is_active: true },
            { category_id: categoriesData[2].id, name: 'Men\'s Clothing', slug: 'mens-clothing', display_order: 1, is_active: true },
            { category_id: categoriesData[2].id, name: 'Women\'s Clothing', slug: 'womens-clothing', display_order: 2, is_active: true }
          ]);

        if (subcategoriesInsertError) {
          console.error('Error inserting subcategories:', subcategoriesInsertError);
        } else {
          console.log('✅ Sample subcategories inserted successfully');
        }
      }
    }

    console.log('🎉 Menu database setup completed successfully!');
    console.log('You can now access the Menu Management page at /admin/menu-management');

  } catch (error) {
    console.error('Error setting up menu database:', error);
  }
}

// Alternative method using direct SQL if RPC is not available
async function setupMenuDatabaseAlternative() {
  console.log('Setting up menu database using alternative method...');

  try {
    // Check if tables exist by trying to select from them
    const { data: existingCategories } = await supabase
      .from('menu_categories')
      .select('id')
      .limit(1);

    if (!existingCategories) {
      console.log('Tables do not exist. Please run the SQL manually in your Supabase dashboard:');
      console.log(`
        -- Create menu_categories table
        CREATE TABLE IF NOT EXISTS menu_categories (
          id SERIAL PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          icon VARCHAR(50) NOT NULL,
          display_order INTEGER DEFAULT 0,
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        -- Create menu_subcategories table
        CREATE TABLE IF NOT EXISTS menu_subcategories (
          id SERIAL PRIMARY KEY,
          category_id INTEGER REFERENCES menu_categories(id) ON DELETE CASCADE,
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
      .from('menu_categories')
      .select('*');

    if (!categories || categories.length === 0) {
      console.log('Inserting sample categories...');
      const { data: newCategories, error: categoriesError } = await supabase
        .from('menu_categories')
        .insert([
          { name: 'Electronics', icon: '📱', display_order: 1, is_active: true },
          { name: 'Home & Kitchen', icon: '🏠', display_order: 2, is_active: true },
          { name: 'Fashion', icon: '👕', display_order: 3, is_active: true }
        ])
        .select();

      if (categoriesError) {
        console.error('Error inserting categories:', categoriesError);
      } else if (newCategories) {
        console.log('✅ Sample categories inserted');
        
        // Insert subcategories
        const { error: subcategoriesError } = await supabase
          .from('menu_subcategories')
          .insert([
            { category_id: newCategories[0].id, name: 'Phones', slug: 'smartphones', display_order: 1, is_active: true },
            { category_id: newCategories[0].id, name: 'Laptops', slug: 'computers-laptops', display_order: 2, is_active: true },
            { category_id: newCategories[0].id, name: 'Gaming', slug: 'gaming', display_order: 3, is_active: true },
            { category_id: newCategories[1].id, name: 'Appliances', slug: 'home-appliances', display_order: 1, is_active: true },
            { category_id: newCategories[1].id, name: 'Furniture', slug: 'furniture', display_order: 2, is_active: true },
            { category_id: newCategories[2].id, name: 'Men\'s Clothing', slug: 'mens-clothing', display_order: 1, is_active: true },
            { category_id: newCategories[2].id, name: 'Women\'s Clothing', slug: 'womens-clothing', display_order: 2, is_active: true }
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

    console.log('🎉 Menu database setup completed!');
    console.log('You can now access the Menu Management page at /admin/menu-management');

  } catch (error) {
    console.error('Error setting up menu database:', error);
  }
}

// Run the setup
setupMenuDatabaseAlternative();
