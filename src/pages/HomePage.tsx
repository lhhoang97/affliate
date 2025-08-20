import React from 'react';
import {
  Container,
  Typography,
  Box
} from '@mui/material';

const HomePage: React.FC = () => {
  return (
    <Box sx={{ backgroundColor: '#ffffff', minHeight: 'calc(100vh - 120px)' }}>
      <Container maxWidth="lg" sx={{ 
        py: 8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 200px)'
      }}>
        {/* Simple centered content matching staging.giatotday.vn */}
        <Box sx={{ 
          textAlign: 'center',
          maxWidth: 600,
          mx: 'auto'
        }}>
          <Box sx={{ 
            position: 'relative',
            width: 48,
            height: 48,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 3
          }}>
            <Box sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: 24,
              height: 24,
              backgroundColor: '#ff4444',
              borderRadius: '50% 50% 0 50%',
              transform: 'rotate(-45deg)'
            }} />
            <Box sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: 18,
              height: 18,
              backgroundColor: '#ffaa00',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              color: '#333'
            }}>
              ☀
            </Box>
          </Box>
          
          <Typography variant="h2" component="h1" gutterBottom sx={{ 
            fontWeight: 'bold',
            color: '#007bff',
            mb: 4,
            fontSize: { xs: '2rem', md: '3rem' },
            textTransform: 'lowercase'
          }}>
            giatotday
          </Typography>
          
          <Typography variant="h6" color="text.secondary" sx={{ 
            mb: 6,
            lineHeight: 1.6,
            fontSize: { xs: '1rem', md: '1.25rem' }
          }}>
            Chào mừng bạn đến với GiaTotDay
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage;