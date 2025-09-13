const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.log('❌ Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createSettingsTables() {
  try {
    console.log('🔄 Creating settings tables...');
    
    // Create system settings table
    console.log('\n📊 Creating system_settings table...');
    const { error: systemError } = await supabase
      .from('system_settings')
      .select('id')
      .limit(1);
    
    if (systemError && systemError.code === 'PGRST116') {
      console.log('⚠️  system_settings table does not exist');
      console.log('📝 Please create the table manually in Supabase SQL Editor:');
      console.log(`
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

-- Enable RLS
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow authenticated users to read system settings" ON public.system_settings
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow admin users to manage system settings" ON public.system_settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Insert default data
INSERT INTO public.system_settings (
  site_name,
  site_description,
  currency,
  maintenance_mode,
  allow_registration,
  max_products_per_page,
  enable_reviews,
  enable_wishlist,
  enable_coupons,
  default_language,
  timezone,
  contact_email,
  contact_phone
) VALUES (
  'Affiliate Store',
  'Modern affiliate marketing website with SlickDeals-inspired design',
  'USD',
  FALSE,
  TRUE,
  20,
  TRUE,
  TRUE,
  TRUE,
  'en',
  'UTC',
  'admin@affiliatestore.com',
  '+1-555-0123'
) ON CONFLICT DO NOTHING;
      `);
    } else if (systemError) {
      console.log('❌ Error checking system_settings table:', systemError.message);
    } else {
      console.log('✅ system_settings table exists');
    }
    
    // Create email settings table
    console.log('\n📧 Creating email_settings table...');
    const { error: emailError } = await supabase
      .from('email_settings')
      .select('id')
      .limit(1);
    
    if (emailError && emailError.code === 'PGRST116') {
      console.log('⚠️  email_settings table does not exist');
      console.log('📝 Please create the table manually in Supabase SQL Editor:');
      console.log(`
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

-- Enable RLS
ALTER TABLE public.email_settings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow authenticated users to read email settings" ON public.email_settings
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow admin users to manage email settings" ON public.email_settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Insert default data
INSERT INTO public.email_settings (
  smtp_host,
  smtp_port,
  smtp_secure,
  from_email,
  from_name
) VALUES (
  'smtp.gmail.com',
  587,
  FALSE,
  'noreply@affiliatestore.com',
  'Affiliate Store'
) ON CONFLICT DO NOTHING;
      `);
    } else if (emailError) {
      console.log('❌ Error checking email_settings table:', emailError.message);
    } else {
      console.log('✅ email_settings table exists');
    }
    
    // Create payment settings table
    console.log('\n💳 Creating payment_settings table...');
    const { error: paymentError } = await supabase
      .from('payment_settings')
      .select('id')
      .limit(1);
    
    if (paymentError && paymentError.code === 'PGRST116') {
      console.log('⚠️  payment_settings table does not exist');
      console.log('📝 Please create the table manually in Supabase SQL Editor:');
      console.log(`
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

-- Enable RLS
ALTER TABLE public.payment_settings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow authenticated users to read payment settings" ON public.payment_settings
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow admin users to manage payment settings" ON public.payment_settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Insert default data
INSERT INTO public.payment_settings (
  default_payment_method,
  currency
) VALUES (
  'stripe',
  'USD'
) ON CONFLICT DO NOTHING;
      `);
    } else if (paymentError) {
      console.log('❌ Error checking payment_settings table:', paymentError.message);
    } else {
      console.log('✅ payment_settings table exists');
    }
    
    console.log('\n🎉 Settings tables setup completed!');
    console.log('\n📋 Next steps:');
    console.log('1. Copy the SQL commands above');
    console.log('2. Go to your Supabase project');
    console.log('3. Open SQL Editor');
    console.log('4. Paste and run the SQL commands');
    console.log('5. Test the AdminSettingsPage at /admin/settings');
    
  } catch (error) {
    console.error('❌ Error creating settings tables:', error.message);
  }
}

createSettingsTables();

