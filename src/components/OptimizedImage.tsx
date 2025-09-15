import React from 'react';
import { Box, Skeleton } from '@mui/material';
import { useImageOptimization } from '../hooks/useImageOptimization';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: string | number;
  height?: string | number;
  style?: React.CSSProperties;
  className?: string;
  loading?: 'lazy' | 'eager';
  webpSrc?: string; // Optional WebP source
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  style,
  className,
  loading = 'lazy',
  webpSrc
}) => {
  const { src: imageSrc, isLoading, hasError } = useImageOptimization({
    webpSrc,
    fallbackSrc: src,
    lazy: loading === 'lazy',
    priority: loading === 'eager'
  });

  if (isLoading) {
    return (
      <Skeleton
        variant="rectangular"
        width={width}
        height={height}
        animation="wave"
        sx={{
          borderRadius: 1,
          ...style
        }}
      />
    );
  }

  if (hasError) {
    return (
      <Box
        width={width}
        height={height}
        display="flex"
        alignItems="center"
        justifyContent="center"
        bgcolor="grey.100"
        borderRadius={1}
        sx={style}
        className={className}
      >
        <Box color="grey.500" fontSize="0.8rem">
          Failed to load image
        </Box>
      </Box>
    );
  }

  return (
    <img
      src={imageSrc}
      alt={alt}
      width={width}
      height={height}
      style={{
        display: 'block',
        objectFit: 'scale-down',
        maxWidth: '100%',
        maxHeight: '100%',
        ...style
      }}
      className={className}
      loading={loading}
      decoding="async"
      fetchPriority="low"
    />
  );
};

export default OptimizedImage;
