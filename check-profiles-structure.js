const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase credentials missing!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkProfilesStructure() {
  console.log('🔍 Checking profiles table structure...\n');

  try {
    // Get table structure
    const { data, error } = await supabase
      .rpc('get_table_columns', { table_name: 'profiles' });

    if (error) {
      console.log('❌ Cannot get table structure via RPC');
      
      // Try alternative method - get one record to see structure
      console.log('🔍 Trying alternative method...');
      const { data: sampleData, error: sampleError } = await supabase
        .from('profiles')
        .select('*')
        .limit(1);

      if (sampleError) {
        console.log('❌ Cannot access profiles table:', sampleError.message);
        return;
      }

      if (sampleData && sampleData.length > 0) {
        console.log('✅ Profiles table structure:');
        console.log('   Columns:', Object.keys(sampleData[0]));
      } else {
        console.log('✅ Profiles table exists but is empty');
        console.log('   This is normal for a new database');
      }
    } else {
      console.log('✅ Profiles table structure:', data);
    }

    // Test specific columns
    console.log('\n🧪 Testing specific columns...');
    
    const columnsToTest = ['is_active', 'email_verified', 'role', 'last_login'];
    
    for (const column of columnsToTest) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select(column)
          .limit(1);
        
        if (error) {
          console.log(`❌ Column '${column}': ${error.message}`);
        } else {
          console.log(`✅ Column '${column}': OK`);
        }
      } catch (err) {
        console.log(`❌ Column '${column}': ${err.message}`);
      }
    }

  } catch (error) {
    console.error('❌ Error checking profiles structure:', error);
  }
}

// Run the check
checkProfilesStructure().catch(console.error);

