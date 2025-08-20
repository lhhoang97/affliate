-- Create Admin User in Supabase Auth and Profiles
-- Run this SQL in your Supabase SQL Editor

-- First, create the user in auth.users (this should be done via Supabase Dashboard)
-- Go to Authentication → Users → Add User
-- Email: admin@shopwithus.com
-- Password: admin123456

-- Then, create the profile in profiles table
INSERT INTO profiles (id, name, email, role, is_verified, created_at, updated_at) 
VALUES (
  '00000000-0000-0000-0000-000000000001', -- Replace with actual user ID from auth.users
  'Admin User',
  'admin@shopwithus.com',
  'admin',
  true,
  NOW(),
  NOW()
) ON CONFLICT (email) DO UPDATE SET
  role = 'admin',
  is_verified = true,
  updated_at = NOW();

-- Verify the admin user was created
SELECT id, name, email, role, is_verified FROM profiles WHERE email = 'admin@shopwithus.com';
