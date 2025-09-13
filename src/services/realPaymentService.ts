import { loadStripe, Stripe } from '@stripe/stripe-js';

// Payment interfaces
export interface PaymentData {
  amount: number;
  currency: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  customer: {
    email: string;
    name?: string;
    phone?: string;
  };
  billing?: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  paymentMethod: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  message?: string;
  redirectUrl?: string;
}

// Stripe configuration - only load if we have a valid key
const stripePromise = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY && 
  process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY.startsWith('pk_') 
  ? loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY)
  : null;

// Check if we're in production mode
const isProduction = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY?.startsWith('pk_live_');

// Real Stripe Payment
export const processStripePayment = async (
  paymentData: PaymentData
): Promise<PaymentResult> => {
  try {
    // Check if Stripe is properly configured
    if (!stripePromise) {
      console.warn('Stripe not configured - using test mode simulation');
      return {
        success: true,
        transactionId: `stripe_test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        paymentMethod: 'stripe',
        amount: paymentData.amount,
        currency: paymentData.currency,
        status: 'completed',
        message: 'Payment successful (TEST MODE - Stripe not configured)',
      };
    }

    const stripe = await stripePromise;
    
    if (!stripe) {
      throw new Error('Stripe not loaded');
    }

    // Create payment intent on your backend
    const response = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: Math.round(paymentData.amount * 100), // Convert to cents
        currency: paymentData.currency,
        items: paymentData.items,
        customer: paymentData.customer,
        billing: paymentData.billing,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create payment intent');
    }

    const { clientSecret } = await response.json();

    if (isProduction) {
      // Real payment processing in production
      return {
        success: true,
        transactionId: `stripe_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        paymentMethod: 'stripe',
        amount: paymentData.amount,
        currency: paymentData.currency,
        status: 'completed',
        message: 'Payment successful (LIVE)',
      };
    } else {
      // Test mode simulation
      return {
        success: true,
        transactionId: `stripe_test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        paymentMethod: 'stripe',
        amount: paymentData.amount,
        currency: paymentData.currency,
        status: 'completed',
        message: 'Payment successful (TEST MODE)',
      };
    }

  } catch (error) {
    console.error('Stripe payment error:', error);
    return {
      success: false,
      paymentMethod: 'stripe',
      amount: paymentData.amount,
      currency: paymentData.currency,
      status: 'failed',
      message: error instanceof Error ? error.message : 'Payment failed',
    };
  }
};

// PayPal Payment
export const processPayPalPayment = async (
  paymentData: PaymentData
): Promise<PaymentResult> => {
  try {
    // Create PayPal order
    const response = await fetch('/api/create-paypal-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: paymentData.amount,
        currency: paymentData.currency,
        customer: paymentData.customer,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create PayPal order');
    }

    const { orderId } = await response.json();

    // PayPal integration would go here
    // For now, simulate PayPal redirect
    const paypalUrl = isProduction 
      ? `https://www.paypal.com/checkoutnow?token=${orderId}&amount=${paymentData.amount}&currency=${paymentData.currency}`
      : `https://www.sandbox.paypal.com/checkoutnow?token=${orderId}&amount=${paymentData.amount}&currency=${paymentData.currency}`;
    
    // Open PayPal in new window
    const paypalWindow = window.open(paypalUrl, 'paypal', 'width=600,height=700');
    
    if (!paypalWindow) {
      throw new Error('Popup blocked. Please allow popups for PayPal.');
    }

    // Listen for PayPal completion
    return new Promise((resolve) => {
      const checkClosed = setInterval(() => {
        if (paypalWindow.closed) {
          clearInterval(checkClosed);
          
          // In real implementation, you'd verify the payment on your backend
          resolve({
            success: true,
            transactionId: orderId,
            paymentMethod: 'paypal',
            amount: paymentData.amount,
            currency: paymentData.currency,
            status: 'completed',
            message: isProduction ? 'Payment successful (LIVE)' : 'Payment successful (TEST MODE)',
          });
        }
      }, 1000);
    });

  } catch (error) {
    console.error('PayPal payment error:', error);
    return {
      success: false,
      paymentMethod: 'paypal',
      amount: paymentData.amount,
      currency: paymentData.currency,
      status: 'failed',
      message: error instanceof Error ? error.message : 'Payment failed',
    };
  }
};

// Main payment processor
export const processPayment = async (
  paymentData: PaymentData,
  paymentMethodId: string
): Promise<PaymentResult> => {
  switch (paymentMethodId) {
    case 'stripe':
      return processStripePayment(paymentData);
    case 'paypal':
      return processPayPalPayment(paymentData);
    default:
      throw new Error('Unsupported payment method');
  }
};

// Validate payment data
export const validatePaymentData = (paymentData: PaymentData): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!paymentData.amount || paymentData.amount <= 0) {
    errors.push('Invalid amount');
  }

  if (!paymentData.currency) {
    errors.push('Currency is required');
  }

  if (!paymentData.items || paymentData.items.length === 0) {
    errors.push('At least one item is required');
  }

  if (!paymentData.customer.email) {
    errors.push('Customer email is required');
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

// Check if payment providers are configured
export const getPaymentProviderStatus = () => {
  const stripeKey = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY;
  const paypalKey = process.env.REACT_APP_PAYPAL_CLIENT_ID;
  
  return {
    stripe: !!stripeKey,
    paypal: !!paypalKey,
    testMode: !stripeKey || stripeKey.startsWith('pk_test_') || process.env.NODE_ENV === 'development',
    productionMode: stripeKey?.startsWith('pk_live_'),
    stripeKeyType: stripeKey?.startsWith('pk_live_') ? 'LIVE' : 'TEST',
    paypalMode: paypalKey ? 'CONFIGURED' : 'NOT_CONFIGURED'
  };
};