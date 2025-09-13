// Backend API Example for Real Payment Processing
// This is an example of what you need to implement on your backend

const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Stripe Payment Intent Creation
app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency, customer, billing } = req.body;
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // Amount in cents
      currency: currency,
      customer: customer.email,
      metadata: {
        customer_name: customer.name,
        customer_email: customer.email,
      },
      shipping: billing ? {
        name: customer.name,
        address: {
          line1: billing.address,
          city: billing.city,
          state: billing.state,
          postal_code: billing.zipCode,
          country: billing.country,
        },
      } : undefined,
    });

    res.json({ 
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id 
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: error.message });
  }
});

// PayPal Order Creation
app.post('/api/create-paypal-order', async (req, res) => {
  try {
    const { amount, currency, customer } = req.body;
    
    // PayPal SDK integration would go here
    // For now, return a mock order ID
    const orderId = `paypal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    res.json({ 
      orderId: orderId,
      status: 'CREATED'
    });
  } catch (error) {
    console.error('Error creating PayPal order:', error);
    res.status(500).json({ error: error.message });
  }
});

// Payment Verification
app.post('/api/verify-payment', async (req, res) => {
  try {
    const { paymentId, orderId, paymentMethod } = req.body;
    
    let verificationResult;
    
    if (paymentMethod === 'stripe') {
      // Verify Stripe payment
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentId);
      verificationResult = {
        success: paymentIntent.status === 'succeeded',
        status: paymentIntent.status,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
      };
    } else if (paymentMethod === 'paypal') {
      // Verify PayPal payment
      // PayPal SDK verification would go here
      verificationResult = {
        success: true,
        status: 'COMPLETED',
        orderId: orderId,
      };
    }
    
    res.json(verificationResult);
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ error: error.message });
  }
});

// Webhook for Stripe events
app.post('/api/stripe-webhook', express.raw({type: 'application/json'}), (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.log(`Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('Payment succeeded:', paymentIntent.id);
      // Update your database, send confirmation email, etc.
      break;
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      console.log('Payment failed:', failedPayment.id);
      // Handle failed payment
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({received: true});
});

// PayPal Webhook
app.post('/api/paypal-webhook', (req, res) => {
  // PayPal webhook handling would go here
  console.log('PayPal webhook received:', req.body);
  res.json({received: true});
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Payment API server running on port ${PORT}`);
});

// Package.json dependencies needed:
/*
{
  "dependencies": {
    "express": "^4.18.2",
    "stripe": "^12.0.0",
    "cors": "^2.8.5",
    "dotenv": "^16.0.0"
  }
}
*/
