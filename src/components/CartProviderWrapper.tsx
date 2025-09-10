import React, { ReactNode } from 'react';
import { CartProvider } from '../contexts/CartContext';
import { SimpleCartProvider } from '../contexts/SimpleCartContext';
import { CartSidebarProvider } from '../contexts/CartSidebarContext';

interface CartProviderWrapperProps {
  children: ReactNode;
}

const CartProviderWrapper: React.FC<CartProviderWrapperProps> = ({ children }) => {
  return (
    <CartProvider>
      <CartSidebarProvider>
        <SimpleCartProvider>
          {children}
        </SimpleCartProvider>
      </CartSidebarProvider>
    </CartProvider>
  );
};

export default CartProviderWrapper;
