import React from "react";
import { DocumentViewer } from "@/components/DocumentViewer";
import { FileList } from "@/components/FileList";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export const Index = () => {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [uploadedFiles, setUploadedFiles] = React.useState<File[]>([]);
  const [selectedColor, setSelectedColor] = React.useState("#000000");
  const [isHighlighter, setIsHighlighter] = React.useState(false);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };

  const handleFileDelete = (fileToDelete: File) => {
    setUploadedFiles(files => files.filter(file => file !== fileToDelete));
    if (selectedFile === fileToDelete) {
      setSelectedFile(null);
    }
  };

  return (
    <div className="h-full flex flex-col gap-4 p-4 animate-fade-in">
      <ErrorBoundary>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
          <div className="space-y-4">
            <FileList
              files={uploadedFiles}
              onFileSelect={handleFileSelect}
              onFileDelete={handleFileDelete}
            />
          </div>
          <div className="h-full">
            <DocumentViewer
              file={selectedFile}
              selectedColor={selectedColor}
              isHighlighter={isHighlighter}
            />
          </div>
        </div>
      </ErrorBoundary>
    </div>
  );
};