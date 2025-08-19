import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Avatar,
  Button,
  Divider,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Tabs,
  Tab,
  Paper
} from '@mui/material';
import {
  Person,
  ShoppingCart,
  Favorite,
  Settings,
  Help,
  Logout,
  Edit,
  Lock,
  Email,
  Phone,
  LocationOn,
  CalendarToday,
  Verified,
  Security,
  Notifications,
  Language,
  Payment,
  History
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
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const ProfilePage: React.FC = () => {
  const { user, logout, updateProfile } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form states
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    bio: user?.bio || ''
  });

  // Update form when user changes
  React.useEffect(() => {
    setProfileForm({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
      bio: user?.bio || ''
    });
  }, [user]);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleEditProfile = () => {
    setEditProfileOpen(true);
  };

  const handleSaveProfile = async () => {
    try {
      await updateProfile(profileForm);
      setAlert({ type: 'success', message: 'Profile updated successfully!' });
      setEditProfileOpen(false);
      setTimeout(() => setAlert(null), 3000);
    } catch (err) {
      setAlert({ type: 'error', message: 'Failed to update profile!' });
      setTimeout(() => setAlert(null), 3000);
    }
  };

  const handleChangePassword = () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setAlert({ type: 'error', message: 'New passwords do not match!' });
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setAlert({ type: 'error', message: 'Password must be at least 6 characters!' });
      return;
    }
    // Here you would typically change password via API
    setAlert({ type: 'success', message: 'Password changed successfully!' });
    setChangePasswordOpen(false);
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleLogout = () => {
    logout();
  };

  // Mock order history data
  const orderHistory = [
    {
      id: 'ORD-001',
      date: '2024-01-15',
      status: 'Delivered',
      total: 299.99,
      items: ['iPhone 15 Pro', 'AirPods Pro']
    },
    {
      id: 'ORD-002',
      date: '2024-01-10',
      status: 'Shipped',
      total: 149.99,
      items: ['Samsung Galaxy S24']
    },
    {
      id: 'ORD-003',
      date: '2024-01-05',
      status: 'Processing',
      total: 89.99,
      items: ['Sony WH-1000XM5']
    }
  ];

  // Mock wishlist data
  const wishlist = [
    { id: 1, name: 'MacBook Pro M3', price: 1999.99, image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=100' },
    { id: 2, name: 'iPad Pro', price: 799.99, image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=100' },
    { id: 3, name: 'Apple Watch Series 9', price: 399.99, image: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=100' }
  ];

  return (
    <>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {alert && (
          <Alert severity={alert.type} sx={{ mb: 2 }}>
            {alert.message}
          </Alert>
        )}

        <Typography variant="h4" component="h1" gutterBottom>
          Profile
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 2fr' }, gap: 3 }}>
          {/* Profile Card */}
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  mx: 'auto',
                  mb: 2,
                  bgcolor: 'primary.main',
                  fontSize: '2.5rem'
                }}
                src={user?.avatar}
              >
                {user?.name?.charAt(0) || 'U'}
              </Avatar>
              <Typography variant="h5" gutterBottom>
                {user?.name || 'User'}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {user?.email}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
                <Chip 
                  icon={<Verified />} 
                  label={user?.role === 'admin' ? 'Admin' : 'User'} 
                  color={user?.role === 'admin' ? 'error' : 'primary'}
                  size="small"
                />
                {user?.isVerified && (
                  <Chip icon={<Verified />} label="Verified" color="success" size="small" />
                )}
              </Box>
              <Typography variant="body2" color="text.secondary">
                Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </Typography>
              <Button 
                variant="outlined" 
                startIcon={<Edit />}
                sx={{ mt: 2 }}
                onClick={handleEditProfile}
              >
                Edit Profile
              </Button>
            </CardContent>
          </Card>

                  {/* Main Content */}
          <Card>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={tabValue} onChange={handleTabChange} aria-label="profile tabs">
                <Tab icon={<Person />} label="Profile" />
                <Tab icon={<History />} label="Orders" />
                <Tab icon={<Favorite />} label="Wishlist" />
                <Tab icon={<Settings />} label="Settings" />
              </Tabs>
            </Box>

            {/* Profile Tab */}
            <TabPanel value={tabValue} index={0}>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={user?.name || ''}
                  InputProps={{ readOnly: true }}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Email"
                  value={user?.email || ''}
                  InputProps={{ readOnly: true }}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Phone"
                  value={user?.phone || 'Not provided'}
                  InputProps={{ readOnly: true }}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Address"
                  value={user?.address || 'Not provided'}
                  InputProps={{ readOnly: true }}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Bio"
                  value={user?.bio || 'No bio available'}
                  multiline
                  rows={3}
                  InputProps={{ readOnly: true }}
                  sx={{ gridColumn: { xs: '1 / -1', sm: '1 / -1' } }}
                />
              </Box>
            </TabPanel>

              {/* Orders Tab */}
              <TabPanel value={tabValue} index={1}>
                <Typography variant="h6" gutterBottom>
                  Order History
                </Typography>
                <List>
                  {orderHistory.map((order) => (
                    <ListItem key={order.id} divider>
                      <ListItemIcon>
                        <ShoppingCart />
                      </ListItemIcon>
                      <ListItemText
                        primary={`Order ${order.id}`}
                        secondary={
                          <Box>
                            <Typography variant="body2">
                              Date: {new Date(order.date).toLocaleDateString()}
                            </Typography>
                            <Typography variant="body2">
                              Items: {order.items.join(', ')}
                            </Typography>
                            <Typography variant="body2">
                              Total: ${order.total}
                            </Typography>
                          </Box>
                        }
                      />
                      <Chip 
                        label={order.status} 
                        color={
                          order.status === 'Delivered' ? 'success' : 
                          order.status === 'Shipped' ? 'primary' : 'warning'
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </TabPanel>

                        {/* Wishlist Tab */}
          <TabPanel value={tabValue} index={2}>
            <Typography variant="h6" gutterBottom>
              My Wishlist
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 2 }}>
              {wishlist.map((item) => (
                <Card key={item.id}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar src={item.image} sx={{ width: 60, height: 60 }} />
                      <Box>
                        <Typography variant="subtitle1">{item.name}</Typography>
                        <Typography variant="body2" color="primary">
                          ${item.price}
                        </Typography>
                      </Box>
                    </Box>
                    <Button variant="outlined" size="small" sx={{ mt: 1 }}>
                      Add to Cart
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </TabPanel>

              {/* Settings Tab */}
              <TabPanel value={tabValue} index={3}>
                <Typography variant="h6" gutterBottom>
                  Account Settings
                </Typography>
                <List>
                  <ListItem onClick={handleEditProfile} sx={{ cursor: 'pointer', '&:hover': { backgroundColor: 'action.hover' } }}>
                    <ListItemIcon>
                      <Person />
                    </ListItemIcon>
                    <ListItemText primary="Edit Profile Information" />
                  </ListItem>
                  <ListItem onClick={() => setChangePasswordOpen(true)} sx={{ cursor: 'pointer', '&:hover': { backgroundColor: 'action.hover' } }}>
                    <ListItemIcon>
                      <Lock />
                    </ListItemIcon>
                    <ListItemText primary="Change Password" />
                  </ListItem>
                  <ListItem sx={{ cursor: 'pointer', '&:hover': { backgroundColor: 'action.hover' } }}>
                    <ListItemIcon>
                      <Notifications />
                    </ListItemIcon>
                    <ListItemText primary="Notification Settings" />
                  </ListItem>
                  <ListItem sx={{ cursor: 'pointer', '&:hover': { backgroundColor: 'action.hover' } }}>
                    <ListItemIcon>
                      <Security />
                    </ListItemIcon>
                    <ListItemText primary="Privacy & Security" />
                  </ListItem>
                  <ListItem sx={{ cursor: 'pointer', '&:hover': { backgroundColor: 'action.hover' } }}>
                    <ListItemIcon>
                      <Language />
                    </ListItemIcon>
                    <ListItemText primary="Language & Region" />
                  </ListItem>
                  <ListItem sx={{ cursor: 'pointer', '&:hover': { backgroundColor: 'action.hover' } }}>
                    <ListItemIcon>
                      <Payment />
                    </ListItemIcon>
                    <ListItemText primary="Payment Methods" />
                  </ListItem>
                  <Divider sx={{ my: 1 }} />
                  <ListItem onClick={handleLogout} sx={{ cursor: 'pointer', '&:hover': { backgroundColor: 'action.hover' } }}>
                    <ListItemIcon>
                      <Logout />
                    </ListItemIcon>
                    <ListItemText primary="Logout" />
                  </ListItem>
                </List>
              </TabPanel>
            </Card>
          </Box>
        </Container>

        {/* Edit Profile Dialog */}
        <Dialog open={editProfileOpen} onClose={() => setEditProfileOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <TextField
                fullWidth
                label="Full Name"
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
              />
              <TextField
                fullWidth
                label="Email"
                value={profileForm.email}
                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
              />
              <TextField
                fullWidth
                label="Phone"
                value={profileForm.phone}
                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
              />
              <TextField
                fullWidth
                label="Address"
                value={profileForm.address}
                onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
              />
              <TextField
                fullWidth
                label="Bio"
                multiline
                rows={3}
                value={profileForm.bio}
                onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditProfileOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveProfile} variant="contained">Save</Button>
          </DialogActions>
        </Dialog>

        {/* Change Password Dialog */}
        <Dialog open={changePasswordOpen} onClose={() => setChangePasswordOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Change Password</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <TextField
                fullWidth
                type="password"
                label="Current Password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
              />
              <TextField
                fullWidth
                type="password"
                label="New Password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              />
              <TextField
                fullWidth
                type="password"
                label="Confirm New Password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setChangePasswordOpen(false)}>Cancel</Button>
            <Button onClick={handleChangePassword} variant="contained">Change Password</Button>
          </DialogActions>
        </Dialog>
      </>
  );
};

export default ProfilePage;
