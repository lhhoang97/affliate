-- Fix Price Alerts duplicate key issue
-- This will handle duplicate price alerts gracefully

-- First, let's check if price_alerts table exists and its structure
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'price_alerts') THEN
        -- Add a unique constraint with ON CONFLICT handling if it doesn't exist
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.table_constraints 
            WHERE constraint_name = 'price_alerts_user_id_product_id_key'
        ) THEN
            ALTER TABLE price_alerts 
            ADD CONSTRAINT price_alerts_user_id_product_id_key 
            UNIQUE (user_id, product_id);
        END IF;
        
        -- Create or replace function to handle price alert upsert
        CREATE OR REPLACE FUNCTION upsert_price_alert(
            p_user_id UUID,
            p_product_id UUID,
            p_target_price DECIMAL(10,2),
            p_is_active BOOLEAN DEFAULT TRUE
        )
        RETURNS UUID
        LANGUAGE plpgsql
        SECURITY DEFINER
        AS $$
        DECLARE
            alert_id UUID;
        BEGIN
            INSERT INTO price_alerts (user_id, product_id, target_price, is_active, created_at, updated_at)
            VALUES (p_user_id, p_product_id, p_target_price, p_is_active, NOW(), NOW())
            ON CONFLICT (user_id, product_id) 
            DO UPDATE SET
                target_price = EXCLUDED.target_price,
                is_active = EXCLUDED.is_active,
                updated_at = NOW()
            RETURNING id INTO alert_id;
            
            RETURN alert_id;
        END;
        $$;
        
        -- Grant execute permission to authenticated users
        GRANT EXECUTE ON FUNCTION upsert_price_alert(UUID, UUID, DECIMAL, BOOLEAN) TO authenticated;
        
        -- Create index for better performance
        CREATE INDEX IF NOT EXISTS idx_price_alerts_user_id ON price_alerts(user_id);
        CREATE INDEX IF NOT EXISTS idx_price_alerts_product_id ON price_alerts(product_id);
        CREATE INDEX IF NOT EXISTS idx_price_alerts_is_active ON price_alerts(is_active);
        CREATE INDEX IF NOT EXISTS idx_price_alerts_target_price ON price_alerts(target_price);
        
    ELSE
        -- Create price_alerts table if it doesn't exist
        CREATE TABLE price_alerts (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
            product_id UUID REFERENCES products(id) ON DELETE CASCADE,
            target_price DECIMAL(10,2) NOT NULL,
            is_active BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW(),
            UNIQUE(user_id, product_id)
        );
        
        -- Enable RLS
        ALTER TABLE price_alerts ENABLE ROW LEVEL SECURITY;
        
        -- Create RLS policies
        CREATE POLICY "Allow users to read own price alerts" ON price_alerts
            FOR SELECT USING (auth.uid() = user_id);
            
        CREATE POLICY "Allow users to insert own price alerts" ON price_alerts
            FOR INSERT WITH CHECK (auth.uid() = user_id);
            
        CREATE POLICY "Allow users to update own price alerts" ON price_alerts
            FOR UPDATE USING (auth.uid() = user_id);
            
        CREATE POLICY "Allow users to delete own price alerts" ON price_alerts
            FOR DELETE USING (auth.uid() = user_id);
        
        -- Create the upsert function
        CREATE OR REPLACE FUNCTION upsert_price_alert(
            p_user_id UUID,
            p_product_id UUID,
            p_target_price DECIMAL(10,2),
            p_is_active BOOLEAN DEFAULT TRUE
        )
        RETURNS UUID
        LANGUAGE plpgsql
        SECURITY DEFINER
        AS $$
        DECLARE
            alert_id UUID;
        BEGIN
            INSERT INTO price_alerts (user_id, product_id, target_price, is_active, created_at, updated_at)
            VALUES (p_user_id, p_product_id, p_target_price, p_is_active, NOW(), NOW())
            ON CONFLICT (user_id, product_id) 
            DO UPDATE SET
                target_price = EXCLUDED.target_price,
                is_active = EXCLUDED.is_active,
                updated_at = NOW()
            RETURNING id INTO alert_id;
            
            RETURN alert_id;
        END;
        $$;
        
        -- Grant execute permission to authenticated users
        GRANT EXECUTE ON FUNCTION upsert_price_alert(UUID, UUID, DECIMAL, BOOLEAN) TO authenticated;
        
        -- Create indexes
        CREATE INDEX idx_price_alerts_user_id ON price_alerts(user_id);
        CREATE INDEX idx_price_alerts_product_id ON price_alerts(product_id);
        CREATE INDEX idx_price_alerts_is_active ON price_alerts(is_active);
        CREATE INDEX idx_price_alerts_target_price ON price_alerts(target_price);
    END IF;
END $$;

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add trigger to price_alerts table
DROP TRIGGER IF EXISTS update_price_alerts_updated_at ON price_alerts;
CREATE TRIGGER update_price_alerts_updated_at 
    BEFORE UPDATE ON price_alerts 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
