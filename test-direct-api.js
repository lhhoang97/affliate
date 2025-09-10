require('dotenv').config();

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

console.log('🔍 Testing Direct Supabase API...');
console.log('URL:', supabaseUrl);
console.log('Key length:', supabaseKey?.length);

async function testDirectAPI() {
  try {
    console.log('\n📡 Making direct fetch request...');
    
    const response = await fetch(`${supabaseUrl}/rest/v1/products?select=*`, {
      method: 'GET',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error:', response.status, errorText);
      return;
    }
    
    const data = await response.json();
    console.log('✅ Success! Products found:', data.length);
    
    if (data.length > 0) {
      console.log('📝 Sample product:', data[0].name);
      console.log('🎉 Database connection works!');
    }
    
  } catch (err) {
    console.error('❌ Fetch error:', err.message);
  }
}

testDirectAPI();
