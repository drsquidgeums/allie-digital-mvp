
import React from "react";
import { useDocumentViewer } from "./document-viewer/useDocumentViewer";
import { useDocumentAccessibility } from "./document-viewer/useDocumentAccessibility";
import { DocumentViewerHeader } from "./document-viewer/DocumentViewerHeader";
import { DocumentViewerContent } from "./document-viewer/DocumentViewerContent";
import { FileUploadInput } from "./document-viewer/FileUploadInput";
import { ErrorBoundary } from "./ErrorBoundary";
import { useToast } from "@/hooks/use-toast";

interface DocumentViewerProps {
  file: File | null;
  selectedColor: string;
  isHighlighter?: boolean;
}

export const DocumentViewer = ({ selectedColor, isHighlighter }: DocumentViewerProps) => {
  const { toast } = useToast();
  
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

  // Hook for document accessibility features
  useDocumentAccessibility(selectedFile, url);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setUrl('');
      e.currentTarget.blur();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (url.trim()) {
        toast({
          title: "URL loaded",
          description: "Document URL has been loaded into the viewer",
        });
      }
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  const handleFileChange = (file: File) => {
    setSelectedFile(file);
  };

  return (
    <div 
      className="h-full flex flex-col bg-card text-card-foreground animate-fade-in rounded-xl overflow-hidden relative"
      role="region"
      aria-label="Document viewer"
    >
      <ErrorBoundary>
        <DocumentViewerHeader
          onUpload={handleUpload}
          onDownload={() => handleDownload(selectedFile)}
          onDelete={handleDelete}
          hasFile={!!selectedFile}
        />
        
        <DocumentViewerContent
          url={url}
          selectedFile={selectedFile}
          documentRef={documentRef}
          selectedColor={selectedColor}
          isHighlighter={isHighlighter}
          onUrlChange={handleUrlChange}
          onKeyDown={handleKeyDown}
          onClearDocument={handleDelete}
        />
        
        <FileUploadInput
          fileInputRef={fileInputRef}
          onFileChange={handleFileChange}
        />
      </ErrorBoundary>
    </div>
  );
};
