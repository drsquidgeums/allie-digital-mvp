
import React, { useState, lazy, Suspense, useEffect } from "react";
import { WorkspaceLayout } from "@/components/WorkspaceLayout";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useFileManager } from "@/hooks/file-manager";
import { useUserAnalytics } from "@/hooks/useUserAnalytics";
import { FloatingAIButton } from "@/components/FloatingAIButton";

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
  const { trackDocumentAction } = useUserAnalytics();

  useEffect(() => {
    // Check if there's a selected file ID in sessionStorage
    const selectedFileId = sessionStorage.getItem('selectedFileId');
    const selectedFileUrl = sessionStorage.getItem('selectedFileUrl');
    const selectedFileName = sessionStorage.getItem('selectedFileName');
    
    if (selectedFileId && files.length > 0) {
      const fileToOpen = files.find(file => file.id === selectedFileId);
      
      if (fileToOpen?.file) {
        setSelectedFile(fileToOpen.file);
        
        // Set document name from sessionStorage if available
        if (selectedFileName) {
          setDocumentName(selectedFileName);
        }
        
        // Clear the selection after it's been used
        sessionStorage.removeItem('selectedFileId');
        sessionStorage.removeItem('selectedFileUrl');
        sessionStorage.removeItem('selectedFileName');
      } else if (selectedFileUrl && fileToOpen) {
        // If we don't have the File object but have URL, need to fetch it
        console.log('Index.tsx - Fetching file from URL:', selectedFileUrl);
        console.log('Index.tsx - File info:', fileToOpen);
        
        fetch(selectedFileUrl)
          .then(response => {
            console.log('Index.tsx - Fetch response status:', response.status);
            return response.blob();
          })
          .then(blob => {
            console.log('Index.tsx - Received blob:', blob.size, 'bytes, type:', blob.type);
            
            // Read the blob content to check what we're getting
            const reader = new FileReader();
            reader.onload = (e) => {
              const content = e.target?.result as string;
              console.log('Index.tsx - Blob content preview:', content.substring(0, 300));
            };
            reader.readAsText(blob);
            
            const file = new File([blob], fileToOpen.name, { type: fileToOpen.type || 'application/octet-stream' });
            console.log('Index.tsx - Created File object:', file.name, file.type, file.size);
            setSelectedFile(file);
            
            // Set document name from sessionStorage if available
            if (selectedFileName) {
              setDocumentName(selectedFileName);
            }
          })
          .catch(error => {
            console.error("Error loading file from URL:", error);
          })
          .finally(() => {
            // Clear the selection after it's been used
            sessionStorage.removeItem('selectedFileId');
            sessionStorage.removeItem('selectedFileUrl');
            sessionStorage.removeItem('selectedFileName');
          });
      }
    }
  }, [files]);

  // Function to handle file selection
  const handleFileSelected = (file: File) => {
    setSelectedFile(file);
  };

  // Function to handle document content loaded
  const handleContentLoaded = (content: string, name: string) => {
    setDocumentContent(content);
    // Only set the document name if it's not already set from sessionStorage
    if (!documentName) {
      setDocumentName(name);
    }
    // Track document loading
    trackDocumentAction('document_loaded', { 
      documentName: name, 
      contentLength: content.length 
    });
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
          {/* Document Viewer */}
          <ErrorBoundary fallback={<ErrorFallback />}>
            <Suspense fallback={<LoadingFallback />}>
              <DocumentViewer 
                file={selectedFile}
                selectedColor={selectedColor}
                isHighlighter={isHighlighter}
                onContentLoaded={handleContentLoaded}
                initialDocumentName={documentName}
              />
            </Suspense>
          </ErrorBoundary>
        </WorkspaceLayout>
        
        {/* Floating AI Button */}
        <FloatingAIButton />
      </ErrorBoundary>
    </div>
  );
};

export default Index;
