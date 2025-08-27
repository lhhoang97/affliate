import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  Divider,
  Alert,
  Snackbar,
  Switch,
  FormControlLabel,
  Chip
} from '@mui/material';
import {
  Save as SaveIcon,
  Refresh as RefreshIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { getDealConfig, updateDealConfig, defaultDealConfig, DealConfig } from '../services/dealConfigService';

const AdminDealConfigPage: React.FC = () => {
  const [config, setConfig] = useState<DealConfig>(getDealConfig());
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as any });
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setConfig(getDealConfig());
  }, []);

  const handleConfigChange = (section: keyof DealConfig, field: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    try {
      updateDealConfig(config);
      setHasChanges(false);
      setSnackbar({
        open: true,
        message: 'Deal configuration saved successfully!',
        severity: 'success'
      });
      // Refresh page to apply changes
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error saving configuration',
        severity: 'error'
      });
    }
  };

  const handleReset = () => {
    setConfig(defaultDealConfig);
    setHasChanges(true);
    setSnackbar({
      open: true,
      message: 'Configuration reset to defaults',
      severity: 'info'
    });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <SettingsIcon sx={{ mr: 2, fontSize: '2rem', color: '#3b82f6' }} />
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1f2937' }}>
            Deal Configuration
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Configure criteria and display settings for homepage deal sections
          </Typography>
        </Box>
      </Box>

      {/* Save/Reset Actions */}
      <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSave}
          disabled={!hasChanges}
          sx={{ 
            bgcolor: '#059669',
            '&:hover': { bgcolor: '#047857' }
          }}
        >
          Save Changes
        </Button>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={handleReset}
          sx={{ borderColor: '#6b7280', color: '#6b7280' }}
        >
          Reset to Defaults
        </Button>
        {hasChanges && (
          <Chip 
            label="Unsaved Changes" 
            color="warning" 
            variant="outlined" 
            sx={{ ml: 'auto' }}
          />
        )}
      </Box>

      <Grid container spacing={4}>
        {/* Hot Deals Configuration */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Box sx={{ 
                  width: 40, 
                  height: 40, 
                  borderRadius: '50%', 
                  bgcolor: '#fef3c7', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  mr: 2
                }}>
                  💥
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Hot Deals
                </Typography>
              </Box>

              <TextField
                label="Section Title"
                fullWidth
                value={config.hotDeals.title}
                onChange={(e) => handleConfigChange('hotDeals', 'title', e.target.value)}
                sx={{ mb: 2 }}
              />

              <TextField
                label="Subtitle/Description"
                fullWidth
                multiline
                rows={2}
                value={config.hotDeals.subtitle}
                onChange={(e) => handleConfigChange('hotDeals', 'subtitle', e.target.value)}
                sx={{ mb: 2 }}
              />

              <TextField
                label="Maximum Price ($)"
                type="number"
                fullWidth
                value={config.hotDeals.maxPrice}
                onChange={(e) => handleConfigChange('hotDeals', 'maxPrice', Number(e.target.value))}
                sx={{ mb: 2 }}
                helperText="Products under this price qualify as hot deals"
              />

              <TextField
                label="Minimum Discount (%)"
                type="number"
                fullWidth
                value={config.hotDeals.minDiscountPercent}
                onChange={(e) => handleConfigChange('hotDeals', 'minDiscountPercent', Number(e.target.value))}
                helperText="Minimum discount percentage to qualify"
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Trending Deals Configuration */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Box sx={{ 
                  width: 40, 
                  height: 40, 
                  borderRadius: '50%', 
                  bgcolor: '#fef3c7', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  mr: 2
                }}>
                  ⭐
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Trending Deals
                </Typography>
              </Box>

              <TextField
                label="Section Title"
                fullWidth
                value={config.trendingDeals.title}
                onChange={(e) => handleConfigChange('trendingDeals', 'title', e.target.value)}
                sx={{ mb: 2 }}
              />

              <TextField
                label="Subtitle/Description"
                fullWidth
                multiline
                rows={2}
                value={config.trendingDeals.subtitle}
                onChange={(e) => handleConfigChange('trendingDeals', 'subtitle', e.target.value)}
                sx={{ mb: 2 }}
              />

              <TextField
                label="Minimum Rating"
                type="number"
                fullWidth
                inputProps={{ min: 0, max: 5, step: 0.1 }}
                value={config.trendingDeals.minRating}
                onChange={(e) => handleConfigChange('trendingDeals', 'minRating', Number(e.target.value))}
                sx={{ mb: 2 }}
                helperText="Minimum star rating to qualify as trending"
              />

              <TextField
                label="Minimum Reviews"
                type="number"
                fullWidth
                value={config.trendingDeals.minReviews}
                onChange={(e) => handleConfigChange('trendingDeals', 'minReviews', Number(e.target.value))}
                helperText="Minimum number of reviews required"
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Just For You Configuration */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Box sx={{ 
                  width: 40, 
                  height: 40, 
                  borderRadius: '50%', 
                  bgcolor: '#fef3c7', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  mr: 2
                }}>
                  🎯
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Just For You
                </Typography>
              </Box>

              <TextField
                label="Section Title"
                fullWidth
                value={config.justForYou.title}
                onChange={(e) => handleConfigChange('justForYou', 'title', e.target.value)}
                sx={{ mb: 2 }}
              />

              <TextField
                label="Subtitle/Description"
                fullWidth
                multiline
                rows={2}
                value={config.justForYou.subtitle}
                onChange={(e) => handleConfigChange('justForYou', 'subtitle', e.target.value)}
                sx={{ mb: 2 }}
              />

              <Alert severity="info" sx={{ mt: 2 }}>
                This section shows randomized products for personalization. No additional criteria needed.
              </Alert>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Preview Section */}
      <Card sx={{ mt: 4 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
            Live Preview
          </Typography>
          <Divider sx={{ mb: 3 }} />
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Box sx={{ p: 2, bgcolor: '#f9fafb', borderRadius: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  {config.hotDeals.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {config.hotDeals.subtitle}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Chip label={`Under $${config.hotDeals.maxPrice}`} size="small" color="primary" />
                  <Chip label={`${config.hotDeals.minDiscountPercent}%+ discount`} size="small" color="secondary" sx={{ ml: 1 }} />
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box sx={{ p: 2, bgcolor: '#f9fafb', borderRadius: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  {config.trendingDeals.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {config.trendingDeals.subtitle}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Chip label={`${config.trendingDeals.minRating}+ stars`} size="small" color="primary" />
                  <Chip label={`${config.trendingDeals.minReviews}+ reviews`} size="small" color="secondary" sx={{ ml: 1 }} />
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box sx={{ p: 2, bgcolor: '#f9fafb', borderRadius: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  {config.justForYou.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {config.justForYou.subtitle}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Chip label="Personalized" size="small" color="primary" />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminDealConfigPage;
