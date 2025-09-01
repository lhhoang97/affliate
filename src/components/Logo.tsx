import React from 'react';
import { Box, Typography } from '@mui/material';
import { ShoppingCart } from '@mui/icons-material';
import SmartLink from './SmartLink';

interface LogoProps {
  variant?: 'header' | 'footer' | 'mobile';
  onClick?: () => void;
}

const Logo: React.FC<LogoProps> = ({ variant = 'header', onClick }) => {
  const getIconSize = () => {
    switch (variant) {
      case 'mobile':
        return { width: 16, height: 16 }; // Smaller
      case 'footer':
        return { width: 20, height: 20 }; // Smaller
      default:
        return { width: 22, height: 22 }; // Much smaller for header
    }
  };

  const getTextSize = () => {
    switch (variant) {
      case 'mobile':
        return '13px'; // Smaller
      case 'footer':
        return '15px'; // Smaller
      default:
        return '16px'; // Much smaller for header
    }
  };

  const iconSize = getIconSize();
  const textSize = getTextSize();

  return (
    <SmartLink 
      to="/"
      onClick={onClick}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          cursor: 'pointer',
          '&:hover': {
            opacity: 0.8,
            transform: 'scale(1.05)',
            transition: 'all 0.2s ease-in-out'
          }
        }}
      >
      {/* Shopping Cart Icon */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 0.5,
          position: 'relative'
        }}
      >
        {/* Blue Shopping Cart */}
        <ShoppingCart
          sx={{
            ...iconSize,
            color: '#1976d2',
            transform: variant === 'header' ? 'scale(1.0)' : 'scale(1.2)', // No scaling for header
          }}
        />
        
        {/* Colorful items inside cart */}
        <Box
          sx={{
            position: 'absolute',
            top: '25%',
            left: '20%',
            width: 6,
            height: 8,
            backgroundColor: '#e91e63', // Pink/magenta
            borderRadius: '1px',
            transform: 'rotate(-15deg)'
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: '35%',
            left: '25%',
            width: 5,
            height: 6,
            backgroundColor: '#00bcd4', // Light blue/cyan
            borderRadius: '1px',
            transform: 'rotate(10deg)'
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: '45%',
            left: '30%',
            width: 4,
            height: 5,
            backgroundColor: '#ff9800', // Orange
            borderRadius: '1px',
            transform: 'rotate(-5deg)'
          }}
        />
      </Box>

      {/* Text "shopwithus" */}
      <Typography
        sx={{
          fontSize: textSize,
          fontWeight: variant === 'header' ? 600 : 'bold', // Lighter for header
          color: '#007bff',
          textTransform: 'lowercase',
          letterSpacing: variant === 'header' ? '0.3px' : '0.5px',
          lineHeight: variant === 'header' ? 0.9 : 1, // Tighter for header
          mt: variant === 'header' ? 0.2 : 0 // Minimal top margin for header
        }}
      >
        shopwithus
      </Typography>
    </Box>
    </SmartLink>
  );
};

export default Logo;
