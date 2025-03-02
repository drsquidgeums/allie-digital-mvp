
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

/**
 * DocumentViewer Component
 * 
 * A comprehensive document viewer that supports various file formats including PDF, TXT, and HTML.
 * Features include document upload, URL loading, annotation tools, and accessibility features.
 * 
 * @param selectedColor - The currently selected annotation color
 * @param isHighlighter - Boolean flag to determine if highlighter mode is active
 * @returns A fully functional document viewer UI component
 */
export const DocumentViewer = ({ selectedColor, isHighlighter }: DocumentViewerProps) => {
  const { toast } = useToast();
  
  // Custom hook that manages document state and actions
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

  /**
   * Auto-activates accessibility tools when content is loaded
   * This useEffect activates Bionic Reader and Text-to-Speech tools
   * when a document is loaded (either via file upload or URL)
   */
  useEffect(() => {
    if (selectedFile || url) {
      try {
        // Find and activate the Bionic Reader and TTS tools
        const toolbarTools = document.querySelectorAll('[data-tool-id]');
        const bionicTool = Array.from(toolbarTools).find(
          tool => tool.getAttribute('data-tool-id') === 'bionic'
        );
        const ttsTool = Array.from(toolbarTools).find(
          tool => tool.getAttribute('data-tool-id') === 'tts'
        );

        // Programmatically click the tools to activate them
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

  /**
   * Handles keyboard events for the URL input field
   * - Escape key clears the URL and removes focus
   * - Enter key confirms the URL and shows a toast notification
   */
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

  /**
   * Updates the URL state when the input field changes
   */
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  /**
   * Handles file upload from the file input
   * Includes validation for file size (25MB limit)
   */
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
        {/* Document Toolbar Section */}
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
        
        {/* Document Content Area */}
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
        
        {/* Hidden file input for document upload */}
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
