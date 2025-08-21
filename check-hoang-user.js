// Check if hoang@shopwithus.com user exists in Supabase Auth
const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://rlgjpejeulxvfatwvniq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJsZ2pwZWpldWx4dmZhdHd2bmlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3MDk0ODAsImV4cCI6MjA3MTI4NTQ4MH0.2d3RgtqDg-3PSuK85smraSgo7Zt2WYymQzRa8bgNltg';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkHoangUser() {
  try {
    console.log('🔍 Checking hoang@shopwithus.com user...');
    
    // Test 1: Try to sign in with the credentials
    console.log('🔐 Testing sign in...');
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'hoang@shopwithus.com',
      password: 'hoang123@'
    });
    
    if (authError) {
      console.error('❌ Sign in failed:', authError.message);
      console.log('');
      console.log('💡 This means either:');
      console.log('   1. User does not exist in Supabase Auth');
      console.log('   2. Password is incorrect');
      console.log('   3. User is not confirmed');
      console.log('');
      console.log('🔧 Solution: Create the user in Supabase Dashboard');
      console.log('   1. Go to Supabase Dashboard > Authentication > Users');
      console.log('   2. Click "Add User"');
      console.log('   3. Enter: hoang@shopwithus.com');
      console.log('   4. Enter: hoang123@');
      console.log('   5. Check "Auto-confirm"');
      console.log('   6. Click "Create User"');
      return;
    }
    
    console.log('✅ Sign in successful!');
    console.log('🆔 User ID:', authData.user.id);
    console.log('📧 Email:', authData.user.email);
    console.log('✅ Confirmed:', authData.user.email_confirmed_at ? 'Yes' : 'No');
    
    // Test 2: Check if profile exists
    console.log('');
    console.log('👤 Checking profile in database...');
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', 'hoang@shopwithus.com');
    
    if (profileError) {
      console.error('❌ Profile query failed:', profileError);
      return;
    }
    
    if (profileData.length === 0) {
      console.log('⚠️ No profile found in database');
      console.log('');
      console.log('🔧 Solution: Create profile in database');
      console.log('   1. Go to Supabase Dashboard > SQL Editor');
      console.log('   2. Run this SQL:');
      console.log('');
      console.log(`INSERT INTO profiles (
  id,
  email,
  name,
  role,
  created_at,
  updated_at
) VALUES (
  '${authData.user.id}',
  'hoang@shopwithus.com',
  'Hoang Admin',
  'admin',
  NOW(),
  NOW()
);`);
    } else {
      console.log('✅ Profile found:', profileData[0]);
    }
    
  } catch (error) {
    console.error('💥 Unexpected error:', error);
  }
}

// Run the check
checkHoangUser();
