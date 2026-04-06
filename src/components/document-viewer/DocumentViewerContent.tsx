
import React from "react";
import { ErrorBoundary } from "../ErrorBoundary";
import { DocumentPreview } from "./DocumentPreview";
import { StudySessionTracker } from "../study/StudySessionTracker";

interface DocumentViewerContentProps {
  documentRef: React.RefObject<HTMLDivElement>;
  url: string;
  setUrl: (url: string) => void;
  selectedFile: File | null;
  selectedColor: string;
  isHighlighter?: boolean;
  documentName?: string;
}

/**
 * DocumentViewerContent Component
 * 
 * Container for the document content area including preview
 */
export const DocumentViewerContent: React.FC<DocumentViewerContentProps> = ({
  documentRef,
  url,
  setUrl,
  selectedFile,
  selectedColor,
  isHighlighter,
  documentName
}) => {
  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 p-4 relative overflow-auto">
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
              selectedColor={selectedColor}
              isHighlighter={isHighlighter} 
            />
          </ErrorBoundary>
        </div>
      </div>
      
      {/* Study Session Tracker at the bottom */}
      {selectedFile && documentName && (
        <div className="border-t border-border p-4">
          <StudySessionTracker documentName={documentName} />
        </div>
      )}
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
          aria-label="Clear document and try again"
        >
          Clear document and try again
        </button>
      </div>
    </div>
  );
};
