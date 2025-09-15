import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { CartItem, BundleOption } from '../types';
import { 
  getGuestCart, 
  addToGuestCart, 
  updateGuestCartItemQuantity, 
  removeGuestCartItem, 
  clearGuestCart,
  loadGuestCartWithProducts,
  getBundleDeals,
  calculateBundleSavings
} from '../services/cartService';
import { supabase } from '../utils/supabaseClient';

interface GuestCartItem {
  id: string;
  productId: string;
  quantity: number;
  bundleOption?: BundleOption;
  product?: any;
  bundleSavings?: {
    originalPrice: number;
    discountAmount: number;
    finalPrice: number;
    savings: number;
    appliedDeal?: any;
  };
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
      single: { quantity: 1, discountAmount: 0, discountText: '' },
      double: { quantity: 2, discountAmount: 15, discountText: 'SAVE $15 OFF' },
      triple: { quantity: 3, discountAmount: 30, discountText: 'SAVE $30 OFF' }
    };
    
    const config = bundleConfigs[bundleType];
    const originalPrice = productPrice * config.quantity;
    const discountedPrice = originalPrice - config.discountAmount;
    
    return {
      type: bundleType,
      quantity: config.quantity,
      originalPrice,
      discountedPrice,
      discount: config.discountAmount,
      discountText: config.discountText
    };
  }, []);

  // Load cart with product data (optimized)
  const loadCart = useCallback(async () => {
    try {
      const itemsWithProducts = await loadGuestCartWithProducts();
      
      // Get bundle deals for all products
      const productIds = itemsWithProducts.map(item => item.productId);
      const bundleDeals = await getBundleDeals(productIds);
      
      // Calculate bundle savings for each item
      const itemsWithBundleSavings = itemsWithProducts.map(item => {
        const productBundleDeals = bundleDeals.filter(deal => deal.product_id === item.productId);
        const bundleSavings = calculateBundleSavings(
          item.product?.price || 0, 
          item.quantity, 
          productBundleDeals
        );
        
        return {
          ...item,
          bundleSavings
        };
      });
      
      setItems(itemsWithBundleSavings);
      
      const newTotalItems = itemsWithBundleSavings.reduce((sum, item) => sum + item.quantity, 0);
      const newTotalPrice = itemsWithBundleSavings.reduce((sum, item) => {
        if (item.bundleSavings && item.bundleSavings.savings > 0) {
          return sum + item.bundleSavings.finalPrice;
        }
        return sum + (item.product?.price || 0) * item.quantity;
      }, 0);
      const newTotalSavings = itemsWithBundleSavings.reduce((sum, item) => {
        return sum + (item.bundleSavings?.savings || 0);
      }, 0);
      
      setTotalItems(newTotalItems);
      setTotalPrice(newTotalPrice);
      setTotalSavings(newTotalSavings);
    } catch (error) {
      console.error('SimpleCartContext - Error loading cart:', error);
      // Fallback to empty cart
      setItems([]);
      setTotalItems(0);
      setTotalPrice(0);
      setTotalSavings(0);
    }
  }, []);

  // Add to cart with bundle options and race condition prevention
  const addToCart = useCallback(async (productId: string, quantity: number = 1, bundleType: 'single' | 'double' | 'triple' = 'single') => {
    
    // Create unique bundle key for race condition prevention
    const bundleKey = `${productId}-${bundleType}`;
    
    // Check if this bundle is already being processed
    if (pendingBundles.has(bundleKey)) {
      return;
    }
    
    // Add to pending bundles
    setPendingBundles(prev => new Set(prev).add(bundleKey));
    
    try {
      // Get product price from existing items or fetch from database
      const existingItem = items.find(item => item.productId === productId);
      let productPrice = existingItem?.product?.price;
      
      // If no existing item, fetch product data
      if (!productPrice) {
        try {
          const { data: product } = await supabase
            .from('products')
            .select('price')
            .eq('id', productId)
            .single();
          productPrice = product?.price || 0;
        } catch (error) {
          console.error('Error fetching product price:', error);
          productPrice = 0;
        }
      }
      const bundleOption = createBundleOption(bundleType, productPrice);
      
      // Check if item with same product and bundle type already exists
      const existingBundleItem = items.find(item => 
        item.productId === productId && 
        item.bundleOption?.type === bundleType
      );
      
      let updatedItems: GuestCartItem[];
      
      if (existingBundleItem) {
        // Increase quantity of existing item
        updatedItems = items.map(item => 
          item.id === existingBundleItem.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Create new item with bundle option
        const newItem: GuestCartItem = {
          id: `guest_${Date.now()}_${bundleType}`,
          productId,
          quantity: 1,
          bundleOption,
          product: {
            id: productId,
            name: 'Loading...',
            price: productPrice,
            image: ''
          }
        };
        updatedItems = [...items, newItem];
      }
      
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
      if (existingBundleItem) {
        // Update existing item quantity in localStorage
        updateGuestCartItemQuantity(existingBundleItem.id, existingBundleItem.quantity + 1);
      } else {
        // Add new item to localStorage
        addToGuestCart(productId, bundleOption.quantity, bundleOption);
      }
      
      // Don't reload cart immediately to prevent infinite loop
      
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

  // Load cart on mount - only once
  useEffect(() => {
    loadCart();
  }, [loadCart]); // Include loadCart dependency

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
    setTotalItems(calculatedTotals.newTotalItems);
    setTotalPrice(calculatedTotals.newTotalPrice);
    setTotalSavings(calculatedTotals.newTotalSavings);
  }, [calculatedTotals]); // Only depend on calculatedTotals

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
