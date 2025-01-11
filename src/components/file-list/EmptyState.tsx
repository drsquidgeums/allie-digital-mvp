import React from "react";

export const EmptyState = () => {
  return (
    <div 
      className="text-sm text-muted-foreground p-4 text-center animate-fade-in"
      role="status"
      aria-label="No files uploaded"
    >
      No files uploaded yet
    </div>
  );
};