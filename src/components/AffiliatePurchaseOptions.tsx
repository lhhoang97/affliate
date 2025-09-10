import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Stack,
  Paper,
  Radio,
  FormControlLabel,
  TextField,
  IconButton,
  Alert
} from '@mui/material';
import { Add, Remove, ShoppingCart, FlashOn, Payment } from '@mui/icons-material';
import { useCart } from '../contexts/CartContext';

interface AffiliatePurchaseOptionsProps {
  product: any;
  hasAffiliateLink: boolean;
}

const AffiliatePurchaseOptions: React.FC<AffiliatePurchaseOptionsProps> = ({ 
  product, 
  hasAffiliateLink 
}) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedBundle, setSelectedBundle] = useState('single');
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isBuyingNow, setIsBuyingNow] = useState(false);
  const [isPayPalLoading, setIsPayPalLoading] = useState(false);

  const bundleOptions = [
    { id: 'single', label: `Get 1 ${product?.name}`, quantity: 1, price: product?.price },
    { id: 'bundle2', label: `Get 2 ${product?.name} SAVE $15 OFF - ONLY DAY`, quantity: 2, price: (product?.price * 2) - 15 },
    { id: 'bundle3', label: `Get 3 ${product?.name} SAVE $30 OFF - ONLY DAY`, quantity: 3, price: (product?.price * 3) - 30 }
  ];

  const handleAddToCart = async () => {
    if (product) {
      setIsAddingToCart(true);
      try {
        const bundleQuantity = bundleOptions.find(b => b.id === selectedBundle)?.quantity || 1;
        const totalQuantity = quantity * bundleQuantity;
        addToCart(product.id, totalQuantity);
        await new Promise(resolve => setTimeout(resolve, 1000));
        alert(`✅ Added ${totalQuantity} ${product.name} to cart!`);
      } catch (error) {
        alert('❌ Failed to add to cart. Please try again.');
      } finally {
        setIsAddingToCart(false);
      }
    }
  };

  const handleBuyNow = async () => {
    if (product) {
      setIsBuyingNow(true);
      try {
        if (hasAffiliateLink) {
          // Redirect to affiliate link
          const affiliateUrl = product.affiliateLink || product.externalUrl || `https://amazon.com/dp/${product.id}`;
          window.open(affiliateUrl, '_blank', 'noopener,noreferrer');
          console.log('Affiliate link clicked:', affiliateUrl);
        } else {
          // Add to cart and redirect to checkout
          const bundleQuantity = bundleOptions.find(b => b.id === selectedBundle)?.quantity || 1;
          const totalQuantity = quantity * bundleQuantity;
          addToCart(product.id, totalQuantity);
          await new Promise(resolve => setTimeout(resolve, 500));
          window.location.href = '/cart';
        }
      } catch (error) {
        alert('❌ Purchase failed. Please try again.');
      } finally {
        setIsBuyingNow(false);
      }
    }
  };

  const handlePayPal = async () => {
    if (product) {
      setIsPayPalLoading(true);
      try {
        const bundleQuantity = bundleOptions.find(b => b.id === selectedBundle)?.quantity || 1;
        const totalQuantity = quantity * bundleQuantity;
        const totalPrice = (product.price * totalQuantity).toFixed(2);
        await new Promise(resolve => setTimeout(resolve, 800));
        const paypalUrl = `https://www.paypal.com/checkoutnow?token=${product.id}&amount=${totalPrice}&quantity=${totalQuantity}`;
        window.open(paypalUrl, '_blank', 'noopener,noreferrer');
        console.log('PayPal checkout initiated:', { product: product.name, quantity: totalQuantity, price: totalPrice });
      } catch (error) {
        alert('❌ PayPal checkout failed. Please try again.');
      } finally {
        setIsPayPalLoading(false);
      }
    }
  };

  return (
    <Box>
      {/* Bundle Options */}
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#000000' }}>
        Bundle & save
      </Typography>
      <Stack spacing={1} sx={{ mb: 3 }}>
        {bundleOptions.map((bundle) => (
          <Paper
            key={bundle.id}
            sx={{
              p: 2,
              border: selectedBundle === bundle.id ? '2px solid #1976d2' : '1px solid #e0e0e0',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              '&:hover': {
                borderColor: '#1976d2',
                backgroundColor: '#f5f5f5'
              }
            }}
            onClick={() => setSelectedBundle(bundle.id)}
          >
            <FormControlLabel
              control={
                <Radio
                  checked={selectedBundle === bundle.id}
                  onChange={() => setSelectedBundle(bundle.id)}
                  color="primary"
                />
              }
              label={
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {bundle.label}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#1976d2' }}>
                    ${bundle.price?.toFixed(2)}
                  </Typography>
                </Box>
              }
            />
          </Paper>
        ))}
      </Stack>

      {/* Quantity Selector */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" sx={{ mb: 1, color: '#666666' }}>
          Quantity
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
            size="small"
          >
            <Remove />
          </IconButton>
          <TextField
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            inputProps={{ min: 1, style: { textAlign: 'center' } }}
            sx={{ width: 80 }}
            size="small"
          />
          <IconButton
            onClick={() => setQuantity(quantity + 1)}
            size="small"
          >
            <Add />
          </IconButton>
        </Box>
      </Box>

      {/* Purchase Buttons */}
      <Stack spacing={2} sx={{ mb: 3 }}>
        {hasAffiliateLink ? (
          // Affiliate-focused buttons
          <>
            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={handleBuyNow}
              disabled={isBuyingNow}
              startIcon={isBuyingNow ? <ShoppingCart /> : <FlashOn />}
              sx={{
                backgroundColor: '#dc2626',
                color: 'white',
                fontWeight: 600,
                py: 1.5,
                '&:hover': {
                  backgroundColor: '#b91c1c'
                }
              }}
            >
              {isBuyingNow ? 'Redirecting...' : 'BUY IT NOW'}
            </Button>
            
            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={handlePayPal}
              disabled={isPayPalLoading}
              startIcon={isPayPalLoading ? <Payment /> : <Payment />}
              sx={{
                backgroundColor: '#003087',
                color: 'white',
                fontWeight: 600,
                py: 1.5,
                '&:hover': {
                  backgroundColor: '#002366'
                }
              }}
            >
              {isPayPalLoading ? 'Processing...' : 'PayPal'}
            </Button>
          </>
        ) : (
          // E-commerce buttons
          <>
            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              startIcon={isAddingToCart ? <ShoppingCart /> : <ShoppingCart />}
              sx={{
                backgroundColor: '#1976d2',
                color: 'white',
                fontWeight: 600,
                py: 1.5,
                '&:hover': {
                  backgroundColor: '#1565c0'
                }
              }}
            >
              {isAddingToCart ? 'Adding...' : 'ADD TO CART'}
            </Button>
            
            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={handleBuyNow}
              disabled={isBuyingNow}
              startIcon={isBuyingNow ? <FlashOn /> : <FlashOn />}
              sx={{
                backgroundColor: '#dc2626',
                color: 'white',
                fontWeight: 600,
                py: 1.5,
                '&:hover': {
                  backgroundColor: '#b91c1c'
                }
              }}
            >
              {isBuyingNow ? 'Processing...' : 'BUY IT NOW'}
            </Button>
          </>
        )}
      </Stack>

      {/* Trust Indicators */}
      <Box sx={{ textAlign: 'center', mb: 2 }}>
        <Typography variant="body2" sx={{ color: '#666666', mb: 1 }}>
          Guaranteed Safe Checkout
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Typography variant="body2" sx={{ color: '#666666' }}>
            🔒 SSL Secured
          </Typography>
          <Typography variant="body2" sx={{ color: '#666666' }}>
            💳 Multiple Payment Options
          </Typography>
          <Typography variant="body2" sx={{ color: '#666666' }}>
            🚚 Fast Shipping
          </Typography>
        </Box>
      </Box>

      {/* Affiliate Notice */}
      {hasAffiliateLink && (
        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="body2">
            <strong>Affiliate Link:</strong> You'll be redirected to the official retailer to complete your purchase. 
            We may earn a commission from qualifying purchases.
          </Typography>
        </Alert>
      )}
    </Box>
  );
};

export default AffiliatePurchaseOptions;
