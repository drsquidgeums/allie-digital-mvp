
import React from 'react';
import { File } from 'lucide-react';

export const EmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-8 text-center">
      <div className="bg-muted/20 w-16 h-16 rounded-full flex items-center justify-center mb-4">
        <File className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-medium">No document loaded</h3>
      <p className="text-muted-foreground mt-2">
        Upload a file or provide a URL to preview a document
      </p>
    </div>
  );
};

export default EmptyState;
