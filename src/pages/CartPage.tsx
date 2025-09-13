import React from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  Button,
  IconButton,
  TextField,
  Divider,
  Alert
} from '@mui/material';
import { Add, Remove, Delete, ShoppingCart } from '@mui/icons-material';
import { useCart } from '../contexts/CartContext';
import { useBusinessMode } from '../contexts/BusinessModeContext';

const CartPage: React.FC = () => {
  const { items, totalItems, totalPrice, updateQuantity, removeFromCart, clearCart, reloadCart } = useCart();
  const { mode, isAffiliateMode, isEcommerceMode, isHybridMode } = useBusinessMode();
  // const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    updateQuantity(productId, newQuantity);
  };

  const handleCheckout = () => {
    if (isEcommerceMode) {
      // E-commerce mode: Direct checkout
      window.location.href = '/checkout';
    } else if (isAffiliateMode) {
      // Affiliate mode: Redirect to first product's affiliate link
      if (items.length > 0 && items[0].product?.affiliateLink) {
        window.open(items[0].product.affiliateLink, '_blank', 'noopener,noreferrer');
      } else {
        // Fallback to checkout page
        window.location.href = '/checkout';
      }
    } else {
      // Hybrid mode: Go to checkout page
      window.location.href = '/checkout';
    }
  };

  const handleIndividualCheckout = (product: any) => {
    if (isEcommerceMode) {
      // E-commerce mode: Go to checkout with this product
      window.location.href = `/checkout?product=${product.id}`;
    } else if (isAffiliateMode) {
      // Affiliate mode: Redirect to affiliate link
      if (product.affiliateLink) {
        window.open(product.affiliateLink, '_blank', 'noopener,noreferrer');
      } else if ((product as any).externalUrl) {
        window.open((product as any).externalUrl, '_blank', 'noopener,noreferrer');
      } else {
        const defaultLink = `https://bestfinds.com/product/${product.id}?ref=cart`;
        window.open(defaultLink, '_blank', 'noopener,noreferrer');
      }
    } else {
      // Hybrid mode: Go to checkout page
      window.location.href = `/checkout?product=${product.id}`;
    }
  };

  if (items.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Shopping Cart
        </Typography>
        <Alert severity="info" sx={{ mt: 2 }}>
          Your cart is empty. <Button href="/" color="primary">Continue Shopping</Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Shopping Cart ({totalItems} items)
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" color="primary" onClick={reloadCart}>
            Reload Cart
          </Button>
          <Button 
            variant="outlined" 
            color="secondary" 
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
          >
            Clear Storage & Reload
          </Button>
          <Button variant="outlined" color="error" onClick={clearCart}>
            Clear Cart
          </Button>
        </Box>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 3 }}>
        {/* Cart Items */}
        <Box>
          {items.map((item) => (
            <Card key={item.id} sx={{ mb: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <CardMedia
                    component="img"
                    sx={{ width: 100, height: 100, objectFit: 'cover' }}
                    image={item.product?.image}
                    alt={item.product?.name}
                  />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      {item.product?.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      ${item.product?.price}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                      <IconButton
                        size="small"
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Remove />
                      </IconButton>
                      <TextField
                        size="small"
                        value={item.quantity}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          if (!isNaN(value) && value > 0) {
                            handleQuantityChange(item.id, value);
                          }
                        }}
                        sx={{ width: 60 }}
                        inputProps={{ min: 1, style: { textAlign: 'center' } }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      >
                        <Add />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Delete />
                      </IconButton>
                      
                      {/* Individual Checkout Button */}
                      <Button
                        size="small"
                        variant="outlined"
                        color="primary"
                        startIcon={<ShoppingCart />}
                        onClick={() => handleIndividualCheckout(item.product)}
                        sx={{ ml: 1 }}
                      >
                        {isEcommerceMode ? 'Checkout' : 
                         isAffiliateMode ? 'Buy Now' : 
                         'Buy Now'}
                      </Button>
                    </Box>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="h6" color="primary">
                      ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Order Summary */}
        <Card sx={{ height: 'fit-content' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            <Divider sx={{ my: 2 }} />

            {isAffiliateMode ? (
              // Affiliate mode: Show estimated total only
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography>Estimated Total ({totalItems} items):</Typography>
                <Typography variant="h6" color="primary">
                  ${totalPrice.toFixed(2)}
                </Typography>
              </Box>
            ) : (
              // E-commerce/Hybrid mode: Show detailed pricing
              <>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Subtotal ({totalItems} items):</Typography>
                  <Typography>${totalPrice.toFixed(2)}</Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Shipping:</Typography>
                  <Typography>Free</Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Tax:</Typography>
                  <Typography>${(totalPrice * 0.1).toFixed(2)}</Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                  <Typography variant="h6">Total:</Typography>
                  <Typography variant="h6" color="primary">
                    ${(totalPrice * 1.1).toFixed(2)}
                  </Typography>
                </Box>
              </>
            )}

            <Button 
              variant="contained" 
              fullWidth 
              size="large"
              onClick={handleCheckout}
              startIcon={<ShoppingCart />}
              sx={{
                backgroundColor: isAffiliateMode ? '#4caf50' : undefined,
                '&:hover': {
                  backgroundColor: isAffiliateMode ? '#45a049' : undefined,
                }
              }}
            >
              {isEcommerceMode ? 'Proceed to Checkout' : 
               isAffiliateMode ? 'Buy Now on Retailer Site' : 
               'Proceed to Checkout'}
            </Button>
            
            {isAffiliateMode ? (
              <Box sx={{ mt: 2, p: 2, backgroundColor: '#f8f9fa', borderRadius: 1, border: '1px solid #e9ecef' }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 'bold' }}>
                  ℹ️ Affiliate Mode
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                  • You'll be redirected to the retailer's website to complete your purchase
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                  • Prices may vary on the retailer's site
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                  • We earn a commission from qualifying purchases
                </Typography>
              </Box>
            ) : (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block', textAlign: 'center' }}>
                {isEcommerceMode ? 'Complete your purchase directly on our website' :
                 'Choose your preferred checkout method'}
              </Typography>
            )}
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default CartPage;
