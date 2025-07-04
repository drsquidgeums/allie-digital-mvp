
import React, { useState, useEffect } from "react";
import { ErrorBoundary } from "./ErrorBoundary";
import { useDocumentViewer } from "./document-viewer/useDocumentViewer";
import { DocumentViewerToolbar } from "./document-viewer/DocumentViewerToolbar";
import { DocumentViewerContent } from "./document-viewer/DocumentViewerContent";
import { FileInputHandler } from "./document-viewer/FileInputHandler";
import { useDocumentViewerEffects } from "./document-viewer/hooks/useDocumentViewerEffects";
import { extractTextFromFile } from "./document-viewer/FileConverter";

interface DocumentViewerProps {
  file: File | null;
  selectedColor: string;
  isHighlighter?: boolean;
  onContentLoaded?: (content: string, fileName: string) => void;
  initialDocumentName?: string;
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
 * @param onContentLoaded - Callback function when document content is loaded
 * @param initialDocumentName - Initial document name to display
 * @returns A fully functional document viewer UI component
 */
export const DocumentViewer = ({ 
  file,
  selectedColor, 
  isHighlighter,
  onContentLoaded,
  initialDocumentName
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
  
  // State to track extracted text content
  const [documentContent, setDocumentContent] = useState<string>("");
  const [documentName, setDocumentName] = useState<string>("");
  
  // Custom hook to handle document viewer side effects
  useDocumentViewerEffects(displayFile, url);

  // Extract text content from the file when it changes
  useEffect(() => {
    const extractContent = async () => {
      if (displayFile) {
        try {
          const text = await extractTextFromFile(displayFile);
          setDocumentContent(text);
          const displayName = initialDocumentName || displayFile.name;
          setDocumentName(displayName);
          if (onContentLoaded) {
            onContentLoaded(text, displayName);
          }
        } catch (error) {
          console.error("Error extracting text from file:", error);
        }
      } else {
        setDocumentContent("");
        setDocumentName("");
      }
    };
    
    extractContent();
  }, [displayFile, onContentLoaded, initialDocumentName]);

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
        
        {/* Document Content Area with Study Session Tracker at bottom */}
        <DocumentViewerContent
          documentRef={documentRef}
          url={url}
          setUrl={setUrl}
          selectedFile={displayFile}
          selectedColor={selectedColor}
          isHighlighter={isHighlighter}
          documentName={documentName}
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
