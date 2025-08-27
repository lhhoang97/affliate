import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Card,
  CardContent
} from '@mui/material';
import { 
  Home as HomeIcon, 
  Search as SearchIcon,
  ArrowBack as ArrowBackIcon 
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleSearch = () => {
    navigate('/search');
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
            {/* 404 Animation */}
            <Box 
              sx={{ 
                fontSize: { xs: '8rem', md: '12rem' },
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                lineHeight: 1,
                mb: 2,
                animation: 'pulse 2s infinite'
              }}
            >
              404
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
              Oops! Page Not Found
            </Typography>
            
            <Typography 
              variant="h6" 
              color="text.secondary" 
              sx={{ 
                mb: 4,
                maxWidth: '500px',
                mx: 'auto'
              }}
            >
              The page you're looking for doesn't exist. 
              It might have been moved, deleted, or you entered the wrong URL.
            </Typography>

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
                startIcon={<HomeIcon />}
                onClick={handleGoHome}
                sx={{
                  background: 'linear-gradient(45deg, #667eea, #764ba2)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #5a6fd8, #6a4190)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                  minWidth: '160px'
                }}
              >
                Go Home
              </Button>
              
              <Button
                variant="outlined"
                size="large"
                startIcon={<ArrowBackIcon />}
                onClick={handleGoBack}
                sx={{
                  borderColor: '#667eea',
                  color: '#667eea',
                  '&:hover': {
                    borderColor: '#5a6fd8',
                    backgroundColor: 'rgba(102, 126, 234, 0.04)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                  minWidth: '160px'
                }}
              >
                Go Back
              </Button>
              
              <Button
                variant="text"
                size="large"
                startIcon={<SearchIcon />}
                onClick={handleSearch}
                sx={{
                  color: '#667eea',
                  '&:hover': {
                    backgroundColor: 'rgba(102, 126, 234, 0.04)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                  minWidth: '160px'
                }}
              >
                Search Products
              </Button>
            </Box>

            {/* Helpful Links */}
            <Box sx={{ borderTop: '1px solid #e5e7eb', pt: 4 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Popular pages:
              </Typography>
              <Box 
                sx={{ 
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 2,
                  justifyContent: 'center'
                }}
              >
                {[
                  { label: 'Hot Deals', path: '/deals' },
                  { label: 'Categories', path: '/categories' },
                  { label: 'Products', path: '/products' },
                  { label: 'About Us', path: '/about' }
                ].map((link) => (
                  <Button
                    key={link.path}
                    variant="text"
                    size="small"
                    onClick={() => navigate(link.path)}
                    sx={{
                      color: '#6b7280',
                      '&:hover': {
                        color: '#667eea',
                        backgroundColor: 'rgba(102, 126, 234, 0.04)',
                      }
                    }}
                  >
                    {link.label}
                  </Button>
                ))}
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Container>

      {/* CSS Animation */}
      <style>
        {`
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
        `}
      </style>
    </Box>
  );
};

export default NotFoundPage;
