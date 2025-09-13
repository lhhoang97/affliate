-- Create Cart Items Table
-- =====================================================

-- Create cart_items table
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Enable Row Level Security
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- Create policies for cart_items
CREATE POLICY "Users can manage own cart items" ON cart_items
  FOR ALL USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_cart_items_updated_at 
  BEFORE UPDATE ON cart_items 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Test
SELECT 'Cart items table created successfully' as result;

