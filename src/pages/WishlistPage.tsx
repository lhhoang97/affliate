import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  Button,
  IconButton,
  Grid,
  Alert,
  CircularProgress,
  Chip,
  Divider,
  Paper,
  Stack
} from '@mui/material';
import {
  Delete,
  ShoppingCart,
  Favorite,
  Share,
  TrendingUp,
  Category
} from '@mui/icons-material';
import { useWishlist } from '../contexts/WishlistContext';
import { useAuth } from '../contexts/AuthContext';
import { useSimpleCart } from '../contexts/SimpleCartContext';
import { useCartSidebar } from '../contexts/CartSidebarContext';
import { useBusinessMode } from '../contexts/BusinessModeContext';
import { useNavigate } from 'react-router-dom';
import SmartLink from '../components/SmartLink';
import OptimizedImage from '../components/OptimizedImage';

const WishlistPage: React.FC = () => {
  const { 
    items, 
    totalItems, 
    totalValue, 
    isLoading, 
    error, 
    removeFromWishlist, 
    clearWishlist 
  } = useWishlist();
  const { addToCart } = useSimpleCart();
  const { openCart } = useCartSidebar();
  const { isAuthenticated } = useAuth();
  const { isAffiliateMode, isEcommerceMode, isHybridMode } = useBusinessMode();
  const navigate = useNavigate();
  const [isRemoving, setIsRemoving] = useState<string | null>(null);

  const handleRemoveItem = async (wishlistItemId: string) => {
    setIsRemoving(wishlistItemId);
    try {
      await removeFromWishlist(wishlistItemId);
    } catch (error) {
      console.error('Error removing item:', error);
    } finally {
      setIsRemoving(null);
    }
  };

  const handleClearWishlist = async () => {
    if (window.confirm('Are you sure you want to clear your entire wishlist?')) {
      try {
        await clearWishlist();
      } catch (error) {
        console.error('Error clearing wishlist:', error);
      }
    }
  };

  const handleAddToCart = async (productId: string) => {
    try {
      await addToCart(productId, 1, 'single');
      openCart();
      // Optionally remove from wishlist after adding to cart
      // await removeFromWishlist(wishlistItemId);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const handleShareWishlist = () => {
    const wishlistUrl = `${window.location.origin}/wishlist`;
    if (navigator.share) {
      navigator.share({
        title: 'My Wishlist',
        text: 'Check out my wishlist!',
        url: wishlistUrl,
      });
    } else {
      navigator.clipboard.writeText(wishlistUrl);
      alert('Wishlist URL copied to clipboard!');
    }
  };

  if (!isAuthenticated) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box textAlign="center" py={8}>
          <Favorite sx={{ fontSize: 80, color: '#e91e63', mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            Your Wishlist
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Please login to view and manage your wishlist
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/login')}
            sx={{ px: 4 }}
          >
            Login
          </Button>
        </Box>
      </Container>
    );
  }

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  if (totalItems === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box textAlign="center" py={8}>
          <Favorite sx={{ fontSize: 80, color: '#e91e63', mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            Your Wishlist is Empty
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Start adding products you love to your wishlist
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/products')}
            sx={{ px: 4 }}
          >
            Browse Products
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h4" component="h1">
            My Wishlist
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              startIcon={<Share />}
              onClick={handleShareWishlist}
            >
              Share
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<Delete />}
              onClick={handleClearWishlist}
            >
              Clear All
            </Button>
          </Stack>
        </Box>
        
        <Paper sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <Box textAlign="center">
                <Typography variant="h6" color="primary">
                  {totalItems}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Items
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box textAlign="center">
                <Typography variant="h6" color="primary">
                  ${totalValue.toFixed(2)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Value
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box textAlign="center">
                <Typography variant="h6" color="primary">
                  ${(totalValue / totalItems).toFixed(2)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Average Price
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>

      {/* Wishlist Items */}
      <Grid container spacing={3}>
        {items.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ position: 'relative' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={item.product?.image}
                  alt={item.product?.name}
                  sx={{ objectFit: 'cover' }}
                />
                <IconButton
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 1)',
                    },
                  }}
                  onClick={() => handleRemoveItem(item.id)}
                  disabled={isRemoving === item.id}
                >
                  {isRemoving === item.id ? (
                    <CircularProgress size={20} />
                  ) : (
                    <Delete color="error" />
                  )}
                </IconButton>
              </Box>
              
              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6" gutterBottom>
                  {item.product?.name}
                </Typography>
                
                <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
                  ${item.product?.price}
                </Typography>

                {item.product?.category && (
                  <Chip
                    icon={<Category />}
                    label={item.product.category}
                    size="small"
                    variant="outlined"
                    sx={{ mb: 2, alignSelf: 'flex-start' }}
                  />
                )}

                <Box sx={{ mt: 'auto' }}>
                  <Stack direction="row" spacing={1}>
                    {!isAffiliateMode && (
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<ShoppingCart />}
                        onClick={() => handleAddToCart(item.product_id)}
                        sx={{ flex: 1 }}
                      >
                        Add to Cart
                      </Button>
                    )}
                    
                    {item.product?.affiliateLink && (
                      <SmartLink
                        to={item.product.affiliateLink}
                        external={true}
                        productId={item.product_id}
                        productName={item.product.name}
                        productPrice={item.product.price}
                        retailer={item.product.retailer}
                      >
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<TrendingUp />}
                          sx={{ flex: 1 }}
                        >
                          Get Deal
                        </Button>
                      </SmartLink>
                    )}
                  </Stack>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default WishlistPage;
