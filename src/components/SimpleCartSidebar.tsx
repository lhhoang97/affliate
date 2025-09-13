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
import LazyImage from './LazyImage';

interface SimpleCartSidebarProps {
  open: boolean;
  onClose: () => void;
}

const SimpleCartSidebar: React.FC<SimpleCartSidebarProps> = ({ open, onClose }) => {
  const { items, totalPrice, totalSavings, updateQuantity, removeFromCart } = useSimpleCart();
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
          width: { xs: '100%', sm: '90%', md: 420, lg: 480 },
          maxWidth: { xs: '100vw', sm: '500px', md: '420px', lg: '480px' },
          backgroundColor: '#ffffff'
        }
      }}
    >
      <Box sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        p: { xs: 1, sm: 1.5, md: 2, lg: 2.5 }
      }}>
        {/* Header */}
        <Box sx={{ 
          borderBottom: '1px solid #e0e0e0', 
          pb: { xs: 1, sm: 1.25, md: 1.5, lg: 1.5 }, 
          mb: { xs: 1, sm: 1.25, md: 1.5, lg: 1.5 } 
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h5" sx={{ 
              fontWeight: 700, 
              color: '#000000',
              fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem', lg: '1.375rem' }
            }}>
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
                      p: { xs: 1, sm: 1.25, md: 1.5, lg: 1.5 },
                      mb: { xs: 1, sm: 1.25, md: 1.5, lg: 1.5 },
                      border: '1px solid #e0e0e0',
                      borderRadius: { xs: 1, sm: 1.25, md: 1.5, lg: 1.5 },
                      backgroundColor: '#ffffff'
                    }}
                >
                  <Box sx={{ display: 'flex', gap: { xs: 0.75, sm: 1, md: 1.25, lg: 1.5 } }}>
                    {/* Product Image */}
                    <Box sx={{ 
                      width: { xs: 50, sm: 60, md: 70, lg: 75 }, 
                      height: { xs: 50, sm: 60, md: 70, lg: 75 }, 
                      backgroundColor: '#f5f5f5',
                      borderRadius: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      {item.product?.image ? (
                        <LazyImage
                          src={item.product.image}
                          alt={item.product.name || 'Product'}
                          width="100%"
                          height="100%"
                          loading="lazy"
                          sizes="75px"
                          placeholder={item.product?.name ? item.product.name.substring(0, 2).toUpperCase() : 'PR'}
                          sx={{
                            borderRadius: 1
                          }}
                        />
                      ) : (
                        <Box sx={{ 
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '100%',
                          height: '100%',
                          backgroundColor: '#f0f0f0',
                          borderRadius: 1
                        }}>
                          <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center' }}>
                            {item.product?.name ? item.product.name.substring(0, 2).toUpperCase() : 'PR'}
                          </Typography>
                        </Box>
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
                            WebkitBoxOrient: 'vertical',
                            fontSize: { xs: '0.75rem', sm: '0.8125rem', md: '0.875rem', lg: '0.9375rem' }
                          }}
                        >
                          {item.product?.name || `Product ${item.productId}`}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => removeFromCart(item.id)}
                          sx={{ color: '#dc3545', ml: 1 }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>

                      {/* Bundle Option Display */}
                      {item.bundleOption && (
                        <Box sx={{ 
                          mb: { xs: 0.5, sm: 0.625, md: 0.75, lg: 0.75 }, 
                          p: { xs: 0.5, sm: 0.625, md: 0.75, lg: 0.875 }, 
                          backgroundColor: item.bundleOption.type !== 'single' ? '#fff3e0' : '#f5f5f5', 
                          borderRadius: 1, 
                          border: `1px solid ${item.bundleOption.type !== 'single' ? '#ff6b35' : '#ddd'}` 
                        }}>
                          <Typography variant="body2" sx={{
                            color: item.bundleOption.type !== 'single' ? '#ff6b35' : '#666',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            textAlign: 'center',
                            fontSize: { xs: '0.625rem', sm: '0.6875rem', md: '0.75rem', lg: '0.8125rem' }
                          }}>
                            {item.bundleOption.type === 'single' 
                              ? `Get 1 ${item.product?.name || `Product ${item.productId}`}`
                              : `🔥Get ${item.bundleOption.quantity} ${item.product?.name || `Product ${item.productId}`} ${item.bundleOption.discountText} - ONLY TODAY🔥`
                            }
                          </Typography>
                        </Box>
                      )}
                      

                      {/* Quantity Selector */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 0.75, md: 1 }, mb: { xs: 0.5, sm: 0.625, md: 0.75, lg: 0.75 } }}>
                        <IconButton
                          size="small"
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          sx={{ 
                            border: '1px solid #e0e0e0',
                            borderRadius: 1,
                            width: { xs: 24, sm: 26, md: 28, lg: 30 },
                            height: { xs: 24, sm: 26, md: 28, lg: 30 }
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
                              width: { xs: 45, sm: 50, md: 55, lg: 60 },
                              height: { xs: 24, sm: 26, md: 28, lg: 30 }
                            }
                          }}
                        />
                        
                        <IconButton
                          size="small"
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          sx={{ 
                            border: '1px solid #e0e0e0',
                            borderRadius: 1,
                            width: { xs: 24, sm: 26, md: 28, lg: 30 },
                            height: { xs: 24, sm: 26, md: 28, lg: 30 }
                          }}
                        >
                          <Add fontSize="small" />
                        </IconButton>
                      </Box>

                      {/* Price with Bundle Discount */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {item.bundleSavings && item.bundleSavings.savings > 0 ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography 
                              variant="h6" 
                              sx={{ 
                                fontWeight: 700,
                                color: '#000000',
                                fontSize: { xs: '0.875rem', sm: '0.9375rem', md: '1rem', lg: '1.125rem' }
                              }}
                            >
                              ${item.bundleSavings.finalPrice.toFixed(2)}
                            </Typography>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                textDecoration: 'line-through',
                                color: '#999',
                                fontSize: { xs: '0.625rem', sm: '0.6875rem', md: '0.75rem', lg: '0.8125rem' }
                              }}
                            >
                              ${item.bundleSavings.originalPrice.toFixed(2)}
                            </Typography>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                color: '#ff6b35',
                                fontWeight: 600,
                                fontSize: { xs: '0.625rem', sm: '0.6875rem', md: '0.75rem', lg: '0.8125rem' }
                              }}
                            >
                              Save ${item.bundleSavings.savings.toFixed(2)}
                            </Typography>
                            {item.bundleSavings.appliedDeal && (
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  color: '#4caf50',
                                  fontWeight: 600,
                                  fontSize: { xs: '0.625rem', sm: '0.6875rem', md: '0.75rem', lg: '0.8125rem' },
                                  backgroundColor: '#e8f5e8',
                                  padding: '2px 6px',
                                  borderRadius: 1
                                }}
                              >
                                {item.bundleSavings.appliedDeal.bundle_type.toUpperCase()} - {item.bundleSavings.appliedDeal.discount_percentage}% OFF
                              </Typography>
                            )}
                          </Box>
                        ) : item.bundleOption ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography 
                              variant="h6" 
                              sx={{ 
                                fontWeight: 700,
                                color: '#000000',
                                fontSize: { xs: '0.875rem', sm: '0.9375rem', md: '1rem', lg: '1.125rem' }
                              }}
                            >
                              ${item.bundleOption.discountedPrice.toFixed(2)}
                            </Typography>
                            {item.bundleOption.discount > 0 && (
                              <>
                                <Typography 
                                  variant="body2" 
                                  sx={{ 
                                    textDecoration: 'line-through',
                                    color: '#999',
                                    fontSize: { xs: '0.625rem', sm: '0.6875rem', md: '0.75rem', lg: '0.8125rem' }
                                  }}
                                >
                                  ${(item.bundleOption.originalPrice * item.quantity).toFixed(2)}
                                </Typography>
                                <Typography 
                                  variant="body2" 
                                  sx={{ 
                                    color: '#ff6b35',
                                    fontWeight: 600,
                                    fontSize: { xs: '0.625rem', sm: '0.6875rem', md: '0.75rem', lg: '0.8125rem' }
                                  }}
                                >
                                  Save ${((item.bundleOption.originalPrice - item.bundleOption.discountedPrice) * item.quantity).toFixed(2)}
                                </Typography>
                              </>
                            )}
                          </Box>
                        ) : (
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              fontWeight: 700,
                              color: '#000000',
                              fontSize: { xs: '0.875rem', sm: '0.9375rem', md: '1rem', lg: '1.125rem' }
                            }}
                          >
                            ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                          </Typography>
                        )}
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
              pt: { xs: 1, sm: 1.25, md: 1.5, lg: 1.5 }, 
              mt: { xs: 1, sm: 1.25, md: 1.5, lg: 1.5 } 
            }}>
            {totalSavings > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body1" sx={{ color: '#ff6b35', fontWeight: 600 }}>
                  Total Savings:
                </Typography>
                <Typography variant="body1" sx={{ color: '#ff6b35', fontWeight: 600 }}>
                  -${totalSavings.toFixed(2)}
                </Typography>
              </Box>
            )}
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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: { xs: 1, sm: 1.25, md: 1.5, lg: 1.5 }, pb: { xs: 0.5, sm: 0.625, md: 0.75, lg: 0.75 }, borderBottom: '1px solid #e0e0e0' }}>
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
                py: { xs: 0.875, sm: 1, md: 1.125, lg: 1.25 },
                mb: 1,
                fontSize: { xs: '0.75rem', sm: '0.8125rem', md: '0.875rem', lg: '0.9375rem' },
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
                py: { xs: 0.875, sm: 1, md: 1.125, lg: 1.25 },
                mb: 2,
                fontSize: { xs: '0.75rem', sm: '0.8125rem', md: '0.875rem', lg: '0.9375rem' },
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
