
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ManagedFile } from '../types';
import { updateFileInStorage } from '../fileService';
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
      const displayName = existingFile.displayName || metadata?.originalName || existingFile.name;
      console.log('Updating file:', displayName, 'preserving filename structure');
      
      // Use the new updateFileInStorage function that preserves filenames
      const updatedFileObject = await updateFileInStorage(existingFile, newContent, {
        ...metadata,
        originalName: displayName
      });
      
      if (updatedFileObject) {
        console.log('File updated successfully, filename preserved:', updatedFileObject.displayName);
        
        // Update the file in global state with preserved metadata
        updateFile(existingFile.id, updatedFileObject);
        
        toast({
          title: "File updated",
          description: `${displayName} has been updated successfully`,
        });
        
        return updatedFileObject;
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
