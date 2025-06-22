
import React from 'react';
import { Skeleton } from './skeleton';
import { cn } from '@/lib/utils';

interface LoadingSkeletonProps {
  className?: string;
  type?: 'document' | 'text' | 'button' | 'card';
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ 
  className, 
  type = 'document' 
}) => {
  switch (type) {
    case 'document':
      return (
        <div className={cn("space-y-3 p-4", className)}>
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
        <div className={cn("space-y-2", className)}>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      );
    
    case 'button':
      return <Skeleton className={cn("h-9 w-20", className)} />;
    
    case 'card':
      return (
        <div className={cn("p-4 space-y-3", className)}>
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      );
    
    default:
      return <Skeleton className={className} />;
  }
};
