import React from 'react';
import { Box, Container, Typography, Link } from '@mui/material';

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) => theme.palette.grey[100],
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
          gap: 4 
        }}>
          <Box>
            <Typography variant="h6" color="text.primary" gutterBottom>
              ReviewHub
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Your trusted source for honest product reviews and recommendations.
            </Typography>
          </Box>
          <Box>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="#" color="inherit">About Us</Link>
              <Link href="#" color="inherit">Contact</Link>
              <Link href="#" color="inherit">Privacy Policy</Link>
            </Box>
          </Box>
          <Box>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Categories
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="#" color="inherit">Electronics</Link>
              <Link href="#" color="inherit">Fashion</Link>
              <Link href="#" color="inherit">Home & Garden</Link>
            </Box>
          </Box>
        </Box>
        <Box mt={3}>
          <Typography variant="body2" color="text.secondary" align="center">
            © 2024 ReviewHub. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
