import React from "react";
import { Sidebar } from "./Sidebar";
import { DocumentViewer } from "./DocumentViewer";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "react-router-dom";

export const WorkspaceLayout = () => {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [selectedColor, setSelectedColor] = React.useState("#000000");
  const [isHighlighter, setIsHighlighter] = React.useState(false);
  const [uploadedFiles, setUploadedFiles] = React.useState<File[]>([]);
  const location = useLocation();

  React.useEffect(() => {
    const savedOverlay = localStorage.getItem('irlenOverlayColor');
    if (savedOverlay) {
      document.documentElement.style.setProperty('--overlay-color', savedOverlay);
      document.documentElement.style.setProperty('--overlay-display', 'block');
    }
  }, []);

  if (["/tasks", "/mind-map", "/ai-assistant"].includes(location.pathname)) {
    return null;
  }

  const handleFileUpload = (file: File) => {
    if (file.type === "application/pdf" || 
        file.type === "application/msword" || 
        file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      setSelectedFile(file);
      setUploadedFiles(prevFiles => {
        // Check if file already exists
        const exists = prevFiles.some(f => 
          f.name === file.name && 
          f.size === file.size && 
          f.lastModified === file.lastModified
        );
        if (!exists) {
          return [...prevFiles, file];
        }
        return prevFiles;
      });
      
      toast({
        title: "File uploaded successfully",
        description: `${file.name} has been added to your workspace`,
      });
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF or DOC file",
        variant: "destructive",
      });
    }
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    toast({
      title: "File selected",
      description: `${file.name} is now active`,
    });
  };

  const handleFileDelete = (fileToDelete: File) => {
    setUploadedFiles(prev => prev.filter(file => file !== fileToDelete));
    if (selectedFile === fileToDelete) {
      setSelectedFile(null);
    }
  };

  const handleColorChange = (color: string, highlighter?: boolean) => {
    setSelectedColor(color);
    setIsHighlighter(!!highlighter);
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar 
        onFileUpload={handleFileUpload} 
        onColorChange={handleColorChange}
        uploadedFiles={uploadedFiles}
        onFileSelect={handleFileSelect}
        onFileDelete={handleFileDelete}
      />
      <main className="flex-1 p-6 overflow-auto">
        <DocumentViewer 
          file={selectedFile} 
          selectedColor={selectedColor}
          isHighlighter={isHighlighter}
        />
      </main>
    </div>
  );
};