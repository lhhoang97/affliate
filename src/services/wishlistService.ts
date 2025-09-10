import { supabase } from '../utils/supabaseClient';
import { Product } from '../types';

export interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
  // Joined product data
  product?: Product;
}

// Add product to wishlist
export async function addToWishlist(productId: string): Promise<WishlistItem> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Check if already in wishlist
    const { data: existingItem, error: checkError } = await supabase
      .from('wishlist')
      .select('*')
      .eq('user_id', user.id)
      .eq('product_id', productId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError;
    }

    if (existingItem) {
      throw new Error('Product already in wishlist');
    }

    // Add to wishlist
    const { data: wishlistItem, error } = await supabase
      .from('wishlist')
      .insert({
        user_id: user.id,
        product_id: productId
      })
      .select(`
        *,
        product:products(*)
      `)
      .single();

    if (error) {
      throw error;
    }

    return wishlistItem;
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    throw error;
  }
}

// Remove product from wishlist
export async function removeFromWishlist(productId: string): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { error } = await supabase
      .from('wishlist')
      .delete()
      .eq('user_id', user.id)
      .eq('product_id', productId);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    throw error;
  }
}

// Get user's wishlist
export async function getWishlist(): Promise<WishlistItem[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data: wishlistItems, error } = await supabase
      .from('wishlist')
      .select(`
        *,
        product:products(*)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return wishlistItems || [];
  } catch (error) {
    console.error('Error getting wishlist:', error);
    throw error;
  }
}

// Check if product is in wishlist
export async function isInWishlist(productId: string): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return false;
    }

    const { data, error } = await supabase
      .from('wishlist')
      .select('id')
      .eq('user_id', user.id)
      .eq('product_id', productId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error checking wishlist:', error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error('Error checking if in wishlist:', error);
    return false;
  }
}

// Get wishlist count
export async function getWishlistCount(): Promise<number> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return 0;
    }

    const { count, error } = await supabase
      .from('wishlist')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    if (error) {
      console.error('Error getting wishlist count:', error);
      return 0;
    }

    return count || 0;
  } catch (error) {
    console.error('Error getting wishlist count:', error);
    return 0;
  }
}

// Clear entire wishlist
export async function clearWishlist(): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { error } = await supabase
      .from('wishlist')
      .delete()
      .eq('user_id', user.id);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error clearing wishlist:', error);
    throw error;
  }
}

// Move from wishlist to cart
export async function moveToCart(productId: string, quantity: number = 1): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Check if product is in wishlist
    const { data: wishlistItem, error: checkError } = await supabase
      .from('wishlist')
      .select('*')
      .eq('user_id', user.id)
      .eq('product_id', productId)
      .single();

    if (checkError) {
      throw new Error('Product not in wishlist');
    }

    // Add to cart
    const { data: existingCartItem, error: cartCheckError } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', user.id)
      .eq('product_id', productId)
      .single();

    if (cartCheckError && cartCheckError.code !== 'PGRST116') {
      throw cartCheckError;
    }

    if (existingCartItem) {
      // Update existing cart item
      const { error: updateError } = await supabase
        .from('cart_items')
        .update({
          quantity: existingCartItem.quantity + quantity,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingCartItem.id);

      if (updateError) {
        throw updateError;
      }
    } else {
      // Add new cart item
      const { error: insertError } = await supabase
        .from('cart_items')
        .insert({
          user_id: user.id,
          product_id: productId,
          quantity: quantity
        });

      if (insertError) {
        throw insertError;
      }
    }

    // Remove from wishlist
    const { error: removeError } = await supabase
      .from('wishlist')
      .delete()
      .eq('user_id', user.id)
      .eq('product_id', productId);

    if (removeError) {
      throw removeError;
    }
  } catch (error) {
    console.error('Error moving to cart:', error);
    throw error;
  }
}

// Get wishlist statistics
export async function getWishlistStats(): Promise<{
  totalItems: number;
  totalValue: number;
  averagePrice: number;
  categories: { [key: string]: number };
}> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data: wishlistItems, error } = await supabase
      .from('wishlist')
      .select(`
        *,
        product:products(price, category)
      `)
      .eq('user_id', user.id);

    if (error) {
      throw error;
    }

    const items = wishlistItems || [];
    const totalItems = items.length;
    const totalValue = items.reduce((sum: number, item: any) => sum + (item.product?.price || 0), 0);
    const averagePrice = totalItems > 0 ? totalValue / totalItems : 0;

    // Count by category
    const categories: { [key: string]: number } = {};
    items.forEach((item: any) => {
      const category = item.product?.category || 'Unknown';
      categories[category] = (categories[category] || 0) + 1;
    });

    return {
      totalItems,
      totalValue,
      averagePrice,
      categories
    };
  } catch (error) {
    console.error('Error getting wishlist stats:', error);
    throw error;
  }
}
