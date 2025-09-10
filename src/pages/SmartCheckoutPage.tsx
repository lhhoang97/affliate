import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Stepper,
  Step,
  StepLabel,
  Grid,
  Divider,
  Alert,
  CircularProgress,
  Chip,
  Stack,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  ShoppingCart,
  Payment,
  LocalShipping,
  CheckCircle,
  CreditCard,
  AccountBalance,
  AttachMoney,
  Security,
  ArrowBack,
  Info
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useBusinessMode } from '../contexts/BusinessModeContext';

interface CheckoutItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  affiliateLink?: string;
}

const SmartCheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { items, totalPrice, clearCart } = useCart();
  const { mode, isAffiliateMode, isEcommerceMode, isHybridMode } = useBusinessMode();
  
  const [activeStep, setActiveStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showModeDialog, setShowModeDialog] = useState(false);
  const [checkoutItems, setCheckoutItems] = useState<CheckoutItem[]>([]);

  useEffect(() => {
    // Convert cart items to checkout items
    const checkoutItems = items.map(item => ({
      id: item.product_id,
      name: item.product?.name || 'Unknown Product',
      price: item.product?.price || 0,
      quantity: item.quantity,
      image: item.product?.image,
      affiliateLink: item.product?.affiliateLink
    }));
    setCheckoutItems(checkoutItems);
  }, [items]);

  const steps = [
    'Review Order',
    isAffiliateMode ? 'Redirect to Retailer' : 'Payment',
    'Confirmation'
  ];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleAffiliateCheckout = async () => {
    setIsProcessing(true);
    
    try {
      // Find the first item with affiliate link
      const firstItem = checkoutItems.find(item => item.affiliateLink);
      
      if (firstItem && firstItem.affiliateLink) {
        // Redirect to affiliate link
        window.open(firstItem.affiliateLink, '_blank', 'noopener,noreferrer');
        
        // Clear cart after successful redirect
        setTimeout(() => {
          clearCart();
          setIsProcessing(false);
          setActiveStep(2);
        }, 2000);
      } else {
        // Fallback to Amazon
        const amazonUrl = `https://amazon.com/s?k=${checkoutItems.map(item => item.name).join('+')}`;
        window.open(amazonUrl, '_blank', 'noopener,noreferrer');
        
        setTimeout(() => {
          clearCart();
          setIsProcessing(false);
          setActiveStep(2);
        }, 2000);
      }
    } catch (error) {
      console.error('Affiliate checkout error:', error);
      setIsProcessing(false);
    }
  };

  const handleEcommerceCheckout = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Clear cart after successful payment
      clearCart();
      setIsProcessing(false);
      setActiveStep(2);
    } catch (error) {
      console.error('E-commerce checkout error:', error);
      setIsProcessing(false);
    }
  };

  const handleHybridCheckout = async () => {
    // In hybrid mode, let user choose
    setShowModeDialog(true);
  };

  const getModeColor = () => {
    switch (mode) {
      case 'affiliate': return 'success';
      case 'ecommerce': return 'primary';
      case 'hybrid': return 'warning';
      default: return 'default';
    }
  };

  const getModeIcon = () => {
    switch (mode) {
      case 'affiliate': return <AttachMoney />;
      case 'ecommerce': return <CreditCard />;
      case 'hybrid': return <AccountBalance />;
      default: return <ShoppingCart />;
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Review Your Order
            </Typography>
            
            {/* Business Mode Indicator */}
            <Box sx={{ mb: 3 }}>
              <Chip
                icon={getModeIcon()}
                label={`${mode.toUpperCase()} Mode`}
                color={getModeColor() as any}
                variant="outlined"
                sx={{ mb: 1 }}
              />
              <Typography variant="body2" color="text.secondary">
                {isAffiliateMode && "You'll be redirected to the retailer to complete your purchase"}
                {isEcommerceMode && "Complete your purchase securely on our platform"}
                {isHybridMode && "Choose your preferred checkout method"}
              </Typography>
            </Box>

            {/* Order Items */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Order Items ({checkoutItems.length})
                </Typography>
                {checkoutItems.map((item, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ width: 60, height: 60, mr: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }} />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1">{item.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Quantity: {item.quantity}
                      </Typography>
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </Typography>
                  </Box>
                ))}
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6">Total:</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    ${totalPrice.toFixed(2)}
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            {/* Mode-specific Information */}
            {isAffiliateMode && (
              <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="body2">
                  <strong>Affiliate Checkout:</strong> You'll be redirected to the official retailer 
                  to complete your purchase. We may earn a commission from qualifying purchases.
                </Typography>
              </Alert>
            )}

            {isEcommerceMode && (
              <Alert severity="success" sx={{ mb: 3 }}>
                <Typography variant="body2">
                  <strong>Direct Checkout:</strong> Complete your purchase securely on our platform 
                  with multiple payment options and buyer protection.
                </Typography>
              </Alert>
            )}

            {isHybridMode && (
              <Alert severity="warning" sx={{ mb: 3 }}>
                <Typography variant="body2">
                  <strong>Hybrid Mode:</strong> Choose between affiliate redirect or direct checkout 
                  based on your preference and available options.
                </Typography>
              </Alert>
            )}
          </Box>
        );

      case 1:
        return (
          <Box sx={{ textAlign: 'center' }}>
            {isProcessing ? (
              <Box>
                <CircularProgress size={60} sx={{ mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  {isAffiliateMode ? 'Redirecting to Retailer...' : 'Processing Payment...'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Please wait while we process your order
                </Typography>
              </Box>
            ) : (
              <Box>
                <Typography variant="h5" gutterBottom>
                  {isAffiliateMode ? 'Ready to Redirect' : 'Payment Information'}
                </Typography>
                
                {isAffiliateMode ? (
                  <Box>
                    <LocalShipping sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
                    <Typography variant="body1" sx={{ mb: 3 }}>
                      Click the button below to complete your purchase on the retailer's website
                    </Typography>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={handleAffiliateCheckout}
                      startIcon={<AttachMoney />}
                      sx={{ mb: 2 }}
                    >
                      Complete Purchase on Retailer Site
                    </Button>
                  </Box>
                ) : (
                  <Box>
                    <CreditCard sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                    <Typography variant="body1" sx={{ mb: 3 }}>
                      Enter your payment information to complete the purchase
                    </Typography>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={handleEcommerceCheckout}
                      startIcon={<Payment />}
                      sx={{ mb: 2 }}
                    >
                      Process Payment
                    </Button>
                  </Box>
                )}
              </Box>
            )}
          </Box>
        );

      case 2:
        return (
          <Box sx={{ textAlign: 'center' }}>
            <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
            <Typography variant="h4" gutterBottom color="success.main">
              Order Complete!
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              {isAffiliateMode 
                ? "Thank you for your purchase! You should receive a confirmation email from the retailer shortly."
                : "Thank you for your purchase! Your order has been processed and you'll receive a confirmation email shortly."
              }
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/')}
              startIcon={<ShoppingCart />}
            >
              Continue Shopping
            </Button>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <IconButton onClick={() => navigate('/cart')} sx={{ mr: 2 }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" component="h1">
          Checkout
        </Typography>
      </Box>

      {/* Stepper */}
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* Step Content */}
      <Card>
        <CardContent sx={{ p: 4 }}>
          {renderStepContent(activeStep)}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      {activeStep < 2 && !isProcessing && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            startIcon={<ArrowBack />}
          >
            Back
          </Button>
          
          {activeStep === 0 && (
            <Button
              variant="contained"
              onClick={handleNext}
              endIcon={<Payment />}
            >
              {isAffiliateMode ? 'Continue to Retailer' : 'Continue to Payment'}
            </Button>
          )}
        </Box>
      )}

      {/* Hybrid Mode Dialog */}
      <Dialog open={showModeDialog} onClose={() => setShowModeDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Choose Checkout Method</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 3 }}>
            You can choose between affiliate redirect or direct checkout:
          </Typography>
          
          <Stack spacing={2}>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => {
                setShowModeDialog(false);
                handleAffiliateCheckout();
              }}
              startIcon={<AttachMoney />}
            >
              Affiliate Checkout (Redirect to Retailer)
            </Button>
            
            <Button
              variant="outlined"
              fullWidth
              onClick={() => {
                setShowModeDialog(false);
                handleEcommerceCheckout();
              }}
              startIcon={<CreditCard />}
            >
              Direct Checkout (Pay Here)
            </Button>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowModeDialog(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SmartCheckoutPage;
