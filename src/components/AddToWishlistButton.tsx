import React, { useState, useEffect } from 'react';
import { IconButton, Button, Tooltip, CircularProgress } from '@mui/material';
import { Favorite, FavoriteBorder, Add } from '@mui/icons-material';
import { useWishlist } from '../contexts/WishlistContext';
import { useAuth } from '../contexts/AuthContext';

interface AddToWishlistButtonProps {
  productId: string;
  productName?: string;
  variant?: 'icon' | 'button';
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' | 'inherit';
  showText?: boolean;
  fullWidth?: boolean;
}

const AddToWishlistButton: React.FC<AddToWishlistButtonProps> = ({
  productId,
  productName = '',
  variant = 'icon',
  size = 'small',
  color = 'inherit',
  showText = false,
  fullWidth = false
}) => {
  const { addToWishlist, removeFromWishlist, isInWishlist, isLoading } = useWishlist();
  const { isAuthenticated } = useAuth();
  const [isInWishlistState, setIsInWishlistState] = useState(false);
  const [isLoadingState, setIsLoadingState] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Check if product is in wishlist
  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (isAuthenticated && productId) {
        try {
          const inWishlist = await isInWishlist(productId);
          setIsInWishlistState(inWishlist);
        } catch (error) {
          console.error('Error checking wishlist status:', error);
        }
      }
    };

    checkWishlistStatus();
  }, [isAuthenticated, productId, isInWishlist]);

  const handleToggleWishlist = async () => {
    if (!isAuthenticated) {
      // Show login prompt or redirect to login
      alert('Please login to add items to your wishlist');
      return;
    }

    setIsLoadingState(true);
    try {
      if (isInWishlistState) {
        // Find the wishlist item ID to remove
        // For now, we'll use the productId as the wishlist item ID
        // In a real implementation, you'd need to get the actual wishlist item ID
        await removeFromWishlist(productId);
        setIsInWishlistState(false);
      } else {
        await addToWishlist(productId);
        setIsInWishlistState(true);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    } finally {
      setIsLoadingState(false);
    }
  };

  const getTooltipText = () => {
    if (!isAuthenticated) return 'Login to add to wishlist';
    if (isInWishlistState) return 'Remove from wishlist';
    return 'Add to wishlist';
  };

  const getButtonText = () => {
    if (isInWishlistState) return 'In Wishlist';
    return 'Add to Wishlist';
  };

  if (variant === 'icon') {
    return (
      <Tooltip title={getTooltipText()}>
        <span>
          <IconButton
            size={size}
            color={isInWishlistState ? 'error' : color}
            onClick={handleToggleWishlist}
            disabled={isLoadingState || isLoading}
            sx={{
              '&:hover': {
                backgroundColor: isInWishlistState 
                  ? 'rgba(233, 30, 99, 0.04)' 
                  : 'rgba(0, 0, 0, 0.04)',
              },
            }}
          >
            {isLoadingState ? (
              <CircularProgress size={20} />
            ) : isInWishlistState ? (
              <Favorite sx={{ color: '#e91e63' }} />
            ) : (
              <FavoriteBorder />
            )}
          </IconButton>
        </span>
      </Tooltip>
    );
  }

  return (
    <Tooltip title={getTooltipText()}>
      <span>
        <Button
          variant={isInWishlistState ? 'contained' : 'outlined'}
          size={size}
          color={isInWishlistState ? 'error' : color}
          onClick={handleToggleWishlist}
          disabled={isLoadingState || isLoading}
          fullWidth={fullWidth}
          startIcon={
            isLoadingState ? (
              <CircularProgress size={16} />
            ) : isInWishlistState ? (
              <Favorite />
            ) : (
              <Add />
            )
          }
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            ...(isInWishlistState && {
              backgroundColor: '#e91e63',
              '&:hover': {
                backgroundColor: '#c2185b',
              },
            }),
            ...(showSuccess && {
              backgroundColor: '#4caf50',
              '&:hover': {
                backgroundColor: '#45a049',
              },
            }),
          }}
        >
          {showText ? getButtonText() : ''}
        </Button>
      </span>
    </Tooltip>
  );
};

export default AddToWishlistButton;
