-- Fix email_settings table schema
-- This will drop and recreate the table with correct schema

-- Drop existing table if it exists
DROP TABLE IF EXISTS email_settings CASCADE;

-- Create email_settings table with correct schema
CREATE TABLE email_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    value TEXT,
    description TEXT,
    is_encrypted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE email_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Allow authenticated read email_settings" ON email_settings
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated write email_settings" ON email_settings
    FOR ALL USING (auth.role() = 'authenticated');

-- Insert default email settings
INSERT INTO email_settings (key, value, description, is_encrypted) VALUES
('smtp_host', '', 'SMTP server host', false),
('smtp_port', '587', 'SMTP server port', false),
('smtp_username', '', 'SMTP username', true),
('smtp_password', '', 'SMTP password', true),
('from_email', 'noreply@bestfinds.com', 'Default from email', false),
('from_name', 'BestFinds', 'Default from name', false);

-- Add trigger to email_settings table
CREATE TRIGGER update_email_settings_updated_at 
    BEFORE UPDATE ON email_settings 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
