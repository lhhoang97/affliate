const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://rlgjpejeulxvfatwvniq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJsZ2pwZWpldWx4dmZhdHd2bmlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3MDk0ODAsImV4cCI6MjA3MTI4NTQ4MH0.2d3RgtqDg-3PSuK85smraSgo7Zt2WYymQzRa8bgNltg';

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupAffiliateTables() {
  console.log('🚀 Setting up Affiliate Tables...');
  
  try {
    // First, let's check if tables already exist
    console.log('🔍 Checking existing tables...');
    
    const { data: existingTables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .in('table_name', ['affiliate_products', 'affiliate_retailers', 'affiliate_clicks']);
    
    if (tablesError) {
      console.log('ℹ️  Cannot check existing tables, proceeding with setup...');
    } else {
      console.log('📋 Existing tables:', existingTables?.map(t => t.table_name) || []);
    }
    
    // Since we can't create tables via Supabase client, we'll provide instructions
    console.log('📝 Database Setup Instructions:');
    console.log('');
    console.log('1. Go to Supabase Dashboard: https://supabase.com/dashboard');
    console.log('2. Select your project: rlgjpejeulxvfatwvniq');
    console.log('3. Go to SQL Editor');
    console.log('4. Copy and paste the SQL from CREATE_AFFILIATE_PRODUCTS_TABLE.sql');
    console.log('5. Click "Run" to execute');
    console.log('');
    console.log('Alternatively, you can run this SQL directly:');
    console.log('');
    
    // Read and display the SQL content
    const fs = require('fs');
    const sqlContent = fs.readFileSync('CREATE_AFFILIATE_PRODUCTS_TABLE.sql', 'utf8');
    console.log(sqlContent);
    
    console.log('');
    console.log('After running the SQL, come back and run this script again to verify setup.');
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
  }
}

// Run the setup
setupAffiliateTables().catch(console.error);
