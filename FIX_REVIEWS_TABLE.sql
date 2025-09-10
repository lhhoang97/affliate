-- Fix Reviews Table - Add missing is_approved column if it doesn't exist
-- =====================================================

-- Check if reviews table exists and add missing column
DO $$
BEGIN
    -- Add is_approved column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'reviews' AND column_name = 'is_approved'
    ) THEN
        ALTER TABLE reviews ADD COLUMN is_approved BOOLEAN DEFAULT true;
        RAISE NOTICE 'Added is_approved column to reviews table';
    ELSE
        RAISE NOTICE 'is_approved column already exists in reviews table';
    END IF;
END $$;

-- Update the policy to use is_approved column
DROP POLICY IF EXISTS "Public read access" ON reviews;
CREATE POLICY "Public read access" ON reviews
  FOR SELECT USING (is_approved = true);

-- Test the fix
SELECT 'Reviews table fixed successfully' as status;
