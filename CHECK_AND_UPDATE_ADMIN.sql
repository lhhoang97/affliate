-- Check and Update Admin User
-- This script checks if admin user exists and updates it if needed

-- Step 1: Check if admin user exists
SELECT * FROM profiles WHERE email = 'admin@shopwithus.com';

-- Step 2: If admin user exists, update it to admin role
UPDATE profiles 
SET role = 'admin', 
    name = 'Admin User',
    updated_at = NOW()
WHERE email = 'admin@shopwithus.com';

-- Step 3: Verify the update
SELECT * FROM profiles WHERE email = 'admin@shopwithus.com';

-- Step 4: Check if user exists in Supabase Auth
-- Go to Authentication > Users in Supabase Dashboard
-- Look for user with email: admin@shopwithus.com
-- If not found, create it manually with:
-- Email: admin@shopwithus.com
-- Password: Admin123!@#
-- Email Confirm: ✅

-- Step 5: Test login credentials
-- Email: admin@shopwithus.com
-- Password: Admin123!@#
