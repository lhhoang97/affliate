const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase credentials missing!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkOrdersStructure() {
  console.log('🔍 Checking orders table structure...\n');

  try {
    // Get table structure
    const { data: sampleData, error: sampleError } = await supabase
      .from('orders')
      .select('*')
      .limit(1);

    if (sampleError) {
      console.log('❌ Cannot access orders table:', sampleError.message);
      return;
    }

    if (sampleData && sampleData.length > 0) {
      console.log('✅ Orders table structure:');
      console.log('   Columns:', Object.keys(sampleData[0]));
    } else {
      console.log('✅ Orders table exists but is empty');
    }

    // Test specific columns
    console.log('\n🧪 Testing specific columns...');
    
    const columnsToTest = ['total_amount', 'shipping_amount', 'tax_amount', 'payment_status', 'shipping_address'];
    
    for (const column of columnsToTest) {
      try {
        const { data, error } = await supabase
          .from('orders')
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
    console.error('❌ Error checking orders structure:', error);
  }
}

// Run the check
checkOrdersStructure().catch(console.error);

