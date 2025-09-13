import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  Box,
  Alert,
  TextField,
  Divider,
  Chip,
  Stack
} from '@mui/material';
import {
  Email,
  Send,
  CheckCircle,
  Error,
  Info
} from '@mui/icons-material';
import { EmailService } from '../services/emailService';

const EmailTestPanel: React.FC = () => {
  const [testEmail, setTestEmail] = useState('');
  const [testName, setTestName] = useState('Test User');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Array<{
    type: 'welcome' | 'order' | 'password' | 'price' | 'deal';
    success: boolean;
    message: string;
  }>>([]);

  const handleSendTestEmails = async () => {
    if (!testEmail.trim()) {
      alert('Vui lòng nhập email để test');
      return;
    }

    setLoading(true);
    setResults([]);
    
    const testResults: Array<{ type: any; success: boolean; message: string }> = [];

    try {
      // Test Welcome Email
      try {
        await EmailService.sendWelcomeEmail(testEmail, testName);
        testResults.push({
          type: 'welcome',
          success: true,
          message: 'Welcome email sent successfully'
        });
      } catch (error) {
        testResults.push({
          type: 'welcome',
          success: false,
          message: `Welcome email failed: ${error}`
        });
      }

      // Test Order Confirmation Email
      try {
        await EmailService.sendOrderConfirmationEmail(
          testEmail,
          testName,
          'TEST-ORDER-123',
          [
            { name: 'Test Product 1', quantity: 2, price: 29.99 },
            { name: 'Test Product 2', quantity: 1, price: 49.99 }
          ],
          109.97,
          '123 Test Street, Test City, 12345'
        );
        testResults.push({
          type: 'order',
          success: true,
          message: 'Order confirmation email sent successfully'
        });
      } catch (error) {
        testResults.push({
          type: 'order',
          success: false,
          message: `Order confirmation email failed: ${error}`
        });
      }

      // Test Password Reset Email
      try {
        await EmailService.sendPasswordResetEmail(
          testEmail,
          testName,
          `${window.location.origin}/reset-password?token=test_token`,
          new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleString('vi-VN')
        );
        testResults.push({
          type: 'password',
          success: true,
          message: 'Password reset email sent successfully'
        });
      } catch (error) {
        testResults.push({
          type: 'password',
          success: false,
          message: `Password reset email failed: ${error}`
        });
      }

      // Test Price Alert Email
      try {
        await EmailService.sendPriceAlertEmail(
          testEmail,
          testName,
          'Test Product - Amazing Deal',
          99.99,
          79.99,
          `${window.location.origin}/product/test-product`
        );
        testResults.push({
          type: 'price',
          success: true,
          message: 'Price alert email sent successfully'
        });
      } catch (error) {
        testResults.push({
          type: 'price',
          success: false,
          message: `Price alert email failed: ${error}`
        });
      }

      // Test New Deal Email
      try {
        await EmailService.sendNewDealEmail(
          testEmail,
          testName,
          '🔥 Mega Sale - Up to 50% Off Everything!',
          'Limited time offer on all electronics and gadgets. Don\'t miss out on these amazing deals!',
          `${window.location.origin}/deals/mega-sale`,
          50,
          new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleString('vi-VN')
        );
        testResults.push({
          type: 'deal',
          success: true,
          message: 'New deal email sent successfully'
        });
      } catch (error) {
        testResults.push({
          type: 'deal',
          success: false,
          message: `New deal email failed: ${error}`
        });
      }

      setResults(testResults);
    } catch (error) {
      console.error('Test failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEmailTypeLabel = (type: string) => {
    const labels = {
      welcome: 'Welcome Email',
      order: 'Order Confirmation',
      password: 'Password Reset',
      price: 'Price Alert',
      deal: 'New Deal'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getEmailTypeIcon = (type: string) => {
    const icons = {
      welcome: '🎉',
      order: '📦',
      password: '🔐',
      price: '💰',
      deal: '🔥'
    };
    return icons[type as keyof typeof icons] || '📧';
  };

  const successCount = results.filter(r => r.success).length;
  const totalCount = results.length;

  return (
    <Card>
      <CardHeader
        title={
          <Box display="flex" alignItems="center" gap={2}>
            <Email color="primary" />
            <Typography variant="h6">Email Test Panel</Typography>
            {results.length > 0 && (
              <Chip 
                label={`${successCount}/${totalCount} successful`}
                color={successCount === totalCount ? 'success' : successCount > 0 ? 'warning' : 'error'}
                size="small"
              />
            )}
          </Box>
        }
        subheader="Test all email notification templates"
      />
      
      <CardContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            This panel allows you to test all email notification templates. 
            Enter a test email address to send sample emails.
          </Typography>
          
          <Stack spacing={2}>
            <TextField
              label="Test Email Address"
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder="test@example.com"
              fullWidth
              size="small"
            />
            <TextField
              label="Test User Name"
              value={testName}
              onChange={(e) => setTestName(e.target.value)}
              placeholder="Test User"
              fullWidth
              size="small"
            />
          </Stack>
        </Box>

        <Button
          variant="contained"
          startIcon={<Send />}
          onClick={handleSendTestEmails}
          disabled={loading || !testEmail.trim()}
          fullWidth
          sx={{ mb: 3 }}
        >
          {loading ? 'Sending Test Emails...' : 'Send All Test Emails'}
        </Button>

        {results.length > 0 && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" sx={{ mb: 2 }}>
              Test Results
            </Typography>
            
            <Stack spacing={2}>
              {results.map((result, index) => (
                <Alert
                  key={index}
                  severity={result.success ? 'success' : 'error'}
                  icon={result.success ? <CheckCircle /> : <Error />}
                  sx={{ 
                    '& .MuiAlert-message': {
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <span>{getEmailTypeIcon(result.type)}</span>
                    <Typography variant="body2" fontWeight="medium">
                      {getEmailTypeLabel(result.type)}
                    </Typography>
                  </Box>
                  <Typography variant="body2">
                    {result.message}
                  </Typography>
                </Alert>
              ))}
            </Stack>
          </>
        )}

        <Box sx={{ mt: 3, p: 2, bgcolor: 'info.50', borderRadius: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Info color="info" />
            <Typography variant="body2" fontWeight="medium">
              Note
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            This is a test environment. Emails are logged to the console and database 
            but not actually sent. In production, emails would be delivered via your 
            configured email service (SendGrid, AWS SES, etc.).
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default EmailTestPanel;
