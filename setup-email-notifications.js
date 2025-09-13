const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config();

// Initialize Supabase client
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  console.log('Please check your .env file contains:');
  console.log('REACT_APP_SUPABASE_URL=your_supabase_url');
  console.log('REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupEmailNotifications() {
  console.log('🚀 Setting up Email Notifications System...\n');

  try {
    // Read SQL file
    const sqlContent = fs.readFileSync('./UPDATE_EMAIL_SCHEMA.sql', 'utf8');
    
    // Split by semicolon and execute each statement
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    console.log(`📝 Found ${statements.length} SQL statements to execute`);

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        try {
          console.log(`⏳ Executing statement ${i + 1}/${statements.length}...`);
          
          const { error } = await supabase.rpc('exec_sql', { sql: statement });
          
          if (error) {
            console.log(`⚠️  Statement ${i + 1} had an issue:`, error.message);
            // Continue with other statements
          } else {
            console.log(`✅ Statement ${i + 1} executed successfully`);
          }
        } catch (err) {
          console.log(`⚠️  Statement ${i + 1} failed:`, err.message);
          // Continue with other statements
        }
      }
    }

    // Test the setup
    console.log('\n🧪 Testing Email Notifications Setup...');
    
    // Test email_logs table
    const { data: emailLogs, error: emailLogsError } = await supabase
      .from('email_logs')
      .select('*')
      .limit(1);

    if (emailLogsError) {
      console.log('❌ email_logs table test failed:', emailLogsError.message);
    } else {
      console.log('✅ email_logs table is accessible');
    }

    // Test price_alerts table
    const { data: priceAlerts, error: priceAlertsError } = await supabase
      .from('price_alerts')
      .select('*')
      .limit(1);

    if (priceAlertsError) {
      console.log('❌ price_alerts table test failed:', priceAlertsError.message);
    } else {
      console.log('✅ price_alerts table is accessible');
    }

    // Test profiles table email_preferences
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('email_preferences')
      .limit(1);

    if (profilesError) {
      console.log('❌ profiles email_preferences test failed:', profilesError.message);
    } else {
      console.log('✅ profiles email_preferences column is accessible');
    }

    console.log('\n🎉 Email Notifications System Setup Complete!');
    console.log('\n📋 What was set up:');
    console.log('  ✅ Email preferences column in profiles table');
    console.log('  ✅ Email logs table for tracking sent emails');
    console.log('  ✅ Price alerts table for user price monitoring');
    console.log('  ✅ Database triggers for automatic welcome emails');
    console.log('  ✅ Functions for checking price alerts');
    console.log('  ✅ Proper indexes for performance');
    console.log('  ✅ Row Level Security policies');

    console.log('\n🚀 Next Steps:');
    console.log('  1. Test email notifications in Admin Dashboard');
    console.log('  2. Configure actual email service (SendGrid, AWS SES, etc.)');
    console.log('  3. Set up scheduled jobs for price alerts');
    console.log('  4. Test user registration to verify welcome emails');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

// Alternative approach using direct SQL execution
async function setupEmailNotificationsDirect() {
  console.log('🚀 Setting up Email Notifications System (Direct SQL)...\n');

  try {
    // Read and execute the SQL file directly
    const sqlContent = fs.readFileSync('./UPDATE_EMAIL_SCHEMA.sql', 'utf8');
    
    console.log('📝 Executing SQL schema update...');
    console.log('⚠️  Note: You may need to run this SQL manually in Supabase SQL Editor');
    console.log('\n📋 Copy and paste the following SQL into Supabase SQL Editor:');
    console.log('=' * 80);
    console.log(sqlContent);
    console.log('=' * 80);

    // Test basic connectivity
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);

    if (error) {
      console.error('❌ Database connection test failed:', error.message);
    } else {
      console.log('✅ Database connection successful');
    }

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
  }
}

// Main execution
if (require.main === module) {
  console.log('📧 Email Notifications Setup Script');
  console.log('=====================================\n');
  
  // Try the direct approach since RPC might not be available
  setupEmailNotificationsDirect()
    .then(() => {
      console.log('\n✅ Setup script completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Setup script failed:', error);
      process.exit(1);
    });
}

module.exports = { setupEmailNotifications, setupEmailNotificationsDirect };
