
import React from 'react';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';

/**
 * LoadingFallback Component
 * 
 * Displays a loading skeleton while document content is being loaded.
 * Used as a fallback for Suspense.
 */
export const LoadingFallback: React.FC = () => {
  return (
    <div className="h-full p-4 animate-fade-in">
      <LoadingSkeleton type="document" className="h-full" />
    </div>
  );
};
