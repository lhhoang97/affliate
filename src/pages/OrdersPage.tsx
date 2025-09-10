import React, { useState, useEffect } from 'react';
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
  Tabs,
  Tab,
  Alert,
  CircularProgress,
  Paper,
  Stack,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment
} from '@mui/material';
import {
  ShoppingBag,
  Search,
  FilterList,
  Refresh,
  TrendingUp,
  LocalShipping,
  CheckCircle,
  Pending,
  Cancel
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useOrders } from '../contexts/OrdersContext';
import { useAuth } from '../contexts/AuthContext';
import OrderCard from '../components/OrderCard';

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
  const navigate = useNavigate();
  const { orders, orderStatistics, isLoading, error, refreshOrders } = useOrders();
  const { isAuthenticated } = useAuth();
  const [selectedTab, setSelectedTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      refreshOrders();
    }
  }, [isAuthenticated, refreshOrders]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshOrders();
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleViewOrderDetails = (orderId: string) => {
    navigate(`/orders/${orderId}`);
  };

  const handleUpdateOrderStatus = (orderId: string, status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded') => {
    // This will be handled by the OrderCard component
    // The OrdersContext will automatically refresh the data
  };

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

  // Filter orders based on search term and selected tab
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.status.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedTab === 0) return matchesSearch; // All orders
    if (selectedTab === 1) return matchesSearch && order.status === 'pending';
    if (selectedTab === 2) return matchesSearch && (order.status === 'processing' || order.status === 'shipped');
    if (selectedTab === 3) return matchesSearch && order.status === 'delivered';
    if (selectedTab === 4) return matchesSearch && order.status === 'cancelled';
    
    return matchesSearch;
  });

  if (!isAuthenticated) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box textAlign="center" py={8}>
          <ShoppingBag sx={{ fontSize: 80, color: '#3b82f6', mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            Your Orders
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Please login to view your orders
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/login')}
            sx={{ px: 4 }}
          >
            Login
          </Button>
        </Box>
      </Container>
    );
  }

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
          onClick={handleRefresh}
          startIcon={<Refresh />}
        >
          Try Again
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h4" component="h1">
            My Orders
          </Typography>
          <Tooltip title="Refresh Orders">
            <IconButton
              onClick={handleRefresh}
              disabled={isRefreshing}
              color="primary"
            >
              <Refresh />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Statistics */}
        {orderStatistics && (
          <Paper sx={{ p: 3, mb: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={3}>
                <Box textAlign="center">
                  <Typography variant="h4" color="primary">
                    {orderStatistics.totalOrders}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Orders
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Box textAlign="center">
                  <Typography variant="h4" color="warning.main">
                    {orderStatistics.pendingOrders}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Pending
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Box textAlign="center">
                  <Typography variant="h4" color="success.main">
                    {orderStatistics.completedOrders}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Completed
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Box textAlign="center">
                  <Typography variant="h4" color="primary">
                    ${orderStatistics.totalRevenue.toFixed(2)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Spent
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        )}

        {/* Search and Filter */}
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Search orders by ID or status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ maxWidth: 400 }}
          />
        </Box>
      </Box>

      {/* Tabs */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={selectedTab} onChange={handleTabChange} aria-label="orders tabs">
            <Tab label={`All (${orders.length})`} />
            <Tab 
              label={`Pending (${orders.filter(o => o.status === 'pending').length})`} 
              icon={<Pending />}
              iconPosition="start"
            />
            <Tab 
              label={`Processing (${orders.filter(o => o.status === 'processing' || o.status === 'shipped').length})`} 
              icon={<LocalShipping />}
              iconPosition="start"
            />
            <Tab 
              label={`Delivered (${orders.filter(o => o.status === 'delivered').length})`} 
              icon={<CheckCircle />}
              iconPosition="start"
            />
            <Tab 
              label={`Cancelled (${orders.filter(o => o.status === 'cancelled').length})`} 
              icon={<Cancel />}
              iconPosition="start"
            />
          </Tabs>
        </Box>

        {/* Tab Panels */}
        <TabPanel value={selectedTab} index={0}>
          {filteredOrders.length === 0 ? (
            <Box textAlign="center" py={8}>
              <ShoppingBag sx={{ fontSize: 80, color: '#ccc', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                No orders found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {searchTerm ? 'Try adjusting your search terms' : 'You haven\'t placed any orders yet'}
              </Typography>
            </Box>
          ) : (
            <Stack spacing={2}>
              {filteredOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onViewDetails={handleViewOrderDetails}
                  onUpdateStatus={handleUpdateOrderStatus}
                />
              ))}
            </Stack>
          )}
        </TabPanel>

        <TabPanel value={selectedTab} index={1}>
          {filteredOrders.length === 0 ? (
            <Box textAlign="center" py={8}>
              <Pending sx={{ fontSize: 80, color: '#ccc', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                No pending orders
              </Typography>
              <Typography variant="body2" color="text.secondary">
                All your orders are being processed or completed
              </Typography>
            </Box>
          ) : (
            <Stack spacing={2}>
              {filteredOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onViewDetails={handleViewOrderDetails}
                  onUpdateStatus={handleUpdateOrderStatus}
                />
              ))}
            </Stack>
          )}
        </TabPanel>

        <TabPanel value={selectedTab} index={2}>
          {filteredOrders.length === 0 ? (
            <Box textAlign="center" py={8}>
              <LocalShipping sx={{ fontSize: 80, color: '#ccc', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                No orders in progress
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Your orders are either pending or completed
              </Typography>
            </Box>
          ) : (
            <Stack spacing={2}>
              {filteredOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onViewDetails={handleViewOrderDetails}
                  onUpdateStatus={handleUpdateOrderStatus}
                />
              ))}
            </Stack>
          )}
        </TabPanel>

        <TabPanel value={selectedTab} index={3}>
          {filteredOrders.length === 0 ? (
            <Box textAlign="center" py={8}>
              <CheckCircle sx={{ fontSize: 80, color: '#ccc', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                No delivered orders
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Your completed orders will appear here
              </Typography>
            </Box>
          ) : (
            <Stack spacing={2}>
              {filteredOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onViewDetails={handleViewOrderDetails}
                  onUpdateStatus={handleUpdateOrderStatus}
                />
              ))}
            </Stack>
          )}
        </TabPanel>

        <TabPanel value={selectedTab} index={4}>
          {filteredOrders.length === 0 ? (
            <Box textAlign="center" py={8}>
              <Cancel sx={{ fontSize: 80, color: '#ccc', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                No cancelled orders
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Cancelled orders will appear here
              </Typography>
            </Box>
          ) : (
            <Stack spacing={2}>
              {filteredOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onViewDetails={handleViewOrderDetails}
                  onUpdateStatus={handleUpdateOrderStatus}
                />
              ))}
            </Stack>
          )}
        </TabPanel>
      </Card>
    </Container>
  );
};

export default OrdersPage;