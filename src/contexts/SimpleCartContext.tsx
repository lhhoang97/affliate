import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { CartItem, BundleOption } from '../types';
import { 
  getGuestCart, 
  addToGuestCart, 
  updateGuestCartItemQuantity, 
  removeGuestCartItem, 
  clearGuestCart,
  loadGuestCartWithProducts
} from '../services/cartService';

interface GuestCartItem {
  id: string;
  productId: string;
  quantity: number;
  bundleOption?: BundleOption;
  product?: any;
}

interface SimpleCartContextType {
  items: GuestCartItem[];
  totalItems: number;
  totalPrice: number;
  totalSavings: number;
  addToCart: (productId: string, quantity?: number, bundleType?: 'single' | 'double' | 'triple') => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
}

const SimpleCartContext = createContext<SimpleCartContextType | undefined>(undefined);

export const SimpleCartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<GuestCartItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalSavings, setTotalSavings] = useState(0);
  const [pendingBundles, setPendingBundles] = useState<Set<string>>(new Set());

  // Helper function to create bundle options
  const createBundleOption = useCallback((bundleType: 'single' | 'double' | 'triple', productPrice: number): BundleOption => {
    const bundleConfigs = {
      single: { quantity: 1, discount: 0, discountText: '' },
      double: { quantity: 2, discount: 15, discountText: 'SAVE $15 OFF' },
      triple: { quantity: 3, discount: 30, discountText: 'SAVE $30 OFF' }
    };
    
    const config = bundleConfigs[bundleType];
    const originalPrice = productPrice * config.quantity;
    const discountAmount = (originalPrice * config.discount) / 100;
    const discountedPrice = originalPrice - discountAmount;
    
    return {
      type: bundleType,
      quantity: config.quantity,
      originalPrice,
      discountedPrice,
      discount: config.discount,
      discountText: config.discountText
    };
  }, []);

  // Load cart with product data (optimized)
  const loadCart = useCallback(async () => {
    try {
      console.log('SimpleCartContext - Loading cart with optimized service...');
      const itemsWithProducts = await loadGuestCartWithProducts();
      
      console.log('SimpleCartContext - Items received from service:', itemsWithProducts);
      console.log('SimpleCartContext - Setting items state...');
      setItems(itemsWithProducts);
      
      const newTotalItems = itemsWithProducts.reduce((sum, item) => sum + item.quantity, 0);
      const newTotalPrice = itemsWithProducts.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);
      setTotalItems(newTotalItems);
      setTotalPrice(newTotalPrice);
      
      console.log('SimpleCartContext - Cart loaded successfully:', { 
        items: itemsWithProducts.length, 
        totalItems: newTotalItems, 
        totalPrice: newTotalPrice,
        itemsData: itemsWithProducts
      });
    } catch (error) {
      console.error('SimpleCartContext - Error loading cart:', error);
      // Fallback to empty cart
      setItems([]);
      setTotalItems(0);
      setTotalPrice(0);
    }
  }, []);

  // Add to cart with bundle options and race condition prevention
  const addToCart = useCallback(async (productId: string, quantity: number = 1, bundleType: 'single' | 'double' | 'triple' = 'single') => {
    console.log('SimpleCartContext - addToCart called:', { productId, quantity, bundleType });
    
    // Create unique bundle key for race condition prevention
    const bundleKey = `${productId}-${bundleType}`;
    
    // Check if this bundle is already being processed
    if (pendingBundles.has(bundleKey)) {
      console.log(`Bundle ${bundleType} for ${productId} is already being processed - BLOCKED`);
      return;
    }
    
    // Add to pending bundles
    setPendingBundles(prev => new Set(prev).add(bundleKey));
    
    try {
      // Get product price from existing items or use default
      const existingItem = items.find(item => item.productId === productId);
      const productPrice = existingItem?.product?.price || 150; // Default price for demo
      const bundleOption = createBundleOption(bundleType, productPrice);
      
      // Check if this exact bundle already exists
      const existingBundle = items.find(item => 
        item.productId === productId && 
        item.bundleOption?.type === bundleType
      );
      
      if (existingBundle) {
        console.log(`Bundle ${bundleType} for ${productId} already exists - INCREASING QUANTITY`);
        // Increase quantity of existing bundle
        const updatedItems = items.map(item => 
          item.id === existingBundle.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        setItems(updatedItems);
        
        // Calculate new totals
        const newTotalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
        const newTotalPrice = updatedItems.reduce((sum, item) => {
          if (item.bundleOption) {
            return sum + (item.bundleOption.discountedPrice * item.quantity);
          }
          return sum + (item.product?.price || 0) * item.quantity;
        }, 0);
        const newTotalSavings = updatedItems.reduce((sum, item) => {
          if (item.bundleOption) {
            return sum + ((item.bundleOption.originalPrice - item.bundleOption.discountedPrice) * item.quantity);
          }
          return sum;
        }, 0);
        
        setTotalItems(newTotalItems);
        setTotalPrice(newTotalPrice);
        setTotalSavings(newTotalSavings);
        
        // Update localStorage
        addToGuestCart(productId, 1, bundleOption);
        return;
      }
      
      // Create new item with bundle option
      const newItem: GuestCartItem = {
        id: `guest_${Date.now()}_${bundleType}`,
        productId,
        quantity: 1, // Always 1 for bundle display
        bundleOption,
        product: {
          id: productId,
          name: 'Loading...',
          price: productPrice,
          image: ''
        }
      };
      
      // Optimistic update
      const updatedItems = [...items, newItem];
      setItems(updatedItems);
      
      // Calculate totals with bundle pricing
      const newTotalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
      const newTotalPrice = updatedItems.reduce((sum, item) => {
        if (item.bundleOption) {
          return sum + (item.bundleOption.discountedPrice * item.quantity);
        }
        return sum + (item.product?.price || 0) * item.quantity;
      }, 0);
      const newTotalSavings = updatedItems.reduce((sum, item) => {
        if (item.bundleOption) {
          return sum + ((item.bundleOption.originalPrice - item.bundleOption.discountedPrice) * item.quantity);
        }
        return sum;
      }, 0);
      
      setTotalItems(newTotalItems);
      setTotalPrice(newTotalPrice);
      setTotalSavings(newTotalSavings);
      
      // Update localStorage immediately
      addToGuestCart(productId, bundleOption.quantity, bundleOption);
      console.log('SimpleCartContext - Bundle added to cart:', { bundleType, bundleOption });
      
      // Load full product data in background
      setTimeout(() => {
        loadCart();
      }, 100);
      
    } catch (error) {
      console.error('SimpleCartContext - Error adding bundle to cart:', error);
      // Revert optimistic update on error
      loadCart();
    } finally {
      // Remove from pending bundles
      setPendingBundles(prev => {
        const newSet = new Set(prev);
        newSet.delete(bundleKey);
        return newSet;
      });
    }
  }, [items, pendingBundles, createBundleOption, loadCart]);

  // Update quantity (optimized with bundle pricing)
  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    try {
      if (quantity <= 0) {
        // Remove item
        const updatedItems = items.filter(item => item.id !== itemId);
        setItems(updatedItems);
        
        const newTotalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
        const newTotalPrice = updatedItems.reduce((sum, item) => {
          if (item.bundleOption) {
            return sum + (item.bundleOption.discountedPrice * item.quantity);
          }
          return sum + (item.product?.price || 0) * item.quantity;
        }, 0);
        const newTotalSavings = updatedItems.reduce((sum, item) => {
          if (item.bundleOption) {
            return sum + ((item.bundleOption.originalPrice - item.bundleOption.discountedPrice) * item.quantity);
          }
          return sum;
        }, 0);
        
        setTotalItems(newTotalItems);
        setTotalPrice(newTotalPrice);
        setTotalSavings(newTotalSavings);
        removeGuestCartItem(itemId);
      } else {
        // Update quantity
        const updatedItems = items.map(item => 
          item.id === itemId ? { ...item, quantity } : item
        );
        setItems(updatedItems);
        
        const newTotalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
        const newTotalPrice = updatedItems.reduce((sum, item) => {
          if (item.bundleOption) {
            return sum + (item.bundleOption.discountedPrice * item.quantity);
          }
          return sum + (item.product?.price || 0) * item.quantity;
        }, 0);
        const newTotalSavings = updatedItems.reduce((sum, item) => {
          if (item.bundleOption) {
            return sum + ((item.bundleOption.originalPrice - item.bundleOption.discountedPrice) * item.quantity);
          }
          return sum;
        }, 0);
        
        setTotalItems(newTotalItems);
        setTotalPrice(newTotalPrice);
        setTotalSavings(newTotalSavings);
        updateGuestCartItemQuantity(itemId, quantity);
      }
    } catch (error) {
      console.error('SimpleCartContext - Error updating quantity:', error);
      // Revert on error
      loadCart();
    }
  }, [items, loadCart]);

  // Remove from cart (optimized with bundle pricing)
  const removeFromCart = useCallback((itemId: string) => {
    try {
      const updatedItems = items.filter(item => item.id !== itemId);
      setItems(updatedItems);
      
      const newTotalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
      const newTotalPrice = updatedItems.reduce((sum, item) => {
        if (item.bundleOption) {
          return sum + item.bundleOption.discountedPrice;
        }
        return sum + (item.product?.price || 0) * item.quantity;
      }, 0);
      const newTotalSavings = updatedItems.reduce((sum, item) => {
        if (item.bundleOption) {
          return sum + (item.bundleOption.originalPrice - item.bundleOption.discountedPrice);
        }
        return sum;
      }, 0);
      
      setTotalItems(newTotalItems);
      setTotalPrice(newTotalPrice);
      setTotalSavings(newTotalSavings);
      removeGuestCartItem(itemId);
    } catch (error) {
      console.error('SimpleCartContext - Error removing from cart:', error);
      loadCart();
    }
  }, [items, loadCart]);

  // Clear cart (optimized)
  const clearCart = useCallback(() => {
    try {
      setItems([]);
      setTotalItems(0);
      setTotalPrice(0);
      setTotalSavings(0);
      clearGuestCart();
    } catch (error) {
      console.error('SimpleCartContext - Error clearing cart:', error);
    }
  }, []);

  // Load cart on mount
  useEffect(() => {
    loadCart();
  }, [loadCart]);

  // Sync totals with items when items change (optimized with useMemo)
  const calculatedTotals = React.useMemo(() => {
    const newTotalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const newTotalPrice = items.reduce((sum, item) => {
      if (item.bundleOption) {
        return sum + (item.bundleOption.discountedPrice * item.quantity);
      }
      return sum + (item.product?.price || 0) * item.quantity;
    }, 0);
    const newTotalSavings = items.reduce((sum, item) => {
      if (item.bundleOption) {
        return sum + ((item.bundleOption.originalPrice - item.bundleOption.discountedPrice) * item.quantity);
      }
      return sum;
    }, 0);
    return { newTotalItems, newTotalPrice, newTotalSavings };
  }, [items]);

  useEffect(() => {
    if (calculatedTotals.newTotalItems !== totalItems) {
      setTotalItems(calculatedTotals.newTotalItems);
    }
    if (calculatedTotals.newTotalPrice !== totalPrice) {
      setTotalPrice(calculatedTotals.newTotalPrice);
    }
    if (calculatedTotals.newTotalSavings !== totalSavings) {
      setTotalSavings(calculatedTotals.newTotalSavings);
    }
  }, [calculatedTotals, totalItems, totalPrice, totalSavings]);

  const value: SimpleCartContextType = {
    items,
    totalItems,
    totalPrice,
    totalSavings,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart
  };

  return (
    <SimpleCartContext.Provider value={value}>
      {children}
    </SimpleCartContext.Provider>
  );
};

export const useSimpleCart = (): SimpleCartContextType => {
  const context = useContext(SimpleCartContext);
  if (context === undefined) {
    throw new Error('useSimpleCart must be used within a SimpleCartProvider');
  }
  return context;
};
