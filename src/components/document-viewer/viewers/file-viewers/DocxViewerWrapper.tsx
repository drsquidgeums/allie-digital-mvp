
import React, { useEffect, useState } from 'react';
import { convertDocxToHtml } from '../../FileConverter';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ErrorDisplay } from '../ErrorDisplay';

interface DocxViewerWrapperProps {
  file: File;
}

export const DocxViewerWrapper: React.FC<DocxViewerWrapperProps> = ({ file }) => {
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDocxContent = async () => {
      try {
        setIsLoading(true);
        const content = await convertDocxToHtml(file);
        setHtmlContent(content);
        setError(null);
      } catch (err) {
        console.error('Error converting DOCX to HTML:', err);
        setError('Failed to convert document');
      } finally {
        setIsLoading(false);
      }
    };

    if (file) {
      loadDocxContent();
    }
  }, [file]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorDisplay 
        title="Document Conversion Error" 
        description={error}
        onRetry={() => setIsLoading(true)}
      />
    );
  }

  return (
    <div className="h-full w-full border rounded-md overflow-hidden bg-white">
      <ScrollArea className="h-full">
        <div 
          className="p-4 docx-content" 
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </ScrollArea>
    </div>
  );
};

export default DocxViewerWrapper;
