import React from "react";
import { Sidebar } from "./Sidebar";
import { DocumentViewer } from "./DocumentViewer";
import { ThemeProvider } from "./ThemeProvider";
import { useToast } from "@/hooks/use-toast";

export const WorkspaceLayout = () => {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);

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
    <div className="flex h-screen bg-workspace overflow-hidden">
      <Sidebar onFileUpload={handleFileUpload} />
      <main className="flex-1 p-6 overflow-auto">
        <DocumentViewer file={selectedFile} />
      </main>
      <ThemeProvider />
    </div>
  );
};