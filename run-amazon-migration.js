const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function runAmazonMigration() {
  try {
    console.log('🚀 Running Amazon migration...');
    
    // Step 1: Add new columns to products table
    console.log('📝 Adding new columns to products table...');
    
    const { error: alterError } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE products
        ADD COLUMN IF NOT EXISTS source VARCHAR(20) DEFAULT 'manual',
        ADD COLUMN IF NOT EXISTS asin VARCHAR(20),
        ADD COLUMN IF NOT EXISTS retailer VARCHAR(50) DEFAULT 'Unknown',
        ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0,
        ADD COLUMN IF NOT EXISTS rating DECIMAL(2,1) DEFAULT 0.0,
        ADD COLUMN IF NOT EXISTS last_synced TIMESTAMP WITH TIME ZONE DEFAULT NOW();
      `
    });
    
    if (alterError) {
      console.error('❌ Error adding columns:', alterError.message);
      return;
    }
    
    console.log('✅ Columns added successfully!');
    
    // Step 2: Create indexes
    console.log('📊 Creating indexes...');
    
    const { error: indexError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE INDEX IF NOT EXISTS idx_products_source ON products(source);
        CREATE INDEX IF NOT EXISTS idx_products_asin ON products(asin);
        CREATE INDEX IF NOT EXISTS idx_products_retailer ON products(retailer);
        CREATE INDEX IF NOT EXISTS idx_products_rating ON products(rating);
        CREATE INDEX IF NOT EXISTS idx_products_last_synced ON products(last_synced);
      `
    });
    
    if (indexError) {
      console.error('❌ Error creating indexes:', indexError.message);
    } else {
      console.log('✅ Indexes created successfully!');
    }
    
    // Step 3: Create tracking tables
    console.log('📋 Creating tracking tables...');
    
    const { error: tableError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS amazon_sync_log (
          id SERIAL PRIMARY KEY,
          sync_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          keywords TEXT,
          category TEXT,
          products_found INTEGER DEFAULT 0,
          products_imported INTEGER DEFAULT 0,
          status VARCHAR(20) DEFAULT 'success',
          error_message TEXT
        );
        
        CREATE TABLE IF NOT EXISTS amazon_api_usage (
          id SERIAL PRIMARY KEY,
          date DATE DEFAULT CURRENT_DATE,
          requests_made INTEGER DEFAULT 0,
          requests_remaining INTEGER DEFAULT 0,
          last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    
    if (tableError) {
      console.error('❌ Error creating tables:', tableError.message);
    } else {
      console.log('✅ Tracking tables created successfully!');
    }
    
    // Step 4: Verify migration
    console.log('🔍 Verifying migration...');
    
    const { data, error } = await supabase
      .from('products')
      .select('id, name, source, asin, retailer, rating, review_count, last_synced')
      .limit(1);
    
    if (error) {
      console.error('❌ Verification failed:', error.message);
    } else {
      console.log('✅ Migration completed successfully!');
      console.log('Available columns:', Object.keys(data[0] || {}));
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
  }
}

runAmazonMigration();

