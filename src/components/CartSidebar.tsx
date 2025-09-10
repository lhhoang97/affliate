import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  Button,
  TextField,
  Stack,
  Paper,
  Chip,
  Alert
} from '@mui/material';
import {
  Close,
  Remove,
  Add,
  Delete,
  ShoppingCart,
  Security,
  LocalShipping
} from '@mui/icons-material';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';

interface CartSidebarProps {
  open: boolean;
  onClose: () => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({ open, onClose }) => {
  const { items, totalPrice, updateQuantity, removeFromCart, clearCart, reloadCart } = useCart();
  const navigate = useNavigate();

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);
  };

  const calculateShipping = () => {
    const subtotal = calculateSubtotal();
    return subtotal > 50 ? 0 : 4.99; // Free shipping over $50
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping();
  };

  const subtotal = calculateSubtotal();
  const shipping = calculateShipping();
  const total = calculateTotal();

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: { xs: '100%', sm: 400 },
          backgroundColor: '#ffffff',
          boxShadow: '-4px 0 20px rgba(0,0,0,0.15)'
        }
      }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box sx={{ 
          p: 3, 
          borderBottom: '1px solid #e0e0e0',
          backgroundColor: '#f8f9fa'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#000000' }}>
              Your Shopping Cart
            </Typography>
            <IconButton onClick={onClose} sx={{ color: '#666666' }}>
              <Close />
            </IconButton>
          </Box>
          {items.length > 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {items.length} item{items.length > 1 ? 's' : ''} in your cart
            </Typography>
          )}
        </Box>

        {/* Cart Items */}
        <Box sx={{ flex: 1, overflow: 'auto', p: 0 }}>
          {items.length === 0 ? (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              height: '100%',
              p: 3,
              textAlign: 'center'
            }}>
              <ShoppingCart sx={{ fontSize: 64, color: '#e0e0e0', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Your cart is empty
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Add some products to get started
              </Typography>
            </Box>
          ) : (
            <Box sx={{ p: 2 }}>
              {items.map((item, index) => (
                <Paper
                  key={item.id}
                  sx={{
                    p: 2,
                    mb: 2,
                    border: '1px solid #e0e0e0',
                    borderRadius: 2,
                    backgroundColor: '#ffffff'
                  }}
                >
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    {/* Product Image */}
                    <Box sx={{ 
                      width: 80, 
                      height: 80, 
                      backgroundColor: '#f5f5f5',
                      borderRadius: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      {item.product?.image ? (
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            borderRadius: 4
                          }}
                        />
                      ) : (
                        <ShoppingCart sx={{ color: '#ccc' }} />
                      )}
                    </Box>

                    {/* Product Details */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Typography 
                          variant="subtitle1" 
                          sx={{ 
                            fontWeight: 600,
                            color: '#000000',
                            lineHeight: 1.3,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical'
                          }}
                        >
                          {item.product?.name || 'Product'}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => removeFromCart(item.id)}
                          sx={{ color: '#dc3545', ml: 1 }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>

                      {/* Option Display - Always show */}
              <Box sx={{ mb: 1, p: 1, backgroundColor: item.quantity > 1 ? '#fff3e0' : '#f5f5f5', borderRadius: 1, border: `1px solid ${item.quantity > 1 ? '#ff6b35' : '#ddd'}` }}>
                <Typography variant="body2" sx={{
                  color: item.quantity > 1 ? '#ff6b35' : '#666',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  textAlign: 'center'
                }}>
                  {item.quantity === 1 
                    ? `Option: Get 1 ${item.product?.name || 'Product'}`
                    : `Option: 🔥Get ${item.quantity} ${item.product?.name || 'Product'} SAVE $${item.quantity === 2 ? '15' : item.quantity === 3 ? '30' : '45'} OFF - ONLY DAY🔥`
                  }
                </Typography>
              </Box>

                      {/* Quantity Selector */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <IconButton
                          size="small"
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          sx={{ 
                            border: '1px solid #e0e0e0',
                            borderRadius: 1,
                            width: 32,
                            height: 32
                          }}
                        >
                          <Remove fontSize="small" />
                        </IconButton>
                        
                        <TextField
                          value={item.quantity}
                          onChange={(e) => {
                            const newQuantity = parseInt(e.target.value) || 1;
                            if (newQuantity > 0) {
                              handleQuantityChange(item.id, newQuantity);
                            }
                          }}
                          inputProps={{ 
                            min: 1,
                            style: { 
                              textAlign: 'center',
                              width: 40,
                              padding: '4px 8px'
                            }
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              width: 60,
                              height: 32
                            }
                          }}
                        />
                        
                        <IconButton
                          size="small"
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          sx={{ 
                            border: '1px solid #e0e0e0',
                            borderRadius: 1,
                            width: 32,
                            height: 32
                          }}
                        >
                          <Add fontSize="small" />
                        </IconButton>
                      </Box>

                      {/* Price */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {item.product?.originalPrice && item.product.originalPrice > (item.product?.price || 0) && (
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              textDecoration: 'line-through',
                              color: '#999999'
                            }}
                          >
                            ${item.product.originalPrice.toFixed(2)}
                          </Typography>
                        )}
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            fontWeight: 700,
                            color: '#000000'
                          }}
                        >
                          ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Paper>
              ))}
            </Box>
          )}
        </Box>

        {/* Order Summary */}
        {items.length > 0 && (
          <Box sx={{ 
            borderTop: '1px solid #e0e0e0',
            backgroundColor: '#f8f9fa',
            p: 3
          }}>
            {/* Summary */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body1">Subtotal:</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  ${subtotal.toFixed(2)}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <LocalShipping sx={{ fontSize: 16, color: 'text.secondary' }} />
                  <Typography variant="body1">
                    Shipping {shipping === 0 ? '(Free)' : '(Standard)'}:
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  ${shipping.toFixed(2)}
                </Typography>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Total:
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#000000' }}>
                  ${total.toFixed(2)}
                </Typography>
              </Box>
            </Box>

            {/* Free Shipping Progress */}
            {subtotal < 50 && (
              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  Add ${(50 - subtotal).toFixed(2)} more for free shipping!
                </Typography>
              </Alert>
            )}

            {/* Checkout Buttons */}
            <Stack spacing={2}>
              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={handleCheckout}
                sx={{
                  backgroundColor: '#333333',
                  color: 'white',
                  fontWeight: 600,
                  py: 1.5,
                  '&:hover': {
                    backgroundColor: '#000000'
                  }
                }}
              >
                PROCEED TO SECURED CHECKOUT
              </Button>
              
              <Box sx={{ textAlign: 'center', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  or quick checkout with
                </Typography>
              </Box>
              
              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={handleCheckout}
                sx={{
                  backgroundColor: '#FFC439',
                  color: '#000000',
                  fontWeight: 600,
                  py: 1.5,
                  '&:hover': {
                    backgroundColor: '#FFB800'
                  }
                }}
              >
                PayPal
              </Button>
            </Stack>

            {/* Security Badges */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              gap: 1,
              mt: 2,
              pt: 2,
              borderTop: '1px solid #e0e0e0'
            }}>
              <Security sx={{ fontSize: 16, color: 'success.main' }} />
              <Typography variant="caption" color="text.secondary">
                Secure checkout protected by SSL
              </Typography>
            </Box>
          </Box>
        )}
      </Box>
    </Drawer>
  );
};

export default CartSidebar;
