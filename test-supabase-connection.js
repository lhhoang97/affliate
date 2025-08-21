// Test Supabase Connection and Authentication
const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://rlgjpejeulxvfatwvniq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJsZ2pwZWpldWx4dmZhdHd2bmlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3MDk0ODAsImV4cCI6MjA3MTI4NTQ4MH0.2d3RgtqDg-3PSuK85smraSgo7Zt2WYymQzRa8bgNltg';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSupabaseConnection() {
  try {
    console.log('🔍 Testing Supabase connection...');
    
    // Test 1: Check if we can connect to Supabase
    console.log('📡 Testing basic connection...');
    const { data: healthData, error: healthError } = await supabase.from('profiles').select('count').limit(1);
    
    if (healthError) {
      console.error('❌ Connection failed:', healthError);
      return;
    }
    
    console.log('✅ Basic connection successful!');
    
    // Test 2: Check if hoang@shopwithus.com exists in profiles
    console.log('👤 Checking hoang@shopwithus.com profile...');
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', 'hoang@shopwithus.com')
      .single();
    
    if (profileError) {
      console.error('❌ Profile check failed:', profileError);
      return;
    }
    
    console.log('✅ Profile found:', {
      id: profileData.id,
      name: profileData.name,
      email: profileData.email,
      role: profileData.role
    });
    
    // Test 3: Test authentication
    console.log('🔐 Testing authentication...');
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'hoang@shopwithus.com',
      password: 'hoang123@'
    });
    
    if (authError) {
      console.error('❌ Authentication failed:', authError.message);
      return;
    }
    
    console.log('✅ Authentication successful!');
    console.log('🆔 User ID:', authData.user.id);
    console.log('📧 Email:', authData.user.email);
    
    // Test 4: Check session
    console.log('🎫 Checking session...');
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('❌ Session check failed:', sessionError);
      return;
    }
    
    if (sessionData.session) {
      console.log('✅ Session active!');
      console.log('⏰ Expires at:', new Date(sessionData.session.expires_at * 1000));
    } else {
      console.log('⚠️ No active session');
    }
    
    console.log('');
    console.log('🎉 All tests passed! Supabase is working correctly.');
    console.log('');
    console.log('🌐 You can now login to your web application with:');
    console.log('   Email: hoang@shopwithus.com');
    console.log('   Password: hoang123@');
    
  } catch (error) {
    console.error('💥 Unexpected error:', error);
  }
}

// Run the test
testSupabaseConnection();
