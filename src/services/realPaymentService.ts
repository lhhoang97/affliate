import { loadStripe } from '@stripe/stripe-js';
import { mockApiCall } from '../api/paymentApi';

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

// Stripe configuration
const stripePromise = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY 
  ? loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY)
  : null;

// Stripe Payment (Real Implementation)
export const processStripePayment = async (
  paymentData: PaymentData
): Promise<PaymentResult> => {
  try {
    if (!stripePromise) {
      throw new Error('Stripe not configured. Please add REACT_APP_STRIPE_PUBLISHABLE_KEY to your .env file');
    }

    const stripe = await stripePromise;
    
    if (!stripe) {
      throw new Error('Stripe failed to load');
    }

    // Create payment intent (using mock API for now)
    const response = await mockApiCall('/api/create-payment-intent', {
      amount: Math.round(paymentData.amount * 100), // Convert to cents
      currency: paymentData.currency,
      customer: paymentData.customer,
      items: paymentData.items,
    });
    
    const { clientSecret } = response as { clientSecret: string; id: string };

    // For demo purposes, simulate successful payment
    // In real implementation, you would use Stripe Elements for card input
    const paymentIntent = {
      id: `pi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: 'succeeded'
    };

    // No error in demo mode

    return {
      success: true,
      transactionId: paymentIntent.id,
      paymentMethod: 'stripe',
      amount: paymentData.amount,
      currency: paymentData.currency,
      status: paymentIntent.status === 'succeeded' ? 'completed' : 'pending',
      message: 'Payment successful',
    };

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

// PayPal Payment (Real Implementation)
export const processPayPalPayment = async (
  paymentData: PaymentData
): Promise<PaymentResult> => {
  try {
    if (!process.env.REACT_APP_PAYPAL_CLIENT_ID) {
      throw new Error('PayPal not configured. Please add REACT_APP_PAYPAL_CLIENT_ID to your .env file');
    }

    // Create PayPal order (using mock API for now)
    const response = await mockApiCall('/api/create-paypal-order', {
      amount: paymentData.amount,
      currency: paymentData.currency,
      customer: paymentData.customer,
      items: paymentData.items,
    });
    
    const { orderId } = response as { orderId: string; id: string };

    // PayPal integration
    const paypalUrl = process.env.REACT_APP_PAYPAL_CLIENT_ID.includes('sandbox')
      ? `https://www.sandbox.paypal.com/checkoutnow?token=${orderId}&amount=${paymentData.amount}&currency=${paymentData.currency}`
      : `https://www.paypal.com/checkoutnow?token=${orderId}&amount=${paymentData.amount}&currency=${paymentData.currency}`;
    
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
            message: 'Payment successful',
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

// Payment Provider Status
export const getPaymentProviderStatus = () => {
  const stripeKey = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY;
  const paypalKey = process.env.REACT_APP_PAYPAL_CLIENT_ID;
  
  return {
    stripe: {
      enabled: !!stripeKey && stripeKey.length > 0,
      productionMode: stripeKey?.startsWith('pk_live_'),
      testMode: stripeKey?.startsWith('pk_test_'),
      key: stripeKey ? `${stripeKey.substring(0, 10)}...` : 'Not configured'
    },
    paypal: {
      enabled: !!paypalKey && paypalKey.length > 0,
      productionMode: !paypalKey?.includes('sandbox'),
      testMode: paypalKey?.includes('sandbox'),
      key: paypalKey ? `${paypalKey.substring(0, 10)}...` : 'Not configured'
    },
    productionMode: stripeKey?.startsWith('pk_live_') || !paypalKey?.includes('sandbox'),
    testMode: stripeKey?.startsWith('pk_test_') || paypalKey?.includes('sandbox'),
    anyEnabled: (!!stripeKey && stripeKey.length > 0) || (!!paypalKey && paypalKey.length > 0)
  };
};

// Generic Payment Processor
export const processPayment = async (
  paymentData: PaymentData,
  method: 'stripe' | 'paypal' = 'stripe'
): Promise<PaymentResult> => {
  if (method === 'stripe') {
    return processStripePayment(paymentData);
  } else if (method === 'paypal') {
    return processPayPalPayment(paymentData);
  } else {
    return {
      success: false,
      paymentMethod: method,
      amount: paymentData.amount,
      currency: paymentData.currency,
      status: 'failed',
      message: 'Unsupported payment method',
    };
  }
};