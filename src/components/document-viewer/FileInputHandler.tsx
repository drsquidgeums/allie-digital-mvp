
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useFileManager } from "@/hooks/useFileManager";
import { UploadProgress } from "@/components/ui/upload-progress";
import { formatBytes } from "@/utils/fileUtils";

interface FileInputHandlerProps {
  fileInputRef: React.RefObject<HTMLInputElement>;
  onFileChange: (file: File) => void;
}

/**
 * FileInputHandler Component
 * 
 * Handles file input changes and validation for the document viewer
 * with enhanced upload progress indicators
 */
export const FileInputHandler: React.FC<FileInputHandlerProps> = ({ 
  fileInputRef, 
  onFileChange 
}) => {
  const { toast } = useToast();
  const { uploadFile } = useFileManager();
  const [uploadProgress, setUploadProgress] = useState<{
    fileName: string;
    progress: number;
    status: 'uploading' | 'completed' | 'error';
    fileSize: string;
  } | null>(null);

  /**
   * Handles file upload from the file input
   * Includes validation for file size (25MB limit) and progress tracking
   */
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

        // Initialize upload progress
        setUploadProgress({
          fileName: file.name,
          progress: 0,
          status: 'uploading',
          fileSize: formatBytes(file.size)
        });
        
        // Simulate progress updates (in real scenario, this would come from upload service)
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => {
            if (!prev || prev.progress >= 90) return prev;
            return {
              ...prev,
              progress: Math.min(prev.progress + Math.random() * 20, 90)
            };
          });
        }, 200);
        
        // Update local state for document viewer immediately
        onFileChange(file);
        
        // Also upload to file manager (which stores in Supabase)
        const uploadedFile = await uploadFile(file);
        
        // Complete the progress
        clearInterval(progressInterval);
        setUploadProgress(prev => prev ? {
          ...prev,
          progress: 100,
          status: 'completed'
        } : null);
        
        toast({
          title: "File uploaded",
          description: `${file.name} has been added to the viewer and saved to your files`,
        });

        // Hide progress after completion
        setTimeout(() => {
          setUploadProgress(null);
        }, 2000);
      }
    } catch (error) {
      setUploadProgress(prev => prev ? {
        ...prev,
        status: 'error'
      } : null);
      
      toast({
        title: "Upload failed",
        description: "There was a problem processing your file",
        variant: "destructive",
      });

      // Hide progress after error
      setTimeout(() => {
        setUploadProgress(null);
      }, 3000);
    } finally {
      // Clear the file input to allow uploading the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept=".pdf,.doc,.docx,.txt,.html"
        onChange={handleFileChange}
        aria-hidden="true"
      />
      
      {/* Upload Progress Indicator */}
      {uploadProgress && (
        <div className="fixed bottom-4 right-4 w-80 z-50 transition-all duration-300 ease-in-out">
          <UploadProgress
            fileName={uploadProgress.fileName}
            progress={uploadProgress.progress}
            status={uploadProgress.status}
            fileSize={uploadProgress.fileSize}
            onCancel={() => setUploadProgress(null)}
          />
        </div>
      )}
    </>
  );
};
