
import React from 'react';
import { UrlInput } from './UrlInput';
import { DocumentPreview } from './DocumentPreview';
import { ErrorBoundary } from '../ErrorBoundary';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface DocumentViewerContentProps {
  url: string;
  selectedFile: File | null;
  documentRef: React.RefObject<HTMLDivElement>;
  selectedColor: string;
  isHighlighter?: boolean;
  onUrlChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onClearDocument: () => void;
}

export const DocumentViewerContent: React.FC<DocumentViewerContentProps> = ({
  url,
  selectedFile,
  documentRef,
  selectedColor,
  isHighlighter,
  onUrlChange,
  onKeyDown,
  onClearDocument
}) => {
  return (
    <div className="flex-1 p-4 relative">
      <UrlInput 
        url={url}
        onChange={onUrlChange}
        onKeyDown={onKeyDown}
      />
      <div 
        className="h-full" 
        ref={documentRef}
        tabIndex={0}
        role="document"
        aria-label={selectedFile ? `Viewing ${selectedFile.name}` : "Document preview area"}
      >
        <ErrorBoundary
          fallback={
            <div className="flex items-center justify-center h-full p-4">
              <Alert variant="destructive" className="max-w-md">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Document Viewer Error</AlertTitle>
                <AlertDescription>
                  <p className="text-sm mb-4">
                    There was a problem displaying the document content.
                  </p>
                  <button 
                    onClick={onClearDocument}
                    className="text-xs underline hover:text-muted-foreground"
                  >
                    Clear document and try again
                  </button>
                </AlertDescription>
              </Alert>
            </div>
          }
        >
          <DocumentPreview 
            file={selectedFile} 
            url={url} 
            selectedColor={selectedColor}
            isHighlighter={isHighlighter} 
          />
        </ErrorBoundary>
      </div>
    </div>
  );
};
