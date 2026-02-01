import React from "react";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Consistent page container for all pages
 * Provides uniform padding and overflow handling
 */
export const PageContainer: React.FC<PageContainerProps> = ({ 
  children,
  className = "" 
}) => {
  return (
    <div className={`p-6 h-full overflow-auto ${className}`}>
      {children}
    </div>
  );
};
