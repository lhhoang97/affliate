import React from 'react';
import { Badge, IconButton, Tooltip } from '@mui/material';
import { ShoppingCart } from '@mui/icons-material';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface CartIconProps {
  onClick?: () => void;
}

const CartIcon: React.FC<CartIconProps> = ({ onClick }) => {
  const { cartItemCount, isLoading } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate('/cart');
    }
  };

  if (!isAuthenticated) {
    return (
      <Tooltip title="Login to view cart">
        <IconButton 
          color="inherit" 
          onClick={() => navigate('/login')}
          disabled={isLoading}
        >
          <ShoppingCart />
        </IconButton>
      </Tooltip>
    );
  }

  return (
    <Tooltip title={`Cart (${cartItemCount} items)`}>
      <IconButton 
        color="inherit" 
        onClick={handleClick}
        disabled={isLoading}
      >
        <Badge 
          badgeContent={cartItemCount} 
          color="error"
          max={99}
        >
          <ShoppingCart />
        </Badge>
      </IconButton>
    </Tooltip>
  );
};

export default CartIcon;

