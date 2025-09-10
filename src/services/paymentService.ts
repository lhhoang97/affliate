// Payment Service for E-commerce Mode
// This service handles payment processing when in e-commerce mode

export interface PaymentMethod {
  id: string;
  name: string;
  type: 'card' | 'paypal' | 'bank_transfer' | 'crypto';
  icon: string;
  enabled: boolean;
}

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

// Available payment methods
export const paymentMethods: PaymentMethod[] = [
  {
    id: 'stripe',
    name: 'Credit/Debit Card',
    type: 'card',
    icon: '💳',
    enabled: true
  },
  {
    id: 'paypal',
    name: 'PayPal',
    type: 'paypal',
    icon: '🅿️',
    enabled: true
  },
  {
    id: 'bank_transfer',
    name: 'Bank Transfer',
    type: 'bank_transfer',
    icon: '🏦',
    enabled: false // Disabled for now
  },
  {
    id: 'crypto',
    name: 'Cryptocurrency',
    type: 'crypto',
    icon: '₿',
    enabled: false // Disabled for now
  }
];

// Simulate payment processing
export const processPayment = async (
  paymentData: PaymentData,
  paymentMethodId: string
): Promise<PaymentResult> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Simulate payment processing based on method
  switch (paymentMethodId) {
    case 'stripe':
      return simulateStripePayment(paymentData);
    case 'paypal':
      return simulatePayPalPayment(paymentData);
    case 'bank_transfer':
      return simulateBankTransfer(paymentData);
    case 'crypto':
      return simulateCryptoPayment(paymentData);
    default:
      throw new Error('Unsupported payment method');
  }
};

// Simulate Stripe payment
const simulateStripePayment = async (paymentData: PaymentData): Promise<PaymentResult> => {
  // Simulate 95% success rate
  const success = Math.random() > 0.05;
  
  if (success) {
    return {
      success: true,
      transactionId: `stripe_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      paymentMethod: 'stripe',
      amount: paymentData.amount,
      currency: paymentData.currency,
      status: 'completed',
      message: 'Payment processed successfully'
    };
  } else {
    return {
      success: false,
      paymentMethod: 'stripe',
      amount: paymentData.amount,
      currency: paymentData.currency,
      status: 'failed',
      message: 'Payment failed. Please try again or use a different payment method.'
    };
  }
};

// Simulate PayPal payment
const simulatePayPalPayment = async (paymentData: PaymentData): Promise<PaymentResult> => {
  // Simulate PayPal redirect
  return {
    success: true,
    transactionId: `paypal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    paymentMethod: 'paypal',
    amount: paymentData.amount,
    currency: paymentData.currency,
    status: 'pending',
    message: 'Redirecting to PayPal...',
    redirectUrl: `https://paypal.com/checkout?amount=${paymentData.amount}&currency=${paymentData.currency}`
  };
};

// Simulate Bank Transfer
const simulateBankTransfer = async (paymentData: PaymentData): Promise<PaymentResult> => {
  return {
    success: true,
    transactionId: `bank_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    paymentMethod: 'bank_transfer',
    amount: paymentData.amount,
    currency: paymentData.currency,
    status: 'pending',
    message: 'Bank transfer initiated. Payment will be processed within 1-3 business days.'
  };
};

// Simulate Crypto payment
const simulateCryptoPayment = async (paymentData: PaymentData): Promise<PaymentResult> => {
  return {
    success: true,
    transactionId: `crypto_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    paymentMethod: 'crypto',
    amount: paymentData.amount,
    currency: paymentData.currency,
    status: 'pending',
    message: 'Cryptocurrency payment initiated. Confirmation pending.'
  };
};

// Get payment method by ID
export const getPaymentMethod = (id: string): PaymentMethod | undefined => {
  return paymentMethods.find(method => method.id === id);
};

// Get enabled payment methods
export const getEnabledPaymentMethods = (): PaymentMethod[] => {
  return paymentMethods.filter(method => method.enabled);
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
