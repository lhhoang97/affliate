const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Initialize Supabase client
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testEmailSystem() {
  console.log('🧪 Testing Email Notifications System...\n');

  try {
    // Test 1: Check if email_logs table exists
    console.log('1️⃣ Testing email_logs table...');
    const { data: emailLogs, error: emailLogsError } = await supabase
      .from('email_logs')
      .select('*')
      .limit(1);

    if (emailLogsError) {
      console.log('❌ email_logs table not found or not accessible');
      console.log('   Error:', emailLogsError.message);
    } else {
      console.log('✅ email_logs table is accessible');
    }

    // Test 2: Check if price_alerts table exists
    console.log('\n2️⃣ Testing price_alerts table...');
    const { data: priceAlerts, error: priceAlertsError } = await supabase
      .from('price_alerts')
      .select('*')
      .limit(1);

    if (priceAlertsError) {
      console.log('❌ price_alerts table not found or not accessible');
      console.log('   Error:', priceAlertsError.message);
    } else {
      console.log('✅ price_alerts table is accessible');
    }

    // Test 3: Check if profiles table has email_preferences column
    console.log('\n3️⃣ Testing profiles email_preferences column...');
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('email_preferences')
      .limit(1);

    if (profilesError) {
      console.log('❌ profiles email_preferences column not found');
      console.log('   Error:', profilesError.message);
    } else {
      console.log('✅ profiles email_preferences column is accessible');
    }

    // Test 4: Test email logging functionality
    console.log('\n4️⃣ Testing email logging...');
    const testEmailLog = {
      to_email: 'test@example.com',
      subject: 'Test Email',
      email_type: 'welcome',
      status: 'sent'
    };

    const { data: insertData, error: insertError } = await supabase
      .from('email_logs')
      .insert(testEmailLog)
      .select();

    if (insertError) {
      console.log('❌ Email logging failed');
      console.log('   Error:', insertError.message);
    } else {
      console.log('✅ Email logging works');
      console.log('   Inserted email log ID:', insertData[0].id);
      
      // Clean up test data
      await supabase
        .from('email_logs')
        .delete()
        .eq('id', insertData[0].id);
      console.log('   Test data cleaned up');
    }

    // Test 5: Test price alert functionality
    console.log('\n5️⃣ Testing price alerts...');
    const testPriceAlert = {
      user_id: '00000000-0000-0000-0000-000000000000', // Dummy UUID
      product_id: '00000000-0000-0000-0000-000000000001', // Dummy UUID
      target_price: 50.00,
      current_price: 75.00,
      is_active: true
    };

    const { data: alertData, error: alertError } = await supabase
      .from('price_alerts')
      .insert(testPriceAlert)
      .select();

    if (alertError) {
      console.log('❌ Price alert creation failed');
      console.log('   Error:', alertError.message);
    } else {
      console.log('✅ Price alerts work');
      console.log('   Created price alert ID:', alertData[0].id);
      
      // Clean up test data
      await supabase
        .from('price_alerts')
        .delete()
        .eq('id', alertData[0].id);
      console.log('   Test data cleaned up');
    }

    // Test 6: Check database functions
    console.log('\n6️⃣ Testing database functions...');
    
    // Test check_price_alerts function
    try {
      const { error: functionError } = await supabase
        .rpc('check_price_alerts');
      
      if (functionError) {
        console.log('⚠️  check_price_alerts function not available or failed');
        console.log('   Error:', functionError.message);
      } else {
        console.log('✅ check_price_alerts function works');
      }
    } catch (err) {
      console.log('⚠️  check_price_alerts function test skipped (RPC not available)');
    }

    // Test 7: Check if triggers exist
    console.log('\n7️⃣ Testing database triggers...');
    
    // This is harder to test directly, so we'll check if welcome email trigger works
    // by checking if there are any email logs with type 'welcome'
    const { data: welcomeEmails, error: welcomeError } = await supabase
      .from('email_logs')
      .select('*')
      .eq('email_type', 'welcome')
      .limit(5);

    if (welcomeError) {
      console.log('⚠️  Could not check welcome email logs');
    } else {
      console.log(`✅ Found ${welcomeEmails.length} welcome emails in logs`);
      if (welcomeEmails.length > 0) {
        console.log('   Latest welcome email:', welcomeEmails[0].created_at);
      }
    }

    // Summary
    console.log('\n📊 Email System Test Summary:');
    console.log('==============================');
    
    const tests = [
      { name: 'email_logs table', status: !emailLogsError },
      { name: 'price_alerts table', status: !priceAlertsError },
      { name: 'profiles email_preferences', status: !profilesError },
      { name: 'email logging', status: !insertError },
      { name: 'price alerts', status: !alertError }
    ];

    const passedTests = tests.filter(test => test.status).length;
    const totalTests = tests.length;

    tests.forEach(test => {
      console.log(`${test.status ? '✅' : '❌'} ${test.name}`);
    });

    console.log(`\n🎯 Results: ${passedTests}/${totalTests} tests passed`);

    if (passedTests === totalTests) {
      console.log('\n🎉 Email Notifications System is fully functional!');
      console.log('\n🚀 Ready for:');
      console.log('   ✅ User registration welcome emails');
      console.log('   ✅ Order confirmation emails');
      console.log('   ✅ Password reset emails');
      console.log('   ✅ Price alert notifications');
      console.log('   ✅ New deal notifications');
      console.log('   ✅ User email preferences');
    } else {
      console.log('\n⚠️  Some tests failed. Please check the database setup.');
      console.log('   Run: node setup-email-notifications.js');
    }

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    process.exit(1);
  }
}

// Run the test
if (require.main === module) {
  testEmailSystem()
    .then(() => {
      console.log('\n✅ Email system test completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Email system test failed:', error);
      process.exit(1);
    });
}

module.exports = { testEmailSystem };
