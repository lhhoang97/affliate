import { useEffect, useCallback } from 'react';

interface PerformanceConfig {
  enableImageOptimization?: boolean;
  enableLazyLoading?: boolean;
  enablePrefetching?: boolean;
  enableServiceWorker?: boolean;
}

export const usePerformanceOptimization = (config: PerformanceConfig = {}) => {
  const {
    enableImageOptimization = true,
    enableLazyLoading = true,
    enablePrefetching = true,
    enableServiceWorker = true
  } = config;

  // Preload critical resources
  const preloadCriticalResources = useCallback(() => {
    if (!enablePrefetching) return;

    // Preload critical CSS
    const criticalCSS = document.createElement('link');
    criticalCSS.rel = 'preload';
    criticalCSS.href = '/static/css/critical.css';
    criticalCSS.as = 'style';
    document.head.appendChild(criticalCSS);

    // Preload critical fonts
    const criticalFont = document.createElement('link');
    criticalFont.rel = 'preload';
    criticalFont.href = 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap';
    criticalFont.as = 'style';
    document.head.appendChild(criticalFont);
  }, [enablePrefetching]);

  // Optimize images
  const optimizeImages = useCallback(() => {
    if (!enableImageOptimization) return;

    // Add image optimization attributes to all images
    const images = document.querySelectorAll('img:not([loading])');
    images.forEach((img) => {
      img.setAttribute('loading', 'lazy');
      img.setAttribute('decoding', 'async');
      img.setAttribute('fetchpriority', 'low');
    });
  }, [enableImageOptimization]);

  // Register service worker for caching
  const registerServiceWorker = useCallback(() => {
    if (!enableServiceWorker || !('serviceWorker' in navigator)) return;

    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    });
  }, [enableServiceWorker]);

  // Debounce function for performance
  const debounce = useCallback(<T extends (...args: any[]) => any>(
    func: T,
    delay: number
  ): ((...args: Parameters<T>) => void) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  }, []);

  // Throttle function for performance
  const throttle = useCallback(<T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): ((...args: Parameters<T>) => void) => {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }, []);

  // Initialize performance optimizations
  useEffect(() => {
    preloadCriticalResources();
    optimizeImages();
    registerServiceWorker();

    // Cleanup function
    return () => {
      // Remove any added elements
      const preloadLinks = document.querySelectorAll('link[rel="preload"]');
      preloadLinks.forEach(link => link.remove());
    };
  }, [preloadCriticalResources, optimizeImages, registerServiceWorker]);

  return {
    debounce,
    throttle,
    preloadCriticalResources,
    optimizeImages,
    registerServiceWorker
  };
};

export default usePerformanceOptimization;
