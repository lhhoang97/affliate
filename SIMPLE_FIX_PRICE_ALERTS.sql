-- Simple fix for Price Alerts duplicate key issue
-- This will create the upsert function for price alerts

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
