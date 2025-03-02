
import React, { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { ThemeProvider } from "./ThemeProvider";
import { useDocumentViewer } from "./document-viewer/useDocumentViewer";
import { DocumentToolbar } from "./document-viewer/DocumentToolbar";
import { DocumentPreview } from "./document-viewer/DocumentPreview";
import { ToolbarTools } from "./document-viewer/ToolbarTools";
import { UrlInput } from "./document-viewer/UrlInput";
import { ErrorBoundary } from "./ErrorBoundary";
import { AlertCircle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface DocumentViewerProps {
  file: File | null;
  selectedColor: string;
  isHighlighter?: boolean;
}

export const DocumentViewer = ({ selectedColor, isHighlighter }: DocumentViewerProps) => {
  const { toast } = useToast();
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

  // Auto-activate Bionic Reader and TTS when content is loaded
  useEffect(() => {
    if (selectedFile || url) {
      try {
        const toolbarTools = document.querySelectorAll('[data-tool-id]');
        const bionicTool = Array.from(toolbarTools).find(
          tool => tool.getAttribute('data-tool-id') === 'bionic'
        );
        const ttsTool = Array.from(toolbarTools).find(
          tool => tool.getAttribute('data-tool-id') === 'tts'
        );

        if (bionicTool instanceof HTMLElement) {
          bionicTool.click();
        }
        if (ttsTool instanceof HTMLElement) {
          ttsTool.click();
        }

        toast({
          title: "Tools activated",
          description: "Bionic Reader and Text-to-Speech are now available for this document",
        });
      } catch (error) {
        console.error("Error activating document tools:", error);
        // Don't show error toast here to avoid overwhelming the user
      }
    }
  }, [selectedFile, url, toast]);

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
    try {
      const file = e.target.files?.[0];
      if (file) {
        // Basic validation
        if (file.size > 25 * 1024 * 1024) { // 25MB limit
          toast({
            title: "File too large",
            description: "Please upload a file smaller than 25MB",
            variant: "destructive",
          });
          return;
        }
        
        setSelectedFile(file);
        toast({
          title: "File uploaded",
          description: `${file.name} has been added to the viewer`,
        });
      }
    } catch (error) {
      console.error("Error handling file change:", error);
      toast({
        title: "Upload failed",
        description: "There was a problem processing your file",
        variant: "destructive",
      });
    }
  };

  return (
    <div 
      className="h-full flex flex-col bg-card text-card-foreground animate-fade-in rounded-xl overflow-hidden relative"
      role="region"
      aria-label="Document viewer"
    >
      <ErrorBoundary>
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between gap-2">
            <DocumentToolbar
              onUpload={handleUpload}
              onDownload={() => handleDownload(selectedFile)}
              onDelete={handleDelete}
              hasFile={!!selectedFile}
            />
            <div className="flex items-center gap-2">
              <ToolbarTools />
              <ThemeProvider />
            </div>
          </div>
        </div>
        <div className="flex-1 p-4 relative">
          <UrlInput 
            url={url}
            onChange={handleUrlChange}
            onKeyDown={handleKeyDown}
          />
          <div 
            className="h-full" 
            ref={documentRef}
            tabIndex={0}
            role="document"
            aria-label={selectedFile ? `Viewing ${selectedFile.name}` : "Document preview area"}
          >
            <ErrorBoundary
              fallback={
                <div className="flex items-center justify-center h-full p-4">
                  <Alert variant="destructive" className="max-w-md">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Document Viewer Error</AlertTitle>
                    <AlertDescription>
                      <p className="text-sm mb-4">
                        There was a problem displaying the document content.
                      </p>
                      <button 
                        onClick={handleDelete}
                        className="text-xs underline hover:text-muted-foreground"
                      >
                        Clear document and try again
                      </button>
                    </AlertDescription>
                  </Alert>
                </div>
              }
            >
              <DocumentPreview 
                file={selectedFile} 
                url={url} 
                selectedColor={selectedColor}
                isHighlighter={isHighlighter} 
              />
            </ErrorBoundary>
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
      </ErrorBoundary>
    </div>
  );
};
