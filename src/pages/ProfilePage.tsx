import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Tabs,
  Tab,
  Alert,
  CircularProgress,
  Stack,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Person,
  Edit,
  Refresh,
  Security,
  Notifications,
  Help,
  Logout
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../contexts/ProfileContext';
import { useAuth } from '../contexts/AuthContext';
import ProfileStats from '../components/ProfileStats';
import ProfileEditForm from '../components/ProfileEditForm';
import EmailPreferences from '../components/EmailPreferences';

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
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { profile, userStatistics, isLoading, error, refreshProfile } = useProfile();
  const { logout } = useAuth();
  const [selectedTab, setSelectedTab] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshProfile();
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
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
            My Profile
          </Typography>
          <Stack direction="row" spacing={1}>
            <Tooltip title="Refresh Profile">
              <IconButton
                onClick={handleRefresh}
                disabled={isRefreshing}
                color="primary"
              >
                <Refresh />
              </IconButton>
            </Tooltip>
            <Button
              variant="outlined"
              color="error"
              startIcon={<Logout />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Stack>
        </Box>
      </Box>

      {/* Tabs */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={selectedTab} onChange={handleTabChange} aria-label="profile tabs">
            <Tab 
              icon={<Person />} 
              label="Overview" 
              iconPosition="start"
            />
            <Tab 
              icon={<Edit />} 
              label="Edit Profile" 
              iconPosition="start"
            />
            <Tab 
              icon={<Security />} 
              label="Security" 
              iconPosition="start"
            />
            <Tab 
              icon={<Notifications />} 
              label="Notifications" 
              iconPosition="start"
            />
            <Tab 
              icon={<Help />} 
              label="Help & Support" 
              iconPosition="start"
            />
          </Tabs>
        </Box>

        {/* Tab Panels */}
        <TabPanel value={selectedTab} index={0}>
          <ProfileStats />
        </TabPanel>

        <TabPanel value={selectedTab} index={1}>
          <ProfileEditForm />
        </TabPanel>

        <TabPanel value={selectedTab} index={2}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Security Settings
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Manage your account security and privacy settings
              </Typography>
              
              <Stack spacing={2}>
                <Button variant="outlined" fullWidth>
                  Change Password
                </Button>
                <Button variant="outlined" fullWidth>
                  Two-Factor Authentication
                </Button>
                <Button variant="outlined" fullWidth>
                  Login History
                </Button>
                <Button variant="outlined" fullWidth>
                  Connected Devices
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </TabPanel>

        <TabPanel value={selectedTab} index={3}>
          <EmailPreferences />
        </TabPanel>

        <TabPanel value={selectedTab} index={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Help & Support
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Get help with your account and find answers to common questions
              </Typography>
              
              <Stack spacing={2}>
                <Button variant="outlined" fullWidth>
                  FAQ
                </Button>
                <Button variant="outlined" fullWidth>
                  Contact Support
                </Button>
                <Button variant="outlined" fullWidth>
                  Report a Problem
                </Button>
                <Button variant="outlined" fullWidth>
                  User Guide
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </TabPanel>
      </Card>
    </Container>
  );
};

export default ProfilePage;