import React, { useState } from 'react';
import { Button, CircularProgress } from '@mui/material';
import { ShoppingCart } from '@mui/icons-material';
import { useCart } from '../contexts/CartContext';
import { useCartSidebar } from '../contexts/CartSidebarContext';

interface AddToCartButtonWithSidebarProps {
  productId: string;
  productName: string;
  quantity?: number;
  variant?: 'contained' | 'outlined' | 'text';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  sx?: any;
}

const AddToCartButtonWithSidebar: React.FC<AddToCartButtonWithSidebarProps> = ({
  productId,
  productName,
  quantity = 1,
  variant = 'contained',
  size = 'large',
  fullWidth = false,
  sx = {}
}) => {
  const { addToCart } = useCart();
  const { openCart } = useCartSidebar();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      await addToCart(productId, quantity);
      // Open cart sidebar after adding
      openCart();
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      onClick={handleAddToCart}
      disabled={isAdding}
      startIcon={isAdding ? <CircularProgress size={20} /> : <ShoppingCart />}
      sx={{
        backgroundColor: '#333333',
        color: 'white',
        fontWeight: 600,
        py: 1.5,
        '&:hover': {
          backgroundColor: '#000000'
        },
        '&:disabled': {
          backgroundColor: '#cccccc',
          color: '#666666'
        },
        ...sx
      }}
    >
      {isAdding ? 'Adding...' : 'ADD TO CART'}
    </Button>
  );
};

export default AddToCartButtonWithSidebar;
