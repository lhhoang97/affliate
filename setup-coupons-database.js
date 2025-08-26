const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase configuration. Please check your .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupCouponsDatabase() {
  console.log('Setting up coupons database...');

  try {
    // Check if tables exist by trying to select from them
    const { data: existingRetailers } = await supabase
      .from('coupon_retailers')
      .select('id')
      .limit(1);

    if (!existingRetailers) {
      console.log('Tables do not exist. Please run the SQL manually in your Supabase dashboard:');
      console.log(`
        -- Create coupon_retailers table
        CREATE TABLE IF NOT EXISTS coupon_retailers (
          id SERIAL PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          icon VARCHAR(50) NOT NULL,
          display_order INTEGER DEFAULT 0,
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        -- Create coupon_categories table
        CREATE TABLE IF NOT EXISTS coupon_categories (
          id SERIAL PRIMARY KEY,
          retailer_id INTEGER REFERENCES coupon_retailers(id) ON DELETE CASCADE,
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
    const { data: retailers } = await supabase
      .from('coupon_retailers')
      .select('*');

    if (!retailers || retailers.length === 0) {
      console.log('Inserting sample retailers...');
      const { data: newRetailers, error: retailersError } = await supabase
        .from('coupon_retailers')
        .insert([
          { name: 'Amazon', icon: '🛒', display_order: 1, is_active: true },
          { name: 'eBay', icon: '🛍️', display_order: 2, is_active: true },
          { name: 'Best Buy', icon: '🏪', display_order: 3, is_active: true }
        ])
        .select();

      if (retailersError) {
        console.error('Error inserting retailers:', retailersError);
      } else if (newRetailers) {
        console.log('✅ Sample retailers inserted');
        
        // Insert categories
        const { error: categoriesError } = await supabase
          .from('coupon_categories')
          .insert([
            { retailer_id: newRetailers[0].id, name: 'Electronics Coupons', slug: 'amazon-electronics', display_order: 1, is_active: true },
            { retailer_id: newRetailers[0].id, name: 'Fashion Coupons', slug: 'amazon-fashion', display_order: 2, is_active: true },
            { retailer_id: newRetailers[0].id, name: 'Home & Garden Coupons', slug: 'amazon-home-garden', display_order: 3, is_active: true },
            { retailer_id: newRetailers[1].id, name: 'Tech Deals', slug: 'ebay-tech', display_order: 1, is_active: true },
            { retailer_id: newRetailers[1].id, name: 'Fashion Deals', slug: 'ebay-fashion', display_order: 2, is_active: true },
            { retailer_id: newRetailers[1].id, name: 'Home Deals', slug: 'ebay-home', display_order: 3, is_active: true },
            { retailer_id: newRetailers[2].id, name: 'Electronics Deals', slug: 'bestbuy-electronics', display_order: 1, is_active: true },
            { retailer_id: newRetailers[2].id, name: 'Gaming Deals', slug: 'bestbuy-gaming', display_order: 2, is_active: true },
            { retailer_id: newRetailers[2].id, name: 'Appliance Deals', slug: 'bestbuy-appliances', display_order: 3, is_active: true }
          ]);

        if (categoriesError) {
          console.error('Error inserting categories:', categoriesError);
        } else {
          console.log('✅ Sample categories inserted');
        }
      }
    } else {
      console.log('✅ Sample data already exists');
    }

    console.log('🎉 Coupons database setup completed!');
    console.log('You can now access the Coupon Management page at /admin/coupon-management');

  } catch (error) {
    console.error('Error setting up coupons database:', error);
  }
}

// Run the setup
setupCouponsDatabase();
