import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Switch,
  FormControlLabel,
  Alert,
  Grid,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack
} from '@mui/material';
import {
  AttachMoney,
  CreditCard,
  AccountBalance,
  Settings,
  Info,
  CheckCircle,
  Warning,
  TrendingUp,
  Security,
  Speed
} from '@mui/icons-material';
import { useBusinessMode } from '../contexts/BusinessModeContext';

const AdminBusinessModePage: React.FC = () => {
  const { mode, setMode, isAffiliateMode, isEcommerceMode, isHybridMode } = useBusinessMode();
  const [showPreview, setShowPreview] = useState(false);

  const handleModeChange = (newMode: 'affiliate' | 'ecommerce' | 'hybrid') => {
    setMode(newMode);
  };

  const modeConfigs = [
    {
      id: 'affiliate' as const,
      title: 'Affiliate Mode',
      description: 'Redirect customers to retailer websites',
      icon: <AttachMoney />,
      color: 'success' as const,
      features: [
        'No payment processing needed',
        'Commission-based revenue',
        'Lower operational costs',
        'Faster setup and deployment',
        'No inventory management',
        'Automatic order fulfillment'
      ],
      pros: [
        'Zero inventory risk',
        'No payment processing fees',
        'Automatic order fulfillment',
        'Lower maintenance costs'
      ],
      cons: [
        'Lower profit margins',
        'Less control over customer experience',
        'Dependent on retailer policies',
        'Limited customer data collection'
      ]
    },
    {
      id: 'ecommerce' as const,
      title: 'E-commerce Mode',
      description: 'Direct sales with your own payment system',
      icon: <CreditCard />,
      color: 'primary' as const,
      features: [
        'Full payment processing control',
        'Higher profit margins',
        'Complete customer data ownership',
        'Custom checkout experience',
        'Inventory management',
        'Direct customer relationships'
      ],
      pros: [
        'Higher profit margins',
        'Full control over customer experience',
        'Complete customer data ownership',
        'Brand building opportunities'
      ],
      cons: [
        'Higher operational costs',
        'Payment processing fees',
        'Inventory management required',
        'More complex setup'
      ]
    },
    {
      id: 'hybrid' as const,
      title: 'Hybrid Mode',
      description: 'Best of both worlds - let customers choose',
      icon: <AccountBalance />,
      color: 'warning' as const,
      features: [
        'Customer choice flexibility',
        'Optimized revenue streams',
        'Risk diversification',
        'Market testing capabilities',
        'Gradual transition support',
        'A/B testing opportunities'
      ],
      pros: [
        'Maximum flexibility',
        'Risk diversification',
        'Customer preference learning',
        'Gradual business model transition'
      ],
      cons: [
        'More complex implementation',
        'Higher development costs',
        'Potential customer confusion',
        'More maintenance required'
      ]
    }
  ];

  const currentConfig = modeConfigs.find(config => config.id === mode);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Business Mode Settings
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Configure your website's business model and checkout behavior
      </Typography>

      {/* Current Mode Status */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Settings sx={{ mr: 2, color: 'primary.main' }} />
            <Typography variant="h6">Current Mode</Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Chip
              icon={currentConfig?.icon}
              label={currentConfig?.title}
              color={currentConfig?.color}
              size="medium"
              sx={{ fontSize: '1rem', height: 40 }}
            />
            <Typography variant="body2" color="text.secondary">
              {currentConfig?.description}
            </Typography>
          </Box>

          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>Impact:</strong> This setting affects how customers checkout and purchase products on your website.
              Changes take effect immediately.
            </Typography>
          </Alert>
        </CardContent>
      </Card>

      {/* Mode Selection */}
      <Grid container spacing={3}>
        {modeConfigs.map((config) => (
          <Grid item xs={12} md={4} key={config.id}>
            <Card 
              sx={{ 
                height: '100%',
                border: mode === config.id ? `2px solid ${config.color === 'success' ? '#4caf50' : config.color === 'primary' ? '#1976d2' : '#ff9800'}` : '1px solid #e0e0e0',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }}
              onClick={() => handleModeChange(config.id)}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ 
                    p: 1, 
                    borderRadius: 1, 
                    backgroundColor: `${config.color}.light`,
                    color: `${config.color}.contrastText`,
                    mr: 2
                  }}>
                    {config.icon}
                  </Box>
                  <Box>
                    <Typography variant="h6">{config.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {config.description}
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle2" gutterBottom>
                  Key Features:
                </Typography>
                <List dense>
                  {config.features.slice(0, 3).map((feature, index) => (
                    <ListItem key={index} sx={{ py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckCircle sx={{ fontSize: 16, color: 'success.main' }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary={feature}
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                  ))}
                </List>

                <Button
                  variant={mode === config.id ? 'contained' : 'outlined'}
                  color={config.color}
                  fullWidth
                  sx={{ mt: 2 }}
                  onClick={() => handleModeChange(config.id)}
                >
                  {mode === config.id ? 'Current Mode' : 'Select Mode'}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Detailed Comparison */}
      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Detailed Comparison
          </Typography>
          
          <Grid container spacing={3}>
            {modeConfigs.map((config) => (
              <Grid item xs={12} md={4} key={config.id}>
                <Paper sx={{ p: 2, height: '100%' }}>
                  <Typography variant="h6" gutterBottom color={`${config.color}.main`}>
                    {config.title}
                  </Typography>
                  
                  <Typography variant="subtitle2" gutterBottom>
                    Advantages:
                  </Typography>
                  <List dense>
                    {config.pros.map((pro, index) => (
                      <ListItem key={index} sx={{ py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <TrendingUp sx={{ fontSize: 16, color: 'success.main' }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary={pro}
                          primaryTypographyProps={{ variant: 'body2' }}
                        />
                      </ListItem>
                    ))}
                  </List>

                  <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                    Considerations:
                  </Typography>
                  <List dense>
                    {config.cons.map((con, index) => (
                      <ListItem key={index} sx={{ py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <Warning sx={{ fontSize: 16, color: 'warning.main' }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary={con}
                          primaryTypographyProps={{ variant: 'body2' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Implementation Notes */}
      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Implementation Notes
          </Typography>
          
          <Stack spacing={2}>
            <Alert severity="info">
              <Typography variant="body2">
                <strong>Affiliate Mode:</strong> Customers will be redirected to retailer websites 
                (Amazon, eBay, etc.) to complete their purchases. No payment processing required.
              </Typography>
            </Alert>
            
            <Alert severity="success">
              <Typography variant="body2">
                <strong>E-commerce Mode:</strong> Customers can purchase directly on your website 
                using integrated payment gateways (Stripe, PayPal, etc.).
              </Typography>
            </Alert>
            
            <Alert severity="warning">
              <Typography variant="body2">
                <strong>Hybrid Mode:</strong> Customers can choose between affiliate redirect or 
                direct checkout based on their preference and product availability.
              </Typography>
            </Alert>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AdminBusinessModePage;
