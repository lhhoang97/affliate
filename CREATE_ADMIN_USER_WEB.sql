-- Create Admin User for Web Login
-- This script creates an admin user that can be used to login from the web application

-- Step 1: Create the admin user in Supabase Auth
-- Go to your Supabase Dashboard > Authentication > Users
-- Click "Add User" and create with these details:
-- Email: admin@shopwithus.com
-- Password: Admin123!@#
-- (You can change this password later)

-- Step 2: After creating the user, get the User ID from the Users table
-- The User ID will be something like: 12345678-1234-1234-1234-123456789abc

-- Step 3: Insert the admin profile into the profiles table
-- Replace 'YOUR_USER_ID_HERE' with the actual User ID from Step 2

INSERT INTO profiles (
  id,
  email,
  full_name,
  role,
  created_at,
  updated_at
) VALUES (
  'YOUR_USER_ID_HERE', -- Replace with actual User ID from Supabase Auth
  'admin@shopwithus.com',
  'Admin User',
  'admin',
  NOW(),
  NOW()
);

-- Step 4: Verify the admin user was created
SELECT * FROM profiles WHERE email = 'admin@shopwithus.com';

-- Alternative: If you want to update an existing user to admin role
-- UPDATE profiles SET role = 'admin' WHERE email = 'admin@shopwithus.com';

-- Step 5: Test the login
-- Go to your web application and try to login with:
-- Email: admin@shopwithus.com
-- Password: Admin123!@#
