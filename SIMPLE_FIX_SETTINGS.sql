-- Simple fix for Settings Service - Create tables directly
-- This will create the settings tables without needing exec_sql function

-- Create system_settings table
CREATE TABLE IF NOT EXISTS system_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    value TEXT,
    description TEXT,
    category TEXT DEFAULT 'general',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create email_settings table
CREATE TABLE IF NOT EXISTS email_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    value TEXT,
    description TEXT,
    is_encrypted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create payment_settings table
CREATE TABLE IF NOT EXISTS payment_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    value TEXT,
    description TEXT,
    is_encrypted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all settings tables
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for system_settings
DROP POLICY IF EXISTS "Allow authenticated read system_settings" ON system_settings;
DROP POLICY IF EXISTS "Allow authenticated write system_settings" ON system_settings;

CREATE POLICY "Allow authenticated read system_settings" ON system_settings
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated write system_settings" ON system_settings
    FOR ALL USING (auth.role() = 'authenticated');

-- Create RLS policies for email_settings
DROP POLICY IF EXISTS "Allow authenticated read email_settings" ON email_settings;
DROP POLICY IF EXISTS "Allow authenticated write email_settings" ON email_settings;

CREATE POLICY "Allow authenticated read email_settings" ON email_settings
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated write email_settings" ON email_settings
    FOR ALL USING (auth.role() = 'authenticated');

-- Create RLS policies for payment_settings
DROP POLICY IF EXISTS "Allow authenticated read payment_settings" ON payment_settings;
DROP POLICY IF EXISTS "Allow authenticated write payment_settings" ON payment_settings;

CREATE POLICY "Allow authenticated read payment_settings" ON payment_settings
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated write payment_settings" ON payment_settings
    FOR ALL USING (auth.role() = 'authenticated');

-- Insert default system settings
INSERT INTO system_settings (key, value, description, category) VALUES
('site_name', 'BestFinds', 'Website name', 'general'),
('site_description', 'Your trusted affiliate shopping platform', 'Website description', 'general'),
('currency', 'USD', 'Default currency', 'general'),
('timezone', 'UTC', 'Default timezone', 'general'),
('maintenance_mode', 'false', 'Maintenance mode status', 'system')
ON CONFLICT (key) DO NOTHING;

-- Insert default email settings
INSERT INTO email_settings (key, value, description, is_encrypted) VALUES
('smtp_host', '', 'SMTP server host', false),
('smtp_port', '587', 'SMTP server port', false),
('smtp_username', '', 'SMTP username', true),
('smtp_password', '', 'SMTP password', true),
('from_email', 'noreply@bestfinds.com', 'Default from email', false),
('from_name', 'BestFinds', 'Default from name', false)
ON CONFLICT (key) DO NOTHING;

-- Insert default payment settings
INSERT INTO payment_settings (key, value, description, is_encrypted) VALUES
('paypal_client_id', '', 'PayPal client ID', true),
('paypal_client_secret', '', 'PayPal client secret', true),
('paypal_mode', 'sandbox', 'PayPal mode (sandbox/live)', false),
('stripe_public_key', '', 'Stripe public key', false),
('stripe_secret_key', '', 'Stripe secret key', true)
ON CONFLICT (key) DO NOTHING;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers to all settings tables
DROP TRIGGER IF EXISTS update_system_settings_updated_at ON system_settings;
CREATE TRIGGER update_system_settings_updated_at 
    BEFORE UPDATE ON system_settings 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_email_settings_updated_at ON email_settings;
CREATE TRIGGER update_email_settings_updated_at 
    BEFORE UPDATE ON email_settings 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_payment_settings_updated_at ON payment_settings;
CREATE TRIGGER update_payment_settings_updated_at 
    BEFORE UPDATE ON payment_settings 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
