
import React, { useEffect, useRef, useState } from 'react';
import { Viewer } from '@pdfme/ui';
import { generate } from '@pdfme/generator';
import { BLANK_PDF } from '@pdfme/common';
import { useToast } from '@/hooks/use-toast';

interface SimplePdfViewerProps {
  url?: string;
  file?: File;
  selectedColor: string;
  isHighlighter: boolean;
  onContentLoaded?: (content: string, fileName: string) => void;
}

export const SimplePdfViewer: React.FC<SimplePdfViewerProps> = ({
  url,
  file,
  selectedColor,
  isHighlighter,
  onContentLoaded
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!containerRef.current) return;

    const loadPdf = async () => {
      setIsLoading(true);
      try {
        let pdfData: Uint8Array | null = null;

        // Clean up existing viewer
        if (viewerRef.current) {
          viewerRef.current.destroy();
          viewerRef.current = null;
        }

        // Get PDF data from file or URL
        if (file) {
          const arrayBuffer = await file.arrayBuffer();
          pdfData = new Uint8Array(arrayBuffer);
        } else if (url) {
          const response = await fetch(url);
          const arrayBuffer = await response.arrayBuffer();
          pdfData = new Uint8Array(arrayBuffer);
        }

        // Create a basic empty schema structure required by pdfme
        const emptySchema = [
          [
            {
              name: 'empty',
              type: 'text',
              position: { x: 0, y: 0 },
              width: 0,
              height: 0,
            }
          ]
        ];

        // Initialize viewer with PDF data or blank PDF
        const template = {
          basePdf: pdfData || BLANK_PDF,
          schemas: emptySchema
        };

        // Create and initialize the viewer
        const viewer = new Viewer({
          domContainer: containerRef.current,
          template,
          inputs: [{}], // Add empty inputs array as required by pdfme Viewer
          options: {
            readonly: true, // View-only mode
          },
        });

        viewerRef.current = viewer;

        // Extract text content (basic implementation)
        if (onContentLoaded && (file || url)) {
          // This is a simplified version - actual text extraction might require additional processing
          const fileName = file?.name || url?.split('/').pop() || 'document.pdf';
          const textContent = 'PDF content loaded. Text extraction is limited with pdfme.';
          onContentLoaded(textContent, fileName);
        }

        toast({
          title: "PDF loaded",
          description: "Document has been loaded successfully",
        });
      } catch (error) {
        console.error('Error loading PDF:', error);
        toast({
          title: "Error",
          description: "Failed to load PDF document",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadPdf();

    // Clean up on unmount
    return () => {
      if (viewerRef.current) {
        viewerRef.current.destroy();
      }
    };
  }, [file, url, onContentLoaded, toast]);

  // Handle highlighting functionality (simplified)
  useEffect(() => {
    if (viewerRef.current && isHighlighter) {
      // Note: pdfme doesn't have built-in highlighting like PDFTron
      // This would be a placeholder for future highlighting implementation
      console.log('Highlight color changed:', selectedColor);
    }
  }, [selectedColor, isHighlighter]);

  return (
    <div className="relative h-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      )}
      <div ref={containerRef} className="h-full w-full"></div>
    </div>
  );
};
