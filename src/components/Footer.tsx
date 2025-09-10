import React from 'react';
import {
  Box,
  Container,
  Typography,
  Link,
  Button,
  Grid,
  Divider
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import {
  Email,
  LocationOn,
  Phone,
  KeyboardArrowUp
} from '@mui/icons-material';

const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Box sx={{ 
      backgroundColor: '#2c2c2c', 
      color: '#ffffff',
      mt: 'auto'
    }}>
      <Container maxWidth="lg" sx={{ py: 3 }}>
        {/* Main Footer Content - 3 Column Layout */}
        <Grid container spacing={3} sx={{ mb: 2 }}>
          {/* Left Column - Order & Help */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ 
              fontWeight: 700, 
              mb: 2, 
              color: '#ffffff',
              fontSize: '1rem'
            }}>
              Order
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2.5 }}>
              <Link
                component={RouterLink}
                to="/orders"
                sx={{
                  color: '#ffffff',
                  textDecoration: 'none',
                  fontSize: '0.95rem',
                  '&:hover': { color: '#ffffff', textDecoration: 'underline' }
                }}
              >
                Track My Order
              </Link>
              <Link
                component={RouterLink}
                to="/contact"
                sx={{
                  color: '#ffffff',
                  textDecoration: 'none',
                  fontSize: '0.95rem',
                  '&:hover': { color: '#ffffff', textDecoration: 'underline' }
                }}
              >
                Return & Refund Policy
              </Link>
              <Link
                component={RouterLink}
                to="/contact"
                sx={{
                  color: '#ffffff',
                  textDecoration: 'none',
                  fontSize: '0.95rem',
                  '&:hover': { color: '#ffffff', textDecoration: 'underline' }
                }}
              >
                Shipping Policy
              </Link>
            </Box>

            <Typography variant="h6" sx={{ 
              fontWeight: 600, 
              mb: 1.5, 
              color: '#ffffff',
              fontSize: '0.95rem'
            }}>
              How can we help you?
            </Typography>
            
            <Button
              component={RouterLink}
              to="/contact"
              variant="contained"
              sx={{
                backgroundColor: '#dc2626',
                color: '#ffffff',
                fontWeight: 600,
                px: 2.5,
                py: 1,
                borderRadius: 1.5,
                textTransform: 'none',
                fontSize: '0.9rem',
                '&:hover': {
                  backgroundColor: '#b91c1c'
                }
              }}
            >
              Contact Us
            </Button>
          </Grid>

          {/* Middle Column - Resources */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ 
              fontWeight: 700, 
              mb: 2, 
              color: '#ffffff',
              fontSize: '1rem'
            }}>
              Resources
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link
                component={RouterLink}
                to="/faq"
                sx={{
                  color: '#ffffff',
                  textDecoration: 'none',
                  fontSize: '0.95rem',
                  '&:hover': { color: '#ffffff', textDecoration: 'underline' }
                }}
              >
                FAQs
              </Link>
              <Link
                component={RouterLink}
                to="/payment"
                sx={{
                  color: '#ffffff',
                  textDecoration: 'none',
                  fontSize: '0.95rem',
                  '&:hover': { color: '#ffffff', textDecoration: 'underline' }
                }}
              >
                Payment Methods
              </Link>
              <Link
                component={RouterLink}
                to="/privacy"
                sx={{
                  color: '#ffffff',
                  textDecoration: 'none',
                  fontSize: '0.95rem',
                  '&:hover': { color: '#ffffff', textDecoration: 'underline' }
                }}
              >
                Privacy Policy
              </Link>
              <Link
                component={RouterLink}
                to="/terms"
                sx={{
                  color: '#ffffff',
                  textDecoration: 'none',
                  fontSize: '0.95rem',
                  '&:hover': { color: '#ffffff', textDecoration: 'underline' }
                }}
              >
                Terms of Service
              </Link>
            </Box>
          </Grid>

          {/* Right Column - Company Info */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ 
              fontWeight: 700, 
              mb: 2, 
              color: '#ffffff',
              fontSize: '1.1rem'
            }}>
              Your Company Store
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Email sx={{ color: '#ffffff', fontSize: '1rem' }} />
                <Typography variant="body2" sx={{ color: '#ffffff', fontSize: '0.9rem' }}>
                  support@yourcompany.com
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOn sx={{ color: '#ffffff', fontSize: '1rem' }} />
                <Typography variant="body2" sx={{ color: '#ffffff', fontSize: '0.9rem' }}>
                  123 Your Street, Your City, Your Country
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Phone sx={{ color: '#ffffff', fontSize: '1rem' }} />
                <Typography variant="body2" sx={{ color: '#ffffff', fontSize: '0.9rem' }}>
                  +84 123 456 789
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Bottom Section */}
        <Divider sx={{ backgroundColor: '#555555', mb: 2 }} />
        
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 1.5
        }}>
          {/* Copyright */}
          <Typography variant="body2" sx={{ color: '#cccccc', fontSize: '0.85rem' }}>
            © 2025 Your Company Store. All rights reserved.
          </Typography>
          
          {/* Go to top */}
          <Button
            onClick={scrollToTop}
            sx={{
              color: '#ffffff',
              textDecoration: 'none',
              fontSize: '0.85rem',
              textTransform: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              minWidth: 'auto',
              px: 1,
              py: 0.5,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            Go to top
            <KeyboardArrowUp sx={{ fontSize: '1rem' }} />
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
