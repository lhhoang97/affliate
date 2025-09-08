// Google Analytics 4 Service for BestFinds
// Tracks page views, e-commerce events, and custom user interactions

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

class AnalyticsService {
  private measurementId: string;
  private isInitialized: boolean = false;

  constructor() {
    this.measurementId = process.env.REACT_APP_GA_MEASUREMENT_ID || '';
  }

  // Initialize Google Analytics
  initialize(): void {
    if (this.isInitialized || !this.measurementId) {
      return;
    }

    // Load Google Analytics script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.measurementId}`;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    window.gtag = function() {
      window.dataLayer.push(arguments);
    };

    window.gtag('js', new Date());
    window.gtag('config', this.measurementId, {
      page_title: document.title,
      page_location: window.location.href,
    });

    this.isInitialized = true;
    console.log('📊 Google Analytics initialized:', this.measurementId);
  }

  // Track page views
  trackPageView(pagePath: string, pageTitle?: string): void {
    if (!this.isInitialized) return;

    window.gtag('config', this.measurementId, {
      page_path: pagePath,
      page_title: pageTitle || document.title,
    });

    console.log('📊 Page view tracked:', pagePath);
  }

  // Track custom events
  trackEvent(eventName: string, parameters?: Record<string, any>): void {
    if (!this.isInitialized) return;

    window.gtag('event', eventName, {
      event_category: parameters?.category || 'engagement',
      event_label: parameters?.label,
      value: parameters?.value,
      ...parameters,
    });

    console.log('📊 Event tracked:', eventName, parameters);
  }

  // Track search events
  trackSearch(searchTerm: string, resultsCount?: number): void {
    this.trackEvent('search', {
      search_term: searchTerm,
      results_count: resultsCount,
      category: 'search',
    });
  }

  // Track product views
  trackProductView(product: {
    id: string;
    name: string;
    category?: string;
    price?: number;
    brand?: string;
  }): void {
    this.trackEvent('view_item', {
      currency: 'USD',
      value: product.price,
      items: [{
        item_id: product.id,
        item_name: product.name,
        item_category: product.category,
        item_brand: product.brand,
        price: product.price,
        quantity: 1,
      }],
      category: 'ecommerce',
    });
  }

  // Track affiliate link clicks
  trackAffiliateClick(product: {
    id: string;
    name: string;
    retailer: string;
    url: string;
    price?: number;
  }): void {
    this.trackEvent('affiliate_click', {
      currency: 'USD',
      value: product.price,
      items: [{
        item_id: product.id,
        item_name: product.name,
        item_brand: product.retailer,
        price: product.price,
        quantity: 1,
      }],
      retailer: product.retailer,
      affiliate_url: product.url,
      category: 'ecommerce',
    });
  }

  // Track mobile menu interactions
  trackMobileMenu(action: 'open' | 'close'): void {
    this.trackEvent('mobile_menu_interaction', {
      action: action,
      category: 'navigation',
    });
  }

  // Track category navigation
  trackCategoryView(categoryName: string, categoryId?: string): void {
    this.trackEvent('view_item_list', {
      item_list_id: categoryId,
      item_list_name: categoryName,
      category: 'navigation',
    });
  }

  // Track user engagement
  trackEngagement(action: string, element?: string): void {
    this.trackEvent('user_engagement', {
      action: action,
      element: element,
      category: 'engagement',
    });
  }

  // Track errors
  trackError(error: string, fatal: boolean = false): void {
    this.trackEvent('exception', {
      description: error,
      fatal: fatal,
      category: 'error',
    });
  }
}

// Create singleton instance
export const analytics = new AnalyticsService();

// Export for easy access
export default analytics;
