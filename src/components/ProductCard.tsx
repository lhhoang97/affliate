import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  IconButton,
  Avatar,
  Button
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  Share,
  ChatBubbleOutline,
  Fullscreen,
  Person
} from '@mui/icons-material';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    originalPrice: number;
    image: string;
    retailer: string;
    color?: string;
    likes?: number;
    comments?: number;
    isForYou?: boolean;
    foundBy?: {
      name: string;
      avatar?: string;
      time: string;
    };
  };
  onLike?: (productId: string) => void;
  onShare?: (productId: string) => void;
  onComment?: (productId: string) => void;
  onView?: (productId: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onLike,
  onShare,
  onComment,
  onView
}) => {
  const [isLiked, setIsLiked] = React.useState(false);
  
  // Debug log to check product data
  console.log('ProductCard - Product data:', {
    id: product.id,
    name: product.name,
    price: product.price,
    originalPrice: product.originalPrice,
    retailer: product.retailer,
    hasRetailer: !!product.retailer,
    retailerType: typeof product.retailer
  });
  
  const discountPercentage = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike?.(product.id);
  };

  const handleShare = () => {
    onShare?.(product.id);
  };

  const handleComment = () => {
    onComment?.(product.id);
  };

  const handleView = () => {
    onView?.(product.id);
  };

  return (
    <Card 
      sx={{ 
        maxWidth: { xs: '100%', sm: 400 },
        minWidth: { xs: 280, sm: 320 },
        borderRadius: 2,
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
        }
      }}
    >
      {/* User who found the deal */}
      {product.foundBy && (
        <Box sx={{ p: 2, pb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar 
            sx={{ width: 24, height: 24, fontSize: '0.75rem' }}
            src={product.foundBy.avatar}
          >
            {product.foundBy.avatar ? null : <Person sx={{ fontSize: '0.75rem' }} />}
          </Avatar>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
            Found by {product.foundBy.name}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto', fontSize: '0.75rem' }}>
            {product.foundBy.time}
          </Typography>
        </Box>
      )}

      {/* Product Image */}
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="200"
          image={product.image}
          alt={product.name}
          sx={{ 
            objectFit: 'cover',
            height: { xs: 180, sm: 200 }
          }}
        />
        
        {/* For You Badge */}
        {product.isForYou && (
          <Chip
            label="For You"
            size="small"
            sx={{
              position: 'absolute',
              top: 8,
              left: 8,
              backgroundColor: 'rgba(139, 92, 246, 0.9)',
              color: 'white',
              fontSize: { xs: '0.65rem', sm: '0.7rem' },
              fontWeight: 600,
              height: { xs: 20, sm: 24 }
            }}
          />
        )}

        {/* Retailer Badge */}
        <Chip
          label={product.retailer || 'ShopWithUs'}
          size="small"
          sx={{
            position: 'absolute',
            top: 8,
            right: 40,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            fontSize: { xs: '0.6rem', sm: '0.65rem' },
            fontWeight: 600,
            height: { xs: 18, sm: 20 },
            maxWidth: 80,
            '& .MuiChip-label': {
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }
          }}
        />

        {/* Fullscreen Button */}
        <IconButton
          size="small"
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 1)'
            },
            p: { xs: 0.5, sm: 1 }
          }}
          onClick={handleView}
        >
          <Fullscreen sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }} />
        </IconButton>
      </Box>

      {/* Color Selection Button */}
      {product.color && (
        <Box sx={{ p: 1, pt: 0 }}>
          <Button
            variant="contained"
            size="small"
            sx={{
              backgroundColor: '#1976d2',
              color: 'white',
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '0.8rem',
              fontWeight: 600,
              '&:hover': {
                backgroundColor: '#1565c0'
              }
            }}
          >
            {product.color}
          </Button>
        </Box>
      )}

      <CardContent sx={{ p: { xs: 1.5, sm: 2 }, pt: 1 }}>
        {/* Product Name */}
        <Typography 
          variant="h6" 
          component="h3"
          sx={{ 
            fontWeight: 700,
            fontSize: { xs: '1rem', sm: '1.1rem' },
            lineHeight: 1.3,
            mb: 1,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {product.name}
        </Typography>

        {/* Pricing */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1, 
          mb: 1.5,
          p: 1,
          backgroundColor: '#f8fafc',
          borderRadius: 1,
          border: '1px solid #e5e7eb'
        }}>
          <Typography 
            variant="h5" 
            component="span"
            sx={{ 
              fontWeight: 700,
              color: '#1a1a1a',
              fontSize: { xs: '1.4rem', sm: '1.6rem' }
            }}
          >
            ${product.price?.toFixed(2) || '0.00'}
          </Typography>
          <Typography 
            variant="body1" 
            component="span"
            sx={{ 
              textDecoration: 'line-through',
              color: '#dc2626',
              fontSize: { xs: '1rem', sm: '1.1rem' },
              fontWeight: 500
            }}
          >
            ${product.originalPrice?.toFixed(2) || '0.00'}
          </Typography>
          {discountPercentage > 0 && (
            <Chip
              label={`${discountPercentage}% OFF`}
              size="small"
              sx={{
                backgroundColor: '#dc2626',
                color: 'white',
                fontSize: '0.7rem',
                fontWeight: 600,
                height: 20,
                ml: 'auto'
              }}
            />
          )}
        </Box>

        {/* Simple Retailer - Like in the image */}
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ 
            fontSize: { xs: '0.8rem', sm: '0.9rem' },
            fontWeight: 500,
            mb: 1.5,
            color: '#6b7280'
          }}
        >
          {product.retailer || 'Amazon'}
        </Typography>
        


        {/* Simple Buy Button - Like in the image */}
        <Button
          variant="outlined"
          size="small"
          fullWidth
          onClick={handleView}
          sx={{
            mb: 1.5,
            borderColor: '#3b82f6',
            color: '#3b82f6',
            fontWeight: 600,
            textTransform: 'none',
            fontSize: { xs: '0.8rem', sm: '0.9rem' },
            py: { xs: 0.5, sm: 0.75 },
            '&:hover': {
              backgroundColor: '#3b82f6',
              color: 'white',
              borderColor: '#3b82f6'
            }
          }}
        >
          Get Deal
        </Button>

        {/* Interaction Buttons */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: { xs: 1.5, sm: 2 },
          pt: 1,
          borderTop: '1px solid #f0f0f0'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <IconButton 
              size="small" 
              onClick={handleLike}
              sx={{ 
                color: isLiked ? '#dc2626' : '#6b7280',
                p: { xs: 0.5, sm: 1 }
              }}
            >
              {isLiked ? <Favorite sx={{ fontSize: { xs: '1rem', sm: '1.1rem' } }} /> : <FavoriteBorder sx={{ fontSize: { xs: '1rem', sm: '1.1rem' } }} />}
            </IconButton>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.8rem' } }}>
              {product.likes || 0}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <IconButton 
              size="small" 
              onClick={handleComment}
              sx={{ 
                color: '#6b7280',
                p: { xs: 0.5, sm: 1 }
              }}
            >
              <ChatBubbleOutline sx={{ fontSize: { xs: '1rem', sm: '1.1rem' } }} />
            </IconButton>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.8rem' } }}>
              {product.comments || 0}
            </Typography>
          </Box>

          <IconButton 
            size="small" 
            onClick={handleShare}
            sx={{ 
              color: '#6b7280',
              ml: 'auto',
              p: { xs: 0.5, sm: 1 }
            }}
          >
            <Share sx={{ fontSize: { xs: '1rem', sm: '1.1rem' } }} />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
