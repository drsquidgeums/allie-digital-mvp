import React, { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { ThemeProvider } from "./ThemeProvider";
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { highlightPlugin } from '@react-pdf-viewer/highlight';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { DocumentToolbar } from "./document-viewer/DocumentToolbar";
import { ToolbarTools } from "./document-viewer/ToolbarTools";
import { UrlInput } from "./document-viewer/UrlInput";

// Import styles
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import '@react-pdf-viewer/highlight/lib/styles/index.css';

interface DocumentViewerProps {
  file: File | null;
  selectedColor: string;
  isHighlighter?: boolean;
}

export const DocumentViewer = ({ selectedColor, isHighlighter }: DocumentViewerProps) => {
  const { toast } = useToast();
  const [url, setUrl] = React.useState('');
  const [fileUrl, setFileUrl] = React.useState('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);

  // Initialize plugins
  const highlightPluginInstance = highlightPlugin({
    enableAreaSelection: true,
    highlightColor: selectedColor,
  });

  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  useEffect(() => {
    if (selectedFile) {
      const objectUrl = URL.createObjectURL(selectedFile);
      setFileUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [selectedFile]);

  const handleUpload = () => {
    fileInputRef.current?.click();
  };

  const handleDelete = () => {
    setUrl("");
    setFileUrl("");
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    toast({
      title: "File deleted",
      description: "The document has been removed from the viewer",
    });
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

  return (
    <div 
      className="h-full flex flex-col bg-card text-card-foreground animate-fade-in rounded-xl overflow-hidden relative"
      role="region"
      aria-label="Document viewer"
    >
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between gap-2">
          <DocumentToolbar
            onUpload={handleUpload}
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
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <div className="h-full bg-white rounded-lg overflow-hidden">
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
            {(fileUrl || url) ? (
              <Viewer
                fileUrl={fileUrl || url}
                plugins={[
                  highlightPluginInstance,
                  defaultLayoutPluginInstance,
                ]}
                defaultScale={1.2}
                theme={{
                  theme: 'light',
                }}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Upload a file or paste a URL to view
              </div>
            )}
          </Worker>
        </div>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept=".pdf"
        onChange={handleFileChange}
        aria-hidden="true"
      />
    </div>
  );
};