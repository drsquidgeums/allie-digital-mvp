
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface ErrorDisplayProps {
  title: string;
  description: string;
  onRetry?: () => void;
}

/**
 * ErrorDisplay Component
 * 
 * Displays error messages in a standardized format.
 * Optionally provides a retry action for error recovery.
 * 
 * @param title - The error title
 * @param description - Detailed error message
 * @param onRetry - Optional callback function for retry action
 */
export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ 
  title, 
  description, 
  onRetry 
}) => {
  return (
    <div 
      className="flex items-center justify-center h-full p-4"
      role="alert"
      aria-live="assertive"
    >
      <Alert variant="destructive" className="max-w-md">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>
          <p className="text-sm mb-4">{description}</p>
          {onRetry && (
            <button 
              onClick={onRetry}
              className="text-xs underline hover:text-muted-foreground"
            >
              Try again
            </button>
          )}
        </AlertDescription>
      </Alert>
    </div>
  );
};
