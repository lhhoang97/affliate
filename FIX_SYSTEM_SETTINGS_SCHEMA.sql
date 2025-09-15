-- Fix system_settings table schema
-- This will drop and recreate the table with correct schema

-- Drop existing table if it exists
DROP TABLE IF EXISTS system_settings CASCADE;

-- Create system_settings table with correct schema
CREATE TABLE system_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    value TEXT,
    description TEXT,
    category TEXT DEFAULT 'general',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Allow authenticated read system_settings" ON system_settings
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated write system_settings" ON system_settings
    FOR ALL USING (auth.role() = 'authenticated');

-- Insert default system settings
INSERT INTO system_settings (key, value, description, category) VALUES
('site_name', 'BestFinds', 'Website name', 'general'),
('site_description', 'Your trusted affiliate shopping platform', 'Website description', 'general'),
('currency', 'USD', 'Default currency', 'general'),
('timezone', 'UTC', 'Default timezone', 'general'),
('maintenance_mode', 'false', 'Maintenance mode status', 'system');

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add trigger to system_settings table
CREATE TRIGGER update_system_settings_updated_at 
    BEFORE UPDATE ON system_settings 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
