import React from 'react';
import {
  Fab,
  Badge,
  Tooltip,
  Zoom
} from '@mui/material';
import {
  ShoppingCart
} from '@mui/icons-material';
import { useCart } from '../contexts/CartContext';
import { useCartSidebar } from '../contexts/CartSidebarContext';

const FloatingCartIcon: React.FC = () => {
  const { cartItemCount } = useCart();
  const { openCart } = useCartSidebar();

  return (
    <Zoom in={true} timeout={300}>
      <Tooltip title={`${cartItemCount} items in cart`} placement="left">
        <Fab
          color="primary"
          onClick={openCart}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            width: 64,
            height: 64,
            backgroundColor: '#333333',
            color: 'white',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            zIndex: 1000,
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              backgroundColor: '#000000',
              transform: 'scale(1.1)',
              boxShadow: '0 6px 25px rgba(0,0,0,0.4)'
            },
            '&:active': {
              transform: 'scale(0.95)'
            }
          }}
        >
          <Badge
            badgeContent={cartItemCount}
            color="error"
            sx={{
              '& .MuiBadge-badge': {
                fontSize: '0.75rem',
                fontWeight: 700,
                minWidth: 20,
                height: 20,
                borderRadius: '50%',
                backgroundColor: '#dc2626',
                color: 'white',
                border: '2px solid white',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
              }
            }}
          >
            <ShoppingCart sx={{ fontSize: 28 }} />
          </Badge>
        </Fab>
      </Tooltip>
    </Zoom>
  );
};

export default FloatingCartIcon;

