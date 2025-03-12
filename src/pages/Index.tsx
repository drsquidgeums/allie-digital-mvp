
import React, { useState, lazy, Suspense } from "react";
import { WorkspaceLayout } from "@/components/WorkspaceLayout";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

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

  // Function to handle file selection
  const handleFileSelected = (file: File) => {
    console.log("File selected in Index:", file.name);
    setSelectedFile(file);
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
              />
            </Suspense>
          </ErrorBoundary>
        </WorkspaceLayout>
      </ErrorBoundary>
    </div>
  );
};

export default Index;
