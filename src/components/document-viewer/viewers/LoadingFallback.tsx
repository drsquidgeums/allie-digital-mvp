
import React from 'react';

interface LoadingFallbackProps {
  message?: string;
}

export const LoadingFallback: React.FC<LoadingFallbackProps> = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-8">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mb-4"></div>
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
};

export default LoadingFallback;
