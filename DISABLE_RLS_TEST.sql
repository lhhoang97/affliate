-- TEMPORARY: Disable RLS to test Supabase connection
-- Run this in Supabase SQL Editor

-- Disable RLS on products table
ALTER TABLE products DISABLE ROW LEVEL SECURITY;

-- Test query to verify access
SELECT COUNT(*) as product_count FROM products;

-- Re-enable RLS after testing (uncomment when done)
-- ALTER TABLE products ENABLE ROW LEVEL SECURITY;
