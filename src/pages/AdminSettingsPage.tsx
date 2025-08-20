import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, TextField, Button, Switch, FormControlLabel, Divider, Select, MenuItem } from '@mui/material';

const AdminSettingsPage: React.FC = () => {
  const [siteName, setSiteName] = useState('ReviewHub');
  const [currency, setCurrency] = useState('USD');
  const [maintenance, setMaintenance] = useState(false);
  const [allowRegistration, setAllowRegistration] = useState(true);

  const saveSettings = () => {
    // In real app, persist to Supabase table `settings`
    console.log({ siteName, currency, maintenance, allowRegistration });
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" gutterBottom>System Settings</Typography>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>General Information</Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
            <TextField label="Website name" value={siteName} onChange={(e) => setSiteName(e.target.value)} fullWidth />
            <Box>
              <Typography variant="body2" gutterBottom>Currency</Typography>
              <Select value={currency} onChange={(e) => setCurrency(e.target.value as string)} fullWidth>
                <MenuItem value="USD">USD</MenuItem>
                <MenuItem value="VND">VND</MenuItem>
                <MenuItem value="EUR">EUR</MenuItem>
              </Select>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Maintenance & Permissions</Typography>
          <FormControlLabel control={<Switch checked={maintenance} onChange={(e) => setMaintenance(e.target.checked)} />} label="Maintenance mode" />
                      <FormControlLabel control={<Switch checked={allowRegistration} onChange={(e) => setAllowRegistration(e.target.checked)} />} label="Allow user registration" />
        </CardContent>
      </Card>

              <Button variant="contained" onClick={saveSettings}>Save Settings</Button>
    </Box>
  );
};

export default AdminSettingsPage;


