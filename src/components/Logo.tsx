import React from 'react';
import { Box, Typography } from '@mui/material';
import { Campaign, WbSunny } from '@mui/icons-material';

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
      {/* Icons Container */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          mb: 0.5
        }}
      >
        {/* Red Megaphone with Yellow Tag */}
        <Box sx={{ position: 'relative' }}>
          <Campaign
            sx={{
              ...iconSize,
              color: '#e74c3c', // Red color
              transform: 'scaleX(-1)', // Flip horizontally to face right
            }}
          />
          {/* Yellow tag with dollar sign */}
          <Box
            sx={{
              position: 'absolute',
              bottom: -2,
              right: -2,
              width: 12,
              height: 12,
              backgroundColor: '#f39c12', // Yellow color
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid #fff',
              boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
            }}
          >
            <Typography
              sx={{
                fontSize: '8px',
                fontWeight: 'bold',
                color: '#fff',
                lineHeight: 1
              }}
            >
              $
            </Typography>
          </Box>
        </Box>

        {/* Yellow Sun */}
        <WbSunny
          sx={{
            ...iconSize,
            color: '#f39c12', // Yellow color
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
