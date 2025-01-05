import React, { useRef } from 'react';
import { useDocumentPreview } from './useDocumentPreview';
import { PdfViewer } from './PdfViewer';
import { TextViewer } from './TextViewer';
import { AnnotationTools } from './AnnotationTools';
import { getFileType } from './FileConverter';

interface DocumentPreviewProps {
  file: File | null;
  url: string;
  selectedColor: string;
  isHighlighter?: boolean;
}

export const DocumentPreview = ({ 
  file, 
  url, 
  selectedColor, 
  isHighlighter = false 
}: DocumentPreviewProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const {
    content,
    isLoading,
    currentPage,
    totalPages,
    pdfDoc,
    renderPdfPage,
    handlePageChange,
    handleTextSelection,
    handleAddComment,
    handleSaveAnnotations,
  } = useDocumentPreview(file);

  React.useEffect(() => {
    if (pdfDoc && canvasRef.current) {
      renderPdfPage(currentPage).then(page => {
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        
        if (canvas && context) {
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          
          page.render({
            canvasContext: context,
            viewport: viewport
          });
        }
      });
    }
  }, [pdfDoc, currentPage, renderPdfPage]);

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
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto">
        {file && getFileType(file) === 'pdf' ? (
          <PdfViewer
            canvasRef={canvasRef}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        ) : (
          <TextViewer
            content={content}
            onTextSelection={handleTextSelection}
          />
        )}
      </div>
      <AnnotationTools
        onAddComment={handleAddComment}
        onSaveAnnotations={handleSaveAnnotations}
      />
    </div>
  );
};