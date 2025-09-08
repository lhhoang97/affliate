const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

console.log('🔍 Simple test...');
console.log('URL:', supabaseUrl ? 'Set' : 'Missing');
console.log('Key:', supabaseKey ? 'Set' : 'Missing');

if (supabaseUrl && supabaseKey) {
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  // Simple test
  supabase.from('products').select('*').limit(1).then(({data, error}) => {
    if (error) {
      console.log('❌ Error:', error.message);
    } else {
      console.log('✅ Success, found', data?.length || 0, 'products');
    }
  });
}

