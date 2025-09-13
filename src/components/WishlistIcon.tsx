import React from 'react';
import { IconButton, Badge } from '@mui/material';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import { useWishlist } from '../contexts/WishlistContext';
import { useNavigate } from 'react-router-dom';

interface WishlistIconProps {
  size?: 'small' | 'medium' | 'large';
  color?: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  showBadge?: boolean;
  onClick?: () => void;
}

const WishlistIcon: React.FC<WishlistIconProps> = ({ 
  size = 'medium', 
  color = 'default',
  showBadge = true,
  onClick 
}) => {
  const { wishlistItemCount, isLoading } = useWishlist();
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate('/wishlist');
    }
  };

  return (
    <IconButton
      size={size}
      color={color}
      onClick={handleClick}
      disabled={isLoading}
      sx={{
        '&:hover': {
          backgroundColor: 'rgba(233, 30, 99, 0.04)',
        },
      }}
    >
      {showBadge && wishlistItemCount > 0 ? (
        <Badge 
          badgeContent={wishlistItemCount} 
          color="error"
          max={99}
        >
          <Favorite sx={{ color: '#e91e63' }} />
        </Badge>
      ) : (
        <FavoriteBorder sx={{ color: '#666' }} />
      )}
    </IconButton>
  );
};

export default WishlistIcon;

