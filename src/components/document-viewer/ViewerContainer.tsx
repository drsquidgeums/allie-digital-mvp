import React from 'react';
import { Card } from "@/components/ui/card";
import { DocumentToolbar } from "./DocumentToolbar";
import { ThemeProvider } from "../ThemeProvider";
import { UrlInput } from "./UrlInput";
import { DocumentPreview } from "./DocumentPreview";

interface ViewerContainerProps {
  file: File | null;
  url: string;
  setUrl: (url: string) => void;
  selectedColor: string;
  isHighlighter?: boolean;
  onUpload: () => void;
  onDownload: () => void;
  onDelete: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
}

export const ViewerContainer = ({
  file,
  url,
  setUrl,
  selectedColor,
  isHighlighter,
  onUpload,
  onDownload,
  onDelete,
  onZoomIn,
  onZoomOut,
}: ViewerContainerProps) => {
  return (
    <Card className="h-full flex flex-col bg-card text-card-foreground animate-fade-in rounded-xl overflow-hidden relative">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <DocumentToolbar
            onUpload={onUpload}
            onDownload={onDownload}
            onDelete={onDelete}
            onZoomIn={onZoomIn}
            onZoomOut={onZoomOut}
            hasFile={!!file}
          />
          <ThemeProvider />
        </div>
      </div>
      <div className="flex-1 p-4 relative">
        <UrlInput url={url} setUrl={setUrl} />
        <div className="h-full">
          <DocumentPreview 
            file={file} 
            url={url} 
            selectedColor={selectedColor}
            isHighlighter={isHighlighter} 
          />
        </div>
      </div>
    </Card>
  );
};