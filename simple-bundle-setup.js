const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function setupBundleDeals() {
  try {
    console.log('🚀 Setting up Bundle Deals System...\n');

    // 1. Create bundle_deals table
    console.log('1. Creating bundle_deals table...');
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS bundle_deals (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
        bundle_type VARCHAR(10) NOT NULL CHECK (bundle_type IN ('get2', 'get3', 'get4', 'get5')),
        discount_percentage DECIMAL(5,2) NOT NULL CHECK (discount_percentage >= 0 AND discount_percentage <= 100),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(product_id, bundle_type)
      );
    `;

    const { error: tableError } = await supabase.rpc('exec_sql', { 
      sql_query: createTableSQL 
    });

    if (tableError) {
      console.log('⚠️  Table might already exist or error:', tableError.message);
    } else {
      console.log('✅ Bundle deals table created');
    }

    // 2. Create indexes
    console.log('\n2. Creating indexes...');
    const indexSQL = `
      CREATE INDEX IF NOT EXISTS idx_bundle_deals_product_id ON bundle_deals(product_id);
      CREATE INDEX IF NOT EXISTS idx_bundle_deals_active ON bundle_deals(is_active) WHERE is_active = true;
    `;

    await supabase.rpc('exec_sql', { sql_query: indexSQL });
    console.log('✅ Indexes created');

    // 3. Enable RLS
    console.log('\n3. Setting up RLS policies...');
    const rlsSQL = `
      ALTER TABLE bundle_deals ENABLE ROW LEVEL SECURITY;
      
      DROP POLICY IF EXISTS "Admin can manage all bundle deals" ON bundle_deals;
      CREATE POLICY "Admin can manage all bundle deals" ON bundle_deals
        FOR ALL USING (
          EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
          )
        );
      
      DROP POLICY IF EXISTS "Users can view active bundle deals" ON bundle_deals;
      CREATE POLICY "Users can view active bundle deals" ON bundle_deals
        FOR SELECT USING (is_active = true);
    `;

    await supabase.rpc('exec_sql', { sql_query: rlsSQL });
    console.log('✅ RLS policies created');

    // 4. Add sample data
    console.log('\n4. Adding sample bundle deals...');
    const { data: products } = await supabase
      .from('products')
      .select('id, name, price')
      .limit(5);

    if (products && products.length > 0) {
      const sampleDeals = products.slice(0, 3).map(product => ({
        product_id: product.id,
        bundle_type: 'get2',
        discount_percentage: 20.00,
        is_active: true
      }));

      const { error: insertError } = await supabase
        .from('bundle_deals')
        .insert(sampleDeals);

      if (insertError) {
        console.log('⚠️  Sample data insert error:', insertError.message);
      } else {
        console.log(`✅ Added ${sampleDeals.length} sample bundle deals`);
      }
    } else {
      console.log('⚠️  No products found to create sample deals');
    }

    console.log('\n🎉 Bundle Deals System setup completed!');
    console.log('\nNext steps:');
    console.log('1. Go to /admin/bundle-deals to manage bundle deals');
    console.log('2. Add products to cart to see bundle deals in action');
    console.log('3. Test different quantities to trigger different bundle deals');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
  }
}

setupBundleDeals();
