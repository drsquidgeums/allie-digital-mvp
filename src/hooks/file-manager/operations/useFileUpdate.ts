import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ManagedFile } from '../types';
import { uploadFileToStorage, deleteFileFromStorage } from '../fileService';
import { updateFile } from '../fileStore';

/**
 * Hook for handling file update operations
 */
export function useFileUpdate() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleFileUpdate = useCallback(async (existingFile: ManagedFile, newContent: File, metadata?: Record<string, any>): Promise<ManagedFile | null> => {
    if (!existingFile || !newContent) {
      console.error('Missing required parameters for file update');
      return null;
    }

    setLoading(true);
    try {
      console.log('Updating file:', existingFile.name, 'with new content');
      
      // Delete the old file first if it has a path
      if (existingFile.path) {
        try {
          await deleteFileFromStorage(existingFile.path);
        } catch (deleteError) {
          console.warn('Failed to delete old file, continuing with update:', deleteError);
        }
      }
      
      // Upload the new content
      const displayName = metadata?.originalName || existingFile.displayName || existingFile.name;
      const updatedFileObject = await uploadFileToStorage(newContent, {
        ...metadata,
        originalName: displayName
      });
      
      if (updatedFileObject) {
        console.log('File updated successfully, new file object:', updatedFileObject);
        
        // Update the file in global state keeping the same ID for consistency
        const updatedFile: ManagedFile = {
          ...updatedFileObject,
          id: existingFile.id,
          displayName: displayName
        };
        
        updateFile(existingFile.id, updatedFile);
        
        console.log('Updated file in global state with ID:', existingFile.id);
        
        toast({
          title: "File updated",
          description: `${displayName} has been updated successfully`,
        });
        
        return updatedFile;
      }
      throw new Error('File update failed - no updated file object returned');
    } catch (error) {
      console.error("Error updating file:", error);
      toast({
        title: "Update failed",
        description: error instanceof Error ? error.message : "There was a problem updating your file",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return { updateFile: handleFileUpdate, loading };
}
