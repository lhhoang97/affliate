import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  IconButton
} from '@mui/material';
import {
  ArrowForward,
  TrendingUp,
  NewReleases,
  Star
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Category } from '../types';
import SmartLink from './SmartLink';

interface CategoryCardProps {
  category: Category;
  variant?: 'default' | 'featured' | 'new';
  showProductCount?: boolean;
  showIcon?: boolean;
  showLetter?: boolean;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  variant = 'default',
  showProductCount = true,
  showIcon = true,
  showLetter = false
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/category/${category.slug}`);
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'featured':
        return {
          border: '2px solid #3b82f6',
          boxShadow: '0 8px 25px rgba(59, 130, 246, 0.15)',
          '&:hover': {
            boxShadow: '0 12px 35px rgba(59, 130, 246, 0.25)',
            transform: 'translateY(-4px)'
          }
        };
      case 'new':
        return {
          border: '2px solid #10b981',
          boxShadow: '0 8px 25px rgba(16, 185, 129, 0.15)',
          '&:hover': {
            boxShadow: '0 12px 35px rgba(16, 185, 129, 0.25)',
            transform: 'translateY(-4px)'
          }
        };
      default:
        return {
          border: '1px solid #e5e7eb',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
          '&:hover': {
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
            transform: 'translateY(-2px)'
          }
        };
    }
  };

  const getVariantBadge = () => {
    switch (variant) {
      case 'featured':
        return (
          <Chip
            icon={<TrendingUp />}
            label="Featured"
            size="small"
            color="primary"
            sx={{
              position: 'absolute',
              top: 12,
              left: 12,
              zIndex: 2,
              fontWeight: 600,
              backgroundColor: '#3b82f6',
              color: 'white'
            }}
          />
        );
      case 'new':
        return (
          <Chip
            icon={<NewReleases />}
            label="New"
            size="small"
            color="success"
            sx={{
              position: 'absolute',
              top: 12,
              left: 12,
              zIndex: 2,
              fontWeight: 600,
              backgroundColor: '#10b981',
              color: 'white'
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SmartLink 
      to={`/category/${category.slug}`}
      onClick={handleClick}
    >
      <Card
        sx={{
          cursor: 'pointer',
          transition: 'all 0.3s ease-in-out',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
          ...getVariantStyles()
        }}
      >
      {/* Variant Badge */}
      {getVariantBadge()}

      {/* Category Image */}
      <Box sx={{ position: 'relative', height: 200 }}>
        <CardMedia
          component="img"
          image={category.image}
          alt={category.name}
          sx={{
            height: '100%',
            objectFit: 'contain', // Giữ aspect ratio cho category images
            backgroundColor: '#f9fafb', // Background cho empty space
            transition: 'transform 0.3s ease-in-out',
            '&:hover': {
              transform: 'scale(1.05)'
            }
          }}
        />
        
        {/* Overlay with icon/letter */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.8) 0%, rgba(16, 185, 129, 0.8) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0,
            transition: 'opacity 0.3s ease-in-out',
            '&:hover': {
              opacity: 1
            }
          }}
        >
          {showIcon && category.icon && (
            <Typography
              variant="h1"
              sx={{
                fontSize: '4rem',
                color: 'white',
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
              }}
            >
              {category.icon}
            </Typography>
          )}
          {showLetter && category.letter && (
            <Typography
              variant="h1"
              sx={{
                fontSize: '4rem',
                fontWeight: 700,
                color: 'white',
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
              }}
            >
              {category.letter}
            </Typography>
          )}
        </Box>
      </Box>

      {/* Category Content */}
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
          <Typography
            variant="h5"
            component="h3"
            sx={{
              fontWeight: 700,
              color: '#1f2937',
              lineHeight: 1.3,
              flex: 1
            }}
          >
            {category.name}
          </Typography>
          <IconButton
            size="small"
            sx={{
              color: '#6b7280',
              '&:hover': {
                color: '#3b82f6',
                transform: 'translateX(2px)'
              },
              transition: 'all 0.2s ease-in-out'
            }}
          >
            <ArrowForward fontSize="small" />
          </IconButton>
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            lineHeight: 1.5,
            color: '#6b7280'
          }}
        >
          {category.description}
        </Typography>

        {/* Product Count and Rating */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {showProductCount && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: '#3b82f6'
                }}
              >
                {category.productCount.toLocaleString()} products
              </Typography>
            </Box>
          )}
          
          {/* Rating indicator for featured categories */}
          {variant === 'featured' && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Star sx={{ fontSize: '1rem', color: '#fbbf24' }} />
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#fbbf24' }}>
                4.8
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
    </SmartLink>
  );
};

export default CategoryCard;
