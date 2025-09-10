import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Button,
  Paper,
  TextField
} from '@mui/material';
import { Close, Add, Remove, Delete } from '@mui/icons-material';
import { useSimpleCart } from '../contexts/SimpleCartContext';
import { useNavigate } from 'react-router-dom';

interface SimpleCartSidebarProps {
  open: boolean;
  onClose: () => void;
}

const SimpleCartSidebar: React.FC<SimpleCartSidebarProps> = ({ open, onClose }) => {
  const { items, totalPrice, updateQuantity, removeFromCart } = useSimpleCart();
  const navigate = useNavigate();
  

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: 400,
          backgroundColor: '#ffffff'
        }
      }}
    >
      <Box sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        p: 3
      }}>
        {/* Header */}
        <Box sx={{ 
          borderBottom: '1px solid #e0e0e0', 
          pb: 2, 
          mb: 2 
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
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          {items.length === 0 ? (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              height: '100%',
              textAlign: 'center'
            }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Your cart is empty
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Add some products to get started
              </Typography>
            </Box>
          ) : (
            <Box>
              {items.map((item) => (
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
                        <Typography variant="caption" color="text.secondary">
                          Image
                        </Typography>
                      )}
                    </Box>

                    {/* Product Info */}
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Typography 
                          variant="subtitle1" 
                          sx={{ 
                            fontWeight: 600,
                            color: '#000000',
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
            pt: 2, 
            mt: 2 
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body1">Subtotal:</Typography>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                ${totalPrice.toFixed(2)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body1">Shipping (Standard):</Typography>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                $4.99
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, pb: 1, borderBottom: '1px solid #e0e0e0' }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>Total:</Typography>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                ${(totalPrice + 4.99).toFixed(2)}
              </Typography>
            </Box>

            {/* Free Shipping Message */}
            {totalPrice < 50 && (
              <Box sx={{ 
                backgroundColor: '#e3f2fd', 
                p: 1, 
                borderRadius: 1, 
                mb: 2,
                textAlign: 'center'
              }}>
                <Typography variant="body2" color="primary">
                  Add ${(50 - totalPrice).toFixed(2)} more for free shipping!
                </Typography>
              </Box>
            )}

            {/* Checkout Buttons */}
            <Button
              variant="contained"
              fullWidth
              onClick={handleCheckout}
              sx={{
                backgroundColor: '#000000',
                color: '#ffffff',
                py: 1.5,
                mb: 1,
                '&:hover': {
                  backgroundColor: '#333333'
                }
              }}
            >
              PROCEED TO SECURED CHECKOUT
            </Button>
            
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mb: 1 }}>
              or quick checkout with
            </Typography>
            
            <Button
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: '#ffc439',
                color: '#000000',
                py: 1.5,
                mb: 2,
                '&:hover': {
                  backgroundColor: '#ffb300'
                }
              }}
            >
              PayPal
            </Button>

            <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', display: 'block' }}>
              Secure checkout protected by SSL
            </Typography>
          </Box>
        )}
      </Box>
    </Drawer>
  );
};

export default SimpleCartSidebar;
