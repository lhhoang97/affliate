import React from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Avatar,
  Button,
  Divider
} from '@mui/material';
import {
  Person,
  ShoppingCart,
  Favorite,
  Settings,
  Help,
  Logout
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Profile
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 2fr' }, gap: 3 }}>
        {/* Profile Card */}
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <Avatar
              sx={{
                width: 100,
                height: 100,
                mx: 'auto',
                mb: 2,
                bgcolor: 'primary.main',
                fontSize: '2rem'
              }}
            >
              {user?.name?.charAt(0) || 'U'}
            </Avatar>
            <Typography variant="h5" gutterBottom>
              {user?.name || 'User'}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {user?.email}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
            </Typography>
            <Button variant="outlined" sx={{ mt: 2 }}>
              Edit Profile
            </Button>
          </CardContent>
        </Card>

        {/* Menu Options */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Account Settings
            </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Button
                startIcon={<Person />}
                sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
                fullWidth
              >
                Personal Information
              </Button>
              
              <Button
                startIcon={<ShoppingCart />}
                sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
                fullWidth
              >
                Order History
              </Button>
              
              <Button
                startIcon={<Favorite />}
                sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
                fullWidth
              >
                Wishlist
              </Button>
              
              <Divider sx={{ my: 1 }} />
              
              <Button
                startIcon={<Settings />}
                sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
                fullWidth
              >
                Settings
              </Button>
              
              <Button
                startIcon={<Help />}
                sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
                fullWidth
              >
                Help & Support
              </Button>
              
              <Divider sx={{ my: 1 }} />
              
              <Button
                startIcon={<Logout />}
                sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
                fullWidth
                onClick={handleLogout}
                color="error"
              >
                Logout
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default ProfilePage;
