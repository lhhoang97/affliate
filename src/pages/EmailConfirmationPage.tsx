import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Alert,
  Button,
  CircularProgress,
  Link
} from '@mui/material';
import { CheckCircle, Error, Email, Refresh } from '@mui/icons-material';
import { useNavigate, useSearchParams, Link as RouterLink } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';

const EmailConfirmationPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'expired'>('loading');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        const token = searchParams.get('token');
        const type = searchParams.get('type');
        const emailParam = searchParams.get('email');

        if (emailParam) {
          setEmail(emailParam);
        }

        if (type === 'signup' && token) {
          // Handle email confirmation
          const { data, error } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: 'signup'
          });

          if (error) {
            console.error('Email confirmation error:', error);
            if (error.message.includes('expired')) {
              setStatus('expired');
              setMessage('Email confirmation link has expired. Please request a new one.');
            } else {
              setStatus('error');
              setMessage(error.message || 'Failed to confirm email. Please try again.');
            }
          } else {
            setStatus('success');
            setMessage('Email confirmed successfully! You can now log in to your account.');
          }
        } else {
          setStatus('error');
          setMessage('Invalid confirmation link. Please check your email and try again.');
        }
      } catch (error) {
        console.error('Email confirmation error:', error);
        setStatus('error');
        setMessage('An unexpected error occurred. Please try again.');
      }
    };

    handleEmailConfirmation();
  }, [searchParams]);

  const handleResendEmail = async () => {
    try {
      if (email) {
        const { error } = await supabase.auth.resend({
          type: 'signup',
          email: email
        });

        if (error) {
          console.error('Resend email error:', error);
          setMessage('Failed to resend email. Please try again.');
        } else {
          setMessage('Confirmation email sent! Please check your inbox.');
        }
      }
    } catch (error) {
      console.error('Resend email error:', error);
      setMessage('Failed to resend email. Please try again.');
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'success':
        return <CheckCircle sx={{ fontSize: 60, color: 'success.main' }} />;
      case 'error':
      case 'expired':
        return <Error sx={{ fontSize: 60, color: 'error.main' }} />;
      default:
        return <CircularProgress size={60} />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'success';
      case 'error':
      case 'expired':
        return 'error';
      default:
        return 'info';
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Email Confirmation
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {status === 'loading' && 'Confirming your email address...'}
          {status === 'success' && 'Your email has been confirmed!'}
          {status === 'error' && 'Email confirmation failed'}
          {status === 'expired' && 'Confirmation link expired'}
        </Typography>
      </Box>

      <Card>
        <CardContent sx={{ p: 4, textAlign: 'center' }}>
          <Box sx={{ mb: 3 }}>
            {getStatusIcon()}
          </Box>

          {status === 'loading' && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Please wait...
              </Typography>
              <Typography variant="body2" color="text.secondary">
                We're confirming your email address. This may take a few moments.
              </Typography>
            </Box>
          )}

          {status === 'success' && (
            <Box>
              <Typography variant="h6" gutterBottom color="success.main">
                Email Confirmed Successfully!
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Your email address has been verified. You can now log in to your account.
              </Typography>
              <Button
                variant="contained"
                fullWidth
                onClick={() => navigate('/login')}
                sx={{ mb: 2 }}
              >
                Go to Login
              </Button>
            </Box>
          )}

          {(status === 'error' || status === 'expired') && (
            <Box>
              <Typography variant="h6" gutterBottom color="error.main">
                {status === 'expired' ? 'Link Expired' : 'Confirmation Failed'}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {message}
              </Typography>
              
              {email && (
                <Box sx={{ mb: 3 }}>
                  <Button
                    variant="outlined"
                    startIcon={<Refresh />}
                    onClick={handleResendEmail}
                    sx={{ mb: 2 }}
                  >
                    Resend Confirmation Email
                  </Button>
                </Box>
              )}
              
              <Button
                variant="contained"
                fullWidth
                onClick={() => navigate('/register')}
                sx={{ mb: 1 }}
              >
                Back to Registration
              </Button>
              
              <Button
                variant="outlined"
                fullWidth
                onClick={() => navigate('/login')}
              >
                Go to Login
              </Button>
            </Box>
          )}

          {message && status !== 'loading' && (
            <Alert 
              severity={getStatusColor() as any} 
              sx={{ mt: 3, textAlign: 'left' }}
            >
              {message}
            </Alert>
          )}

          <Box sx={{ mt: 4, pt: 3, borderTop: 1, borderColor: 'divider' }}>
            <Typography variant="body2" color="text.secondary">
              Need help? Contact our{' '}
              <Link component={RouterLink} to="/contact">
                support team
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default EmailConfirmationPage;
