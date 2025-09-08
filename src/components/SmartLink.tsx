import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import analytics from '../services/analyticsService';

interface SmartLinkProps {
  to: string;
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
  style?: React.CSSProperties;
  external?: boolean;
  // Analytics tracking props
  productId?: string;
  productName?: string;
  productPrice?: number;
  retailer?: string;
  [key: string]: any;
}

/**
 * SmartLink Component
 * 
 * Supports all standard browser behaviors:
 * - Left click: Normal navigation
 * - Right click: Context menu with "Open in new tab"
 * - Middle click: Open in new tab
 * - Ctrl+Click: Open in new tab
 * - Cmd+Click (Mac): Open in new tab
 */
const SmartLink: React.FC<SmartLinkProps> = ({ 
  to, 
  children, 
  onClick,
  external = false,
  productId,
  productName,
  productPrice,
  retailer,
  ...props 
}) => {
  const handleClick = (e: React.MouseEvent) => {
    console.log('🖱️ SmartLink Click Event:', {
      button: e.button,
      ctrlKey: e.ctrlKey,
      metaKey: e.metaKey,
      type: e.type,
      url: to
    });

    // Call custom onClick if provided
    if (onClick) {
      onClick(e);
    }

    // Handle special key combinations
    if (e.ctrlKey || e.metaKey) {
      // Ctrl+Click, Cmd+Click - let browser handle
      console.log('🖱️ Modifier key detected, letting browser handle');
      return;
    }

    // Handle middle click
    if (e.button === 1) {
      console.log('🖱️ Middle click detected, opening new tab');
      e.preventDefault();
      window.open(to, '_blank', 'noopener,noreferrer');
      return;
    }

    // For external links, open in new tab
    if (external) {
      e.preventDefault();
      window.open(to, '_blank', 'noopener,noreferrer');
      
      // Track affiliate click if product data is provided
      if (productId && productName) {
        analytics.trackAffiliateClick({
          id: productId,
          name: productName,
          retailer: retailer || 'Unknown',
          url: to,
          price: productPrice,
        });
      }
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    console.log('🖱️ SmartLink MouseDown Event:', {
      button: e.button,
      type: e.type,
      url: to
    });

    if (e.button === 1) {
      // Middle mouse button
      console.log('🖱️ Middle mousedown detected, opening new tab');
      e.preventDefault();
      window.open(to, '_blank', 'noopener,noreferrer');
    }
  };

  // External link
  if (external) {
    return (
      <a
        href={to}
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onMouseUp={(e) => console.log('🖱️ External link mouse up:', e.button)}
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: 'none', color: 'inherit' }}
        {...props}
      >
        {children}
      </a>
    );
  }

  // Internal link with React Router
  return (
    <RouterLink
      to={to}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseUp={(e) => console.log('🖱️ Internal link mouse up:', e.button)}
      style={{ textDecoration: 'none', color: 'inherit' }}
      {...props}
    >
      {children}
    </RouterLink>
  );
};

export default SmartLink;
