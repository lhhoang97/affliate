# 💳 Production Payment Setup Guide

## 🎯 **Setup Real Mastercard & PayPal Payments**

### **1. Environment Variables (.env file)**

Tạo file `.env` trong root directory:

```env
# Production Payment Keys
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_live_key_here
REACT_APP_PAYPAL_CLIENT_ID=your_paypal_live_client_id_here

# Supabase (existing)
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key

# Development (comment out in production)
# REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_test_key
# REACT_APP_PAYPAL_CLIENT_ID=your_paypal_test_client_id
```

### **2. Stripe Setup (Mastercard/Visa/Amex)**

#### **Get Stripe Live Keys:**
1. **Sign up:** [stripe.com](https://stripe.com)
2. **Complete verification:** Business details, bank account
3. **Activate account:** Pass verification process
4. **Get keys:** Dashboard → Developers → API Keys
5. **Copy:** Publishable key (starts with `pk_live_`)

#### **Stripe Pricing:**
- **2.9% + 30¢** per transaction
- **No monthly fees**
- **International support**
- **Supports:** Visa, Mastercard, Amex, Discover

### **3. PayPal Setup**

#### **Get PayPal Live Keys:**
1. **Sign up:** [developer.paypal.com](https://developer.paypal.com)
2. **Create app:** Get Client ID and Secret
3. **Switch to live:** From sandbox to live mode
4. **Verify business:** Complete PayPal verification

#### **PayPal Pricing:**
- **2.9% + 30¢** per transaction
- **No monthly fees**
- **Global acceptance**

### **4. Backend API Implementation**

Cần tạo backend API endpoints:

#### **Required Endpoints:**

```javascript
// Stripe Payment Intent
POST /api/create-payment-intent
{
  "amount": 2000, // cents
  "currency": "usd",
  "customer": {
    "email": "user@example.com",
    "name": "John Doe"
  }
}

// PayPal Order Creation
POST /api/create-paypal-order
{
  "amount": 20.00,
  "currency": "USD",
  "customer": {
    "email": "user@example.com",
    "name": "John Doe"
  }
}

// Payment Verification
POST /api/verify-payment
{
  "paymentId": "stripe_payment_id",
  "orderId": "order_123"
}
```

### **5. Update Payment Components**

#### **Enable Real Payment Processing:**

```typescript
// In StripePaymentForm.tsx
const handleSubmit = async (event: React.FormEvent) => {
  // Replace simulation with real Stripe API call
  const stripe = await stripePromise;
  const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
    payment_method: {
      card: elements.getElement(CardElement)!,
      billing_details: {
        name: customerInfo.name,
        email: customerInfo.email,
      },
    },
  });
  
  if (paymentIntent.status === 'succeeded') {
    onPaymentSuccess(paymentIntent);
  }
};
```

### **6. Security & Compliance**

#### **Required Security:**
- ✅ **HTTPS** - SSL certificate required
- ✅ **PCI Compliance** - Stripe handles this
- ✅ **Data Encryption** - All payment data encrypted
- ✅ **Fraud Protection** - Built into payment providers

#### **Legal Requirements:**
- ✅ **Business License** - Required for payment processing
- ✅ **Terms of Service** - Payment terms
- ✅ **Privacy Policy** - Data handling
- ✅ **Refund Policy** - Return/refund terms

### **7. Testing & Deployment**

#### **Test Flow:**
1. **Setup test keys** first
2. **Test with real cards** (small amounts)
3. **Verify webhook handling**
4. **Test error scenarios**
5. **Switch to live keys**

#### **Deployment Steps:**
1. **Update environment variables**
2. **Deploy backend API**
3. **Configure webhooks**
4. **Test live payments**
5. **Monitor transactions**

### **8. Cost Breakdown**

#### **Monthly Costs:**
- **Stripe:** No monthly fee
- **PayPal:** No monthly fee
- **Server:** $5-20/month
- **SSL Certificate:** $0-50/year

#### **Transaction Costs:**
- **2.9% + 30¢** per transaction
- **Example:** $100 sale = $3.20 fee
- **Net profit:** $96.80

### **9. Quick Start Checklist**

#### **Immediate Steps:**
- [ ] Get Stripe account and live keys
- [ ] Get PayPal developer account and live keys
- [ ] Update .env file with live keys
- [ ] Create backend API endpoints
- [ ] Test with real cards (small amounts)
- [ ] Deploy to production

#### **Production Ready:**
- [ ] SSL certificate installed
- [ ] Business verification complete
- [ ] Terms of service published
- [ ] Privacy policy published
- [ ] Refund policy published
- [ ] Customer support setup

### **10. Support & Resources**

#### **Documentation:**
- **Stripe Docs:** [stripe.com/docs](https://stripe.com/docs)
- **PayPal Docs:** [developer.paypal.com/docs](https://developer.paypal.com/docs)
- **React Integration:** [stripe.com/docs/stripe-js/react](https://stripe.com/docs/stripe-js/react)

#### **Support:**
- **Stripe Support:** [support.stripe.com](https://support.stripe.com)
- **PayPal Support:** [developer.paypal.com/support](https://developer.paypal.com/support)

---

## 🚀 **Next Steps**

1. **Get production keys** from Stripe and PayPal
2. **Update .env file** with live keys
3. **Implement backend API** for payment processing
4. **Test with real cards** (start with small amounts)
5. **Deploy to production**

**💡 Tip:** Start with test mode, then gradually move to live payments with small transaction amounts to verify everything works correctly.
