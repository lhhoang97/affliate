import React, { useState, useRef, useEffect } from 'react';
import { Box, Skeleton } from '@mui/material';

interface LazyImageProps {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  sx?: any;
  placeholder?: string;
  onError?: () => void;
  onLoad?: () => void;
  loading?: 'lazy' | 'eager';
  sizes?: string;
  srcSet?: string;
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  width = '100%',
  height = 'auto',
  sx = {},
  placeholder,
  onError,
  onLoad,
  loading = 'lazy',
  sizes,
  srcSet
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  // Generate responsive srcSet if not provided
  const generateSrcSet = (originalSrc: string) => {
    if (srcSet) return srcSet;
    
    // Generate different sizes for responsive images
    const baseUrl = originalSrc.replace(/\.(jpg|jpeg|png|webp)$/i, '');
    const extension = originalSrc.match(/\.(jpg|jpeg|png|webp)$/i)?.[0] || '.jpg';
    
    return [
      `${baseUrl}_300w${extension} 300w`,
      `${baseUrl}_600w${extension} 600w`,
      `${baseUrl}_900w${extension} 900w`,
      `${baseUrl}_1200w${extension} 1200w`
    ].join(', ');
  };

  const responsiveSizes = sizes || '(max-width: 600px) 300px, (max-width: 900px) 600px, 900px';

  return (
    <Box
      ref={imgRef}
      sx={{
        position: 'relative',
        width,
        height,
        overflow: 'hidden',
        ...sx
      }}
    >
      {/* Loading Skeleton */}
      {!isLoaded && !hasError && (
        <Skeleton
          variant="rectangular"
          width="100%"
          height="100%"
          animation="wave"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 1
          }}
        />
      )}

      {/* Error Placeholder */}
      {hasError && (
        <Box
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f5f5f5',
            color: '#999',
            fontSize: '0.875rem',
            textAlign: 'center',
            padding: 2
          }}
        >
          {placeholder || 'Image not available'}
        </Box>
      )}

      {/* Actual Image */}
      {isInView && !hasError && (
        <img
          src={src}
          alt={alt}
          loading={loading}
          sizes={responsiveSizes}
          srcSet={generateSrcSet(src)}
          onLoad={handleLoad}
          onError={handleError}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: isLoaded ? 'block' : 'none',
            transition: 'opacity 0.3s ease-in-out'
          }}
        />
      )}
    </Box>
  );
};

export default LazyImage;
