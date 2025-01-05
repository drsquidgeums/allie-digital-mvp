import React, { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { convertDocxToHtml, readTextFile, loadPdfDocument, getFileType } from './FileConverter';
import { useToast } from '@/hooks/use-toast';

// Initialize PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface DocumentPreviewProps {
  file: File | null;
  url: string;
  selectedColor: string;
  isHighlighter?: boolean;
}

export const DocumentPreview = ({ file, url, selectedColor, isHighlighter = false }: DocumentPreviewProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [content, setContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!file) return;

    const loadDocument = async () => {
      setIsLoading(true);
      try {
        const fileType = getFileType(file);
        
        switch (fileType) {
          case 'pdf':
            const arrayBuffer = await loadPdfDocument(file);
            const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
            const page = await pdf.getPage(1);
            const viewport = page.getViewport({ scale: 1.5 });
            
            const canvas = canvasRef.current;
            if (canvas) {
              const context = canvas.getContext('2d');
              canvas.height = viewport.height;
              canvas.width = viewport.width;
              
              if (context) {
                await page.render({
                  canvasContext: context,
                  viewport: viewport
                }).promise;
              }
            }
            break;

          case 'docx':
            const htmlContent = await convertDocxToHtml(file);
            setContent(htmlContent);
            break;

          case 'txt':
            const textContent = await readTextFile(file);
            setContent(`<div style="white-space: pre-wrap;">${textContent}</div>`);
            break;

          case 'html':
            const htmlFileContent = await readTextFile(file);
            setContent(htmlFileContent);
            break;
        }

        toast({
          title: "Document loaded successfully",
          description: `${file.name} has been loaded into the viewer`,
        });
      } catch (error) {
        console.error('Error loading document:', error);
        toast({
          title: "Error loading document",
          description: "There was an error loading your document. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadDocument();
  }, [file, toast]);

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && !selection.isCollapsed) {
      const range = selection.getRangeAt(0);
      const span = document.createElement('span');
      
      if (isHighlighter) {
        span.style.backgroundColor = `${selectedColor}40`;
        span.style.padding = '0 2px';
      } else {
        span.style.color = selectedColor;
      }
      
      range.surroundContents(span);
      selection.removeAllRanges();
    }
  };

  if (!file && !url) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-muted-foreground">Upload a document or paste a URL to get started</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-muted-foreground">Loading document...</p>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full overflow-auto"
      onMouseUp={handleTextSelection}
    >
      {file && getFileType(file) === 'pdf' ? (
        <canvas ref={canvasRef} className="w-full" />
      ) : (
        <div
          className="p-4"
          dangerouslySetInnerHTML={{ __html: content }}
          contentEditable
          style={{ minHeight: '100%' }}
        />
      )}
    </div>
  );
};