-- Fix Row Level Security policies for profiles table
-- This will allow users to create their own profiles during registration

-- First, check if RLS is enabled
-- SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'profiles';

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

-- Create new policies that allow profile creation during registration
CREATE POLICY "Users can insert their own profile" ON profiles
    FOR INSERT 
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view their own profile" ON profiles
    FOR SELECT 
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
    FOR UPDATE 
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Alternative: If you want to allow profile creation without authentication
-- (for registration process), you can temporarily disable RLS or create a more permissive policy

-- Option 1: Temporarily disable RLS for testing
-- ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Option 2: Create a more permissive policy for registration
-- DROP POLICY IF EXISTS "Allow profile creation during registration" ON profiles;
-- CREATE POLICY "Allow profile creation during registration" ON profiles
--     FOR INSERT 
--     WITH CHECK (true); -- Allow any insert during registration

-- Option 3: Use a function to handle profile creation
-- CREATE OR REPLACE FUNCTION public.handle_new_user()
-- RETURNS trigger AS $$
-- BEGIN
--   INSERT INTO public.profiles (id, name, email, role, is_verified)
--   VALUES (new.id, new.raw_user_meta_data->>'name', new.email, 'user', false);
--   RETURN new;
-- END;
-- $$ LANGUAGE plpgsql SECURITY DEFINER;

-- CREATE TRIGGER on_auth_user_created
--   AFTER INSERT ON auth.users
--   FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
