
import React from 'react';
import { Skeleton } from './skeleton';
import { cn } from '@/lib/utils';

interface LoadingSkeletonProps {
  className?: string;
  type?: 'document' | 'text' | 'button' | 'card' | 'file-upload' | 'file-list' | 'pdf-page';
  count?: number;
  animated?: boolean;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ 
  className, 
  type = 'document',
  count = 1,
  animated = true
}) => {
  const baseClasses = animated ? "animate-pulse" : "";
  
  const renderSkeleton = () => {
    switch (type) {
      case 'document':
        return (
          <div className={cn("space-y-3 p-4 transition-opacity duration-300", baseClasses, className)}>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/5" />
            <div className="space-y-2 mt-6">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>
        );
      
      case 'text':
        return (
          <div className={cn("space-y-2 transition-opacity duration-300", baseClasses, className)}>
            {Array.from({ length: count }, (_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            ))}
          </div>
        );
      
      case 'button':
        return <Skeleton className={cn("h-9 w-20 transition-opacity duration-300", baseClasses, className)} />;
      
      case 'card':
        return (
          <div className={cn("p-4 space-y-3 transition-opacity duration-300", baseClasses, className)}>
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        );

      case 'file-upload':
        return (
          <div className={cn("p-6 space-y-4 transition-opacity duration-300", baseClasses, className)}>
            <div className="flex items-center space-x-3">
              <Skeleton className="h-8 w-8 rounded" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-2 w-full" />
              </div>
            </div>
            <Skeleton className="h-1 w-full" />
          </div>
        );

      case 'file-list':
        return (
          <div className={cn("space-y-2 transition-opacity duration-300", baseClasses, className)}>
            {Array.from({ length: count }, (_, i) => (
              <div key={i} className="flex items-center space-x-3 p-2">
                <Skeleton className="h-6 w-6 rounded" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <Skeleton className="h-6 w-6 rounded" />
              </div>
            ))}
          </div>
        );

      case 'pdf-page':
        return (
          <div className={cn("flex justify-center p-4 transition-opacity duration-300", baseClasses, className)}>
            <Skeleton className="h-[800px] w-[600px] rounded-lg" />
          </div>
        );
      
      default:
        return <Skeleton className={cn("transition-opacity duration-300", baseClasses, className)} />;
    }
  };

  return renderSkeleton();
};
