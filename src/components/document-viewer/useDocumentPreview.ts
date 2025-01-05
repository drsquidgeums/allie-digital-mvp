import { useState, useEffect } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { useToast } from '@/hooks/use-toast';
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

interface Annotation {
  type: 'highlight' | 'comment';
  content: string;
  color?: string;
  page: number;
  position?: { x: number; y: number };
}

export const useDocumentPreview = (file: File | null) => {
  const [content, setContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const { toast } = useToast();

  const loadDocument = async () => {
    if (!file) return;
    
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

  const renderPdfPage = async (pageNumber: number) => {
    if (!pdfDoc) return;
    
    const page = await pdfDoc.getPage(pageNumber);
    return page;
  };

  const handlePageChange = async (direction: 'prev' | 'next') => {
    if (!pdfDoc) return;
    
    const newPage = direction === 'next' 
      ? Math.min(currentPage + 1, totalPages)
      : Math.max(currentPage - 1, 1);
    
    setCurrentPage(newPage);
  };

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && !selection.isCollapsed) {
      const range = selection.getRangeAt(0);
      const span = document.createElement('span');
      span.style.backgroundColor = `${selection}40`;
      span.style.padding = '0 2px';
      range.surroundContents(span);
      selection.removeAllRanges();

      setAnnotations(prev => [...prev, {
        type: 'highlight',
        content: range.toString(),
        page: currentPage,
      }]);
    }
  };

  const handleAddComment = (comment: string) => {
    setAnnotations(prev => [...prev, {
      type: 'comment',
      content: comment,
      page: currentPage,
      position: { x: 0, y: 0 },
    }]);
  };

  const handleSaveAnnotations = () => {
    localStorage.setItem(`annotations-${file?.name}`, JSON.stringify(annotations));
    toast({
      title: "Annotations saved",
      description: "Your annotations have been saved successfully",
    });
  };

  useEffect(() => {
    loadDocument();
  }, [file]);

  return {
    content,
    isLoading,
    currentPage,
    totalPages,
    pdfDoc,
    annotations,
    renderPdfPage,
    handlePageChange,
    handleTextSelection,
    handleAddComment,
    handleSaveAnnotations,
  };
};