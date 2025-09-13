import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  CircularProgress,
  TextField
} from '@mui/material';
import {
  CreditCard,
  Security,
  CheckCircle,
  Error as ErrorIcon
} from '@mui/icons-material';

interface StripePaymentFormProps {
  amount: number;
  currency: string;
  customerInfo: {
    name: string;
    email: string;
  };
  onPaymentSuccess: (result: any) => void;
  onPaymentError: (error: string) => void;
}

const StripePaymentForm: React.FC<StripePaymentFormProps> = ({
  amount,
  currency,
  customerInfo,
  onPaymentSuccess,
  onPaymentError
}) => {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    setProcessing(true);
    setError(null);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In test mode, always succeed
      // In real implementation, you would call your backend API here
      const result = {
        id: `stripe_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        status: 'succeeded',
        amount: amount,
        currency: currency
      };

      onPaymentSuccess(result);

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Payment failed';
      setError(errorMessage);
      onPaymentError(errorMessage);
    } finally {
      setProcessing(false);
    }
  };

  const handleCardInputChange = (field: string, value: string) => {
    setCardDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <CreditCard color="primary" />
          Credit/Debit Card Payment
        </Typography>

        <Alert severity="info" sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Security />
            <Typography variant="body2">
              Your card information is encrypted and secure. We never store your payment details.
            </Typography>
          </Box>
        </Alert>

        <form onSubmit={handleSubmit}>
          {/* Customer Information */}
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Cardholder Name"
              value={cardDetails.cardholderName}
              onChange={(e) => handleCardInputChange('cardholderName', e.target.value)}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Email"
              value={customerInfo.email}
              disabled
              sx={{ mb: 2 }}
            />
          </Box>

          {/* Card Information */}
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Card Number"
              placeholder="1234 5678 9012 3456"
              value={cardDetails.cardNumber}
              onChange={(e) => handleCardInputChange('cardNumber', e.target.value)}
              required
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="Expiry Date"
                placeholder="MM/YY"
                value={cardDetails.expiryDate}
                onChange={(e) => handleCardInputChange('expiryDate', e.target.value)}
                required
              />
              <TextField
                fullWidth
                label="CVV"
                placeholder="123"
                value={cardDetails.cvv}
                onChange={(e) => handleCardInputChange('cvv', e.target.value)}
                required
              />
            </Box>
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

          {/* Submit Button */}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={processing}
            sx={{ py: 2 }}
            startIcon={processing ? <CircularProgress size={20} color="inherit" /> : <CheckCircle />}
          >
            {processing ? 'Processing Payment...' : `Pay ${currency.toUpperCase()} ${amount.toFixed(2)}`}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default StripePaymentForm;