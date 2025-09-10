import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  Divider,
  Stack,
  Avatar,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  ShoppingBag,
  Visibility,
  LocalShipping,
  CheckCircle,
  Pending,
  Cancel,
  Refresh
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Order } from '../types';

interface OrderCardProps {
  order: Order;
  onViewDetails?: (orderId: string) => void;
  onUpdateStatus?: (orderId: string, status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded') => void;
  showActions?: boolean;
}

const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onViewDetails,
  onUpdateStatus,
  showActions = true
}) => {
  const navigate = useNavigate();

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
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(order.id);
    } else {
      navigate(`/orders/${order.id}`);
    }
  };

  const handleUpdateStatus = (newStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded') => {
    if (onUpdateStatus) {
      onUpdateStatus(order.id, newStatus);
    }
  };

  return (
    <Card sx={{ mb: 2, '&:hover': { boxShadow: 3 } }}>
      <CardContent>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
          <Box>
            <Typography variant="h6" gutterBottom>
              Order #{order.id.slice(-8).toUpperCase()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {formatDate(order.created_at)}
            </Typography>
          </Box>
          
          <Chip
            icon={getStatusIcon(order.status)}
            label={order.status.toUpperCase()}
            color={getStatusColor(order.status) as any}
            variant="outlined"
            sx={{ fontWeight: 600 }}
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Order Details */}
        <Box sx={{ mb: 2 }}>
          <Stack direction="row" spacing={3}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Total Amount
              </Typography>
              <Typography variant="h6" color="primary">
                ${order.total_amount?.toFixed(2) || '0.00'}
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="body2" color="text.secondary">
                Items
              </Typography>
              <Typography variant="h6">
                {order.order_items?.length || 0}
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="body2" color="text.secondary">
                Payment Status
              </Typography>
              <Chip
                label={order.payment_status || 'Pending'}
                color={order.payment_status === 'paid' ? 'success' : 'warning'}
                size="small"
                variant="outlined"
              />
            </Box>
          </Stack>
        </Box>

        {/* Order Items Preview */}
        {order.order_items && order.order_items.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Items:
            </Typography>
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
              {order.order_items.slice(0, 3).map((item: any, index: number) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    backgroundColor: 'grey.100',
                    borderRadius: 1,
                    px: 1,
                    py: 0.5
                  }}
                >
                  <Avatar
                    src={item.product_image}
                    alt={item.product_name}
                    sx={{ width: 24, height: 24 }}
                  />
                  <Typography variant="caption">
                    {item.product_name} (x{item.quantity})
                  </Typography>
                </Box>
              ))}
              {order.order_items.length > 3 && (
                <Typography variant="caption" color="text.secondary">
                  +{order.order_items.length - 3} more
                </Typography>
              )}
            </Stack>
          </Box>
        )}

        {/* Actions */}
        {showActions && (
          <>
            <Divider sx={{ my: 2 }} />
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Button
                variant="outlined"
                startIcon={<Visibility />}
                onClick={handleViewDetails}
                size="small"
              >
                View Details
              </Button>
              
              <Stack direction="row" spacing={1}>
                {order.status === 'pending' && (
                  <Tooltip title="Mark as Processing">
                    <IconButton
                      size="small"
                      onClick={() => handleUpdateStatus('processing')}
                      color="info"
                    >
                      <Refresh />
                    </IconButton>
                  </Tooltip>
                )}
                
                {order.status === 'processing' && (
                  <Tooltip title="Mark as Shipped">
                    <IconButton
                      size="small"
                      onClick={() => handleUpdateStatus('shipped')}
                      color="primary"
                    >
                      <LocalShipping />
                    </IconButton>
                  </Tooltip>
                )}
                
                {order.status === 'shipped' && (
                  <Tooltip title="Mark as Delivered">
                    <IconButton
                      size="small"
                      onClick={() => handleUpdateStatus('delivered')}
                      color="success"
                    >
                      <CheckCircle />
                    </IconButton>
                  </Tooltip>
                )}
                
                {(order.status === 'pending' || order.status === 'processing') && (
                  <Tooltip title="Cancel Order">
                    <IconButton
                      size="small"
                      onClick={() => handleUpdateStatus('cancelled')}
                      color="error"
                    >
                      <Cancel />
                    </IconButton>
                  </Tooltip>
                )}
              </Stack>
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderCard;
