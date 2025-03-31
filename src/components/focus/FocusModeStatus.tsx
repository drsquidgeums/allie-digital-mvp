import React from 'react';
import { Glasses, GlassesOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FocusModeStatusProps {
  isActive: boolean;
}

export const FocusModeStatus: React.FC<FocusModeStatusProps> = ({ isActive }) => {
  return (
    <>
      <div
        className={cn(
          "flex items-center justify-between p-2 rounded-md transition-all duration-300",
          isActive 
            ? "bg-primary/20 border-2 border-primary" 
            : "bg-muted/30"
        )}
      >
        <div className="flex items-center gap-2">
          {isActive ? (
            <Glasses className="h-5 w-5 text-primary animate-pulse" />
          ) : (
            <GlassesOff className="h-5 w-5 text-muted-foreground" />
          )}
          <span className={cn(
            "font-medium",
            isActive ? "text-primary" : "text-muted-foreground"
          )}>
            {isActive ? "Focus mode is active" : "Focus mode is inactive"}
          </span>
        </div>
        
        {isActive && (
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
        )}
      </div>
      
      <div 
        role="status" 
        aria-live="polite"
        className="sr-only"
      >
        {isActive ? "Focus mode is active" : "Focus mode is inactive"}
      </div>
    </>
  );
};
