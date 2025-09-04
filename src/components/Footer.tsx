import React from 'react';
import {
  Box,
  Container,
  Typography,
  Link
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import Logo from './Logo';

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
          <Logo variant="footer" />
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
            BestFinds
          </Typography>
          <Typography variant="body2" sx={{ color: '#666' }}>
            ©2025 BestFinds
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
