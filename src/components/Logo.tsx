import React from 'react';
import { Box, Typography } from '@mui/material';
import { ShoppingCart } from '@mui/icons-material';

interface LogoProps {
  variant?: 'header' | 'footer' | 'mobile';
  onClick?: () => void;
}

const Logo: React.FC<LogoProps> = ({ variant = 'header', onClick }) => {
  const getIconSize = () => {
    switch (variant) {
      case 'mobile':
        return { width: 20, height: 20 };
      case 'footer':
        return { width: 24, height: 24 };
      default:
        return { width: 28, height: 28 };
    }
  };

  const getTextSize = () => {
    switch (variant) {
      case 'mobile':
        return '16px';
      case 'footer':
        return '18px';
      default:
        return '20px';
    }
  };

  const iconSize = getIconSize();
  const textSize = getTextSize();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: onClick ? 'pointer' : 'default',
        '&:hover': onClick ? {
          opacity: 0.8,
          transform: 'scale(1.05)',
          transition: 'all 0.2s ease-in-out'
        } : {}
      }}
      onClick={onClick}
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
            color: '#1976d2', // Blue color
            transform: 'scale(1.2)', // Make it slightly larger
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
          fontWeight: 'bold',
          color: '#007bff', // Light blue color
          textTransform: 'lowercase',
          letterSpacing: '0.5px',
          lineHeight: 1
        }}
      >
        shopwithus
      </Typography>
    </Box>
  );
};

export default Logo;
