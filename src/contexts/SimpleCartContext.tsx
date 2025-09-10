import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getGuestCart, addToGuestCart, updateGuestCartQuantity, removeFromGuestCart, clearGuestCart } from '../utils/cartUtils';
import { getProductById } from '../services/productService';

interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product?: any;
}

interface SimpleCartContextType {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
}

const SimpleCartContext = createContext<SimpleCartContextType | undefined>(undefined);

export const SimpleCartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  // Load cart with product data
  const loadCart = async () => {
    const guestCart = getGuestCart();
    const itemsWithProducts = await Promise.all(
      guestCart.map(async (item: any) => {
        try {
          const product = await getProductById(item.productId);
          return {
            ...item,
            product
          };
        } catch (error) {
          console.error('Error loading product:', error);
          return {
            ...item,
            product: {
              id: item.productId,
              name: `Product ${item.productId}`,
              price: 0,
              image: ''
            }
          };
        }
      })
    );
    
    setItems(itemsWithProducts);
    const newTotalItems = itemsWithProducts.reduce((sum, item) => sum + item.quantity, 0);
    const newTotalPrice = itemsWithProducts.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);
    setTotalItems(newTotalItems);
    setTotalPrice(newTotalPrice);
  };

  // Add to cart
  const addToCart = async (productId: string, quantity: number = 1) => {
    console.log('SimpleCartContext - addToCart called:', { productId, quantity });
    // Optimistic update - add to cart immediately
    const existingItem = items.find(item => item.productId === productId);
    if (existingItem) {
      // Update existing item
      const updatedItems = items.map(item => 
        item.productId === productId 
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
      setItems(updatedItems);
      setTotalItems(updatedItems.reduce((sum, item) => sum + item.quantity, 0));
      setTotalPrice(updatedItems.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0));
    } else {
      // Add new item with basic product data
      const newItem = {
        id: `guest_${Date.now()}`,
        productId,
        quantity,
        product: {
          id: productId,
          name: 'Loading...',
          price: 0,
          image: ''
        }
      };
      const updatedItems = [...items, newItem];
      setItems(updatedItems);
      setTotalItems(updatedItems.reduce((sum, item) => sum + item.quantity, 0));
      setTotalPrice(updatedItems.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0));
    }
    
    // Update localStorage
    addToGuestCart(productId, quantity);
    console.log('SimpleCartContext - addToGuestCart called, localStorage updated');
    
    // Load full product data in background
    console.log('SimpleCartContext - calling loadCart...');
    loadCart();
  };

  // Update quantity
  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      // Remove item
      const updatedItems = items.filter(item => item.id !== itemId);
      setItems(updatedItems);
      setTotalItems(updatedItems.reduce((sum, item) => sum + item.quantity, 0));
      setTotalPrice(updatedItems.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0));
      removeFromGuestCart(itemId);
    } else {
      // Update quantity
      const updatedItems = items.map(item => 
        item.id === itemId ? { ...item, quantity } : item
      );
      setItems(updatedItems);
      setTotalItems(updatedItems.reduce((sum, item) => sum + item.quantity, 0));
      setTotalPrice(updatedItems.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0));
      updateGuestCartQuantity(itemId, quantity);
    }
  };

  // Remove from cart
  const removeFromCart = (itemId: string) => {
    const updatedItems = items.filter(item => item.id !== itemId);
    setItems(updatedItems);
    setTotalItems(updatedItems.reduce((sum, item) => sum + item.quantity, 0));
    setTotalPrice(updatedItems.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0));
    removeFromGuestCart(itemId);
  };

  // Clear cart
  const clearCart = () => {
    setItems([]);
    setTotalItems(0);
    setTotalPrice(0);
    clearGuestCart();
  };

  // Load cart on mount
  useEffect(() => {
    loadCart();
  }, []);

  // Sync totalItems with items when items change
  useEffect(() => {
    const newTotalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const newTotalPrice = items.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);
    
    if (newTotalItems !== totalItems) {
      setTotalItems(newTotalItems);
    }
    if (newTotalPrice !== totalPrice) {
      setTotalPrice(newTotalPrice);
    }
  }, [items, totalItems, totalPrice]);

  const value: SimpleCartContextType = {
    items,
    totalItems,
    totalPrice,
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
