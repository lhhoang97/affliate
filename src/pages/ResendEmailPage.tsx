import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Card,
  CardContent,
  Alert,
  Link,
  CircularProgress
} from '@mui/material';
import { Email, CheckCircle, ArrowBack } from '@mui/icons-material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';

const ResendEmailPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setMessage('Please enter your email address');
      setMessageType('error');
      return;
    }

    setIsLoading(true);
    setMessage('');
    setMessageType('');

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email
      });

      if (error) {
        console.error('Resend email error:', error);
        setMessage(error.message || 'Failed to resend confirmation email. Please try again.');
        setMessageType('error');
      } else {
        setMessage('Confirmation email sent successfully! Please check your inbox and spam folder.');
        setMessageType('success');
      }
    } catch (error) {
      console.error('Resend email error:', error);
      setMessage('An unexpected error occurred. Please try again.');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (message) {
      setMessage('');
      setMessageType('');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Resend Confirmation Email
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Enter your email address to receive a new confirmation link
        </Typography>
      </Box>

      <Card>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Email sx={{ fontSize: 60, color: 'primary.main' }} />
          </Box>

          {message && (
            <Alert 
              severity={messageType === 'success' ? 'success' : 'error'} 
              sx={{ mb: 3 }}
            >
              {message}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={email}
              onChange={handleChange}
              margin="normal"
              required
              disabled={isLoading}
              placeholder="Enter your email address"
              helperText="We'll send a new confirmation link to this email address"
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading || !email}
              sx={{ mt: 3, mb: 2 }}
              startIcon={isLoading ? <CircularProgress size={20} /> : <Email />}
            >
              {isLoading ? 'Sending...' : 'Send Confirmation Email'}
            </Button>
          </Box>

          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={() => navigate('/login')}
              sx={{ mr: 2 }}
            >
              Back to Login
            </Button>
            
            <Button
              variant="text"
              component={RouterLink}
              to="/register"
            >
              Create New Account
            </Button>
          </Box>

          <Box sx={{ mt: 4, pt: 3, borderTop: 1, borderColor: 'divider' }}>
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
              <strong>Didn't receive the email?</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 1 }}>
              • Check your spam/junk folder<br />
              • Make sure you entered the correct email address<br />
              • Wait a few minutes and try again<br />
              • Contact{' '}
              <Link component={RouterLink} to="/contact">
                support
              </Link>{' '}
              if the problem persists
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default ResendEmailPage;
