import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface AINotificationBadgeProps {
  count: number;
  className?: string;
}

export const AINotificationBadge: React.FC<AINotificationBadgeProps> = ({ 
  count, 
  className 
}) => {
  if (count === 0) return null;

  return (
    <Badge 
      variant="destructive" 
      className={cn(
        "absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs animate-pulse",
        className
      )}
    >
      {count > 9 ? '9+' : count}
    </Badge>
  );
};