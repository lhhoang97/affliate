import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

interface SmartLinkProps {
  to: string;
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
  style?: React.CSSProperties;
  external?: boolean;
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
  ...props 
}) => {
  const handleClick = (e: React.MouseEvent) => {
    // Call custom onClick if provided
    if (onClick) {
      onClick(e);
    }

    // Handle special key combinations
    if (e.ctrlKey || e.metaKey || e.button === 1) {
      // Ctrl+Click, Cmd+Click, or Middle-click
      // Let browser handle opening in new tab
      return;
    }

    // For external links, open in new tab
    if (external) {
      e.preventDefault();
      window.open(to, '_blank', 'noopener,noreferrer');
    }
  };

  const handleMiddleClick = (e: React.MouseEvent) => {
    if (e.button === 1) {
      // Middle mouse button
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
        onMouseDown={handleMiddleClick}
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
      onMouseDown={handleMiddleClick}
      style={{ textDecoration: 'none', color: 'inherit' }}
      {...props}
    >
      {children}
    </RouterLink>
  );
};

export default SmartLink;
