import React from 'react';
import { PdfViewer } from './viewers/PdfViewer';
import { TextViewer } from './viewers/TextViewer';
import { getFileType } from './FileConverter';

interface DocumentPreviewProps {
  file: File | null;
  url: string;
  selectedColor: string;
  isHighlighter?: boolean;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  file,
  url,
  selectedColor,
  isHighlighter
}) => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [pdfDoc, setPdfDoc] = React.useState<any>(null);

  React.useEffect(() => {
    if (file) {
      const loadDocument = async () => {
        try {
          const fileType = getFileType(file);
          if (fileType === 'pdf') {
            const { getDocument } = await import('pdfjs-dist');
            const arrayBuffer = await file.arrayBuffer();
            const doc = await getDocument({ data: arrayBuffer }).promise;
            setPdfDoc(doc);
            setTotalPages(doc.numPages);
            setCurrentPage(1);
          }
        } catch (error) {
          console.error('Error loading document:', error);
        }
      };
      loadDocument();
    }
  }, [file]);

  if (!file && !url) {
    return (
      <div 
        className="flex items-center justify-center h-full text-muted-foreground"
        role="status"
        aria-label="No document loaded"
      >
        Upload a file or paste a URL to view
      </div>
    );
  }

  if (file) {
    try {
      const fileType = getFileType(file);
      switch (fileType) {
        case 'pdf':
          return (
            <PdfViewer
              pdfDoc={pdfDoc}
              currentPage={currentPage}
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
              selectedColor={selectedColor}
              isHighlighter={isHighlighter}
            />
          );
        case 'txt':
        case 'html':
          return <TextViewer file={file} />;
        default:
          return (
            <div 
              className="text-destructive"
              role="alert"
              aria-live="polite"
            >
              Unsupported file type
            </div>
          );
      }
    } catch (error) {
      return (
        <div 
          className="text-destructive"
          role="alert"
          aria-live="polite"
        >
          Error loading file
        </div>
      );
    }
  }

  if (url) {
    return (
      <iframe
        src={url}
        className="w-full h-full border-0"
        title="Document preview"
        sandbox="allow-same-origin allow-scripts"
        tabIndex={0}
      />
    );
  }

  return null;
};