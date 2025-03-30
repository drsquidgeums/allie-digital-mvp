import React, { useState, lazy, Suspense, useEffect } from "react";
import { WorkspaceLayout } from "@/components/WorkspaceLayout";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { FloatingAIAssistant } from "@/components/chat/FloatingAIAssistant";
import { useFileManager } from "@/hooks/file-manager";

// Lazy load DocumentViewer component for better initial load performance
const DocumentViewer = lazy(() => import("@/components/DocumentViewer").then(module => ({
  default: module.DocumentViewer
})));

/**
 * Index Component
 * 
 * The main entry point for the application's document workspace.
 * Provides a document viewer with file selection capabilities and annotation tools.
 * Uses lazy loading to improve initial load performance.
 * 
 * @returns The main application interface
 */
const Index = () => {
  // State management for file selection and annotation color
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>("#000000");
  const [isHighlighter, setIsHighlighter] = useState<boolean>(true);
  const [documentContent, setDocumentContent] = useState<string>("");
  const [documentName, setDocumentName] = useState<string>("");
  const { files } = useFileManager();

  useEffect(() => {
    // Check if there's a selected file ID in sessionStorage
    const selectedFileId = sessionStorage.getItem('selectedFileId');
    
    if (selectedFileId && files.length > 0) {
      const fileToOpen = files.find(file => file.id === selectedFileId);
      
      if (fileToOpen?.file) {
        console.log("Opening file from MyFiles:", fileToOpen.name);
        setSelectedFile(fileToOpen.file);
        
        // Clear the selection after it's been used
        sessionStorage.removeItem('selectedFileId');
      }
    }
  }, [files]);

  // Function to handle file selection
  const handleFileSelected = (file: File) => {
    console.log("File selected in Index:", file.name);
    setSelectedFile(file);
  };

  // Function to handle document content loaded
  const handleContentLoaded = (content: string, name: string) => {
    setDocumentContent(content);
    setDocumentName(name);
  };

  /**
   * Loading indicator for the lazy-loaded DocumentViewer
   */
  const LoadingFallback = () => (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );

  /**
   * Error fallback for the DocumentViewer if it fails to load
   */
  const ErrorFallback = () => (
    <div className="flex items-center justify-center h-full p-6">
      <Alert variant="destructive" className="max-w-md">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Application Error</AlertTitle>
        <AlertDescription>
          <p className="text-sm mb-4">
            We encountered a problem loading the document viewer
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="text-xs underline hover:text-muted-foreground"
          >
            Refresh the page
          </button>
        </AlertDescription>
      </Alert>
    </div>
  );

  return (
    <div>
      {/* Top-level error boundary for the entire application */}
      <ErrorBoundary>
        <WorkspaceLayout>
          {/* Specific error boundary for the DocumentViewer component */}
          <ErrorBoundary fallback={<ErrorFallback />}>
            <Suspense fallback={<LoadingFallback />}>
              <DocumentViewer 
                file={selectedFile}
                selectedColor={selectedColor}
                isHighlighter={isHighlighter}
                onContentLoaded={handleContentLoaded}
              />
            </Suspense>
          </ErrorBoundary>
        </WorkspaceLayout>
        <FloatingAIAssistant 
          documentContent={documentContent}
          documentName={documentName}
        />
      </ErrorBoundary>
    </div>
  );
};

export default Index;
