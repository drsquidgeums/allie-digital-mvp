import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ManagedFile } from '../types';
import { uploadFileToStorage, deleteFileFromStorage } from '../fileService';
import { updateFile, getFiles } from '../fileStore';

/**
 * Hook for handling file update operations
 */
export function useFileUpdate() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleFileUpdate = async (existingFile: ManagedFile, newContent: File, metadata?: Record<string, any>) => {
    setLoading(true);
    try {
      console.log('Updating file:', existingFile.name, 'with new content');
      
      // Delete the old file first
      if (existingFile.path) {
        await deleteFileFromStorage(existingFile.path);
      }
      
      // Upload the new content with a new timestamp to ensure fresh URL
      const displayName = metadata?.originalName || existingFile.displayName || existingFile.name;
      const updatedFileObject = await uploadFileToStorage(newContent, {
        ...metadata,
        originalName: displayName
      });
      
      if (updatedFileObject) {
        console.log('File updated successfully, new file object:', updatedFileObject);
        
        // Update the file in global state keeping the same ID for consistency
        const updatedFile = {
          ...updatedFileObject,
          id: existingFile.id,
          displayName: displayName
        };
        
        updateFile(existingFile.id, updatedFile);
        
        console.log('Updated file in global state with ID:', existingFile.id);
        
        return updatedFile;
      }
      throw new Error('File update failed');
    } catch (error) {
      console.error("Error updating file:", error);
      toast({
        title: "Update failed",
        description: error instanceof Error ? error.message : "There was a problem updating your file",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { updateFile: handleFileUpdate, loading };
}
