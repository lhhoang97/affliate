-- Reset Admin User
-- This script deletes the existing admin user and creates a new one

-- Step 1: Delete existing admin user from profiles table
DELETE FROM profiles WHERE email = 'admin@shopwithus.com';

-- Step 2: Verify deletion
SELECT * FROM profiles WHERE email = 'admin@shopwithus.com';

-- Step 3: Create new admin user
-- First, create user in Supabase Auth:
-- Go to Authentication > Users > Add User
-- Email: admin@shopwithus.com
-- Password: Admin123!@#
-- Email Confirm: ✅

-- Step 4: After creating auth user, get the User ID and run:
INSERT INTO profiles (
  id,
  email,
  name,
  role,
  created_at,
  updated_at
) VALUES (
  '36e2c0ba-9d84-4834-a03a-facea24aa45a', -- Replace with actual User ID from Supabase Auth
  'admin@shopwithus.com',
  'Admin User',
  'admin',
  NOW(),
  NOW()
);

-- Step 5: Verify new admin user
SELECT * FROM profiles WHERE email = 'admin@shopwithus.com';

-- Step 6: Test login
-- Go to your web application and login with:
-- Email: admin@shopwithus.com
-- Password: Admin123!@#
