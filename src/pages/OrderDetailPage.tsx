import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  Divider,
  Stack,
  Avatar,
  Alert,
  CircularProgress,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  ArrowBack,
  LocalShipping,
  CheckCircle,
  Pending,
  Cancel,
  Refresh,
  Payment,
  ShoppingBag,
  LocationOn,
  Phone,
  Email
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useOrders } from '../contexts/OrdersContext';
import { useAuth } from '../contexts/AuthContext';

const OrderDetailPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { currentOrder, isLoading, error, loadOrderById, updateOrder } = useOrders();
  const { user } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (orderId) {
      loadOrderById(orderId);
    }
  }, [orderId, loadOrderById]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'warning';
      case 'processing':
        return 'info';
      case 'shipped':
        return 'primary';
      case 'delivered':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Pending />;
      case 'processing':
        return <Refresh />;
      case 'shipped':
        return <LocalShipping />;
      case 'delivered':
        return <CheckCircle />;
      case 'cancelled':
        return <Cancel />;
      default:
        return <ShoppingBag />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleUpdateStatus = async (newStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded') => {
    if (!orderId) return;
    
    setIsUpdating(true);
    try {
      await updateOrder(orderId, newStatus);
    } catch (error) {
      console.error('Error updating order status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() => navigate('/orders')}
        >
          Back to Orders
        </Button>
      </Container>
    );
  }

  if (!currentOrder) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="info" sx={{ mb: 3 }}>
          Order not found
        </Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() => navigate('/orders')}
        >
          Back to Orders
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() => navigate('/orders')}
          sx={{ mb: 2 }}
        >
          Back to Orders
        </Button>
        
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              Order #{currentOrder.id.slice(-8).toUpperCase()}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Placed on {formatDate(currentOrder.created_at)}
            </Typography>
          </Box>
          
          <Chip
            icon={getStatusIcon(currentOrder.status)}
            label={currentOrder.status.toUpperCase()}
            color={getStatusColor(currentOrder.status) as any}
            variant="filled"
            sx={{ fontWeight: 600, fontSize: '0.9rem' }}
          />
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Order Items */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Order Items
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              {currentOrder.order_items && currentOrder.order_items.length > 0 ? (
                <List>
                  {currentOrder.order_items.map((item: any, index: number) => (
                    <React.Fragment key={index}>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar
                            src={item.product_image}
                            alt={item.product_name}
                            sx={{ width: 60, height: 60 }}
                          />
                        </ListItemAvatar>
                        <ListItemText
                          primary={item.product_name}
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                Quantity: {item.quantity}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Price: ${item.price?.toFixed(2)}
                              </Typography>
                            </Box>
                          }
                        />
                        <Typography variant="h6" color="primary">
                          ${item.subtotal?.toFixed(2)}
                        </Typography>
                      </ListItem>
                      {index < (currentOrder.order_items?.length || 0) - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Typography color="text.secondary">
                  No items found in this order.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Order Summary & Actions */}
        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            {/* Order Summary */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Order Summary
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Stack spacing={1}>
                  <Box display="flex" justifyContent="space-between">
                    <Typography>Subtotal:</Typography>
                    <Typography>${(currentOrder.total_amount - (currentOrder.shipping_amount || 0) - (currentOrder.tax_amount || 0)).toFixed(2)}</Typography>
                  </Box>
                  
                  {currentOrder.shipping_amount && currentOrder.shipping_amount > 0 && (
                    <Box display="flex" justifyContent="space-between">
                      <Typography>Shipping:</Typography>
                      <Typography>${currentOrder.shipping_amount.toFixed(2)}</Typography>
                    </Box>
                  )}
                  
                  {currentOrder.tax_amount && currentOrder.tax_amount > 0 && (
                    <Box display="flex" justifyContent="space-between">
                      <Typography>Tax:</Typography>
                      <Typography>${currentOrder.tax_amount.toFixed(2)}</Typography>
                    </Box>
                  )}
                  
                  <Divider />
                  
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="h6">Total:</Typography>
                    <Typography variant="h6" color="primary">
                      ${currentOrder.total_amount?.toFixed(2) || '0.00'}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            {/* Payment Status */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Payment Status
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Box display="flex" alignItems="center" gap={1}>
                  <Payment />
                  <Chip
                    label={currentOrder.payment_status || 'Pending'}
                    color={currentOrder.payment_status === 'paid' ? 'success' : 'warning'}
                    variant="outlined"
                  />
                </Box>
              </CardContent>
            </Card>

            {/* Order Actions */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Order Actions
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Stack spacing={1}>
                  {currentOrder.status === 'pending' && (
                    <Button
                      variant="contained"
                      color="info"
                      startIcon={<Refresh />}
                      onClick={() => handleUpdateStatus('processing')}
                      disabled={isUpdating}
                      fullWidth
                    >
                      Mark as Processing
                    </Button>
                  )}
                  
                  {currentOrder.status === 'processing' && (
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<LocalShipping />}
                      onClick={() => handleUpdateStatus('shipped')}
                      disabled={isUpdating}
                      fullWidth
                    >
                      Mark as Shipped
                    </Button>
                  )}
                  
                  {currentOrder.status === 'shipped' && (
                    <Button
                      variant="contained"
                      color="success"
                      startIcon={<CheckCircle />}
                      onClick={() => handleUpdateStatus('delivered')}
                      disabled={isUpdating}
                      fullWidth
                    >
                      Mark as Delivered
                    </Button>
                  )}
                  
                  {(currentOrder.status === 'pending' || currentOrder.status === 'processing') && (
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<Cancel />}
                      onClick={() => handleUpdateStatus('cancelled')}
                      disabled={isUpdating}
                      fullWidth
                    >
                      Cancel Order
                    </Button>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
};

export default OrderDetailPage;
