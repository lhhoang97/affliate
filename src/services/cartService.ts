import { supabase } from '../utils/supabaseClient';
import { CartItem, CartSummary } from '../types';
import { BundleDeal } from '../types/bundleDeal';

// Get bundle deals for products
export const getBundleDeals = async (productIds: string[]): Promise<BundleDeal[]> => {
  try {
    if (productIds.length === 0) return [];

    const { data, error } = await supabase
      .from('bundle_deals')
      .select('*')
      .in('product_id', productIds)
      .eq('is_active', true);

    if (error) {
      console.error('Error fetching bundle deals:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('getBundleDeals error:', error);
    return [];
  }
};

// Calculate bundle deal savings
export const calculateBundleSavings = (price: number, quantity: number, bundleDeals: BundleDeal[]): {
  originalPrice: number;
  discountAmount: number;
  finalPrice: number;
  savings: number;
  appliedDeal?: BundleDeal;
} => {
  const originalPrice = price * quantity;
  
  // Find applicable bundle deal
  const applicableDeal = bundleDeals.find(deal => {
    const requiredQuantity = parseInt(deal.bundle_type.replace('get', ''));
    return quantity >= requiredQuantity;
  });

  if (!applicableDeal) {
    return {
      originalPrice,
      discountAmount: 0,
      finalPrice: originalPrice,
      savings: 0
    };
  }

  const discountAmount = (originalPrice * applicableDeal.discount_percentage) / 100;
  const finalPrice = originalPrice - discountAmount;

  return {
    originalPrice,
    discountAmount,
    finalPrice,
    savings: discountAmount,
    appliedDeal: applicableDeal
  };
};

// Get cart items for authenticated user
export const getCartItems = async (): Promise<CartItem[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        *,
        products (
          id,
          name,
          price,
          original_price,
          image,
          in_stock,
          affiliate_link,
          external_url
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching cart items:', error);
      throw new Error(`Failed to fetch cart items: ${error.message}`);
    }

    // Get bundle deals for all products in cart
    const productIds = data?.map((item: any) => item.product_id) || [];
    const bundleDeals = await getBundleDeals(productIds);

    // Add bundle deal calculations to each cart item
    const itemsWithBundleDeals = data?.map((item: any) => {
      const productBundleDeals = bundleDeals.filter(deal => deal.product_id === item.product_id);
      const bundleSavings = calculateBundleSavings(
        item.products?.price || 0, 
        item.quantity, 
        productBundleDeals
      );

      return {
        ...item,
        bundleSavings
      };
    }) || [];

    return itemsWithBundleDeals;
  } catch (error) {
    console.error('getCartItems error:', error);
    throw error;
  }
};

// Add item to cart (optimized for performance)
export const addToCart = async (productId: string, quantity: number = 1): Promise<void> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Check if item already exists in cart
    const { data: existingItem } = await supabase
      .from('cart_items')
      .select('id, quantity')
      .eq('user_id', user.id)
      .eq('product_id', productId)
      .single();

    if (existingItem) {
      // Update existing item quantity
      const { error } = await supabase
        .from('cart_items')
        .update({ 
          quantity: existingItem.quantity + quantity,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingItem.id);

      if (error) {
        console.error('Error updating cart item:', error);
        throw new Error(`Failed to update cart item: ${error.message}`);
      }
    } else {
      // Add new item to cart
      const { error } = await supabase
        .from('cart_items')
        .insert({
          user_id: user.id,
          product_id: productId,
          quantity,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error adding to cart:', error);
        throw new Error(`Failed to add to cart: ${error.message}`);
      }
    }
  } catch (error) {
    console.error('addToCart error:', error);
    throw error;
  }
};

// Update cart item quantity
export const updateCartItemQuantity = async (cartItemId: string, quantity: number): Promise<void> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    if (quantity <= 0) {
      // Remove item if quantity is 0 or negative
      await removeFromCart(cartItemId);
      return;
    }

    const { error } = await supabase
      .from('cart_items')
      .update({ 
        quantity,
        updated_at: new Date().toISOString()
      })
      .eq('id', cartItemId)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error updating cart item quantity:', error);
      throw new Error(`Failed to update cart item quantity: ${error.message}`);
    }
  } catch (error) {
    console.error('updateCartItemQuantity error:', error);
    throw error;
  }
};

