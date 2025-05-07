
import React, { useState, useEffect, useCallback } from "react";
import { ErrorBoundary } from "./ErrorBoundary";
import { useDocumentViewer } from "./document-viewer/useDocumentViewer";
import { DocumentViewerToolbar } from "./document-viewer/DocumentViewerToolbar";
import { DocumentViewerContent } from "./document-viewer/DocumentViewerContent";
import { FileInputHandler } from "./document-viewer/FileInputHandler";
import { useDocumentViewerEffects } from "./document-viewer/hooks/useDocumentViewerEffects";
import { extractTextFromFile } from "./document-viewer/FileConverter";
import { toast } from "@/hooks/use-toast";

interface DocumentViewerProps {
  file: File | null;
  selectedColor: string;
  isHighlighter?: boolean;
  onContentLoaded?: (content: string, fileName: string) => void;
}

/**
 * DocumentViewer Component
 * 
 * A comprehensive document viewer that supports various file formats including PDF, DOCX, TXT, and HTML.
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
  const [isDragging, setIsDragging] = useState(false);
  
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

  // Handle drag events for file upload
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      
      // Basic validation
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      const allowedTypes = ['pdf', 'doc', 'docx', 'txt', 'html', 'htm'];
      
      if (fileExtension && allowedTypes.includes(fileExtension)) {
        setSelectedFile(file);
        toast({
          title: "File uploaded",
          description: `${file.name} has been added to the viewer`,
        });
      } else {
        toast({
          title: "Unsupported file type",
          description: `Supported files: ${allowedTypes.join(', ')}`,
          variant: "destructive",
        });
      }
    }
  }, [setSelectedFile, toast]);

  // Log the current file being displayed
  console.log("DocumentViewer rendering with file:", displayFile?.name);

  return (
    <div 
      className={`h-full flex flex-col bg-card text-card-foreground animate-fade-in rounded-xl overflow-hidden relative ${isDragging ? 'ring-2 ring-primary' : ''}`}
      role="region"
      aria-label="Document viewer"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
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
        
        {/* Drag and drop overlay */}
        {isDragging && (
          <div className="absolute inset-0 bg-primary/10 flex items-center justify-center pointer-events-none z-10 border-2 border-dashed border-primary rounded-xl">
            <div className="text-center p-4 bg-card rounded-lg shadow-lg">
              <p className="font-medium text-lg">Drop your file here</p>
              <p className="text-muted-foreground text-sm">PDF, DOCX, TXT, HTML supported</p>
            </div>
          </div>
        )}
      </ErrorBoundary>
    </div>
  );
};

export default DocumentViewer;
