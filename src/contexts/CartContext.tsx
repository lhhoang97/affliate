import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { 
  CartItem, 
  CartSummary, 
  getCartItems, 
  addToCart, 
  updateCartItemQuantity,
  updateGuestCartItemQuantity, 
  removeFromCart,
  removeGuestCartItem,
  loadGuestCartWithProducts, 
  clearCart, 
  getCartSummary,
  getCartItemCount 
} from '../services/cartService';
import { useAuth } from './AuthContext';
// import { useCartSidebar } from './CartSidebarContext';

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
  reloadCart: () => Promise<void>;
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
  const loadCart = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (isAuthenticated) {
        // Authenticated user - load from database
        const [items, summary, count] = await Promise.all([
          getCartItems(),
          getCartSummary(),
          getCartItemCount()
        ]);

        setCartItems(items);
        setCartSummary(summary);
        setCartItemCount(count);
      } else {
        // Guest user - load from localStorage with product data
        const guestCartWithProducts = await loadGuestCartWithProducts();
        setCartItems(guestCartWithProducts);
        setCartItemCount(guestCartWithProducts.reduce((sum: number, item: any) => sum + item.quantity, 0));
        setCartSummary(null); // No summary for guest cart
      }
    } catch (err) {
      console.error('Error loading cart:', err);
      setError(err instanceof Error ? err.message : 'Failed to load cart');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Force reload cart with fresh data
  const reloadCart = async () => {
    // Clear current state first
    setCartItems([]);
    setCartItemCount(0);
    setCartSummary(null);
    // Then reload
    await loadCart();
  };

  // Add item to cart
  const addItem = async (productId: string, quantity: number = 1) => {
    try {
      setError(null);
      
      if (isAuthenticated) {
        // Authenticated user - use database
        await addToCart(productId, quantity);
        await loadCart();
      } else {
        // Guest user - use localStorage
        const guestCart = JSON.parse(localStorage.getItem('guest_cart') || '[]');
        const existingItem = guestCart.find((item: any) => item.productId === productId);
        
        if (existingItem) {
          existingItem.quantity += quantity;
        } else {
          guestCart.push({
            id: `guest_${Date.now()}`,
            productId,
            quantity,
            addedAt: new Date().toISOString()
          });
        }
        
        localStorage.setItem('guest_cart', JSON.stringify(guestCart));
        
        // Update local state
        setCartItems(guestCart);
        setCartItemCount(guestCart.reduce((sum: number, item: any) => sum + item.quantity, 0));
      }
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

      if (isAuthenticated) {
        // Authenticated user - update in database
        await updateCartItemQuantity(cartItemId, quantity);
        // Refresh cart data
        await loadCart();
      } else {
        // Guest user - update in localStorage
        const updatedItem = updateGuestCartItemQuantity(cartItemId, quantity);
        if (updatedItem) {
          // Update local state
          setCartItems(prevItems => {
            const newItems = prevItems.map(item => 
              item.id === cartItemId ? updatedItem : item
            );
            // Recalculate total count
            const newTotal = newItems.reduce((sum, item) => sum + item.quantity, 0);
            setCartItemCount(newTotal);
            return newItems;
          });
        } else {
          // Item was removed, refresh cart
          await loadCart();
        }
      }
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
      
      if (isAuthenticated) {
        // Authenticated user - remove from database
        await removeFromCart(cartItemId);
        // Refresh cart data
        await loadCart();
      } else {
        // Guest user - remove from localStorage
        removeGuestCartItem(cartItemId);
        // Update local state
        setCartItems(prevItems => {
          const newItems = prevItems.filter(item => item.id !== cartItemId);
          const newTotal = newItems.reduce((sum, item) => sum + item.quantity, 0);
          setCartItemCount(newTotal);
          return newItems;
        });
      }
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
      
      if (isAuthenticated) {
        await clearCart();
      } else {
        // Clear guest cart
        localStorage.removeItem('guest_cart');
      }
      
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

  // Load cart when component mounts and when authentication state changes
  useEffect(() => {
    loadCart();
  }, [isAuthenticated, loadCart]);

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
    reloadCart,
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