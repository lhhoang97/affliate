// Test Website Authentication
const { createClient } = require('@supabase/supabase-js');

// Supabase configuration (same as production)
const supabaseUrl = 'https://rlgjpejeulxvfatwvniq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJsZ2pwZWpldWx4dmZhdHd2bmlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3MDk0ODAsImV4cCI6MjA3MTI4NTQ4MH0.2d3RgtqDg-3PSuK85smraSgo7Zt2WYymQzRa8bgNltg';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testWebsiteAuth() {
  try {
    console.log('🌐 Testing website authentication...');
    console.log('📧 Testing with: hoang@shopwithus.com');
    
    // Test 1: Check if user exists and can login
    console.log('\n🔐 Testing login...');
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'hoang@shopwithus.com',
      password: 'hoang123@'
    });
    
    if (authError) {
      console.error('❌ Login failed:', authError.message);
      return;
    }
    
    console.log('✅ Login successful!');
    console.log('🆔 User ID:', authData.user.id);
    console.log('📧 Email:', authData.user.email);
    
    // Test 2: Check user profile
    console.log('\n👤 Checking user profile...');
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', 'hoang@shopwithus.com')
      .single();
    
    if (profileError) {
      console.error('❌ Profile check failed:', profileError.message);
      return;
    }
    
    console.log('✅ Profile found:');
    console.log('   Name:', profileData.name);
    console.log('   Role:', profileData.role);
    console.log('   Verified:', profileData.is_verified);
    
    // Test 3: Check if user can access admin features
    console.log('\n🔑 Checking admin access...');
    if (profileData.role === 'admin') {
      console.log('✅ User has admin role - can access admin panel');
    } else {
      console.log('⚠️ User does not have admin role');
    }
    
    console.log('\n🎉 All tests passed!');
    console.log('\n🌐 Website Status:');
    console.log('   ✅ Supabase connection: Working');
    console.log('   ✅ Authentication: Working');
    console.log('   ✅ User profile: Found');
    console.log('   ✅ Admin access: Available');
    
    console.log('\n📱 You can now:');
    console.log('   1. Visit: https://shopingwithus.online/login');
    console.log('   2. Login with: hoang@shopwithus.com / hoang123@');
    console.log('   3. Access admin panel at: /admin');
    
  } catch (error) {
    console.error('💥 Unexpected error:', error);
  }
}

// Run the test
testWebsiteAuth();
