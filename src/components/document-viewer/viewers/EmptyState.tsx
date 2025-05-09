
import React from 'react';

/**
 * EmptyState Component
 * 
 * Displays a message when no document is loaded.
 * Provides a visual indicator and instructions for the user.
 */
export const EmptyState: React.FC = () => {
  return (
    <div 
      className="flex flex-col items-center justify-center h-full text-muted-foreground p-6 space-y-4"
      role="status"
      aria-label="No document loaded"
    >
      <div className="text-center">
        <h3 className="text-lg font-medium mb-2">No Document Loaded</h3>
        <p className="text-sm">Upload a file or paste a URL to view</p>
      </div>
    </div>
  );
};
