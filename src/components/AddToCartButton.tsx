import React, { useState } from 'react';
import { Button, CircularProgress, Snackbar, Alert } from '@mui/material';
import { ShoppingCart, Add } from '@mui/icons-material';
import { useSimpleCart } from '../contexts/SimpleCartContext';
import { useCartSidebar } from '../contexts/CartSidebarContext';

interface AddToCartButtonProps {
  productId: string;
  productName: string;
  variant?: 'contained' | 'outlined' | 'text';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  disabled?: boolean;
  quantity?: number;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  productId,
  productName,
  variant = 'contained',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  quantity = 1
}) => {
  const { addToCart } = useSimpleCart();
  const { openCart } = useCartSidebar();
  
  const [isAdding, setIsAdding] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const handleAddToCart = async () => {
    try {
      setIsAdding(true);
      
      // Add to cart with single bundle (default)
      await addToCart(productId, quantity, 'single');
      
      // Open cart sidebar
      openCart();
      
      setSnackbarMessage(`${productName} added to cart!`);
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error adding to cart:', error);
      setSnackbarMessage('Failed to add item to cart');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setIsAdding(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        fullWidth={fullWidth}
        disabled={disabled || isAdding}
        startIcon={isAdding ? <CircularProgress size={16} /> : <Add />}
        onClick={handleAddToCart}
        sx={{
          textTransform: 'none',
          fontWeight: 500
        }}
      >
        {isAdding ? 'Adding...' : 'Add to Cart'}
      </Button>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AddToCartButton;
