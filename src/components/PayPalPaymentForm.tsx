import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  AttachMoney,
  Security,
  Error as ErrorIcon
} from '@mui/icons-material';

interface PayPalPaymentFormProps {
  amount: number;
  currency: string;
  customerInfo: {
    name: string;
    email: string;
  };
  onPaymentSuccess: (result: any) => void;
  onPaymentError: (error: string) => void;
}

const PayPalPaymentForm: React.FC<PayPalPaymentFormProps> = ({
  amount,
  currency,
  customerInfo,
  onPaymentSuccess,
  onPaymentError
}) => {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayPalPayment = async () => {
    setProcessing(true);
    setError(null);

    try {
      // Create PayPal order
      const response = await fetch('/api/create-paypal-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount,
          currency: currency,
          customer: customerInfo,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create PayPal order');
      }

      const { orderId } = await response.json();

      // In a real implementation, you would use PayPal's SDK here
      // For demo purposes, we'll simulate the PayPal flow
      
      // Simulate PayPal window opening
      const paypalWindow = window.open(
        `https://www.paypal.com/checkoutnow?token=${orderId}&amount=${amount}&currency=${currency}`,
        'paypal',
        'width=600,height=700'
      );

      if (!paypalWindow) {
        throw new Error('Popup blocked. Please allow popups for PayPal.');
      }

      // Listen for PayPal completion
      const checkClosed = setInterval(() => {
        if (paypalWindow.closed) {
          clearInterval(checkClosed);
          
          // In real implementation, you'd verify the payment on your backend
          // For demo, we'll simulate success
          setTimeout(() => {
            onPaymentSuccess({
              id: orderId,
              status: 'COMPLETED',
              amount: amount,
              currency: currency
            });
          }, 1000);
        }
      }, 1000);

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Payment failed';
      setError(errorMessage);
      onPaymentError(errorMessage);
      setProcessing(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <AttachMoney color="primary" />
          PayPal Payment
        </Typography>

        <Alert severity="info" sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Security />
            <Typography variant="body2">
              Pay securely with PayPal. You'll be redirected to PayPal to complete your payment.
            </Typography>
          </Box>
        </Alert>

        {/* Customer Information */}
        <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium' }}>
            Customer Information:
          </Typography>
          <Typography variant="body2">
            <strong>Name:</strong> {customerInfo.name}
          </Typography>
          <Typography variant="body2">
            <strong>Email:</strong> {customerInfo.email}
          </Typography>
        </Box>

        {/* Error Display */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ErrorIcon />
              <Typography variant="body2">{error}</Typography>
            </Box>
          </Alert>
        )}

        {/* Payment Summary */}
        <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Amount:</span>
            <span><strong>{currency.toUpperCase()} {amount.toFixed(2)}</strong></span>
          </Typography>
        </Box>

        {/* PayPal Button */}
        <Button
          variant="contained"
          fullWidth
          size="large"
          onClick={handlePayPalPayment}
          disabled={processing}
          sx={{ 
            py: 2,
            backgroundColor: '#FFC439',
            color: '#000',
            '&:hover': {
              backgroundColor: '#FFC439',
              opacity: 0.9
            },
            '&:disabled': {
              backgroundColor: '#FFC439',
              opacity: 0.6
            }
          }}
          startIcon={processing ? <CircularProgress size={20} color="inherit" /> : <AttachMoney />}
        >
          {processing ? 'Redirecting to PayPal...' : 'Pay with PayPal'}
        </Button>

        {/* PayPal Info */}
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            You'll be redirected to PayPal to complete your payment securely.
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PayPalPaymentForm;
