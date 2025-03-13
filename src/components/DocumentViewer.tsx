
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
  isHighlighter,
  onContentLoaded
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
  
  // Custom hook to handle document viewer side effects
  useDocumentViewerEffects(displayFile, url);

  // Extract text content from the file when it changes
  useEffect(() => {
    const extractContent = async () => {
      if (displayFile) {
        try {
          const text = await extractTextFromFile(displayFile);
          setDocumentContent(text);
          if (onContentLoaded) {
            onContentLoaded(text, displayFile.name);
          }
        } catch (error) {
          console.error("Error extracting text from file:", error);
        }
      } else {
        setDocumentContent("");
      }
    };
    
    extractContent();
  }, [displayFile, onContentLoaded]);

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
