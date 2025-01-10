import React, { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { convertDocxToHtml, readTextFile, loadPdfDocument, getFileType } from './FileConverter';
import { useToast } from '@/hooks/use-toast';
import { PdfViewer } from './viewers/PdfViewer';
import { TextViewer } from './viewers/TextViewer';

interface DocumentPreviewProps {
  file: File | null;
  url: string;
  selectedColor: string;
  isHighlighter?: boolean;
}

export const DocumentPreview = ({ file, url, selectedColor, isHighlighter = false }: DocumentPreviewProps) => {
  const [content, setContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!file && url) {
      setContent(`<iframe src="${url}" style="width:100%; height:100vh; border:none;" title="Document preview"></iframe>`);
      return;
    }

    if (!file) return;

    const loadDocument = async () => {
      setIsLoading(true);
      try {
        const fileType = getFileType(file);
        
        switch (fileType) {
          case 'pdf':
            const arrayBuffer = await loadPdfDocument(file);
            const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
            setPdfDoc(pdf);
            setTotalPages(pdf.numPages);
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
  }, [file, url, toast]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight' && currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    } else if (e.key === 'ArrowLeft' && currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  if (!file && !url) {
    return (
      <div 
        className="h-full flex items-center justify-center"
        role="status"
        aria-label="No document loaded"
      >
        <p className="text-muted-foreground">Upload a document or paste a URL to get started</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div 
        className="h-full flex items-center justify-center"
        role="status"
        aria-label="Loading document"
      >
        <p className="text-muted-foreground">Loading document...</p>
      </div>
    );
  }

  return (
    <div 
      className="flex flex-col h-full"
      ref={previewRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      role="document"
      aria-label={file ? `Document preview: ${file.name}` : 'Document preview'}
    >
      {file && getFileType(file) === 'pdf' ? (
        <PdfViewer
          pdfDoc={pdfDoc}
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
          selectedColor={selectedColor}
          isHighlighter={isHighlighter}
        />
      ) : (
        <TextViewer content={content} />
      )}
    </div>
  );
};