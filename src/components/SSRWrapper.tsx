import React, { useEffect, useState } from 'react';

interface SSRWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  ssrContent?: React.ReactNode;
}

const SSRWrapper: React.FC<SSRWrapperProps> = ({ 
  children, 
  fallback = null, 
  ssrContent = null 
}) => {
  const [isClient, setIsClient] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Small delay to ensure smooth hydration
    const timer = setTimeout(() => {
      setIsHydrated(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Server-side or initial render
  if (!isClient) {
    return <>{ssrContent || children}</>;
  }

  // Client-side but not yet hydrated
  if (!isHydrated) {
    return <>{fallback || children}</>;
  }

  // Fully hydrated
  return <>{children}</>;
};

export default SSRWrapper;
