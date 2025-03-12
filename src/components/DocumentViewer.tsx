
import React from "react";
import { ErrorBoundary } from "./ErrorBoundary";
import { useDocumentViewer } from "./document-viewer/useDocumentViewer";
import { DocumentViewerToolbar } from "./document-viewer/DocumentViewerToolbar";
import { DocumentViewerContent } from "./document-viewer/DocumentViewerContent";
import { FileInputHandler } from "./document-viewer/FileInputHandler";
import { useDocumentViewerEffects } from "./document-viewer/hooks/useDocumentViewerEffects";

interface DocumentViewerProps {
  file: File | null;
  selectedColor: string;
  isHighlighter?: boolean;
}

/**
 * DocumentViewer Component
 * 
 * A comprehensive document viewer that supports various file formats including PDF, TXT, and HTML.
 * Features include document upload, URL loading, annotation tools, and accessibility features.
 * 
 * @param file - The file to display in the viewer
 * @param selectedColor - The currently selected annotation color
 * @param isHighlighter - Boolean flag to determine if highlighter mode is active
 * @returns A fully functional document viewer UI component
 */
export const DocumentViewer = ({ 
  file,
  selectedColor, 
  isHighlighter 
}: DocumentViewerProps) => {
  // Custom hook that manages document state and actions
  const {
    url,
    setUrl,
    fileInputRef,
    documentRef,
    handleUpload,
    handleDelete,
    handleDownload,
    selectedFile,
    setSelectedFile,
  } = useDocumentViewer();
  
  // Use the file prop if provided, otherwise use the internal state
  const displayFile = file || selectedFile;
  
  // Custom hook to handle document viewer side effects
  useDocumentViewerEffects(displayFile, url);

  // Log the current file being displayed
  console.log("DocumentViewer rendering with file:", displayFile?.name);

  return (
    <div 
      className="h-full flex flex-col bg-card text-card-foreground animate-fade-in rounded-xl overflow-hidden relative"
      role="region"
      aria-label="Document viewer"
    >
      <ErrorBoundary>
        {/* Document Toolbar Section */}
        <DocumentViewerToolbar
          onUpload={handleUpload}
          onDownload={() => handleDownload(displayFile)}
          onDelete={handleDelete}
          hasFile={!!displayFile}
        />
        
        {/* Document Content Area */}
        <DocumentViewerContent
          documentRef={documentRef}
          url={url}
          setUrl={setUrl}
          selectedFile={displayFile}
          selectedColor={selectedColor}
          isHighlighter={isHighlighter}
        />
        
        {/* Hidden file input for document upload */}
        <FileInputHandler
          fileInputRef={fileInputRef}
          onFileChange={setSelectedFile}
        />
      </ErrorBoundary>
    </div>
  );
};

export default DocumentViewer;
