import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Divider
} from '@mui/material';
import { PersonAdd, Login, Business } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface CollaboratorAuthProps {
  open: boolean;
  onClose: () => void;
}

const CollaboratorAuth: React.FC<CollaboratorAuthProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    company: '',
    phone: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle collaborator registration/login
    console.log('Collaborator auth:', { mode, formData });
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Business sx={{ color: 'primary.main' }} />
          <Typography variant="h6">
            {mode === 'login' ? 'Collaborator Login' : 'Become a Collaborator'}
          </Typography>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>Collaborator Program:</strong> Join our network of partners to earn commissions 
            by promoting our products. Get access to exclusive tools, analytics, and support.
          </Typography>
        </Alert>

        <Box component="form" onSubmit={handleSubmit}>
          {mode === 'register' && (
            <>
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Company Name"
                name="company"
                value={formData.company}
                onChange={handleChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                margin="normal"
              />
            </>
          )}
          
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
          />
          
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            required
          />

          {mode === 'register' && (
            <Alert severity="success" sx={{ mt: 2 }}>
              <Typography variant="body2">
                <strong>Benefits:</strong>
                <br />• Earn 5-15% commission on sales
                <br />• Access to exclusive products
                <br />• Marketing materials & support
                <br />• Real-time analytics dashboard
              </Typography>
            </Alert>
          )}
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button onClick={onClose}>
          Cancel
        </Button>
        
        <Button
          onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
          variant="outlined"
        >
          {mode === 'login' ? 'Need an account?' : 'Already have an account?'}
        </Button>
        
        <Button
          onClick={handleSubmit}
          variant="contained"
          startIcon={mode === 'login' ? <Login /> : <PersonAdd />}
        >
          {mode === 'login' ? 'Login' : 'Register'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CollaboratorAuth;
