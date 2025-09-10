-- Quick Settings Setup - No Policies
-- Copy and paste this into Supabase SQL Editor

-- Create System Settings Table
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

-- Create Email Settings Table
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

-- Create Payment Settings Table
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

-- Insert Default System Settings
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

-- Insert Default Email Settings
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

-- Insert Default Payment Settings
INSERT INTO public.payment_settings (
  default_payment_method,
  currency
) VALUES (
  'stripe',
  'USD'
) ON CONFLICT DO NOTHING;
