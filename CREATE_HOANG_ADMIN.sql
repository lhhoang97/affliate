-- Create Admin User for hoang@shopwithus.com
-- This script adds the new user to the profiles table with admin role

-- Step 1: Get the User ID from Supabase Auth
-- Go to Supabase Dashboard > Authentication > Users
-- Find user with email: hoang@shopwithus.com
-- Copy the User ID (it looks like: 12345678-1234-1234-1234-123456789abc)

-- Step 2: Insert the admin profile into the profiles table
-- Replace 'YOUR_USER_ID_HERE' with the actual User ID from Step 1

INSERT INTO profiles (
  id,
  email,
  name,
  role,
  created_at,
  updated_at
) VALUES (
  '36e2c0ba-9d84-4834-a03a-facea24aa45a', -- Replace with actual User ID from Supabase Auth
  'hoang@shopwithus.com',
  'Hoang Admin',
  'admin',
  NOW(),
  NOW()
);

-- Step 3: Verify the admin user was created
SELECT * FROM profiles WHERE email = 'hoang@shopwithus.com';

-- Step 4: Test the login
-- Go to your web application and try to login with:
-- Email: hoang@shopwithus.com
-- Password: hoang123@

-- Alternative: If you want to update an existing user to admin role
-- UPDATE profiles SET role = 'admin' WHERE email = 'hoang@shopwithus.com';
