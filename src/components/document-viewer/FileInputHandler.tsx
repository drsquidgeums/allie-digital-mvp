
import React from "react";
import { useToast } from "@/hooks/use-toast";

interface FileInputHandlerProps {
  fileInputRef: React.RefObject<HTMLInputElement>;
  onFileChange: (file: File) => void;
}

/**
 * FileInputHandler Component
 * 
 * Handles file input changes and validation for the document viewer
 */
export const FileInputHandler: React.FC<FileInputHandlerProps> = ({ 
  fileInputRef, 
  onFileChange 
}) => {
  const { toast } = useToast();

  /**
   * Handles file upload from the file input
   * Includes validation for file size (25MB limit)
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (file) {
        console.log("File selected in FileInputHandler:", file.name);
        
        // Basic validation
        if (file.size > 25 * 1024 * 1024) { // 25MB limit
          toast({
            title: "File too large",
            description: "Please upload a file smaller than 25MB",
            variant: "destructive",
          });
          return;
        }
        
        onFileChange(file);
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
    <input
      type="file"
      ref={fileInputRef}
      className="hidden"
      accept=".pdf,.doc,.docx,.txt,.html"
      onChange={handleFileChange}
      aria-hidden="true"
    />
  );
};
