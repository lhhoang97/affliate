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
        return { width: 20, height: 20 }; // Larger for mobile visibility
      case 'footer':
        return { width: 20, height: 20 }; // Smaller
      default:
        return { width: 22, height: 22 }; // Much smaller for header
    }
  };

  const getTextSize = () => {
    switch (variant) {
      case 'mobile':
        return '14px'; // Slightly larger for mobile readability
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
        {/* White Shopping Cart with shadow */}
        <ShoppingCart
          sx={{
            ...iconSize,
            color: '#ffffff',
            filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))',
            transform: variant === 'header' ? 'scale(1.0)' : 'scale(1.2)', // No scaling for header
          }}
        />
        
        {/* Colorful items inside cart - responsive sizing */}
        <Box
          sx={{
            position: 'absolute',
            top: '20%',
            left: '18%',
            width: variant === 'mobile' ? 6 : 8,
            height: variant === 'mobile' ? 8 : 10,
            backgroundColor: '#ff4081', // Brighter pink
            borderRadius: variant === 'mobile' ? '1px' : '2px',
            transform: 'rotate(-15deg)',
            boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
            border: '0.5px solid rgba(255,255,255,0.3)'
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: '30%',
            left: '22%',
            width: variant === 'mobile' ? 5 : 7,
            height: variant === 'mobile' ? 6 : 8,
            backgroundColor: '#00e5ff', // Brighter cyan
            borderRadius: variant === 'mobile' ? '1px' : '2px',
            transform: 'rotate(10deg)',
            boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
            border: '0.5px solid rgba(255,255,255,0.3)'
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: '40%',
            left: '26%',
            width: variant === 'mobile' ? 4 : 6,
            height: variant === 'mobile' ? 5 : 7,
            backgroundColor: '#ffab40', // Brighter orange
            borderRadius: variant === 'mobile' ? '1px' : '2px',
            transform: 'rotate(-5deg)',
            boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
            border: '0.5px solid rgba(255,255,255,0.3)'
          }}
        />
      </Box>

      {/* Text "BestFinds" */}
      <Typography
        sx={{
          fontSize: textSize,
          fontWeight: variant === 'header' ? 700 : 'bold', // Bolder for better visibility
          color: '#ffffff',
          textTransform: 'none', // Keep original case
          letterSpacing: variant === 'header' ? '0.5px' : '0.5px', // Slightly more spacing
          lineHeight: variant === 'header' ? 0.9 : 1, // Tighter for header
          mt: variant === 'header' ? 0.2 : 0, // Minimal top margin for header
          textShadow: '0 1px 2px rgba(0,0,0,0.3)', // Add text shadow for better contrast
          filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.2))' // Additional shadow effect
        }}
      >
        BestFinds
      </Typography>
    </Box>
    </SmartLink>
  );
};

export default Logo;
