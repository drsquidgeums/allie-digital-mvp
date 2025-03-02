
import React, { useState, lazy, Suspense } from "react";
import { WorkspaceLayout } from "@/components/WorkspaceLayout";

// Lazy load DocumentViewer component
const DocumentViewer = lazy(() => import("@/components/DocumentViewer").then(module => ({
  default: module.DocumentViewer
})));

const Index = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>("#000000");

  return (
    <div>
      <WorkspaceLayout>
        <Suspense fallback={
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        }>
          <DocumentViewer 
            file={selectedFile}
            selectedColor={selectedColor}
            isHighlighter={true}
          />
        </Suspense>
      </WorkspaceLayout>
    </div>
  );
};

export default Index;
