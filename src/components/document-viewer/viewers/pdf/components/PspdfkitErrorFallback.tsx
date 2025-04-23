
import React from 'react';

export const PspdfkitErrorFallback = ({ error }: { error: Error }) => (
  <div className="flex items-center justify-center h-full">
    <div className="max-w-md p-6 bg-card rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-2">Error Loading PDF Viewer</h3>
      <p className="text-muted-foreground mb-4">{error.message}</p>
      <p className="text-sm">Please ensure PSPDFKit is properly installed and configured.</p>
    </div>
  </div>
);

export default PspdfkitErrorFallback;
