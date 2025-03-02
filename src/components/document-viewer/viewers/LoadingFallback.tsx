
import React from 'react';

/**
 * LoadingFallback Component
 * 
 * Displays a loading spinner while document content is being loaded.
 * Used as a fallback for Suspense.
 */
export const LoadingFallback: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <div 
        className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" 
        aria-label="Loading document"
      ></div>
    </div>
  );
};
