
import React from 'react';
import { Upload, FileText } from 'lucide-react';

export const EmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-muted-foreground">
      <FileText className="h-16 w-16 mb-4 opacity-20" />
      <h3 className="text-lg font-medium mb-2">No Document Loaded</h3>
      <p className="text-sm text-center max-w-md">
        Upload a document or enter a URL to get started with reading and annotation.
      </p>
      <div className="mt-6 flex items-center gap-2 text-xs">
        <Upload className="h-3 w-3" />
        <span>Click the upload button to add documents</span>
      </div>
    </div>
  );
};

