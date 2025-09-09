-- QUICK FIX: Allow public read access to products table
-- Run this in your Supabase SQL Editor

-- Step 1: Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can view products" ON products;
DROP POLICY IF EXISTS "Users can insert products" ON products;
DROP POLICY IF EXISTS "Users can update products" ON products;
DROP POLICY IF EXISTS "Users can delete products" ON products;

-- Step 2: Create new policy that allows public read access
CREATE POLICY "Allow public read access to products" ON products
    FOR SELECT 
    TO public
    USING (true);

-- Step 3: Create policies for authenticated users (admin functions)
CREATE POLICY "Allow authenticated users to insert products" ON products
    FOR INSERT 
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update products" ON products
    FOR UPDATE 
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete products" ON products
    FOR DELETE 
    TO authenticated
    USING (true);

-- Step 4: Ensure RLS is enabled
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Step 5: Test the fix
-- This should now return all products for anonymous users
SELECT COUNT(*) FROM products;
