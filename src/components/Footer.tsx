import React from 'react';
import {
  Box,
  Container,
  Typography,
  Link
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <Box sx={{ 
      backgroundColor: '#ffffff', 
      borderTop: '1px solid #e9ecef',
      mt: 'auto'
    }}>
      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Logo */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box sx={{ 
            position: 'relative',
            width: 32,
            height: 32,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2
          }}>
            <Box sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: 16,
              height: 16,
              backgroundColor: '#ff4444',
              borderRadius: '50% 50% 0 50%',
              transform: 'rotate(-45deg)'
            }} />
            <Box sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: 12,
              height: 12,
              backgroundColor: '#ffaa00',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '8px',
              color: '#333'
            }}>
              ☀
            </Box>
          </Box>
          <Typography variant="h6" sx={{ 
            fontWeight: 'bold', 
            color: '#007bff',
            textTransform: 'lowercase'
          }}>
            ShopWithUs
          </Typography>
        </Box>

        {/* Footer Links */}
        <Box sx={{ 
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'center',
          gap: { xs: 3, md: 6 },
          mb: 4
        }}>
          {/* Information */}
          <Box sx={{ textAlign: { xs: 'left', md: 'center' } }}>
            <Typography variant="subtitle2" gutterBottom sx={{ 
              fontWeight: 'bold', 
              color: '#333',
              mb: 2
            }}>
              Information
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link
                component={RouterLink}
                to="/about"
                sx={{
                  color: '#666',
                  textDecoration: 'none',
                  fontSize: '14px',
                  '&:hover': {
                    color: '#007bff'
                  }
                }}
              >
                About Us
              </Link>
              <Link
                component={RouterLink}
                to="/contact"
                sx={{
                  color: '#666',
                  textDecoration: 'none',
                  fontSize: '14px',
                  '&:hover': {
                    color: '#007bff'
                  }
                }}
              >
                Contact
              </Link>
              <Link
                component={RouterLink}
                to="/help"
                sx={{
                  color: '#666',
                  textDecoration: 'none',
                  fontSize: '14px',
                  '&:hover': {
                    color: '#007bff'
                  }
                }}
              >
                Help Center
              </Link>
            </Box>
          </Box>

          {/* Terms & Guidelines */}
          <Box sx={{ textAlign: { xs: 'left', md: 'center' } }}>
            <Typography variant="subtitle2" gutterBottom sx={{ 
              fontWeight: 'bold', 
              color: '#333',
              mb: 2
            }}>
              Terms & Guidelines
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link
                component={RouterLink}
                to="/terms"
                sx={{
                  color: '#666',
                  textDecoration: 'none',
                  fontSize: '14px',
                  '&:hover': {
                    color: '#007bff'
                  }
                }}
              >
                Terms & Conditions
              </Link>
              <Link
                component={RouterLink}
                to="/terms"
                sx={{
                  color: '#666',
                  textDecoration: 'none',
                  fontSize: '14px',
                  '&:hover': {
                    color: '#007bff'
                  }
                }}
              >
                Terms of Service
              </Link>
              <Link
                component={RouterLink}
                to="/privacy"
                sx={{
                  color: '#666',
                  textDecoration: 'none',
                  fontSize: '14px',
                  '&:hover': {
                    color: '#007bff'
                  }
                }}
              >
                Privacy Policy
              </Link>
              <Link
                component={RouterLink}
                to="/cookies"
                sx={{
                  color: '#666',
                  textDecoration: 'none',
                  fontSize: '14px',
                  '&:hover': {
                    color: '#007bff'
                  }
                }}
              >
                Cookie Policy
              </Link>
              <Link
                component={RouterLink}
                to="/security"
                sx={{
                  color: '#666',
                  textDecoration: 'none',
                  fontSize: '14px',
                  '&:hover': {
                    color: '#007bff'
                  }
                }}
              >
                Security Settings
              </Link>
            </Box>
          </Box>
        </Box>

        {/* Bottom */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" sx={{ 
            fontWeight: 'bold', 
            color: '#007bff',
            mb: 1,
            textTransform: 'lowercase'
          }}>
            ShopWithUs
          </Typography>
          <Typography variant="body2" sx={{ color: '#666' }}>
            ©2025 ShopWithUs
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
