import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  CartItem, 
  CartSummary, 
  getCartItems, 
  addToCart, 
  updateCartItemQuantity, 
  removeFromCart, 
  clearCart, 
  getCartSummary, 
  getCartItemCount 
} from '../services/cartService';
import { useAuth } from './AuthContext';

interface CartContextType {
  cartItems: CartItem[];
  cartSummary: CartSummary | null;
  cartItemCount: number;
  isLoading: boolean;
  error: string | null;
  addItem: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  removeItem: (cartItemId: string) => Promise<void>;
  clearAll: () => Promise<void>;
  refreshCart: () => Promise<void>;
  // Alias properties for backward compatibility
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  removeFromCart: (cartItemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartSummary, setCartSummary] = useState<CartSummary | null>(null);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const auth = useAuth();
  const isAuthenticated = auth?.isAuthenticated || false;

  // Load cart data
  const loadCart = async () => {
    if (!isAuthenticated) {
      setCartItems([]);
      setCartSummary(null);
      setCartItemCount(0);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const [items, summary, count] = await Promise.all([
        getCartItems(),
        getCartSummary(),
        getCartItemCount()
      ]);

      setCartItems(items);
      setCartSummary(summary);
      setCartItemCount(count);
    } catch (err) {
      console.error('Error loading cart:', err);
      setError(err instanceof Error ? err.message : 'Failed to load cart');
    } finally {
      setIsLoading(false);
    }
  };

  // Add item to cart
  const addItem = async (productId: string, quantity: number = 1) => {
    try {
      setError(null);
      const newItem = await addToCart(productId, quantity);
      
      // Refresh cart data
      await loadCart();
    } catch (err) {
      console.error('Error adding to cart:', err);
      setError(err instanceof Error ? err.message : 'Failed to add item to cart');
      throw err;
    }
  };

  // Update item quantity
  const updateQuantity = async (cartItemId: string, quantity: number) => {
    try {
      setError(null);
      
      if (quantity <= 0) {
        await removeItem(cartItemId);
        return;
      }

      await updateCartItemQuantity(cartItemId, quantity);
      
      // Refresh cart data
      await loadCart();
    } catch (err) {
      console.error('Error updating cart item:', err);
      setError(err instanceof Error ? err.message : 'Failed to update cart item');
      throw err;
    }
  };

  // Remove item from cart
  const removeItem = async (cartItemId: string) => {
    try {
      setError(null);
      await removeFromCart(cartItemId);
      
      // Refresh cart data
      await loadCart();
    } catch (err) {
      console.error('Error removing from cart:', err);
      setError(err instanceof Error ? err.message : 'Failed to remove item from cart');
      throw err;
    }
  };

  // Clear entire cart
  const clearAll = async () => {
    try {
      setError(null);
      await clearCart();
      
      // Refresh cart data
      await loadCart();
    } catch (err) {
      console.error('Error clearing cart:', err);
      setError(err instanceof Error ? err.message : 'Failed to clear cart');
      throw err;
    }
  };

  // Refresh cart data
  const refreshCart = async () => {
    await loadCart();
  };

  // Load cart when authentication state changes
  useEffect(() => {
    loadCart();
  }, [isAuthenticated]);

  const value: CartContextType = {
    cartItems,
    cartSummary,
    cartItemCount,
    isLoading,
    error,
    addItem,
    updateQuantity,
    removeItem,
    clearAll,
    refreshCart,
    // Alias properties for backward compatibility
    items: cartItems,
    totalItems: cartItemCount,
    totalPrice: cartSummary?.totalPrice || 0,
    addToCart: addItem,
    removeFromCart: removeItem,
    clearCart: clearAll
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};