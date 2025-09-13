import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Grid,
  Divider,
  Alert,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Person,
  Email,
  Phone,
  LocationOn,
  CreditCard,
  Security,
  Info,
  Edit,
  Save,
  Cancel
} from '@mui/icons-material';

export interface Address {
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
}

export interface PaymentInfo {
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  cardholderName: string;
  billingSameAsShipping: boolean;
}

interface CheckoutFormsProps {
  shippingAddress: Address;
  setShippingAddress: (address: Address) => void;
  billingAddress: Address;
  setBillingAddress: (address: Address) => void;
  paymentInfo: PaymentInfo;
  setPaymentInfo: (info: PaymentInfo) => void;
  onNext: () => void;
  onBack: () => void;
  isProcessing?: boolean;
}

const CheckoutForms: React.FC<CheckoutFormsProps> = ({
  shippingAddress,
  setShippingAddress,
  billingAddress,
  setBillingAddress,
  paymentInfo,
  setPaymentInfo,
  onNext,
  onBack,
  isProcessing = false
}) => {
  const [activeSection, setActiveSection] = useState<'shipping' | 'billing' | 'payment'>('shipping');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [editingAddress, setEditingAddress] = useState<'shipping' | 'billing' | null>(null);

  const countries = [
    { code: 'US', name: 'United States' },
    { code: 'CA', name: 'Canada' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'AU', name: 'Australia' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' },
    { code: 'JP', name: 'Japan' },
    { code: 'SG', name: 'Singapore' },
    { code: 'VN', name: 'Vietnam' }
  ];

  const months = [
    '01', '02', '03', '04', '05', '06',
    '07', '08', '09', '10', '11', '12'
  ];

  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate shipping address
    if (!shippingAddress.firstName.trim()) newErrors.shippingFirstName = 'First name is required';
    if (!shippingAddress.lastName.trim()) newErrors.shippingLastName = 'Last name is required';
    if (!shippingAddress.address1.trim()) newErrors.shippingAddress1 = 'Address is required';
    if (!shippingAddress.city.trim()) newErrors.shippingCity = 'City is required';
    if (!shippingAddress.state.trim()) newErrors.shippingState = 'State is required';
    if (!shippingAddress.zipCode.trim()) newErrors.shippingZipCode = 'ZIP code is required';
    if (!shippingAddress.country) newErrors.shippingCountry = 'Country is required';

    // Validate billing address if not same as shipping
    if (!paymentInfo.billingSameAsShipping) {
      if (!billingAddress.firstName.trim()) newErrors.billingFirstName = 'First name is required';
      if (!billingAddress.lastName.trim()) newErrors.billingLastName = 'Last name is required';
      if (!billingAddress.address1.trim()) newErrors.billingAddress1 = 'Address is required';
      if (!billingAddress.city.trim()) newErrors.billingCity = 'City is required';
      if (!billingAddress.state.trim()) newErrors.billingState = 'State is required';
      if (!billingAddress.zipCode.trim()) newErrors.billingZipCode = 'ZIP code is required';
      if (!billingAddress.country) newErrors.billingCountry = 'Country is required';
    }

    // Validate payment info
    if (!paymentInfo.cardNumber.trim()) newErrors.cardNumber = 'Card number is required';
    if (!paymentInfo.expiryMonth) newErrors.expiryMonth = 'Expiry month is required';
    if (!paymentInfo.expiryYear) newErrors.expiryYear = 'Expiry year is required';
    if (!paymentInfo.cvv.trim()) newErrors.cvv = 'CVV is required';
    if (!paymentInfo.cardholderName.trim()) newErrors.cardholderName = 'Cardholder name is required';

    // Validate card number format (basic Luhn algorithm)
    if (paymentInfo.cardNumber.trim()) {
      const cardNumber = paymentInfo.cardNumber.replace(/\s/g, '');
      if (!/^\d{13,19}$/.test(cardNumber)) {
        newErrors.cardNumber = 'Invalid card number';
      }
    }

    // Validate CVV
    if (paymentInfo.cvv.trim() && !/^\d{3,4}$/.test(paymentInfo.cvv)) {
      newErrors.cvv = 'Invalid CVV';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext();
    }
  };

  const handleBillingSameAsShippingChange = (checked: boolean) => {
    setPaymentInfo({
      ...paymentInfo,
      billingSameAsShipping: checked
    });

    if (checked) {
      setBillingAddress(shippingAddress);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const renderShippingForm = () => (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocationOn color="primary" />
            Shipping Address
          </Typography>
          {editingAddress === 'shipping' ? (
            <Box>
              <IconButton onClick={() => setEditingAddress(null)} size="small">
                <Save />
              </IconButton>
              <IconButton onClick={() => setEditingAddress(null)} size="small">
                <Cancel />
              </IconButton>
            </Box>
          ) : (
            <IconButton onClick={() => setEditingAddress('shipping')} size="small">
              <Edit />
            </IconButton>
          )}
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="First Name"
              value={shippingAddress.firstName}
              onChange={(e) => setShippingAddress({ ...shippingAddress, firstName: e.target.value })}
              error={!!errors.shippingFirstName}
              helperText={errors.shippingFirstName}
              disabled={editingAddress !== 'shipping'}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Last Name"
              value={shippingAddress.lastName}
              onChange={(e) => setShippingAddress({ ...shippingAddress, lastName: e.target.value })}
              error={!!errors.shippingLastName}
              helperText={errors.shippingLastName}
              disabled={editingAddress !== 'shipping'}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Company (Optional)"
              value={shippingAddress.company || ''}
              onChange={(e) => setShippingAddress({ ...shippingAddress, company: e.target.value })}
              disabled={editingAddress !== 'shipping'}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address Line 1"
              value={shippingAddress.address1}
              onChange={(e) => setShippingAddress({ ...shippingAddress, address1: e.target.value })}
              error={!!errors.shippingAddress1}
              helperText={errors.shippingAddress1}
              disabled={editingAddress !== 'shipping'}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address Line 2 (Optional)"
              value={shippingAddress.address2 || ''}
              onChange={(e) => setShippingAddress({ ...shippingAddress, address2: e.target.value })}
              disabled={editingAddress !== 'shipping'}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="City"
              value={shippingAddress.city}
              onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
              error={!!errors.shippingCity}
              helperText={errors.shippingCity}
              disabled={editingAddress !== 'shipping'}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="State/Province"
              value={shippingAddress.state}
              onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
              error={!!errors.shippingState}
              helperText={errors.shippingState}
              disabled={editingAddress !== 'shipping'}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="ZIP/Postal Code"
              value={shippingAddress.zipCode}
              onChange={(e) => setShippingAddress({ ...shippingAddress, zipCode: e.target.value })}
              error={!!errors.shippingZipCode}
              helperText={errors.shippingZipCode}
              disabled={editingAddress !== 'shipping'}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!errors.shippingCountry}>
              <InputLabel>Country</InputLabel>
              <Select
                value={shippingAddress.country}
                onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                disabled={editingAddress !== 'shipping'}
              >
                {countries.map((country) => (
                  <MenuItem key={country.code} value={country.code}>
                    {country.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.shippingCountry && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                  {errors.shippingCountry}
                </Typography>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Phone Number (Optional)"
              value={shippingAddress.phone || ''}
              onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
              disabled={editingAddress !== 'shipping'}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  const renderBillingForm = () => (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Person color="primary" />
            Billing Address
          </Typography>
          {editingAddress === 'billing' ? (
            <Box>
              <IconButton onClick={() => setEditingAddress(null)} size="small">
                <Save />
              </IconButton>
              <IconButton onClick={() => setEditingAddress(null)} size="small">
                <Cancel />
              </IconButton>
            </Box>
          ) : (
            <IconButton onClick={() => setEditingAddress('billing')} size="small">
              <Edit />
            </IconButton>
          )}
        </Box>

        <FormControlLabel
          control={
            <Checkbox
              checked={paymentInfo.billingSameAsShipping}
              onChange={(e) => handleBillingSameAsShippingChange(e.target.checked)}
            />
          }
          label="Billing address same as shipping address"
          sx={{ mb: 2 }}
        />

        {!paymentInfo.billingSameAsShipping && (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                value={billingAddress.firstName}
                onChange={(e) => setBillingAddress({ ...billingAddress, firstName: e.target.value })}
                error={!!errors.billingFirstName}
                helperText={errors.billingFirstName}
                disabled={editingAddress !== 'billing'}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                value={billingAddress.lastName}
                onChange={(e) => setBillingAddress({ ...billingAddress, lastName: e.target.value })}
                error={!!errors.billingLastName}
                helperText={errors.billingLastName}
                disabled={editingAddress !== 'billing'}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address Line 1"
                value={billingAddress.address1}
                onChange={(e) => setBillingAddress({ ...billingAddress, address1: e.target.value })}
                error={!!errors.billingAddress1}
                helperText={errors.billingAddress1}
                disabled={editingAddress !== 'billing'}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="City"
                value={billingAddress.city}
                onChange={(e) => setBillingAddress({ ...billingAddress, city: e.target.value })}
                error={!!errors.billingCity}
                helperText={errors.billingCity}
                disabled={editingAddress !== 'billing'}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="State/Province"
                value={billingAddress.state}
                onChange={(e) => setBillingAddress({ ...billingAddress, state: e.target.value })}
                error={!!errors.billingState}
                helperText={errors.billingState}
                disabled={editingAddress !== 'billing'}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="ZIP/Postal Code"
                value={billingAddress.zipCode}
                onChange={(e) => setBillingAddress({ ...billingAddress, zipCode: e.target.value })}
                error={!!errors.billingZipCode}
                helperText={errors.billingZipCode}
                disabled={editingAddress !== 'billing'}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.billingCountry}>
                <InputLabel>Country</InputLabel>
                <Select
                  value={billingAddress.country}
                  onChange={(e) => setBillingAddress({ ...billingAddress, country: e.target.value })}
                  disabled={editingAddress !== 'billing'}
                >
                  {countries.map((country) => (
                    <MenuItem key={country.code} value={country.code}>
                      {country.name}
                    </MenuItem>
                  ))}
                </Select>
                {errors.billingCountry && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                    {errors.billingCountry}
                  </Typography>
                )}
              </FormControl>
            </Grid>
          </Grid>
        )}
      </CardContent>
    </Card>
  );

  const renderPaymentForm = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <CreditCard color="primary" />
          Payment Information
        </Typography>

        <Alert severity="info" sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Security />
            <Typography variant="body2">
              Your payment information is encrypted and secure. We use industry-standard SSL encryption.
            </Typography>
          </Box>
        </Alert>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Card Number"
              value={paymentInfo.cardNumber}
              onChange={(e) => {
                const formatted = formatCardNumber(e.target.value);
                setPaymentInfo({ ...paymentInfo, cardNumber: formatted });
              }}
              error={!!errors.cardNumber}
              helperText={errors.cardNumber}
              placeholder="1234 5678 9012 3456"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Cardholder Name"
              value={paymentInfo.cardholderName}
              onChange={(e) => setPaymentInfo({ ...paymentInfo, cardholderName: e.target.value })}
              error={!!errors.cardholderName}
              helperText={errors.cardholderName}
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth error={!!errors.expiryMonth}>
              <InputLabel>Month</InputLabel>
              <Select
                value={paymentInfo.expiryMonth}
                onChange={(e) => setPaymentInfo({ ...paymentInfo, expiryMonth: e.target.value })}
              >
                {months.map((month) => (
                  <MenuItem key={month} value={month}>
                    {month}
                  </MenuItem>
                ))}
              </Select>
              {errors.expiryMonth && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                  {errors.expiryMonth}
                </Typography>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth error={!!errors.expiryYear}>
              <InputLabel>Year</InputLabel>
              <Select
                value={paymentInfo.expiryYear}
                onChange={(e) => setPaymentInfo({ ...paymentInfo, expiryYear: e.target.value })}
              >
                {years.map((year) => (
                  <MenuItem key={year} value={year.toString()}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
              {errors.expiryYear && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                  {errors.expiryYear}
                </Typography>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="CVV"
              value={paymentInfo.cvv}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                setPaymentInfo({ ...paymentInfo, cvv: value });
              }}
              error={!!errors.cvv}
              helperText={errors.cvv}
              placeholder="123"
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      {/* Navigation Tabs */}
      <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
        <Button
          variant={activeSection === 'shipping' ? 'contained' : 'outlined'}
          onClick={() => setActiveSection('shipping')}
          startIcon={<LocationOn />}
        >
          Shipping
        </Button>
        <Button
          variant={activeSection === 'billing' ? 'contained' : 'outlined'}
          onClick={() => setActiveSection('billing')}
          startIcon={<Person />}
        >
          Billing
        </Button>
        <Button
          variant={activeSection === 'payment' ? 'contained' : 'outlined'}
          onClick={() => setActiveSection('payment')}
          startIcon={<CreditCard />}
        >
          Payment
        </Button>
      </Box>

      {/* Form Content */}
      {activeSection === 'shipping' && renderShippingForm()}
      {activeSection === 'billing' && renderBillingForm()}
      {activeSection === 'payment' && renderPaymentForm()}

      {/* Navigation Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button onClick={onBack} disabled={isProcessing}>
          Back
        </Button>
        <Button
          variant="contained"
          onClick={handleNext}
          disabled={isProcessing}
          sx={{ minWidth: 120 }}
        >
          {isProcessing ? 'Processing...' : 'Continue'}
        </Button>
      </Box>
    </Box>
  );
};

export default CheckoutForms;
