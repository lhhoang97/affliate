import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Grid,
  Chip,
  Divider,
  Avatar,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Stepper,
  Step,
  StepLabel,
  StepContent
} from '@mui/material';
import {
  ShoppingCart,
  LocalShipping,
  CheckCircle,
  Schedule,
  Receipt,
  Star,
  Refresh,
  Visibility
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`orders-tabpanel-${index}`}
      aria-labelledby={`orders-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const OrdersPage: React.FC = () => {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const mockOrders = [
    {
      id: 'ORD-001',
      date: '2024-01-15',
      status: 'Delivered',
      total: 299.99,
      items: [
        {
          id: '1',
          name: 'iPhone 15 Pro',
          price: 999.99,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=100'
        },
        {
          id: '2',
          name: 'AirPods Pro',
          price: 249.99,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=100'
        }
      ],
      trackingNumber: '1Z999AA1234567890',
      estimatedDelivery: '2024-01-18',
      actualDelivery: '2024-01-17',
      shippingAddress: '123 Main St, New York, NY 10001',
      paymentMethod: 'Visa ending in 1234'
    },
    {
      id: 'ORD-002',
      date: '2024-01-10',
      status: 'Shipped',
      total: 149.99,
      items: [
        {
          id: '3',
          name: 'Samsung Galaxy S24',
          price: 899.99,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=100'
        }
      ],
      trackingNumber: '1Z999AA1234567891',
      estimatedDelivery: '2024-01-15',
      actualDelivery: null,
      shippingAddress: '123 Main St, New York, NY 10001',
      paymentMethod: 'Mastercard ending in 5678'
    },
    {
      id: 'ORD-003',
      date: '2024-01-05',
      status: 'Processing',
      total: 89.99,
      items: [
        {
          id: '4',
          name: 'Sony WH-1000XM5',
          price: 349.99,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100'
        }
      ],
      trackingNumber: null,
      estimatedDelivery: '2024-01-12',
      actualDelivery: null,
      shippingAddress: '123 Main St, New York, NY 10001',
      paymentMethod: 'PayPal'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'success';
      case 'Shipped':
        return 'primary';
      case 'Processing':
        return 'warning';
      case 'Cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Delivered':
        return <CheckCircle />;
      case 'Shipped':
        return <LocalShipping />;
      case 'Processing':
        return <Schedule />;
      case 'Cancelled':
        return <Refresh />;
      default:
        return <ShoppingCart />;
    }
  };

  const getOrderSteps = (order: any) => {
    const steps = [
      { label: 'Order Placed', completed: true },
      { label: 'Processing', completed: order.status !== 'Cancelled' },
      { label: 'Shipped', completed: ['Shipped', 'Delivered'].includes(order.status) },
      { label: 'Delivered', completed: order.status === 'Delivered' }
    ];
    return steps;
  };

  return (
    <Box sx={{ backgroundColor: '#f3f3f3', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        py: 4
      }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Receipt sx={{ fontSize: 40 }} />
            <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold' }}>
              My Orders
            </Typography>
          </Box>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            Track your orders and view order history
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="orders tabs">
            <Tab label="All Orders" />
            <Tab label="Not Yet Shipped" />
            <Tab label="Cancelled Orders" />
          </Tabs>
        </Box>

        {/* Orders List */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 3 }}>
            {mockOrders.map((order) => (
              <Card key={order.id}>
                <CardContent>
                  {/* Order Header */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        Order #{order.id}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Placed on {new Date(order.date).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Chip
                        icon={getStatusIcon(order.status)}
                        label={order.status}
                        color={getStatusColor(order.status) as any}
                        sx={{ mb: 1 }}
                      />
                      <Typography variant="h6" sx={{ color: '#B12704', fontWeight: 'bold' }}>
                        ${order.total}
                      </Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {/* Order Items */}
                  <List>
                    {order.items.map((item) => (
                      <ListItem key={item.id} sx={{ px: 0 }}>
                        <ListItemAvatar>
                          <Avatar src={item.image} sx={{ width: 60, height: 60 }} />
                        </ListItemAvatar>
                        <ListItemText
                          primary={item.name}
                          secondary={`Qty: ${item.quantity} • $${item.price}`}
                        />
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<Star />}
                          >
                            Review
                          </Button>
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<Visibility />}
                          >
                            View
                          </Button>
                        </Box>
                      </ListItem>
                    ))}
                  </List>

                  <Divider sx={{ my: 2 }} />

                  {/* Order Details */}
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 2 }}>
                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        Shipping Address
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {order.shippingAddress}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        Payment Method
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {order.paymentMethod}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Order Progress */}
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Order Progress
                    </Typography>
                    <Stepper orientation="vertical">
                      {getOrderSteps(order).map((step, index) => (
                        <Step key={index} active={step.completed} completed={step.completed}>
                          <StepLabel>{step.label}</StepLabel>
                          <StepContent>
                            <Typography variant="body2" color="text.secondary">
                              {step.completed ? 'Completed' : 'Pending'}
                            </Typography>
                          </StepContent>
                        </Step>
                      ))}
                    </Stepper>
                  </Box>

                  {/* Action Buttons */}
                  <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                    {order.trackingNumber && (
                      <Button variant="outlined" startIcon={<LocalShipping />}>
                        Track Package
                      </Button>
                    )}
                    <Button variant="outlined" startIcon={<Receipt />}>
                      Download Invoice
                    </Button>
                    <Button variant="outlined">
                      Buy Again
                    </Button>
                    {order.status === 'Delivered' && (
                      <Button variant="contained" startIcon={<Star />}>
                        Write Review
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" gutterBottom>
            Orders Not Yet Shipped
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Orders that are being processed and prepared for shipping
          </Typography>
          {/* Filter orders for "Processing" status */}
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom>
            Cancelled Orders
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Orders that have been cancelled
          </Typography>
          {/* Filter orders for "Cancelled" status */}
        </TabPanel>
      </Container>
    </Box>
  );
};

export default OrdersPage;
