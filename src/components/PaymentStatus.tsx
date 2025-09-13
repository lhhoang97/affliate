import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Alert,
  Divider
} from '@mui/material';
import {
  CheckCircle,
  Error,
  Info,
  CreditCard,
  AttachMoney
} from '@mui/icons-material';
import { getPaymentProviderStatus } from '../services/realPaymentService';

const PaymentStatus: React.FC = () => {
  const status = getPaymentProviderStatus();

  const getStatusIcon = () => {
    if (status.productionMode) {
      return <CheckCircle color="success" />;
    } else if (status.testMode) {
      return <Info color="info" />;
    } else {
      return <Error color="error" />;
    }
  };

  const getStatusText = () => {
    if (status.productionMode) {
      return 'LIVE PAYMENTS ENABLED';
    } else if (status.testMode) {
      return 'TEST MODE ACTIVE';
    } else {
      return 'PAYMENT NOT CONFIGURED';
    }
  };

  const getStatusColor = () => {
    if (status.productionMode) {
      return 'success';
    } else if (status.testMode) {
      return 'info';
    } else {
      return 'error';
    }
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          {getStatusIcon()}
          Payment System Status
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          <Chip 
            label={getStatusText()} 
            color={getStatusColor() as any}
            size="small"
          />
          <Chip 
            label={`Stripe: ${status.stripe.enabled ? 'Enabled' : 'Disabled'}`} 
            color={status.stripe.enabled ? 'success' : 'error'}
            size="small"
            icon={<CreditCard />}
          />
          <Chip 
            label={`PayPal: ${status.paypal.enabled ? 'Enabled' : 'Disabled'}`} 
            color={status.paypal.enabled ? 'success' : 'error'}
            size="small"
            icon={<AttachMoney />}
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        {status.productionMode ? (
          <Alert severity="success">
            <Typography variant="body2">
              <strong>LIVE PAYMENTS ACTIVE</strong><br />
              Real money transactions are enabled. All payments will be processed with real funds.
            </Typography>
          </Alert>
        ) : status.testMode ? (
          <Alert severity="info">
            <Typography variant="body2">
              <strong>TEST MODE ACTIVE</strong><br />
              No real money will be charged. Use test cards for testing:
              <br />
              • Success: 4242 4242 4242 4242
              <br />
              • Decline: 4000 0000 0000 0002
            </Typography>
          </Alert>
        ) : (
          <Alert severity="error">
            <Typography variant="body2">
              <strong>PAYMENT NOT CONFIGURED</strong><br />
              Please set up your payment keys in the .env file to enable payments.
            </Typography>
          </Alert>
        )}

        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            <strong>Supported Cards:</strong> Visa, Mastercard, American Express, Discover
            <br />
            <strong>Supported Payments:</strong> PayPal, Credit/Debit Cards
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PaymentStatus;
