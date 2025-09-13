import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Divider,
  Chip,
  Alert,
  CircularProgress,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent
} from '@mui/material';
import {
  ShoppingCart,
  CreditCard,
  Security,
  CheckCircle,
  LocalShipping
} from '@mui/icons-material';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import StripePaymentForm from './StripePaymentForm';
import PayPalPaymentForm from './PayPalPaymentForm';
import PaymentStatus from './PaymentStatus';

interface SimpleCheckoutProps {
  onComplete: () => void;
}

const SimpleCheckout: React.FC<SimpleCheckoutProps> = ({ onComplete }) => {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const [processing, setProcessing] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);

  const shippingCost = 4.99;
  const finalTotal = totalPrice + shippingCost;

  const handlePayment = async (paymentMethod: string) => {
    setSelectedPayment(paymentMethod);
    setShowPaymentDialog(true);
  };

  const handlePaymentSuccess = (result: any) => {
    console.log('Payment successful:', result);
    setShowPaymentDialog(false);
    setProcessing(false);
    setSelectedPayment(null);
    
    // Clear cart and complete checkout
    clearCart();
    onComplete();
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment failed:', error);
    setShowPaymentDialog(false);
    setProcessing(false);
    setSelectedPayment(null);
  };

  const paymentMethods = [
    {
      id: 'paypal',
      name: 'PayPal',
      icon: '🅿️',
      color: '#FFC439',
      description: 'Pay with PayPal account'
    },
    {
      id: 'credit',
      name: 'Credit/Debit Card',
      icon: '💳',
      color: '#333333',
      description: 'Visa, Mastercard, American Express'
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Payment Status */}
      <PaymentStatus />
      
      <Grid container spacing={4}>
        {/* Left Side - Order Summary */}
        <Grid item xs={12} md={7}>
          <Card>
            <CardContent>
              {/* Store Branding */}
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                  🛍️ BestFinds ONLINE STORE
                </Typography>
                
                {/* Trust Badges */}
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
                  <Chip 
                    label="Google Trusted Store ⭐⭐⭐⭐⭐" 
                    color="primary" 
                    size="small" 
                  />
                  <Chip 
                    label="ACCREDITED BUSINESS A+ Ratings" 
                    color="success" 
                    size="small" 
                  />
                </Box>
              </Box>

              <Divider sx={{ mb: 3 }} />

              {/* Order Summary */}
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Order Summary
              </Typography>

              {/* Products */}
              {items.map((item, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {/* Product Image Placeholder */}
                    <Box sx={{ 
                      width: 60, 
                      height: 60, 
                      bgcolor: '#f5f5f5', 
                      borderRadius: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px'
                    }}>
                      📦
                    </Box>
                    
                    {/* Product Details */}
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        {item.product?.name || 'Product Name'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Quantity: {item.quantity}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Bundle: {item.bundleOption?.type || 'Single'}
                      </Typography>
                    </Box>
                    
                    {/* Price */}
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        ${(item.product?.price || 0).toFixed(2)}
                      </Typography>
                      {item.quantity > 1 && (
                        <Typography variant="body2" color="text.secondary">
                          ${((item.product?.price || 0) * item.quantity).toFixed(2)} total
                        </Typography>
                      )}
                    </Box>
                  </Box>
                  {index < items.length - 1 && <Divider sx={{ mt: 2 }} />}
                </Box>
              ))}

              <Divider sx={{ my: 3 }} />

              {/* Total Calculation */}
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1">Subtotal:</Typography>
                  <Typography variant="body1">${totalPrice.toFixed(2)}</Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1">
                    Shipping (Standard):
                  </Typography>
                  <Typography variant="body1">${shippingCost.toFixed(2)}</Typography>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Total:
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    ${finalTotal.toFixed(2)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Side - Payment Options */}
        <Grid item xs={12} md={5}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                Express checkout
              </Typography>

              {/* Payment Methods */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
                {paymentMethods.map((method) => (
                  <Button
                    key={method.id}
                    variant="contained"
                    fullWidth
                    size="large"
                    onClick={() => handlePayment(method.id)}
                    disabled={processing}
                    sx={{
                      py: 2,
                      backgroundColor: method.color,
                      color: method.id === 'paypal' ? '#000' : '#fff',
                      '&:hover': {
                        backgroundColor: method.color,
                        opacity: 0.9
                      },
                      '&:disabled': {
                        backgroundColor: method.color,
                        opacity: 0.6
                      }
                    }}
                    startIcon={
                      processing && selectedPayment === method.id ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        <span style={{ fontSize: '20px' }}>{method.icon}</span>
                      )
                    }
                  >
                    {method.name}
                  </Button>
                ))}
              </Box>

              {/* Security Information */}
              <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  All transactions are secure and encrypted by
                </Typography>
                
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                  <Chip label="McAfee SECURE" size="small" variant="outlined" />
                  <Chip label="VeriSign Secured ✓" size="small" variant="outlined" />
                  <Chip label="Norton SECURED ✓" size="small" variant="outlined" />
                  <Chip label="TRUSTe VERIFIED ✓" size="small" variant="outlined" />
                </Box>
              </Box>

              {/* Security Alert */}
              <Alert severity="info" sx={{ mt: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Security />
                  <Typography variant="body2">
                    Your payment information is encrypted and secure. We never store your credit card details.
                  </Typography>
                </Box>
              </Alert>

              {/* Shipping Info */}
              <Alert severity="success" sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocalShipping />
                  <Typography variant="body2">
                    <strong>Free shipping</strong> on orders over $75. Standard shipping: $4.99
                  </Typography>
                </Box>
              </Alert>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Payment Dialog */}
      <Dialog 
        open={showPaymentDialog} 
        onClose={() => setShowPaymentDialog(false)} 
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle>
          Complete Payment - {selectedPayment === 'paypal' ? 'PayPal' : 'Credit/Debit Card'}
        </DialogTitle>
        <DialogContent>
          {selectedPayment === 'stripe' && user && (
            <StripePaymentForm
              amount={finalTotal}
              currency="USD"
              customerInfo={{
                name: user.name || 'Guest User',
                email: user.email || 'guest@example.com'
              }}
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentError={handlePaymentError}
            />
          )}
          
          {selectedPayment === 'paypal' && user && (
            <PayPalPaymentForm
              amount={finalTotal}
              currency="USD"
              customerInfo={{
                name: user.name || 'Guest User',
                email: user.email || 'guest@example.com'
              }}
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentError={handlePaymentError}
            />
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default SimpleCheckout;
