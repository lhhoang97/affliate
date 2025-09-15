-- Fix RLS Policies for Email System
-- Run this in Supabase SQL Editor

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own email logs" ON email_logs;
DROP POLICY IF EXISTS "Service can manage email logs" ON email_logs;
DROP POLICY IF EXISTS "Users can manage own price alerts" ON price_alerts;

-- Create new policies for email_logs
CREATE POLICY "Users can view own email logs" ON email_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own email logs" ON email_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service can manage email logs" ON email_logs
  FOR ALL USING (auth.role() = 'service_role');

-- Create new policies for price_alerts
CREATE POLICY "Users can manage own price alerts" ON price_alerts
  FOR ALL USING (auth.uid() = user_id);

-- Grant additional permissions
GRANT INSERT ON email_logs TO authenticated;
GRANT INSERT ON price_alerts TO authenticated;
GRANT UPDATE ON email_logs TO authenticated;
GRANT UPDATE ON price_alerts TO authenticated;
