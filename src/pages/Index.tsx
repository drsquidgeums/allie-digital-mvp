
import React, { useState, lazy, Suspense } from "react";
import { WorkspaceLayout } from "@/components/WorkspaceLayout";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

// Lazy load DocumentViewer component
const DocumentViewer = lazy(() => import("@/components/DocumentViewer").then(module => ({
  default: module.DocumentViewer
})));

const Index = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>("#000000");
  const [isHighlighter, setIsHighlighter] = useState<boolean>(true);
  const { toast } = useToast();

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    toast({
      title: "Color changed",
      description: `New color selected: ${color}`,
    });
  };
  
  const handleHighlighterToggle = (isHighlighter: boolean) => {
    setIsHighlighter(isHighlighter);
    toast({
      title: isHighlighter ? "Highlighter mode activated" : "Pen mode activated",
      description: isHighlighter ? "You can now highlight text" : "You can now annotate with pen",
    });
  };

  return (
    <div className="min-h-screen">
      <WorkspaceLayout>
        <Suspense fallback={
          <div className="flex flex-col space-y-4 p-4 h-full">
            <div className="h-8 w-full bg-muted/50 rounded animate-pulse"></div>
            <Skeleton className="h-[calc(100vh-8rem)] w-full rounded-md" />
          </div>
        }>
          <DocumentViewer 
            file={selectedFile}
            selectedColor={selectedColor}
            isHighlighter={isHighlighter}
          />
        </Suspense>
      </WorkspaceLayout>
    </div>
  );
};

export default Index;
