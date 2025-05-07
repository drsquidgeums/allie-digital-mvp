
import React, { useEffect, useState } from 'react';
import { convertDocxToHtml } from '../FileConverter';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface DocxViewerProps {
  file: File;
}

export const DocxViewer: React.FC<DocxViewerProps> = ({ file }) => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);
        const html = await convertDocxToHtml(file);
        setContent(html);
        setError(null);
      } catch (err) {
        console.error('Error converting DOCX:', err);
        setError('Failed to load document content');
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [file]);

  // Function to download the original file
  const handleDownload = () => {
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <span className="ml-3">Converting document...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4">
        <p className="text-destructive mb-4">{error}</p>
        <Button variant="outline" onClick={handleDownload}>
          <Download className="h-4 w-4 mr-2" />
          Download Original File
        </Button>
      </div>
    );
  }

  return (
    <div className="docx-viewer flex flex-col h-full">
      <div className="bg-muted p-2 flex justify-between items-center border-b">
        <span className="text-sm font-medium">{file.name}</span>
        <Button variant="ghost" size="sm" onClick={handleDownload}>
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
      </div>
      
      <div 
        className="p-4 overflow-auto flex-grow"
        dangerouslySetInnerHTML={{ __html: content }}
        role="document"
        aria-label="Document content"
      />
    </div>
  );
};
