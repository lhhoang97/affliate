const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function setupBundleDeals() {
  try {
    console.log('Setting up bundle deals table...');
    
    const fs = require('fs');
    const sql = fs.readFileSync('CREATE_BUNDLE_DEALS_TABLE.sql', 'utf8');
    
    // Split SQL into individual statements
    const statements = sql.split(';').filter(stmt => stmt.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        console.log('Executing:', statement.substring(0, 50) + '...');
        
        const { data, error } = await supabase.rpc('exec_sql', { 
          sql_query: statement.trim() + ';' 
        });
        
        if (error) {
          console.error('Error executing statement:', error);
          // Continue with other statements
        } else {
          console.log('Statement executed successfully');
        }
      }
    }
    
    console.log('Bundle deals setup completed!');
  } catch (error) {
    console.error('Error setting up bundle deals:', error);
  }
}

setupBundleDeals();

