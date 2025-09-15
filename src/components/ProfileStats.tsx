import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Avatar,
  Chip,
  Divider,
  Stack
} from '@mui/material';
import {
  TrendingUp,
  Person,
  Email,
  Phone,
  LocationOn,
  CalendarToday,
  CheckCircle,
  Warning,
  Security
} from '@mui/icons-material';
import { useProfile } from '../contexts/ProfileContext';
import { useAuth } from '../contexts/AuthContext';

const ProfileStats: React.FC = () => {
  const { profile, userStatistics } = useProfile();
  // const { user } = useAuth();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'success' : 'error';
  };

  const getStatusIcon = (isActive: boolean) => {
    return isActive ? <CheckCircle /> : <Warning />;
  };

  if (!profile) {
    return null;
  }

  return (
    <Grid container spacing={3}>
      {/* Profile Overview */}
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Box display="flex" flexDirection="column" alignItems="center" textAlign="center">
              <Avatar
                sx={{ width: 100, height: 100, mb: 2 }}
                src={profile.avatar_url}
              >
                <Person />
              </Avatar>
              
              <Typography variant="h5" gutterBottom>
                {profile.full_name}
              </Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {profile.email}
              </Typography>
              
              <Chip
                icon={getStatusIcon(profile.is_active)}
                label={profile.is_active ? 'Active' : 'Inactive'}
                color={getStatusColor(profile.is_active) as any}
                variant="outlined"
                sx={{ mb: 2 }}
              />
              
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Contact Information */}
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Contact Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Stack spacing={2}>
              <Box display="flex" alignItems="center">
                <Email sx={{ mr: 2, color: 'text.secondary' }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Email
                  </Typography>
                  <Typography variant="body1">
                    {profile.email}
                  </Typography>
                  {profile.email_verified && (
                    <Chip
                      icon={<CheckCircle />}
                      label="Verified"
                      color="success"
                      size="small"
                      sx={{ mt: 0.5 }}
                    />
                  )}
                </Box>
              </Box>
              
              {profile.phone && (
                <Box display="flex" alignItems="center">
                  <Phone sx={{ mr: 2, color: 'text.secondary' }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Phone
                    </Typography>
                    <Typography variant="body1">
                      {profile.phone}
                    </Typography>
                  </Box>
                </Box>
              )}
              
              {(profile.address || profile.city) && (
                <Box display="flex" alignItems="center">
                  <LocationOn sx={{ mr: 2, color: 'text.secondary' }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Address
                    </Typography>
                    <Typography variant="body1">
                      {[profile.address, profile.city, profile.postal_code]
                        .filter(Boolean)
                        .join(', ')}
                    </Typography>
                  </Box>
                </Box>
              )}
              
              <Box display="flex" alignItems="center">
                <CalendarToday sx={{ mr: 2, color: 'text.secondary' }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Member Since
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(profile.created_at)}
                  </Typography>
                </Box>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      {/* Account Statistics */}
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Account Statistics
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            {userStatistics ? (
              <Stack spacing={2}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box display="flex" alignItems="center">
                    <Person sx={{ mr: 2, color: 'primary.main' }} />
                    <Typography variant="body2" color="text.secondary">
                      Total Users
                    </Typography>
                  </Box>
                  <Typography variant="h6" color="primary">
                    {userStatistics.totalUsers}
                  </Typography>
                </Box>
                
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box display="flex" alignItems="center">
                    <CheckCircle sx={{ mr: 2, color: 'success.main' }} />
                    <Typography variant="body2" color="text.secondary">
                      Active Users
                    </Typography>
                  </Box>
                  <Typography variant="h6" color="success.main">
                    {userStatistics.activeUsers}
                  </Typography>
                </Box>
                
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box display="flex" alignItems="center">
                    <Security sx={{ mr: 2, color: 'warning.main' }} />
                    <Typography variant="body2" color="text.secondary">
                      Admin Users
                    </Typography>
                  </Box>
                  <Typography variant="h6" color="warning.main">
                    {userStatistics.adminUsers}
                  </Typography>
                </Box>
                
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box display="flex" alignItems="center">
                    <TrendingUp sx={{ mr: 2, color: 'info.main' }} />
                    <Typography variant="body2" color="text.secondary">
                      New This Month
                    </Typography>
                  </Box>
                  <Typography variant="h6" color="info.main">
                    {userStatistics.newUsersThisMonth}
                  </Typography>
                </Box>
              </Stack>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No statistics available
              </Typography>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default ProfileStats;
