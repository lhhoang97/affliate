import React, { useEffect } from 'react';

interface PerformanceMetrics {
  fcp?: number; // First Contentful Paint
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  ttfb?: number; // Time to First Byte
  loadTime?: number; // Total load time
}

const PerformanceMonitor: React.FC = () => {
  useEffect(() => {
    // Only run in production
    if (process.env.NODE_ENV !== 'production') {
      return;
    }

    // Get performance metrics
    const getPerformanceMetrics = (): PerformanceMetrics => {
      const metrics: PerformanceMetrics = {};

      // Get navigation timing
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        metrics.ttfb = navigation.responseStart - navigation.requestStart;
        metrics.loadTime = navigation.loadEventEnd - navigation.fetchStart;
      }

      // Get paint timing
      const paintEntries = performance.getEntriesByType('paint');
      paintEntries.forEach((entry) => {
        if (entry.name === 'first-contentful-paint') {
          metrics.fcp = entry.startTime;
        }
      });

      // Get LCP
      const lcpEntries = performance.getEntriesByType('largest-contentful-paint');
      if (lcpEntries.length > 0) {
        metrics.lcp = lcpEntries[lcpEntries.length - 1].startTime;
      }

      // Get FID
      const fidEntries = performance.getEntriesByType('first-input') as any[];
      if (fidEntries.length > 0) {
        metrics.fid = fidEntries[0].processingStart - fidEntries[0].startTime;
      }

      // Get CLS
      let clsValue = 0;
      const clsEntries = performance.getEntriesByType('layout-shift');
      clsEntries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      metrics.cls = clsValue;

      return metrics;
    };

    // Send metrics to analytics
    const sendMetrics = (metrics: PerformanceMetrics) => {
      // Send to Google Analytics if available
      if (typeof (window as any).gtag !== 'undefined') {
        (window as any).gtag('event', 'performance_metrics', {
          event_category: 'Performance',
          event_label: 'Core Web Vitals',
          custom_map: {
            fcp: metrics.fcp,
            lcp: metrics.lcp,
            fid: metrics.fid,
            cls: metrics.cls,
            ttfb: metrics.ttfb,
            load_time: metrics.loadTime
          }
        });
      }

      // Log to console for debugging
      console.log('Performance Metrics:', {
        'First Contentful Paint': metrics.fcp ? `${Math.round(metrics.fcp)}ms` : 'N/A',
        'Largest Contentful Paint': metrics.lcp ? `${Math.round(metrics.lcp)}ms` : 'N/A',
        'First Input Delay': metrics.fid ? `${Math.round(metrics.fid)}ms` : 'N/A',
        'Cumulative Layout Shift': metrics.cls ? metrics.cls.toFixed(3) : 'N/A',
        'Time to First Byte': metrics.ttfb ? `${Math.round(metrics.ttfb)}ms` : 'N/A',
        'Total Load Time': metrics.loadTime ? `${Math.round(metrics.loadTime)}ms` : 'N/A'
      });

      // Check Core Web Vitals thresholds
      const checkCoreWebVitals = (metrics: PerformanceMetrics) => {
        const issues: string[] = [];

        if (metrics.fcp && metrics.fcp > 1800) {
          issues.push(`FCP too slow: ${Math.round(metrics.fcp)}ms (threshold: 1800ms)`);
        }

        if (metrics.lcp && metrics.lcp > 2500) {
          issues.push(`LCP too slow: ${Math.round(metrics.lcp)}ms (threshold: 2500ms)`);
        }

        if (metrics.fid && metrics.fid > 100) {
          issues.push(`FID too slow: ${Math.round(metrics.fid)}ms (threshold: 100ms)`);
        }

        if (metrics.cls && metrics.cls > 0.1) {
          issues.push(`CLS too high: ${metrics.cls.toFixed(3)} (threshold: 0.1)`);
        }

        if (issues.length > 0) {
          console.warn('Performance Issues Detected:', issues);
        } else {
          console.log('✅ All Core Web Vitals are within good thresholds');
        }
      };

      checkCoreWebVitals(metrics);
    };

    // Wait for page load and then collect metrics
    const collectMetrics = () => {
      // Wait a bit for all metrics to be available
      setTimeout(() => {
        const metrics = getPerformanceMetrics();
        sendMetrics(metrics);
      }, 1000);
    };

    // Collect metrics when page loads
    if (document.readyState === 'complete') {
      collectMetrics();
    } else {
      window.addEventListener('load', collectMetrics);
    }

    // Also collect metrics when user interacts (for FID)
    const collectInteractionMetrics = () => {
      const metrics = getPerformanceMetrics();
      if (metrics.fid) {
        sendMetrics(metrics);
      }
    };

    // Listen for user interactions
    ['click', 'keydown', 'mousedown', 'pointerdown', 'touchstart'].forEach(eventType => {
      document.addEventListener(eventType, collectInteractionMetrics, { once: true });
    });

    // Cleanup
    return () => {
      window.removeEventListener('load', collectMetrics);
    };
  }, []);

  // This component doesn't render anything
  return null;
};

export default PerformanceMonitor;
