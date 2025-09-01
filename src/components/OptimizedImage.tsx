import React, { useState, useEffect } from 'react';
import { Box, Skeleton } from '@mui/material';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: string | number;
  height?: string | number;
  style?: React.CSSProperties;
  className?: string;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  style,
  className
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>('');

  useEffect(() => {
    setIsLoading(true);
    setHasError(false);

    const img = new Image();
    img.onload = () => {
      setImageSrc(src);
      setIsLoading(false);
    };
    img.onerror = () => {
      setHasError(true);
      setIsLoading(false);
    };
    img.src = src;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

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
      loading="lazy"
    />
  );
};

export default OptimizedImage;
