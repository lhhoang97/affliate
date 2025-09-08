import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import analytics from '../services/analyticsService';

// Component to track page views automatically
const PageTracker: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    // Track page view when route changes
    analytics.trackPageView(location.pathname + location.search);
  }, [location]);

  return null; // This component doesn't render anything
};

export default PageTracker;
