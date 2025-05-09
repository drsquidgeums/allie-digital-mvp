
import React, { useState, useEffect } from 'react';
import { readTextFile } from '../../FileConverter';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle } from 'lucide-react';

interface TextViewerWrapperProps {
  file: File;
}

export const TextViewerWrapper: React.FC<TextViewerWrapperProps> = ({ file }) => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    const loadTextContent = async () => {
      try {
        setLoading(true);
        const text = await readTextFile(file);
        setContent(text);
      } catch (err) {
        console.error('Error loading text file:', err);
        setError((err as Error).message || 'Failed to load text document');
        
        toast({
          title: 'Error loading text',
          description: 'There was a problem loading the document',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    if (file) {
      loadTextContent();
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
          <h3 className="font-semibold">Text Viewer Error</h3>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="h-full overflow-auto bg-card p-4">
      <pre className="whitespace-pre-wrap text-sm font-mono">{content}</pre>
    </div>
  );
};
