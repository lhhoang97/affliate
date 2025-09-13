import React, { useState, useEffect } from 'react';
import { Box, Skeleton } from '@mui/material';

interface WebPImageProps {
  webpSrc: string;
  fallbackSrc: string;
  alt: string;
  width?: string | number;
  height?: string | number;
  style?: React.CSSProperties;
  className?: string;
  loading?: 'lazy' | 'eager';
}

const WebPImage: React.FC<WebPImageProps> = ({
  webpSrc,
  fallbackSrc,
  alt,
  width,
  height,
  style,
  className,
  loading = 'lazy'
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>('');
  const [supportsWebP, setSupportsWebP] = useState<boolean | null>(null);

  // Check WebP support
  useEffect(() => {
    const checkWebPSupport = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    };

    setSupportsWebP(checkWebPSupport());
  }, []);

  useEffect(() => {
    if (supportsWebP === null) return;

    setIsLoading(true);
    setHasError(false);

    // Use WebP if supported, otherwise use fallback
    const srcToUse = supportsWebP ? webpSrc : fallbackSrc;

    // Add loading timeout for better UX
    const timeoutId = setTimeout(() => {
      setHasError(true);
      setIsLoading(false);
    }, 3000);

    const img = new Image();
    img.onload = () => {
      clearTimeout(timeoutId);
      setImageSrc(srcToUse);
      setIsLoading(false);
    };
    img.onerror = () => {
      clearTimeout(timeoutId);
      // If WebP fails, try fallback
      if (supportsWebP && srcToUse === webpSrc) {
        const fallbackImg = new Image();
        fallbackImg.onload = () => {
          setImageSrc(fallbackSrc);
          setIsLoading(false);
        };
        fallbackImg.onerror = () => {
          setHasError(true);
          setIsLoading(false);
        };
        fallbackImg.src = fallbackSrc;
      } else {
        setHasError(true);
        setIsLoading(false);
      }
    };
    img.src = srcToUse;

    return () => clearTimeout(timeoutId);
  }, [webpSrc, fallbackSrc, supportsWebP]);

  if (isLoading) {
    return (
      <Skeleton
        variant="rectangular"
        width={width}
        height={height}
        style={style}
        className={className}
      />
    );
  }

  if (hasError) {
    return (
      <Box
        width={width}
        height={height}
        style={{
          ...style,
          backgroundColor: '#f5f5f5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#999',
          fontSize: '12px'
        }}
        className={className}
      >
        Image Error
      </Box>
    );
  }

  return (
    <img
      src={imageSrc}
      alt={alt}
      width={width}
      height={height}
      style={style}
      className={className}
      loading={loading}
      decoding="async"
    />
  );
};

export default WebPImage;
