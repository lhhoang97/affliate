import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  Select,
  MenuItem,
  Grid,
  Alert,
  Snackbar,
  Tabs,
  Tab,
  Paper,
  Stack,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Save,
  Refresh,
  Email,
  Payment,
  Settings,
  Security,
  Language,
  Public,
  ContactMail,
  Phone,
  Facebook,
  Twitter,
  Instagram,
  Analytics,
  Search,
  Description
} from '@mui/icons-material';
import {
  getSystemSettings,
  updateSystemSettings,
  getEmailSettings,
  updateEmailSettings,
  getPaymentSettings,
  updatePaymentSettings,
  testEmailConnection,
  SystemSettings,
  EmailSettings,
  PaymentSettings
} from '../services/settingsService';

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
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const AdminSettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as any });

  // System Settings
  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    site_name: 'Affiliate Store',
    site_description: 'Modern affiliate marketing website',
    currency: 'USD',
    maintenance_mode: false,
    allow_registration: true,
    max_products_per_page: 20,
    enable_reviews: true,
    enable_wishlist: true,
    enable_coupons: true,
    default_language: 'en',
    timezone: 'UTC',
    contact_email: '',
    contact_phone: '',
    social_facebook: '',
    social_twitter: '',
    social_instagram: '',
    analytics_google_id: '',
    seo_title: '',
    seo_description: '',
    seo_keywords: ''
  });

  // Email Settings
  const [emailSettings, setEmailSettings] = useState<EmailSettings>({
    smtp_host: '',
    smtp_port: 587,
    smtp_username: '',
    smtp_password: '',
    smtp_secure: false,
    from_email: '',
    from_name: 'Affiliate Store'
  });

  // Payment Settings
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>({
    stripe_public_key: '',
    stripe_secret_key: '',
    paypal_client_id: '',
    paypal_client_secret: '',
    default_payment_method: 'stripe',
    currency: 'USD'
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const [system, email, payment] = await Promise.all([
        getSystemSettings(),
        getEmailSettings(),
        getPaymentSettings()
      ]);

      if (system) setSystemSettings(system);
      if (email) setEmailSettings(email);
      if (payment) setPaymentSettings(payment);
    } catch (error) {
      console.error('Error loading settings:', error);
      setSnackbar({ open: true, message: 'Failed to load settings', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSystemSettings = async () => {
    try {
      setSaving(true);
      await updateSystemSettings(systemSettings);
      setSnackbar({ open: true, message: 'System settings saved successfully', severity: 'success' });
    } catch (error) {
      console.error('Error saving system settings:', error);
      setSnackbar({ open: true, message: 'Failed to save system settings', severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveEmailSettings = async () => {
    try {
      setSaving(true);
      await updateEmailSettings(emailSettings);
      setSnackbar({ open: true, message: 'Email settings saved successfully', severity: 'success' });
    } catch (error) {
      console.error('Error saving email settings:', error);
      setSnackbar({ open: true, message: 'Failed to save email settings', severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleSavePaymentSettings = async () => {
    try {
      setSaving(true);
      await updatePaymentSettings(paymentSettings);
      setSnackbar({ open: true, message: 'Payment settings saved successfully', severity: 'success' });
    } catch (error) {
      console.error('Error saving payment settings:', error);
      setSnackbar({ open: true, message: 'Failed to save payment settings', severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleTestEmail = async () => {
    try {
      const result = await testEmailConnection();
      setSnackbar({ 
        open: true, 
        message: result.message, 
        severity: result.success ? 'success' : 'error' 
      });
    } catch (error) {
      setSnackbar({ open: true, message: 'Email test failed', severity: 'error' });
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <Typography>Loading settings...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          System Settings
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={loadSettings}
          disabled={loading}
        >
          Refresh
        </Button>
      </Box>

      <Paper sx={{ width: '100%' }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab icon={<Settings />} label="System" />
          <Tab icon={<Email />} label="Email" />
          <Tab icon={<Payment />} label="Payment" />
        </Tabs>

        {/* System Settings Tab */}
        <TabPanel value={activeTab} index={0}>
          <Grid container spacing={3}>
            {/* General Information */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Public />
                    General Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Site Name"
                        value={systemSettings.site_name}
                        onChange={(e) => setSystemSettings({ ...systemSettings, site_name: e.target.value })}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Currency"
                        select
                        value={systemSettings.currency}
                        onChange={(e) => setSystemSettings({ ...systemSettings, currency: e.target.value })}
                      >
                        <MenuItem value="USD">USD</MenuItem>
                        <MenuItem value="VND">VND</MenuItem>
                        <MenuItem value="EUR">EUR</MenuItem>
                        <MenuItem value="GBP">GBP</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Site Description"
                        multiline
                        rows={3}
                        value={systemSettings.site_description}
                        onChange={(e) => setSystemSettings({ ...systemSettings, site_description: e.target.value })}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* System Configuration */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Security />
                    System Configuration
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={systemSettings.maintenance_mode}
                            onChange={(e) => setSystemSettings({ ...systemSettings, maintenance_mode: e.target.checked })}
                          />
                        }
                        label="Maintenance Mode"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={systemSettings.allow_registration}
                            onChange={(e) => setSystemSettings({ ...systemSettings, allow_registration: e.target.checked })}
                          />
                        }
                        label="Allow Registration"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Max Products Per Page"
                        type="number"
                        value={systemSettings.max_products_per_page}
                        onChange={(e) => setSystemSettings({ ...systemSettings, max_products_per_page: parseInt(e.target.value) })}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Default Language"
                        select
                        value={systemSettings.default_language}
                        onChange={(e) => setSystemSettings({ ...systemSettings, default_language: e.target.value })}
                      >
                        <MenuItem value="en">English</MenuItem>
                        <MenuItem value="vi">Vietnamese</MenuItem>
                        <MenuItem value="es">Spanish</MenuItem>
                        <MenuItem value="fr">French</MenuItem>
                      </TextField>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Features */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Features
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={systemSettings.enable_reviews}
                            onChange={(e) => setSystemSettings({ ...systemSettings, enable_reviews: e.target.checked })}
                          />
                        }
                        label="Enable Reviews"
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={systemSettings.enable_wishlist}
                            onChange={(e) => setSystemSettings({ ...systemSettings, enable_wishlist: e.target.checked })}
                          />
                        }
                        label="Enable Wishlist"
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={systemSettings.enable_coupons}
                            onChange={(e) => setSystemSettings({ ...systemSettings, enable_coupons: e.target.checked })}
                          />
                        }
                        label="Enable Coupons"
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Contact Information */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ContactMail />
                    Contact Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Contact Email"
                        type="email"
                        value={systemSettings.contact_email}
                        onChange={(e) => setSystemSettings({ ...systemSettings, contact_email: e.target.value })}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Contact Phone"
                        value={systemSettings.contact_phone}
                        onChange={(e) => setSystemSettings({ ...systemSettings, contact_phone: e.target.value })}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Save Button */}
            <Grid item xs={12}>
              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={handleSaveSystemSettings}
                disabled={saving}
                size="large"
              >
                {saving ? 'Saving...' : 'Save System Settings'}
              </Button>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Email Settings Tab */}
        <TabPanel value={activeTab} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Email />
                    SMTP Configuration
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="SMTP Host"
                        value={emailSettings.smtp_host}
                        onChange={(e) => setEmailSettings({ ...emailSettings, smtp_host: e.target.value })}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="SMTP Port"
                        type="number"
                        value={emailSettings.smtp_port}
                        onChange={(e) => setEmailSettings({ ...emailSettings, smtp_port: parseInt(e.target.value) })}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="SMTP Username"
                        value={emailSettings.smtp_username}
                        onChange={(e) => setEmailSettings({ ...emailSettings, smtp_username: e.target.value })}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="SMTP Password"
                        type="password"
                        value={emailSettings.smtp_password}
                        onChange={(e) => setEmailSettings({ ...emailSettings, smtp_password: e.target.value })}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="From Email"
                        type="email"
                        value={emailSettings.from_email}
                        onChange={(e) => setEmailSettings({ ...emailSettings, from_email: e.target.value })}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="From Name"
                        value={emailSettings.from_name}
                        onChange={(e) => setEmailSettings({ ...emailSettings, from_name: e.target.value })}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={emailSettings.smtp_secure}
                            onChange={(e) => setEmailSettings({ ...emailSettings, smtp_secure: e.target.checked })}
                          />
                        }
                        label="Use SSL/TLS"
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  startIcon={<Save />}
                  onClick={handleSaveEmailSettings}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Email Settings'}
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Email />}
                  onClick={handleTestEmail}
                >
                  Test Email
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Payment Settings Tab */}
        <TabPanel value={activeTab} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Payment />
                    Payment Configuration
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Stripe Public Key"
                        value={paymentSettings.stripe_public_key}
                        onChange={(e) => setPaymentSettings({ ...paymentSettings, stripe_public_key: e.target.value })}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Stripe Secret Key"
                        type="password"
                        value={paymentSettings.stripe_secret_key}
                        onChange={(e) => setPaymentSettings({ ...paymentSettings, stripe_secret_key: e.target.value })}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="PayPal Client ID"
                        value={paymentSettings.paypal_client_id}
                        onChange={(e) => setPaymentSettings({ ...paymentSettings, paypal_client_id: e.target.value })}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="PayPal Client Secret"
                        type="password"
                        value={paymentSettings.paypal_client_secret}
                        onChange={(e) => setPaymentSettings({ ...paymentSettings, paypal_client_secret: e.target.value })}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Default Payment Method"
                        select
                        value={paymentSettings.default_payment_method}
                        onChange={(e) => setPaymentSettings({ ...paymentSettings, default_payment_method: e.target.value })}
                      >
                        <MenuItem value="stripe">Stripe</MenuItem>
                        <MenuItem value="paypal">PayPal</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Currency"
                        select
                        value={paymentSettings.currency}
                        onChange={(e) => setPaymentSettings({ ...paymentSettings, currency: e.target.value })}
                      >
                        <MenuItem value="USD">USD</MenuItem>
                        <MenuItem value="VND">VND</MenuItem>
                        <MenuItem value="EUR">EUR</MenuItem>
                        <MenuItem value="GBP">GBP</MenuItem>
                      </TextField>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={handleSavePaymentSettings}
                disabled={saving}
                size="large"
              >
                {saving ? 'Saving...' : 'Save Payment Settings'}
              </Button>
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminSettingsPage;


