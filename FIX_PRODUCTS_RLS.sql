-- Fix Row Level Security policies for products table
-- This will allow public read access to products

-- Step 1: Check current RLS status
-- SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'products';

-- Step 2: Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can view products" ON products;
DROP POLICY IF EXISTS "Users can insert products" ON products;
DROP POLICY IF EXISTS "Users can update products" ON products;
DROP POLICY IF EXISTS "Users can delete products" ON products;

-- Step 3: Create new policies that allow public read access
CREATE POLICY "Allow public read access to products" ON products
    FOR SELECT 
    TO public
    USING (true);

-- Step 4: Create policies for authenticated users (admin functions)
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

-- Step 5: Ensure RLS is enabled
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Step 6: Test the policies
-- This should return all products for anonymous users
-- SELECT COUNT(*) FROM products;
