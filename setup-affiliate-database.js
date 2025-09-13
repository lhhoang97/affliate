const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://rlgjpejeulxvfatwvniq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJsZ2pwZWpldWx4dmZhdHd2bmlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3MDk0ODAsImV4cCI6MjA3MTI4NTQ4MH0.2d3RgtqDg-3PSuK85smraSgo7Zt2WYymQzRa8bgNltg';

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupAffiliateDatabase() {
  console.log('🚀 Setting up Affiliate Database...');
  
  try {
    // Read SQL file
    const fs = require('fs');
    const sqlContent = fs.readFileSync('CREATE_AFFILIATE_PRODUCTS_TABLE.sql', 'utf8');
    
    // Split by semicolon and execute each statement
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`📝 Found ${statements.length} SQL statements to execute`);
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        console.log(`⚡ Executing statement ${i + 1}/${statements.length}...`);
        
        try {
          const { data, error } = await supabase.rpc('exec_sql', { 
            sql_query: statement 
          });
          
          if (error) {
            console.error(`❌ Error in statement ${i + 1}:`, error);
            // Continue with next statement
          } else {
            console.log(`✅ Statement ${i + 1} executed successfully`);
          }
        } catch (err) {
          console.error(`❌ Exception in statement ${i + 1}:`, err.message);
          // Continue with next statement
        }
      }
    }
    
    // Test the tables were created
    console.log('🔍 Testing table creation...');
    
    // Test affiliate_products table
    const { data: productsData, error: productsError } = await supabase
      .from('affiliate_products')
      .select('*')
      .limit(1);
    
    if (productsError) {
      console.error('❌ affiliate_products table error:', productsError);
    } else {
      console.log('✅ affiliate_products table created successfully');
    }
    
    // Test affiliate_retailers table
    const { data: retailersData, error: retailersError } = await supabase
      .from('affiliate_retailers')
      .select('*')
      .limit(1);
    
    if (retailersError) {
      console.error('❌ affiliate_retailers table error:', retailersError);
    } else {
      console.log('✅ affiliate_retailers table created successfully');
      console.log('📦 Default retailers:', retailersData?.length || 0);
    }
    
    // Test affiliate_clicks table
    const { data: clicksData, error: clicksError } = await supabase
      .from('affiliate_clicks')
      .select('*')
      .limit(1);
    
    if (clicksError) {
      console.error('❌ affiliate_clicks table error:', clicksError);
    } else {
      console.log('✅ affiliate_clicks table created successfully');
    }
    
    console.log('🎉 Affiliate database setup completed!');
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
  }
}

// Run the setup
setupAffiliateDatabase().catch(console.error);
