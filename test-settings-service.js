const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.log('❌ Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSettingsService() {
  try {
    console.log('🔄 Testing Settings Service...');
    
    // Test system settings
    console.log('\n📊 Testing System Settings...');
    const { data: systemData, error: systemError } = await supabase
      .from('system_settings')
      .select('*')
      .single();
    
    if (systemError) {
      console.log('⚠️  System settings table not found, creating...');
      
      // Create system settings table
      const createSystemSettings = `
        CREATE TABLE IF NOT EXISTS public.system_settings (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          site_name TEXT NOT NULL DEFAULT 'Affiliate Store',
          site_description TEXT DEFAULT 'Modern affiliate marketing website',
          currency TEXT NOT NULL DEFAULT 'USD',
          maintenance_mode BOOLEAN DEFAULT FALSE,
          allow_registration BOOLEAN DEFAULT TRUE,
          max_products_per_page INTEGER DEFAULT 20,
          enable_reviews BOOLEAN DEFAULT TRUE,
          enable_wishlist BOOLEAN DEFAULT TRUE,
          enable_coupons BOOLEAN DEFAULT TRUE,
          default_language TEXT DEFAULT 'en',
          timezone TEXT DEFAULT 'UTC',
          contact_email TEXT,
          contact_phone TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
      `;
      
      const { error: createError } = await supabase.rpc('exec_sql', { sql: createSystemSettings });
      if (createError) {
        console.log('❌ Error creating system settings table:', createError.message);
      } else {
        console.log('✅ System settings table created successfully!');
      }
    } else {
      console.log('✅ System settings table exists');
      console.log('📋 Current system settings:', systemData);
    }
    
    // Test email settings
    console.log('\n📧 Testing Email Settings...');
    const { data: emailData, error: emailError } = await supabase
      .from('email_settings')
      .select('*')
      .single();
    
    if (emailError) {
      console.log('⚠️  Email settings table not found, creating...');
      
      // Create email settings table
      const createEmailSettings = `
        CREATE TABLE IF NOT EXISTS public.email_settings (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          smtp_host TEXT,
          smtp_port INTEGER DEFAULT 587,
          smtp_username TEXT,
          smtp_password TEXT,
          smtp_secure BOOLEAN DEFAULT FALSE,
          from_email TEXT,
          from_name TEXT DEFAULT 'Affiliate Store',
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
      `;
      
      const { error: createError } = await supabase.rpc('exec_sql', { sql: createEmailSettings });
      if (createError) {
        console.log('❌ Error creating email settings table:', createError.message);
      } else {
        console.log('✅ Email settings table created successfully!');
      }
    } else {
      console.log('✅ Email settings table exists');
      console.log('📋 Current email settings:', emailData);
    }
    
    // Test payment settings
    console.log('\n💳 Testing Payment Settings...');
    const { data: paymentData, error: paymentError } = await supabase
      .from('payment_settings')
      .select('*')
      .single();
    
    if (paymentError) {
      console.log('⚠️  Payment settings table not found, creating...');
      
      // Create payment settings table
      const createPaymentSettings = `
        CREATE TABLE IF NOT EXISTS public.payment_settings (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          stripe_public_key TEXT,
          stripe_secret_key TEXT,
          paypal_client_id TEXT,
          paypal_client_secret TEXT,
          default_payment_method TEXT DEFAULT 'stripe',
          currency TEXT DEFAULT 'USD',
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
      `;
      
      const { error: createError } = await supabase.rpc('exec_sql', { sql: createPaymentSettings });
      if (createError) {
        console.log('❌ Error creating payment settings table:', createError.message);
      } else {
        console.log('✅ Payment settings table created successfully!');
      }
    } else {
      console.log('✅ Payment settings table exists');
      console.log('📋 Current payment settings:', paymentData);
    }
    
    console.log('\n🎉 Settings Service test completed!');
    
  } catch (error) {
    console.error('❌ Error testing settings service:', error.message);
  }
}

testSettingsService();

