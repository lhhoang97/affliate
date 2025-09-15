const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://rlgjpejeulxvfatwvniq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJsZ2pwZWpldWx4dmZhdHd2bmlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3MDk0ODAsImV4cCI6MjA3MTI4NTQ4MH0.2d3RgtqDg-3PSuK85smraSgo7Zt2WYymQzRa8bgNltg';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testEmailWithAuth() {
  try {
    console.log('🔐 Testing Email System with Authentication...\n');
    
    // Step 1: Login as hoang user
    console.log('1. Logging in as hoang user...');
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
    
    // Step 2: Test email_logs insert with authenticated user
    console.log('\n2. Testing email_logs insert...');
    const { data: emailData, error: emailError } = await supabase
      .from('email_logs')
      .insert({
        user_id: authData.user.id,
        to_email: 'hoang@shopwithus.com',
        subject: 'Test Email from BestFinds',
        email_type: 'welcome',
        status: 'pending'
      })
      .select();
    
    if (emailError) {
      console.error('❌ Email insert failed:', emailError.message);
    } else {
      console.log('✅ Email insert successful!');
      console.log('📧 Created email log:', emailData[0].id);
    }
    
    // Step 3: Test price_alerts upsert
    console.log('\n3. Testing price_alerts upsert...');
    const { data: alertData, error: alertError } = await supabase
      .rpc('upsert_price_alert', {
        p_user_id: authData.user.id,
        p_product_id: '62762597-9f72-44ca-89c6-15808e5b570a', // Samsung Galaxy S21
        p_target_price: 700.00,
        p_is_active: true
      });
    
    if (alertError) {
      console.error('❌ Price alert upsert failed:', alertError.message);
    } else {
      console.log('✅ Price alert upsert successful!');
      console.log('🔔 Created/Updated price alert:', alertData);
    }
    
    // Step 4: Test reading email logs
    console.log('\n4. Testing email logs read...');
    const { data: logsData, error: logsError } = await supabase
      .from('email_logs')
      .select('*')
      .eq('user_id', authData.user.id);
    
    if (logsError) {
      console.error('❌ Email logs read failed:', logsError.message);
    } else {
      console.log('✅ Email logs read successful!');
      console.log('📊 Found', logsData.length, 'email logs');
    }
    
    // Step 5: Test reading price alerts
    console.log('\n5. Testing price alerts read...');
    const { data: alertsData, error: alertsError } = await supabase
      .from('price_alerts')
      .select('*')
      .eq('user_id', authData.user.id);
    
    if (alertsError) {
      console.error('❌ Price alerts read failed:', alertsError.message);
    } else {
      console.log('✅ Price alerts read successful!');
      console.log('📊 Found', alertsData.length, 'price alerts');
    }
    
    console.log('\n🎉 Email System Test with Authentication Completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testEmailWithAuth();
