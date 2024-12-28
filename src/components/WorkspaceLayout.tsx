import React from "react";
import { Sidebar } from "./Sidebar";
import { DocumentViewer } from "./DocumentViewer";
import { useToast } from "@/hooks/use-toast";

export const WorkspaceLayout = () => {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [selectedColor, setSelectedColor] = React.useState("#000000");

  const handleFileUpload = (file: File) => {
    if (file.type === "application/pdf" || file.type === "application/msword" || 
        file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      setSelectedFile(file);
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

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar onFileUpload={handleFileUpload} onColorChange={setSelectedColor} />
      <main className="flex-1 p-6 overflow-auto">
        <DocumentViewer file={selectedFile} selectedColor={selectedColor} />
      </main>
    </div>
  );
};