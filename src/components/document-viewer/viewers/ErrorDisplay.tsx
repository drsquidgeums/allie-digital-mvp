
import React from 'react';
import { AlertCircle, RefreshCw, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorDisplayProps {
  title?: string;
  description?: string;
  onRetry?: (() => void) | null;
  variant?: 'error' | 'info';
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  title = "Error",
  description = "There was an error loading the document",
  onRetry,
  variant = 'error'
}) => {
  // Determine icon and styling based on variant
  const IconComponent = variant === 'error' ? AlertCircle : Info;
  const iconColorClass = variant === 'error' ? 'text-destructive' : 'text-blue-500';
  const bgColorClass = variant === 'error' ? 'bg-destructive/10' : 'bg-blue-100/50';
  
  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-8 text-center">
      <div className={`${bgColorClass} w-16 h-16 rounded-full flex items-center justify-center mb-4`}>
        <IconComponent className={`h-8 w-8 ${iconColorClass}`} />
      </div>
      <h3 className="text-xl font-medium">{title}</h3>
      <p className="text-muted-foreground mt-2 max-w-md">
        {description}
      </p>
      
      {onRetry && (
        <Button 
          variant="outline"
          className="mt-4"
          onClick={onRetry}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      )}
    </div>
  );
};

export default ErrorDisplay;
