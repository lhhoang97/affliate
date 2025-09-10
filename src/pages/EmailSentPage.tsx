import React from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Link
} from '@mui/material';
import { Email, CheckCircle, Refresh } from '@mui/icons-material';
import { useNavigate, Link as RouterLink, useLocation } from 'react-router-dom';

const EmailSentPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get email from location state or default message
  const email = location.state?.email || 'your email address';

  const handleResendEmail = () => {
    navigate('/resend-email', { state: { email } });
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Check Your Email
        </Typography>
        <Typography variant="body1" color="text.secondary">
          We've sent a confirmation link to your email address
        </Typography>
      </Box>

      <Card>
        <CardContent sx={{ p: 4, textAlign: 'center' }}>
          <Box sx={{ mb: 3 }}>
            <Email sx={{ fontSize: 80, color: 'primary.main' }} />
          </Box>

          <Typography variant="h5" gutterBottom color="primary.main">
            Email Sent Successfully!
          </Typography>
          
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            We've sent a confirmation link to <strong>{email}</strong>
          </Typography>

          <Box sx={{ 
            backgroundColor: 'grey.50', 
            p: 3, 
            borderRadius: 2, 
            mb: 4,
            textAlign: 'left'
          }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <CheckCircle sx={{ mr: 1, color: 'success.main' }} />
              Next Steps:
            </Typography>
            <Typography variant="body2" color="text.secondary" component="div">
              1. Check your email inbox<br />
              2. Look for an email from BestFinds<br />
              3. Click the confirmation link in the email<br />
              4. Return here to log in to your account
            </Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={handleResendEmail}
              sx={{ mr: 2 }}
            >
              Resend Email
            </Button>
            
            <Button
              variant="contained"
              onClick={() => navigate('/login')}
            >
              Go to Login
            </Button>
          </Box>

          <Box sx={{ 
            backgroundColor: 'warning.light', 
            p: 2, 
            borderRadius: 1,
            mb: 3
          }}>
            <Typography variant="body2" color="warning.contrastText">
              <strong>Can't find the email?</strong><br />
              Check your spam/junk folder or try resending the confirmation email.
            </Typography>
          </Box>

          <Box sx={{ pt: 3, borderTop: 1, borderColor: 'divider' }}>
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

export default EmailSentPage;
