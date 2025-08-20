-- Set Admin Role for User
-- Run this SQL in your Supabase SQL Editor after creating the user

-- Set admin role for the user
UPDATE profiles SET role = 'admin' WHERE email = 'admin@shopwithus.com';

-- Verify the change
SELECT id, name, email, role FROM profiles WHERE email = 'admin@shopwithus.com';
