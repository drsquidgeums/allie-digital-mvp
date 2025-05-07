
import React, { useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useFileManager } from "@/hooks/useFileManager";

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
  const { uploadFile } = useFileManager();

  /**
   * Handles file upload from the file input
   * Includes validation for file size (25MB limit)
   */
  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
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
        
        // Validate file type
        const fileExtension = file.name.split('.').pop()?.toLowerCase();
        const allowedTypes = ['pdf', 'doc', 'docx', 'txt', 'html', 'htm'];
        
        if (fileExtension && !allowedTypes.includes(fileExtension)) {
          toast({
            title: "Unsupported file type",
            description: `Supported files: ${allowedTypes.join(', ')}`,
            variant: "destructive",
          });
          return;
        }
        
        // Update local state for document viewer
        onFileChange(file);
        
        // Also upload to file manager (which stores in Supabase)
        const uploadedFile = await uploadFile(file);
        console.log("File uploaded successfully:", uploadedFile);
        
        toast({
          title: "File uploaded",
          description: `${file.name} has been added to the viewer and saved to your files`,
        });
      }
    } catch (error) {
      console.error("Error handling file change:", error);
      toast({
        title: "Upload failed",
        description: "There was a problem processing your file",
        variant: "destructive",
      });
    } finally {
      // Clear the file input to allow uploading the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, [onFileChange, toast, uploadFile, fileInputRef]);

  return (
    <input
      type="file"
      ref={fileInputRef}
      className="hidden"
      accept=".pdf,.doc,.docx,.txt,.html,.htm"
      onChange={handleFileChange}
      aria-hidden="true"
    />
  );
};
