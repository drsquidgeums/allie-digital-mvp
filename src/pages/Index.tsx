
import React, { useState, lazy, Suspense } from "react";
import { WorkspaceLayout } from "@/components/WorkspaceLayout";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

// Lazy load DocumentViewer component
const DocumentViewer = lazy(() => import("@/components/DocumentViewer").then(module => ({
  default: module.DocumentViewer
})));

const Index = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>("#000000");

  const LoadingFallback = () => (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );

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
      <ErrorBoundary>
        <WorkspaceLayout>
          <ErrorBoundary fallback={<ErrorFallback />}>
            <Suspense fallback={<LoadingFallback />}>
              <DocumentViewer 
                file={selectedFile}
                selectedColor={selectedColor}
                isHighlighter={true}
              />
            </Suspense>
          </ErrorBoundary>
        </WorkspaceLayout>
      </ErrorBoundary>
    </div>
  );
};

export default Index;
