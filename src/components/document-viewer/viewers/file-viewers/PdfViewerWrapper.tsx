
import React, { useState } from 'react';
import { SimplePdfViewer } from '../pdf/SimplePdfViewer';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle } from 'lucide-react';

interface PdfViewerWrapperProps {
  file: File;
  url: string;
  selectedColor: string;
  isHighlighter?: boolean;
}

export const PdfViewerWrapper: React.FC<PdfViewerWrapperProps> = ({ 
  file, 
  url, 
  selectedColor,
  isHighlighter = true
}) => {
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Handle PDF loading errors
  const handleError = (error: Error) => {
    console.error('PDF loading error:', error);
    setError(error.message || 'Failed to load PDF document');
    
    toast({
      title: 'Error loading PDF',
      description: 'There was a problem loading the document',
      variant: 'destructive',
    });
  };
  
  // Show error state if there was a problem loading the PDF
  if (error) {
    return (
      <div className="flex items-center justify-center h-full p-4 text-destructive">
        <div className="flex flex-col items-center gap-2 max-w-md text-center">
          <AlertCircle className="h-8 w-8" />
          <h3 className="font-semibold">PDF Viewer Error</h3>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }
  
  return (
    <SimplePdfViewer
      file={file}
      url={url}
      selectedColor={selectedColor}
      isHighlighter={isHighlighter}
    />
  );
};
