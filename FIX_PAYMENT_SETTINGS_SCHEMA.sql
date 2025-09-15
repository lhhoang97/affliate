-- Fix payment_settings table schema
-- This will drop and recreate the table with correct schema

-- Drop existing table if it exists
DROP TABLE IF EXISTS payment_settings CASCADE;

-- Create payment_settings table with correct schema
CREATE TABLE payment_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    value TEXT,
    description TEXT,
    is_encrypted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE payment_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Allow authenticated read payment_settings" ON payment_settings
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated write payment_settings" ON payment_settings
    FOR ALL USING (auth.role() = 'authenticated');

-- Insert default payment settings
INSERT INTO payment_settings (key, value, description, is_encrypted) VALUES
('paypal_client_id', '', 'PayPal client ID', true),
('paypal_client_secret', '', 'PayPal client secret', true),
('paypal_mode', 'sandbox', 'PayPal mode (sandbox/live)', false),
('stripe_public_key', '', 'Stripe public key', false),
('stripe_secret_key', '', 'Stripe secret key', true);

-- Add trigger to payment_settings table
CREATE TRIGGER update_payment_settings_updated_at 
    BEFORE UPDATE ON payment_settings 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