// Remove item from cart
export const removeFromCart = async (cartItemId: string): Promise<void> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', cartItemId)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error removing from cart:', error);
      throw new Error(`Failed to remove from cart: ${error.message}`);
    }
  } catch (error) {
    console.error('removeFromCart error:', error);
    throw error;
  }
};

// Clear entire cart
export const clearCart = async (): Promise<void> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', user.id);

    if (error) {
      console.error('Error clearing cart:', error);
      throw new Error(`Failed to clear cart: ${error.message}`);
    }
  } catch (error) {
    console.error('clearCart error:', error);
    throw error;
  }
};

// Get cart summary (total items and price)
export const getCartSummary = async (): Promise<CartSummary> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        quantity,
        product_id,
        products (
          price,
          original_price
        )
      `)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching cart summary:', error);
      throw new Error(`Failed to fetch cart summary: ${error.message}`);
    }

    const totalItems = data?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0;
    
    // Get bundle deals for all products
    const productIds = data?.map((item: any) => item.product_id) || [];
    const bundleDeals = await getBundleDeals(productIds);

    // Calculate total price with bundle deals
    let totalPrice = 0;
    let totalSavings = 0;

    data?.forEach((item: any) => {
      const productBundleDeals = bundleDeals.filter(deal => deal.product_id === item.product_id);
      const bundleSavings = calculateBundleSavings(
        item.products?.price || 0, 
        item.quantity, 
        productBundleDeals
      );
      
      totalPrice += bundleSavings.finalPrice;
      totalSavings += bundleSavings.savings;
    });

    return {
      totalItems,
      totalPrice,
      itemCount: data?.length || 0,
      totalSavings
    };
  } catch (error) {
    console.error('getCartSummary error:', error);
    throw error;
  }
};

// Get cart item count (for header badge)
export const getCartItemCount = async (): Promise<number> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return 0;
    }

    const { data, error } = await supabase
      .from('cart_items')
      .select('quantity')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching cart item count:', error);
      return 0;
    }

    return data?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0;
  } catch (error) {
    console.error('getCartItemCount error:', error);
    return 0;
  }
};

// Guest cart functions (using localStorage)
export const getGuestCart = () => {
  try {
    return JSON.parse(localStorage.getItem('guest_cart') || '[]');
  } catch {
    return [];
  }
};

export const saveGuestCart = (cart: any[]) => {
  localStorage.setItem('guest_cart', JSON.stringify(cart));
};

export const addToGuestCart = (productId: string, quantity: number = 1, bundleOption?: any) => {
  const cart = getGuestCart();
  const bundleType = bundleOption?.type || 'single';
  
  // Check if item with same product and bundle type already exists
  const existingItem = cart.find((item: any) => 
    item.productId === productId && 
    item.bundleOption?.type === bundleType
  );
  
  if (existingItem) {
    // Increase quantity of existing item
    existingItem.quantity += 1;
    existingItem.updated_at = new Date().toISOString();
    console.log(`Guest cart: Increased quantity for existing ${bundleType} bundle of ${productId} to ${existingItem.quantity}`);
  } else {
    // Create new item for new bundle
    const uniqueId = `guest_${Date.now()}_${bundleType}_${Math.random().toString(36).substr(2, 9)}`;
    
    cart.push({
      id: uniqueId,
      productId,
      quantity: 1,
      bundleOption,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
    console.log(`Guest cart: Created new ${bundleType} bundle for ${productId}`);
  }
  
  saveGuestCart(cart);
  return cart;
};

export const updateGuestCartItemQuantity = (itemId: string, quantity: number) => {
  const cart = getGuestCart();
  const itemIndex = cart.findIndex((item: any) => item.id === itemId);
  
  if (itemIndex === -1) {
    throw new Error('Item not found');
  }
  
  if (quantity <= 0) {
    cart.splice(itemIndex, 1);
  } else {
    cart[itemIndex].quantity = quantity;
    cart[itemIndex].updated_at = new Date().toISOString();
  }
  
  saveGuestCart(cart);
  return cart;
};

export const removeGuestCartItem = (itemId: string) => {
  const cart = getGuestCart();
  const filteredCart = cart.filter((item: any) => item.id !== itemId);
  saveGuestCart(filteredCart);
  return filteredCart;
};

export const clearGuestCart = () => {
  localStorage.removeItem('guest_cart');
  return [];
};

// Load guest cart with product data (optimized with better error handling)
export const loadGuestCartWithProducts = async (): Promise<any[]> => {
  try {
    console.log('loadGuestCartWithProducts - Starting...');
    const guestCart = getGuestCart();
    console.log('loadGuestCartWithProducts - Guest cart from localStorage:', guestCart);
    
    if (guestCart.length === 0) {
      console.log('loadGuestCartWithProducts - No items in guest cart');
      return [];
    }

    // Try to fetch real product data from database first
    try {
      console.log('loadGuestCartWithProducts - Attempting to fetch from database...');
      const productIds = guestCart.map((item: any) => item.productId);
      console.log('loadGuestCartWithProducts - Product IDs to fetch:', productIds);
      
      const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .in('id', productIds);

      if (error) {
        console.error('Error fetching products for guest cart:', error);
        throw error; // Fall through to fallback
      }

      console.log('loadGuestCartWithProducts - Products fetched from database:', products);

      // Map guest cart items with real product data
      const itemsWithRealData = guestCart.map((item: any) => {
        const product = products?.find((p: any) => p.id === item.productId);
        console.log('loadGuestCartWithProducts - Mapping item:', item.productId, 'to product:', product);
        
        return {
          ...item,
          product: product || {
            id: item.productId,
            name: `Product ${item.productId}`,
            price: 150,
            image: '',
            description: 'Product not found in database'
          }
        };
      });

      console.log('loadGuestCartWithProducts - Returning items with real data:', itemsWithRealData);
      return itemsWithRealData;

    } catch (dbError) {
      console.error('Database fetch failed, using fallback data:', dbError);
      
      // Fallback: return items with basic product data
      const itemsWithBasicData = guestCart.map((item: any) => {
        console.log('loadGuestCartWithProducts - Using fallback for item:', item);
        return {
          ...item,
          product: {
            id: item.productId,
            name: `Product ${item.productId}`,
            price: 150,
            image: '',
            description: 'Product loaded from cart (fallback)'
          }
        };
      });

      console.log('loadGuestCartWithProducts - Returning items with fallback data:', itemsWithBasicData);
      return itemsWithBasicData;
    }

  } catch (error) {
    console.error('loadGuestCartWithProducts error:', error);
    // Return empty array on error to prevent crashes
    return [];
  }
};

// Migrate guest cart to user cart after login
export const migrateGuestCartToUser = async (): Promise<void> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return;
    }

    const guestCart = getGuestCart();
    if (guestCart.length === 0) {
      return;
    }

    // Get existing user cart items
    const existingCartItems = await getCartItems();
    const existingProductIds = existingCartItems.map(item => item.product_id);

    // Prepare items to insert
    const itemsToInsert = guestCart
      .filter((item: any) => !existingProductIds.includes(item.productId))
      .map((item: any) => ({
        user_id: user.id,
        product_id: item.productId,
        quantity: item.quantity,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));

    if (itemsToInsert.length > 0) {
      const { error } = await supabase
        .from('cart_items')
        .insert(itemsToInsert);

      if (error) {
        console.error('Error migrating guest cart:', error);
        throw new Error(`Failed to migrate guest cart: ${error.message}`);
      }
    }

    // Clear guest cart after successful migration
    clearGuestCart();
  } catch (error) {
    console.error('migrateGuestCartToUser error:', error);
    throw error;
  }
};