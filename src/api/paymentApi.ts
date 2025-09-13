// Mock API endpoints for payment processing
// In production, these would be real backend endpoints

export const createPaymentIntent = async (data: any) => {
  // Mock Stripe payment intent creation
  return {
    clientSecret: `pi_test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    id: `pi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  };
};

export const createPayPalOrder = async (data: any) => {
  // Mock PayPal order creation
  return {
    orderId: `paypal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  };
};

// Mock API calls
export const mockApiCall = async (endpoint: string, data: any) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  if (endpoint === '/api/create-payment-intent') {
    return createPaymentIntent(data);
  } else if (endpoint === '/api/create-paypal-order') {
    return createPayPalOrder(data);
  }
  
  throw new Error('Unknown endpoint');
};
