import { supabase } from '../utils/supabaseClient';
import { Product } from '../types';
import { getProductById } from './productService';

export interface CartItem {
  id: string;
  product_id: string;
  user_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
  // Joined product data
  product?: Product;
}

export interface CartSummary {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  totalSavings: number;
}

// Get user's cart items
export async function getCartItems(): Promise<CartItem[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data: cartItems, error } = await supabase
      .from('cart_items')
      .select(`
        *,
        product:products(*)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching cart items:', error);
      throw error;
    }

    return cartItems || [];
  } catch (error) {
    console.error('Error getting cart items:', error);
    throw error;
  }
}

// Add item to cart
export async function addToCart(productId: string, quantity: number = 1): Promise<CartItem> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Check if item already exists in cart
    const { data: existingItem, error: checkError } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', user.id)
      .eq('product_id', productId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError;
    }

    if (existingItem) {
      // Update existing item quantity
      const { data: updatedItem, error: updateError } = await supabase
        .from('cart_items')
        .update({
          quantity: existingItem.quantity + quantity,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingItem.id)
        .select(`
          *,
          product:products(*)
        `)
        .single();

      if (updateError) {
        throw updateError;
      }

      return updatedItem;
    } else {
      // Add new item to cart
      const { data: newItem, error: insertError } = await supabase
        .from('cart_items')
        .insert({
          user_id: user.id,
          product_id: productId,
          quantity: quantity
        })
        .select(`
          *,
          product:products(*)
        `)
        .single();

      if (insertError) {
        throw insertError;
      }

      return newItem;
    }
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
}

// Update cart item quantity
export async function updateCartItemQuantity(cartItemId: string, quantity: number): Promise<CartItem> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    if (quantity <= 0) {
      // Remove item if quantity is 0 or negative
      await removeFromCart(cartItemId);
      throw new Error('Item removed from cart');
    }

    const { data: updatedItem, error } = await supabase
      .from('cart_items')
      .update({
        quantity: quantity,
        updated_at: new Date().toISOString()
      })
      .eq('id', cartItemId)
      .eq('user_id', user.id)
      .select(`
        *,
        product:products(*)
      `)
      .single();

    if (error) {
      throw error;
    }

    return updatedItem;
  } catch (error) {
    console.error('Error updating cart item:', error);
    throw error;
  }
}

// Update cart item quantity for guest users (localStorage)
export function updateGuestCartItemQuantity(cartItemId: string, quantity: number): CartItem | null {
  try {
    const guestCart = JSON.parse(localStorage.getItem('guest_cart') || '[]');
    const itemIndex = guestCart.findIndex((item: any) => item.id === cartItemId);
    
    if (itemIndex === -1) {
      throw new Error('Item not found in cart');
    }

    if (quantity <= 0) {
      // Remove item if quantity is 0 or negative
      guestCart.splice(itemIndex, 1);
      localStorage.setItem('guest_cart', JSON.stringify(guestCart));
      return null;
    }

    // Update quantity
    guestCart[itemIndex].quantity = quantity;
    guestCart[itemIndex].updated_at = new Date().toISOString();
    
    localStorage.setItem('guest_cart', JSON.stringify(guestCart));
    return guestCart[itemIndex];
  } catch (error) {
    console.error('Error updating guest cart item quantity:', error);
    throw error;
  }
}

// Remove item from cart
export async function removeFromCart(cartItemId: string): Promise<void> {
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
      throw error;
    }
  } catch (error) {
    console.error('Error removing from cart:', error);
    throw error;
  }
}

// Remove item from cart for guest users (localStorage)
export function removeGuestCartItem(cartItemId: string): void {
  try {
    const guestCart = JSON.parse(localStorage.getItem('guest_cart') || '[]');
    const filteredCart = guestCart.filter((item: any) => item.id !== cartItemId);
    localStorage.setItem('guest_cart', JSON.stringify(filteredCart));
  } catch (error) {
    console.error('Error removing guest cart item:', error);
    throw error;
  }
}

// Load guest cart with product data
export async function loadGuestCartWithProducts(): Promise<CartItem[]> {
  try {
    const guestCart = JSON.parse(localStorage.getItem('guest_cart') || '[]');
    
    // Fetch product data for each item
    const cartItemsWithProducts = await Promise.all(
      guestCart.map(async (item: any) => {
        try {
          const product = await getProductById(item.productId);
          return {
            ...item, // Keep original item data including ID
            product: product
          };
        } catch (error) {
          console.error(`Error fetching product ${item.productId}:`, error);
          // Return a basic product object so user can still see and manage cart
          const fallbackProduct = {
            id: item.productId,
            name: `Product ${item.productId}`,
            price: 0,
            description: 'Product information will be updated',
            image: '',
            images: [],
            category: 'General',
            brand: '',
            rating: 0,
            reviewCount: 0,
            inStock: true,
            affiliateLink: '',
            externalUrl: '',
            tags: [],
            features: [],
            specifications: {},
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          return {
            ...item, // Keep original item data including ID
            product: fallbackProduct
          };
        }
      })
    );
    
    return cartItemsWithProducts;
  } catch (error) {
    console.error('Error loading guest cart with products:', error);
    return [];
  }
}

// Clear entire cart
export async function clearCart(): Promise<void> {
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
      throw error;
    }
  } catch (error) {
    console.error('Error clearing cart:', error);
    throw error;
  }
}

// Get cart summary
export async function getCartSummary(): Promise<CartSummary> {
  try {
    const cartItems = await getCartItems();
    
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cartItems.reduce((sum, item) => {
      const price = item.product?.price || 0;
      return sum + (price * item.quantity);
    }, 0);
    
    const totalSavings = cartItems.reduce((sum, item) => {
      const originalPrice = item.product?.originalPrice || 0;
      const currentPrice = item.product?.price || 0;
      const savings = originalPrice > currentPrice ? (originalPrice - currentPrice) * item.quantity : 0;
      return sum + savings;
    }, 0);

    return {
      items: cartItems,
      totalItems,
      totalPrice,
      totalSavings
    };
  } catch (error) {
    console.error('Error getting cart summary:', error);
    throw error;
  }
}

// Check if product is in cart
export async function isInCart(productId: string): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return false;
    }

    const { data, error } = await supabase
      .from('cart_items')
      .select('id')
      .eq('user_id', user.id)
      .eq('product_id', productId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error checking cart:', error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error('Error checking if in cart:', error);
    return false;
  }
}

// Get cart item count
export async function getCartItemCount(): Promise<number> {
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
      console.error('Error getting cart count:', error);
      return 0;
    }

    return data?.reduce((sum: number, item: CartItem) => sum + item.quantity, 0) || 0;
  } catch (error) {
    console.error('Error getting cart item count:', error);
    return 0;
  }
}
