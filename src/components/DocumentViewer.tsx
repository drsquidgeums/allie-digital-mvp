import React from "react";
import { useToast } from "@/hooks/use-toast";
import { ThemeProvider } from "./ThemeProvider";
import { Input } from "@/components/ui/input";
import { useDocumentViewer } from "./document-viewer/useDocumentViewer";
import { DocumentToolbar } from "./document-viewer/DocumentToolbar";
import { DocumentPreview } from "./document-viewer/DocumentPreview";

interface DocumentViewerProps {
  file: File | null;
  selectedColor: string;
  isHighlighter?: boolean;
}

export const DocumentViewer = ({ file, selectedColor, isHighlighter }: DocumentViewerProps) => {
  const { toast } = useToast();
  const {
    url,
    setUrl,
    fileInputRef,
    documentRef,
    handleUpload,
    handleDelete,
    handleDownload,
    setSelectedFile,
  } = useDocumentViewer();

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      toast({
        title: "File uploaded",
        description: `${file.name} has been added to the viewer`,
      });
    }
  };

  return (
    <div 
      className="h-full flex flex-col bg-card text-card-foreground animate-fade-in rounded-xl overflow-hidden relative"
      role="region"
      aria-label="Document viewer"
    >
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <DocumentToolbar
            onUpload={handleUpload}
            onDownload={() => handleDownload(file)}
            onDelete={handleDelete}
            hasFile={!!file}
          />
          <ThemeProvider />
        </div>
      </div>
      <div className="flex-1 p-4 relative">
        <div className="mb-4">
          <Input
            type="url"
            placeholder="Paste URL here"
            className="w-full"
            value={url}
            onChange={handleUrlChange}
            onKeyDown={handleKeyDown}
            aria-label="Document URL input"
            role="textbox"
            aria-describedby="url-input-help"
          />
          <div id="url-input-help" className="sr-only">
            Press Enter to load the URL or Escape to clear the input
          </div>
        </div>
        <div 
          className="h-full" 
          ref={documentRef}
          tabIndex={0}
          role="document"
          aria-label={file ? `Viewing ${file.name}` : "Document preview area"}
        >
          <DocumentPreview 
            file={file} 
            url={url} 
            selectedColor={selectedColor}
            isHighlighter={isHighlighter} 
          />
        </div>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept=".pdf,.doc,.docx,.txt,.html"
        onChange={handleFileChange}
        aria-hidden="true"
      />
    </div>
  );
};