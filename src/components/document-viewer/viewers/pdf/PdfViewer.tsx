
import React, { useState } from 'react';
import { Document, Page } from 'react-pdf';
import { useToast } from "@/hooks/use-toast";
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Initialize worker
import { pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString();

interface PdfViewerProps {
  file: File | null;
  url: string;
  selectedColor: string;
  isHighlighter?: boolean;
}

export const PdfViewer: React.FC<PdfViewerProps> = ({
  file,
  url,
  selectedColor,
  isHighlighter = false,
}) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    console.log('PDF loaded successfully with', numPages, 'pages');
    setNumPages(numPages);
    setIsLoading(false);
    toast({
      title: "PDF loaded",
      description: `Document loaded successfully with ${numPages} pages`,
    });
  };

  const onDocumentLoadError = (error: Error) => {
    console.error('Error loading PDF:', error);
    setIsLoading(false);
    toast({
      title: "Error",
      description: "Failed to load PDF document. Please try again.",
      variant: "destructive",
    });
  };

  const loadingMessage = (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
    </div>
  );

  console.log('Current file:', file?.name);
  console.log('Current URL:', url);

  return (
    <div className="flex flex-col h-full overflow-auto">
      <div className="flex justify-between p-4 border-b">
        <div className="flex gap-2">
          <button
            onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))}
            disabled={pageNumber <= 1}
            className="px-3 py-1 bg-primary text-primary-foreground rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span>
            Page {pageNumber} of {numPages}
          </span>
          <button
            onClick={() => setPageNumber(prev => Math.min(prev + 1, numPages))}
            disabled={pageNumber >= numPages}
            className="px-3 py-1 bg-primary text-primary-foreground rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-4">
        <Document
          file={file || url}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={loadingMessage}
          error={
            <div className="text-center text-red-500">
              Failed to load PDF. Please try again.
            </div>
          }
          noData={
            <div className="text-center text-gray-500">
              No PDF file selected.
            </div>
          }
          className="mx-auto"
        >
          {numPages > 0 && (
            <Page 
              pageNumber={pageNumber} 
              className="mx-auto"
              loading={loadingMessage}
              error="Failed to load page"
            />
          )}
        </Document>
      </div>
    </div>
  );
};
