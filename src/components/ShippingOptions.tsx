import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Chip,
  Divider,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  LocalShipping,
  Speed,
  Security,
  CheckCircle,
  Warning
} from '@mui/icons-material';

export interface ShippingOption {
  id: string;
  name: string;
  description: string;
  estimatedDays: string;
  cost: number;
  freeThreshold?: number;
  icon: React.ReactNode;
  features: string[];
  popular?: boolean;
  available: boolean;
}

interface ShippingOptionsProps {
  subtotal: number;
  selectedShipping: string | null;
  onShippingChange: (shippingId: string) => void;
  currency?: string;
}

const ShippingOptions: React.FC<ShippingOptionsProps> = ({
  subtotal,
  selectedShipping,
  onShippingChange,
  currency = 'USD'
}) => {
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to get shipping options
    const fetchShippingOptions = async () => {
      setLoading(true);
      
      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const options: ShippingOption[] = [
        {
          id: 'standard',
          name: 'Standard Shipping',
          description: 'Regular shipping with tracking',
          estimatedDays: '5-7 business days',
          cost: 9.99,
          freeThreshold: 75,
          icon: <LocalShipping />,
          features: ['Package tracking', 'Insurance included', 'Delivery confirmation'],
          available: true
        },
        {
          id: 'expedited',
          name: 'Expedited Shipping',
          description: 'Faster delivery with priority handling',
          estimatedDays: '2-3 business days',
          cost: 19.99,
          freeThreshold: 100,
          icon: <Speed />,
          features: ['Priority processing', 'Package tracking', 'Insurance included', 'Delivery confirmation'],
          popular: true,
          available: true
        },
        {
          id: 'express',
          name: 'Express Shipping',
          description: 'Next-day delivery for urgent orders',
          estimatedDays: '1-2 business days',
          cost: 29.99,
          freeThreshold: 150,
          icon: <CheckCircle />,
          features: ['Next-day delivery', 'Priority processing', 'Package tracking', 'Insurance included', 'Delivery confirmation', 'Signature required'],
          available: true
        },
        {
          id: 'overnight',
          name: 'Overnight Shipping',
          description: 'Guaranteed next-day delivery',
          estimatedDays: '1 business day',
          cost: 49.99,
          icon: <Security />,
          features: ['Guaranteed next-day delivery', 'Priority processing', 'Package tracking', 'Insurance included', 'Delivery confirmation', 'Signature required', 'Money-back guarantee'],
          available: true
        },
        {
          id: 'international',
          name: 'International Shipping',
          description: 'Worldwide delivery with customs handling',
          estimatedDays: '7-14 business days',
          cost: 39.99,
          icon: <LocalShipping />,
          features: ['Worldwide delivery', 'Customs handling', 'Package tracking', 'Insurance included', 'Delivery confirmation'],
          available: false // Disabled for demo
        }
      ];

      setShippingOptions(options);
      setLoading(false);
    };

    fetchShippingOptions();
  }, []);

  const calculateShippingCost = (option: ShippingOption): number => {
    // Check if order qualifies for free shipping
    if (option.freeThreshold && subtotal >= option.freeThreshold) {
      return 0;
    }
    return option.cost;
  };

  const getShippingBadge = (option: ShippingOption) => {
    if (!option.available) {
      return <Chip label="Unavailable" color="error" size="small" />;
    }
    
    if (option.popular) {
      return <Chip label="Popular" color="primary" size="small" />;
    }
    
    if (calculateShippingCost(option) === 0) {
      return <Chip label="Free" color="success" size="small" />;
    }
    
    return null;
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  if (loading) {
    return (
      <Card>
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <CircularProgress size={40} sx={{ mb: 2 }} />
          <Typography variant="body2" color="text.secondary">
            Loading shipping options...
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <LocalShipping color="primary" />
          Shipping Options
        </Typography>

        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>Free shipping</strong> on orders over $75. International shipping available for select countries.
          </Typography>
        </Alert>

        <RadioGroup
          value={selectedShipping || ''}
          onChange={(e) => onShippingChange(e.target.value)}
        >
          {shippingOptions.map((option) => {
            const shippingCost = calculateShippingCost(option);
            const isFree = shippingCost === 0;
            
            return (
              <Box key={option.id} sx={{ mb: 2 }}>
                <FormControlLabel
                  value={option.id}
                  control={<Radio />}
                  disabled={!option.available}
                  label={
                    <Box sx={{ width: '100%' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {option.icon}
                          <Typography variant="subtitle1" fontWeight="medium">
                            {option.name}
                          </Typography>
                          {getShippingBadge(option)}
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="h6" color={isFree ? 'success.main' : 'primary.main'}>
                            {isFree ? 'FREE' : formatCurrency(shippingCost)}
                          </Typography>
                          {option.freeThreshold && !isFree && (
                            <Typography variant="caption" color="text.secondary">
                              Free over {formatCurrency(option.freeThreshold)}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {option.description} • {option.estimatedDays}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {option.features.map((feature, index) => (
                          <Chip
                            key={index}
                            label={feature}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: '0.75rem', height: 20 }}
                          />
                        ))}
                      </Box>
                    </Box>
                  }
                  sx={{
                    width: '100%',
                    alignItems: 'flex-start',
                    '& .MuiFormControlLabel-label': { width: '100%' },
                    opacity: option.available ? 1 : 0.6
                  }}
                />
                
                {option.id !== shippingOptions[shippingOptions.length - 1].id && (
                  <Divider sx={{ mt: 2 }} />
                )}
              </Box>
            );
          })}
        </RadioGroup>

        {subtotal > 0 && (
          <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary">
              <strong>Order Subtotal:</strong> {formatCurrency(subtotal)}
            </Typography>
            {selectedShipping && (
              <Typography variant="body2" color="text.secondary">
                <strong>Shipping:</strong> {
                  shippingOptions.find(opt => opt.id === selectedShipping)?.freeThreshold && 
                  subtotal >= (shippingOptions.find(opt => opt.id === selectedShipping)?.freeThreshold || 0)
                    ? 'FREE' 
                    : formatCurrency(shippingOptions.find(opt => opt.id === selectedShipping)?.cost || 0)
                }
              </Typography>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ShippingOptions;
