
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ManagedFile } from '../types';
import { uploadFileToStorage } from '../fileService';
import { addFile, getFiles } from '../fileStore';

/**
 * Hook for handling file upload operations
 */
export function useFileUpload() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const uploadFile = async (newFile: File, metadata?: Record<string, any>) => {
    setLoading(true);
    try {
      // Upload to Supabase storage
      const fileObject = await uploadFileToStorage(newFile, metadata);
      
      if (fileObject) {
        // Add to global files state
        addFile(fileObject);
        
        toast({
          title: "File uploaded",
          description: `${metadata?.originalName || newFile.name} has been uploaded to Supabase storage`,
        });
        
        return fileObject;
      }
      throw new Error('File upload failed');
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "There was a problem uploading your file",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { uploadFile, loading };
}
