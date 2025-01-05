import React from "react";
import { Card } from "@/components/ui/card";
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
    handleUpload,
    handleDelete,
    handleDownload,
    handleZoomIn,
    handleZoomOut
  } = useDocumentViewer();

  React.useEffect(() => {
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setUrl(fileUrl);
      return () => URL.revokeObjectURL(fileUrl);
    } else {
      setUrl("");
    }
  }, [file, setUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setUrl(fileUrl);
      toast({
        title: "File uploaded",
        description: `${file.name} has been added to the viewer`,
      });
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value.trim();
    
    // Handle empty URL
    if (!newUrl) {
      setUrl("");
      return;
    }

    try {
      // Special handling for data and blob URLs
      if (newUrl.startsWith('data:') || newUrl.startsWith('blob:')) {
        setUrl(newUrl);
        return;
      }

      // For regular URLs, ensure they have a protocol
      let processedUrl = newUrl;
      if (!newUrl.startsWith('http://') && !newUrl.startsWith('https://')) {
        processedUrl = `https://${newUrl}`;
      }

      // Remove any double slashes (except after protocol) and extra colons
      processedUrl = processedUrl
        .replace(/:\/+/g, '://')  // Fix protocol slashes
        .replace(/([^:])\/+/g, '$1/') // Fix other double slashes
        .replace(/:\//g, '/'); // Remove extra colons before slashes
      
      // Validate URL
      new URL(processedUrl);
      
      setUrl(processedUrl);
    } catch (error) {
      console.error('Invalid URL:', error);
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="h-full flex flex-col bg-card text-card-foreground animate-fade-in rounded-xl overflow-hidden relative">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <DocumentToolbar
            onUpload={handleUpload}
            onDownload={() => handleDownload(file)}
            onDelete={handleDelete}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
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
          />
        </div>
        <div className="h-full">
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
      />
    </Card>
  );
};