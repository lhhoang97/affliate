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
  CircularProgress,
  IconButton
} from '@mui/material';
import {
  ShoppingCart,
  CheckCircle,
  ArrowBack
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useBusinessMode } from '../contexts/BusinessModeContext';
import SimpleCheckout from '../components/SimpleCheckout';

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
    'Checkout',
    'Processing',
    'Complete'
  ];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };



  const handleCheckoutComplete = () => {
    setActiveStep(2);
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <SimpleCheckout onComplete={handleCheckoutComplete} />
        );

      case 1:
        return (
          <Box sx={{ textAlign: 'center' }}>
            {isProcessing ? (
              <Box>
                <CircularProgress size={60} sx={{ mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Processing Payment...
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Please wait while we process your order
                </Typography>
              </Box>
            ) : (
              <Box>
                <Typography variant="h5" gutterBottom>
                  Payment Processing
                </Typography>
                <Typography variant="body1" sx={{ mb: 3 }}>
                  Your payment is being processed...
                </Typography>
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
              Thank you for your purchase! Your order has been processed and you'll receive a confirmation email shortly.
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

      {/* Navigation Buttons - Only show back button for processing step */}
      {activeStep === 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button
            onClick={handleBack}
            startIcon={<ArrowBack />}
          >
            Back to Checkout
          </Button>
        </Box>
      )}

    </Container>
  );
};

export default SmartCheckoutPage;

