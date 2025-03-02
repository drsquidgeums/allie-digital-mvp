
import React, { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { ThemeProvider } from "./ThemeProvider";
import { useDocumentViewer } from "./document-viewer/useDocumentViewer";
import { DocumentToolbar } from "./document-viewer/DocumentToolbar";
import { DocumentPreview } from "./document-viewer/DocumentPreview";
import { ToolbarTools } from "./document-viewer/ToolbarTools";
import { UrlInput } from "./document-viewer/UrlInput";
import { ColorHeader } from "./color-tool/ColorHeader";
import { ColorPresets } from "./color-tool/ColorPresets";

interface DocumentViewerProps {
  file: File | null;
  selectedColor: string;
  isHighlighter?: boolean;
}

export const DocumentViewer = ({ selectedColor, isHighlighter = true }: DocumentViewerProps) => {
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

  const presetColors = ["#F87171", "#FBBF24", "#34D399", "#60A5FA", "#A78BFA", "#FB7185", "#000000", "#6B7280"];

  // Auto-activate Bionic Reader and TTS when content is loaded
  useEffect(() => {
    if (selectedFile || url) {
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
      <div className="p-2 sm:p-3 md:p-4 border-b border-border">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <DocumentToolbar
            onUpload={handleUpload}
            onDownload={() => handleDownload(selectedFile)}
            onDelete={handleDelete}
            hasFile={!!selectedFile}
          />
          <div className="flex flex-wrap items-center gap-2 mt-2 sm:mt-0">
            <ToolbarTools />
            <ThemeProvider />
          </div>
        </div>
        
        <div className="mt-3 flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <div className="w-full sm:w-auto">
            <ColorHeader 
              isHighlighter={!!isHighlighter} 
              onHighlighterToggle={() => {}} 
            />
          </div>
          <div className="w-full sm:w-auto mt-2 sm:mt-0">
            <ColorPresets 
              presetColors={presetColors}
              isHighlighter={!!isHighlighter}
              onColorSelect={() => {}}
            />
          </div>
        </div>
      </div>
      
      <div className="flex-1 p-2 sm:p-4 relative">
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
          <DocumentPreview 
            file={selectedFile} 
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

export default { DocumentViewer };
