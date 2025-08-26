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
    currentPrice: number;
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
  const discountPercentage = Math.round(((product.originalPrice - product.currentPrice) / product.originalPrice) * 100);

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
        maxWidth: 400,
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
          sx={{ objectFit: 'cover' }}
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
              fontSize: '0.7rem',
              fontWeight: 600
            }}
          />
        )}

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
            }
          }}
          onClick={handleView}
        >
          <Fullscreen sx={{ fontSize: '1rem' }} />
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

      <CardContent sx={{ p: 2, pt: 1 }}>
        {/* Product Name */}
        <Typography 
          variant="h6" 
          component="h3"
          sx={{ 
            fontWeight: 700,
            fontSize: '1.1rem',
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Typography 
            variant="h5" 
            component="span"
            sx={{ 
              fontWeight: 700,
              color: '#1a1a1a',
              fontSize: '1.5rem'
            }}
          >
            ${product.currentPrice}
          </Typography>
          <Typography 
            variant="body1" 
            component="span"
            sx={{ 
              textDecoration: 'line-through',
              color: '#dc2626',
              fontSize: '1rem',
              fontWeight: 500
            }}
          >
            ${product.originalPrice}
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
                height: 20
              }}
            />
          )}
        </Box>

        {/* Retailer */}
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ 
            fontSize: '0.9rem',
            fontWeight: 500,
            mb: 2
          }}
        >
          {product.retailer}
        </Typography>

        {/* Interaction Buttons */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2,
          pt: 1,
          borderTop: '1px solid #f0f0f0'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <IconButton 
              size="small" 
              onClick={handleLike}
              sx={{ color: isLiked ? '#dc2626' : '#6b7280' }}
            >
              {isLiked ? <Favorite sx={{ fontSize: '1.1rem' }} /> : <FavoriteBorder sx={{ fontSize: '1.1rem' }} />}
            </IconButton>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
              {product.likes || 0}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <IconButton 
              size="small" 
              onClick={handleComment}
              sx={{ color: '#6b7280' }}
            >
              <ChatBubbleOutline sx={{ fontSize: '1.1rem' }} />
            </IconButton>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
              {product.comments || 0}
            </Typography>
          </Box>

          <IconButton 
            size="small" 
            onClick={handleShare}
            sx={{ 
              color: '#6b7280',
              ml: 'auto'
            }}
          >
            <Share sx={{ fontSize: '1.1rem' }} />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
