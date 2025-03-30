
import React, { useState, useEffect } from "react";
import { WorkspaceLayout } from "@/components/WorkspaceLayout";
import { FileManager } from "@/components/file-manager/FileManager";
import { DocumentViewer } from "@/components/DocumentViewer";
import { ManagedFile } from "@/hooks/useFileManager";

const MyFilesPage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>("#FFFF00");
  const [isHighlighter, setIsHighlighter] = useState<boolean>(true);
  
  useEffect(() => {
    console.log("MyFilesPage mounted");
  }, []);
  
  const handleFileSelect = (file: ManagedFile) => {
    console.log("File selected in MyFilesPage:", file.name);
    // Convert ManagedFile back to File object for the DocumentViewer
    if (file.file) {
      setSelectedFile(file.file);
    } else if (file.url) {
      // If we don't have the File object but have a URL, we can fetch it
      fetch(file.url)
        .then(response => response.blob())
        .then(blob => {
          const newFile = new File([blob], file.name, { type: file.type });
          setSelectedFile(newFile);
        })
        .catch(error => {
          console.error("Error fetching file from URL:", error);
        });
    }
  };

  return (
    <WorkspaceLayout>
      <div className="p-6 space-y-6">
        <FileManager onFileSelect={handleFileSelect} />
        
        {selectedFile && (
          <div className="mt-8 border rounded-lg overflow-hidden h-[600px]">
            <DocumentViewer 
              file={selectedFile}
              selectedColor={selectedColor}
              isHighlighter={isHighlighter}
            />
          </div>
        )}
      </div>
    </WorkspaceLayout>
  );
};

export default MyFilesPage;
