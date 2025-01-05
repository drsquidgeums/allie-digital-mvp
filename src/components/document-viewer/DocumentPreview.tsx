import React, { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { 
  convertDocxToHtml, 
  readTextFile, 
  loadPdfDocument, 
  getFileType,
  convertOdtToHtml,
  convertRtfToHtml,
  convertEpubToHtml,
  convertMarkdownToHtml
} from './FileConverter';
import { useToast } from '@/hooks/use-toast';
import { AnnotationTools } from './AnnotationTools';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pdfDoc, setPdfDoc] = useState<any>(null);

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
            setPdfDoc(pdf);
            setTotalPages(pdf.numPages);
            await renderPdfPage(pdf, currentPage);
            break;

          case 'docx':
          case 'doc':
            const docContent = await convertDocxToHtml(file);
            setContent(docContent);
            break;

          case 'odt':
            const odtContent = await convertOdtToHtml(file);
            setContent(odtContent);
            break;

          case 'rtf':
            const rtfContent = await convertRtfToHtml(file);
            setContent(rtfContent);
            break;

          case 'txt':
            const textContent = await readTextFile(file);
            setContent(`<div style="white-space: pre-wrap;">${textContent}</div>`);
            break;

          case 'html':
            const htmlContent = await readTextFile(file);
            setContent(htmlContent);
            break;

          case 'epub':
            const epubContent = await convertEpubToHtml(file);
            setContent(epubContent);
            break;

          case 'md':
            const mdContent = await convertMarkdownToHtml(file);
            setContent(mdContent);
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
  }, [file, currentPage, toast]);

  const renderPdfPage = async (pdf: any, pageNumber: number) => {
    if (!canvasRef.current) return;
    
    const page = await pdf.getPage(pageNumber);
    const viewport = page.getViewport({ scale: 1.5 });
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    if (canvas && context) {
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      
      await page.render({
        canvasContext: context,
        viewport: viewport
      }).promise;
    }
  };

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

      // Save highlight annotation
      setAnnotations(prev => [...prev, {
        type: 'highlight',
        content: range.toString(),
        color: isHighlighter ? selectedColor : undefined,
        page: currentPage,
      }]);
    }
  };

  const handleAddComment = (comment: string) => {
    setAnnotations(prev => [...prev, {
      type: 'comment',
      content: comment,
      page: currentPage,
      position: { x: 0, y: 0 }, // You can implement position selection later
    }]);
  };

  const handleSaveAnnotations = () => {
    // Save annotations to localStorage or your backend
    localStorage.setItem(`annotations-${file?.name}`, JSON.stringify(annotations));
    toast({
      title: "Annotations saved",
      description: "Your annotations have been saved successfully",
    });
  };

  const handlePageChange = async (direction: 'prev' | 'next') => {
    if (!pdfDoc) return;
    
    const newPage = direction === 'next' 
      ? Math.min(currentPage + 1, totalPages)
      : Math.max(currentPage - 1, 1);
    
    setCurrentPage(newPage);
    await renderPdfPage(pdfDoc, newPage);
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
    <div className="flex flex-col h-full">
      <div 
        ref={containerRef} 
        className="flex-1 overflow-auto"
        onMouseUp={handleTextSelection}
      >
        {file && getFileType(file) === 'pdf' ? (
          <div className="relative">
            <canvas ref={canvasRef} className="w-full" />
            {totalPages > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-background/80 p-2 rounded-lg shadow">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange('prev')}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange('next')}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div
            className="p-4"
            dangerouslySetInnerHTML={{ __html: content }}
            contentEditable
            style={{ minHeight: '100%' }}
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
