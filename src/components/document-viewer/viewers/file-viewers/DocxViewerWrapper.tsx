
import React, { useState, useEffect } from 'react';
import { convertDocxToHtml } from '../../FileConverter';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle } from 'lucide-react';

interface DocxViewerWrapperProps {
  file: File;
}

export const DocxViewerWrapper: React.FC<DocxViewerWrapperProps> = ({ file }) => {
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    const loadDocxContent = async () => {
      try {
        setLoading(true);
        const html = await convertDocxToHtml(file);
        setHtmlContent(html);
      } catch (err) {
        console.error('Error loading DOCX file:', err);
        setError((err as Error).message || 'Failed to load DOCX document');
        
        toast({
          title: 'Error loading DOCX',
          description: 'There was a problem loading the document',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    if (file) {
      loadDocxContent();
    }
  }, [file, toast]);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex items-center justify-center h-full p-4 text-destructive">
        <div className="flex flex-col items-center gap-2 max-w-md text-center">
          <AlertCircle className="h-8 w-8" />
          <h3 className="font-semibold">DOCX Viewer Error</h3>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="h-full overflow-auto bg-card p-4">
      <div 
        className="prose dark:prose-invert max-w-none" 
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </div>
  );
};
