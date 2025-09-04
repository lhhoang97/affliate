import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Card,
  CardContent,
  Alert
} from '@mui/material';
import { 
  Home as HomeIcon, 
  Refresh as RefreshIcon,
  SupportAgent as SupportIcon,
  BugReport as BugReportIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const ServerErrorPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleContact = () => {
    navigate('/contact');
  };

  const handleReportBug = () => {
    // In production, this could open a bug report form or email
    window.open('mailto:support@bestfinds.com?subject=Bug Report - Server Error', '_blank');
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4
      }}
    >
      <Container maxWidth="md">
        <Card 
          sx={{ 
            textAlign: 'center',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            borderRadius: 4,
            overflow: 'hidden'
          }}
        >
          <CardContent sx={{ p: { xs: 4, md: 6 } }}>
            {/* 500 Animation */}
            <Box 
              sx={{ 
                fontSize: { xs: '8rem', md: '12rem' },
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #ff6b6b, #ee5a24)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                lineHeight: 1,
                mb: 2,
                animation: 'shake 1s infinite'
              }}
            >
              500
            </Box>
            
            <Typography 
              variant="h4" 
              component="h1" 
              sx={{ 
                fontWeight: 'bold',
                color: '#1a1a1a',
                mb: 2
              }}
            >
              Internal Server Error
            </Typography>
            
            <Typography 
              variant="h6" 
              color="text.secondary" 
              sx={{ 
                mb: 3,
                maxWidth: '500px',
                mx: 'auto'
              }}
            >
              We're experiencing technical difficulties. 
              Our team has been notified and is working to fix this issue.
            </Typography>

            {/* Status Alert */}
            <Alert 
              severity="warning" 
              sx={{ 
                mb: 4,
                textAlign: 'left',
                maxWidth: '500px',
                mx: 'auto'
              }}
            >
              <Typography variant="body2">
                <strong>What happened?</strong><br/>
                Something went wrong on our servers. This is usually temporary and should be resolved soon.
              </Typography>
            </Alert>

            {/* Action Buttons */}
            <Box 
              sx={{ 
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
                justifyContent: 'center',
                alignItems: 'center',
                mb: 4
              }}
            >
              <Button
                variant="contained"
                size="large"
                startIcon={<RefreshIcon />}
                onClick={handleRefresh}
                sx={{
                  background: 'linear-gradient(45deg, #ff6b6b, #ee5a24)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #ff5252, #e53935)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                  minWidth: '160px'
                }}
              >
                Try Again
              </Button>
              
              <Button
                variant="outlined"
                size="large"
                startIcon={<HomeIcon />}
                onClick={handleGoHome}
                sx={{
                  borderColor: '#ff6b6b',
                  color: '#ff6b6b',
                  '&:hover': {
                    borderColor: '#ff5252',
                    backgroundColor: 'rgba(255, 107, 107, 0.04)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                  minWidth: '160px'
                }}
              >
                Go Home
              </Button>
            </Box>

            {/* Help Section */}
            <Box sx={{ borderTop: '1px solid #e5e7eb', pt: 4 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Need immediate help?
              </Typography>
              
              <Box 
                sx={{ 
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: 2,
                  justifyContent: 'center'
                }}
              >
                <Button
                  variant="text"
                  size="large"
                  startIcon={<SupportIcon />}
                  onClick={handleContact}
                  sx={{
                    color: '#6b7280',
                    '&:hover': {
                      color: '#ff6b6b',
                      backgroundColor: 'rgba(255, 107, 107, 0.04)',
                    }
                  }}
                >
                  Contact Support
                </Button>
                
                <Button
                  variant="text"
                  size="large"
                  startIcon={<BugReportIcon />}
                  onClick={handleReportBug}
                  sx={{
                    color: '#6b7280',
                    '&:hover': {
                      color: '#ff6b6b',
                      backgroundColor: 'rgba(255, 107, 107, 0.04)',
                    }
                  }}
                >
                  Report Bug
                </Button>
              </Box>

              <Typography 
                variant="caption" 
                color="text.secondary" 
                sx={{ 
                  display: 'block',
                  mt: 3,
                  fontStyle: 'italic'
                }}
              >
                Error ID: {Date.now().toString(36)} • Time: {new Date().toLocaleString()}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>

      {/* CSS Animation */}
      <style>
        {`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
            20%, 40%, 60%, 80% { transform: translateX(2px); }
          }
        `}
      </style>
    </Box>
  );
};

export default ServerErrorPage;
