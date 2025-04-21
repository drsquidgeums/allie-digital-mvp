
import React from "react";
import { ErrorBoundary } from "../ErrorBoundary";
import { DocumentPreview } from "./DocumentPreview";
import { UrlInputHandler } from "./UrlInputHandler";

interface DocumentViewerContentProps {
  documentRef: React.RefObject<HTMLDivElement>;
  url: string;
  setUrl: (url: string) => void;
  selectedFile: File | null;
  selectedColor: string;
  isHighlighter?: boolean;
  onSave?: (content: string, fileName: string) => void;
}

/**
 * DocumentViewerContent Component
 * 
 * Container for the document content area including URL input and preview
 */
export const DocumentViewerContent: React.FC<DocumentViewerContentProps> = ({
  documentRef,
  url,
  setUrl,
  selectedFile,
  selectedColor,
  isHighlighter,
  onSave
}) => {
  return (
    <div className="flex-1 p-4 relative">
      <UrlInputHandler url={url} setUrl={setUrl} />
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
              <ErrorFallback onClear={() => setUrl('')} />
            </div>
          }
        >
          <DocumentPreview 
            file={selectedFile} 
            url={url} 
            onSave={onSave}
          />
        </ErrorBoundary>
      </div>
    </div>
  );
};

/**
 * ErrorFallback Component
 * 
 * Displays an error message when document content fails to load
 */
const ErrorFallback: React.FC<{ onClear: () => void }> = ({ onClear }) => {
  return (
    <div className="flex items-center justify-center h-full p-4">
      <div className="max-w-md">
        <h3 className="font-semibold mb-2">Document Viewer Error</h3>
        <p className="text-sm mb-4">
          There was a problem displaying the document content.
        </p>
        <button 
          onClick={onClear}
          className="text-xs underline hover:text-muted-foreground"
        >
          Clear document and try again
        </button>
      </div>
    </div>
  );
};
