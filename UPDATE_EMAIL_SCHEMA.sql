-- =====================================================
-- EMAIL NOTIFICATIONS SCHEMA UPDATE
-- =====================================================

-- Add email preferences to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS email_preferences JSONB DEFAULT '{
  "welcomeEmails": true,
  "orderEmails": true,
  "priceAlerts": true,
  "dealNotifications": true
}';

-- Create email logs table for tracking sent emails
CREATE TABLE IF NOT EXISTS email_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  to_email VARCHAR(255) NOT NULL,
  subject VARCHAR(500) NOT NULL,
  email_type VARCHAR(50) NOT NULL CHECK (email_type IN ('welcome', 'order_confirmation', 'password_reset', 'price_alert', 'new_deal')),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'bounced')),
  sent_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for email_logs
CREATE POLICY "Users can view own email logs" ON email_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service can manage email logs" ON email_logs
  FOR ALL USING (auth.role() = 'service_role');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_email_logs_user_id ON email_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_email_type ON email_logs(email_type);
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON email_logs(status);
CREATE INDEX IF NOT EXISTS idx_email_logs_sent_at ON email_logs(sent_at);

-- Create price alerts table for tracking user price alerts
CREATE TABLE IF NOT EXISTS price_alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  target_price DECIMAL(10,2) NOT NULL,
  current_price DECIMAL(10,2) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  last_notified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Enable Row Level Security
ALTER TABLE price_alerts ENABLE ROW LEVEL SECURITY;

-- Create policies for price_alerts
CREATE POLICY "Users can manage own price alerts" ON price_alerts
  FOR ALL USING (auth.uid() = user_id);

-- Create indexes for price_alerts
CREATE INDEX IF NOT EXISTS idx_price_alerts_user_id ON price_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_price_alerts_product_id ON price_alerts(product_id);
CREATE INDEX IF NOT EXISTS idx_price_alerts_active ON price_alerts(is_active);

-- Create function to automatically update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_email_logs_updated_at 
    BEFORE UPDATE ON email_logs 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_price_alerts_updated_at 
    BEFORE UPDATE ON price_alerts 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to send welcome email when user registers
CREATE OR REPLACE FUNCTION send_welcome_email()
RETURNS TRIGGER AS $$
BEGIN
    -- This would be called by your application after user registration
    -- The actual email sending is handled by the application layer
    INSERT INTO email_logs (user_id, to_email, subject, email_type, status)
    VALUES (
        NEW.id,
        NEW.email,
        'Welcome to BestFinds!',
        'welcome',
        'pending'
    );
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for welcome email
CREATE TRIGGER trigger_send_welcome_email
    AFTER INSERT ON profiles
    FOR EACH ROW EXECUTE FUNCTION send_welcome_email();

-- Create function to check price alerts
CREATE OR REPLACE FUNCTION check_price_alerts()
RETURNS void AS $$
BEGIN
    -- This function can be called by a scheduled job to check for price drops
    -- and send notifications to users who have set price alerts
    
    -- Update price alerts for products that have price decreases
    UPDATE price_alerts 
    SET 
        current_price = p.price,
        updated_at = NOW()
    FROM products p
    WHERE price_alerts.product_id = p.id 
    AND price_alerts.current_price != p.price
    AND price_alerts.is_active = true;
    
    -- Mark alerts that should trigger notifications
    UPDATE price_alerts 
    SET 
        last_notified_at = NOW(),
        updated_at = NOW()
    WHERE is_active = true 
    AND current_price <= target_price 
    AND (last_notified_at IS NULL OR last_notified_at < NOW() - INTERVAL '24 hours');
END;
$$ language 'plpgsql';

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON email_logs TO authenticated;
GRANT ALL ON price_alerts TO authenticated;

-- Add comments for documentation
COMMENT ON TABLE email_logs IS 'Tracks all emails sent to users for analytics and debugging';
COMMENT ON TABLE price_alerts IS 'User price alerts for products they want to monitor';
COMMENT ON COLUMN profiles.email_preferences IS 'User email notification preferences stored as JSON';
