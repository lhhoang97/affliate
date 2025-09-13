import { useState, useEffect, useCallback } from 'react';

interface ImageOptimizationOptions {
  webpSrc?: string;
  fallbackSrc: string;
  lazy?: boolean;
  priority?: boolean;
}

interface ImageState {
  src: string;
  isLoading: boolean;
  hasError: boolean;
  supportsWebP: boolean | null;
}

export const useImageOptimization = (options: ImageOptimizationOptions): ImageState => {
  const { webpSrc, fallbackSrc, lazy = true, priority = false } = options;
  
  const [imageState, setImageState] = useState<ImageState>({
    src: '',
    isLoading: true,
    hasError: false,
    supportsWebP: null
  });

  // Check WebP support
  const checkWebPSupport = useCallback(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }, []);

  // Load image with optimization
  const loadImage = useCallback(async () => {
    if (!fallbackSrc) {
      setImageState(prev => ({ ...prev, hasError: true, isLoading: false }));
      return;
    }

    setImageState(prev => ({ ...prev, isLoading: true, hasError: false }));

    // Check WebP support
    const supportsWebP = checkWebPSupport();
    setImageState(prev => ({ ...prev, supportsWebP }));

    // Choose the best source
    const srcToUse = (supportsWebP && webpSrc) ? webpSrc : fallbackSrc;

    // Add timeout for better UX
    const timeoutId = setTimeout(() => {
      setImageState(prev => ({ ...prev, hasError: true, isLoading: false }));
    }, priority ? 1000 : 3000); // Shorter timeout for priority images

    try {
      const img = new Image();
      
      // Set loading priority
      if (priority) {
        (img as any).fetchPriority = 'high';
        img.loading = 'eager';
      } else {
        img.loading = lazy ? 'lazy' : 'eager';
      }

      img.onload = () => {
        clearTimeout(timeoutId);
        setImageState(prev => ({ 
          ...prev, 
          src: srcToUse, 
          isLoading: false, 
          hasError: false 
        }));
      };

      img.onerror = () => {
        clearTimeout(timeoutId);
        
        // If WebP fails, try fallback
        if (supportsWebP && webpSrc && srcToUse === webpSrc) {
          const fallbackImg = new Image();
          fallbackImg.loading = lazy ? 'lazy' : 'eager';
          
          fallbackImg.onload = () => {
            setImageState(prev => ({ 
              ...prev, 
              src: fallbackSrc, 
              isLoading: false, 
              hasError: false 
            }));
          };
          
          fallbackImg.onerror = () => {
            setImageState(prev => ({ 
              ...prev, 
              hasError: true, 
              isLoading: false 
            }));
          };
          
          fallbackImg.src = fallbackSrc;
        } else {
          setImageState(prev => ({ 
            ...prev, 
            hasError: true, 
            isLoading: false 
          }));
        }
      };

      img.src = srcToUse;
    } catch (error) {
      clearTimeout(timeoutId);
      setImageState(prev => ({ 
        ...prev, 
        hasError: true, 
        isLoading: false 
      }));
    }
  }, [webpSrc, fallbackSrc, lazy, priority, checkWebPSupport]);

  useEffect(() => {
    loadImage();
  }, [loadImage]);

  return imageState;
};

// Hook for batch image loading
export const useBatchImageLoading = (images: string[], batchSize: number = 3) => {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [loadingImages, setLoadingImages] = useState<Set<string>>(new Set());

  const loadImageBatch = useCallback(async (imageBatch: string[]) => {
    const promises = imageBatch.map(src => {
      return new Promise<string>((resolve, reject) => {
        const img = new Image();
        img.loading = 'lazy';
        
        img.onload = () => resolve(src);
        img.onerror = () => reject(src);
        img.src = src;
      });
    });

    try {
      const results = await Promise.allSettled(promises);
      const successful = results
        .filter((result): result is PromiseFulfilledResult<string> => result.status === 'fulfilled')
        .map(result => result.value);

      setLoadedImages(prev => {
        const newSet = new Set(prev);
        successful.forEach(src => newSet.add(src));
        return newSet;
      });
    } catch (error) {
      console.warn('Batch image loading error:', error);
    } finally {
      setLoadingImages(prev => {
        const newSet = new Set(prev);
        imageBatch.forEach(src => newSet.delete(src));
        return newSet;
      });
    }
  }, []);

  const startBatchLoading = useCallback(() => {
    const unloadedImages = images.filter(src => !loadedImages.has(src) && !loadingImages.has(src));
    
      // Load images in batches
      for (let i = 0; i < unloadedImages.length; i += batchSize) {
        const batch = unloadedImages.slice(i, i + batchSize);
        setLoadingImages(prev => {
          const newSet = new Set(prev);
          batch.forEach(src => newSet.add(src));
          return newSet;
        });
      
      // Stagger batch loading to prevent overwhelming the browser
      setTimeout(() => {
        loadImageBatch(batch);
      }, i * 100);
    }
  }, [images, loadedImages, loadingImages, batchSize, loadImageBatch]);

  return {
    loadedImages,
    loadingImages,
    startBatchLoading,
    isImageLoaded: (src: string) => loadedImages.has(src),
    isImageLoading: (src: string) => loadingImages.has(src)
  };
};
