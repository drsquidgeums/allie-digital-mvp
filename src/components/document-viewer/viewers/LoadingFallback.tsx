
import React from 'react';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';

interface LoadingFallbackProps {
  type?: 'document' | 'pdf-page' | 'text';
  message?: string;
}

/**
 * LoadingFallback Component
 * 
 * Displays a loading skeleton while document content is being loaded.
 * Used as a fallback for Suspense with enhanced visual feedback.
 */
export const LoadingFallback: React.FC<LoadingFallbackProps> = ({ 
  type = 'document',
  message = 'Loading document...'
}) => {
  return (
    <div className="h-full p-4 animate-fade-in">
      <div className="flex items-center justify-center mb-4">
        <div className="text-sm text-muted-foreground animate-pulse">
          {message}
        </div>
      </div>
      <LoadingSkeleton 
        type={type} 
        className="h-full transition-opacity duration-500 ease-in-out" 
        animated={true}
      />
    </div>
  );
};
