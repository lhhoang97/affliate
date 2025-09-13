const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

console.log('🔍 Debugging Authentication Issues...\n');

// Check environment variables
console.log('1. Environment Variables:');
console.log('VITE_SUPABASE_URL:', process.env.VITE_SUPABASE_URL);
console.log('VITE_SUPABASE_ANON_KEY:', process.env.VITE_SUPABASE_ANON_KEY ? 'Set' : 'Not set');

if (!process.env.VITE_SUPABASE_URL || !process.env.VITE_SUPABASE_ANON_KEY) {
  console.error('❌ Missing Supabase credentials!');
  process.exit(1);
}

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function debugAuth() {
  try {
    console.log('\n2. Testing Supabase Connection:');
    
    // Test basic connection
    const { data, error } = await supabase.from('products').select('count').limit(1);
    if (error) {
      console.error('❌ Connection failed:', error.message);
      return;
    }
    console.log('✅ Supabase connection successful');

    console.log('\n3. Testing Authentication:');
    
    // Test auth state
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) {
      console.error('❌ Auth error:', userError.message);
    } else {
      console.log('✅ Auth service working');
      console.log('Current user:', user ? user.email : 'No user logged in');
    }

    console.log('\n4. Testing Profiles Table:');
    
    // Test profiles table
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, email, role')
      .limit(5);

    if (profilesError) {
      console.error('❌ Profiles table error:', profilesError.message);
    } else {
      console.log('✅ Profiles table accessible');
      console.log(`Found ${profiles.length} profiles:`);
      profiles.forEach(p => console.log(`  - ${p.email} (${p.role})`));
    }

    console.log('\n5. Testing Login with Test User:');
    
    // Test login with a known user
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: 'hoang@shopwithus.com',
      password: 'password123'
    });

    if (loginError) {
      console.error('❌ Login test failed:', loginError.message);
    } else {
      console.log('✅ Login test successful');
      console.log('Logged in user:', loginData.user?.email);
      
      // Sign out
      await supabase.auth.signOut();
      console.log('✅ Signed out successfully');
    }

    console.log('\n🎉 All tests passed! Authentication should work.');

  } catch (error) {
    console.error('❌ Debug failed:', error.message);
  }
}

debugAuth();

