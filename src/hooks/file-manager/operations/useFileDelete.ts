
import { useToast } from '@/hooks/use-toast';
import { ManagedFile } from '../types';
import { deleteFileFromStorage } from '../fileService';
import { removeFile, getFiles } from '../fileStore';

/**
 * Hook for handling file deletion operations
 */
export function useFileDelete() {
  const { toast } = useToast();

  const deleteFile = async (fileToDelete: ManagedFile) => {
    try {
      if (fileToDelete.path) {
        // Delete from Supabase storage
        await deleteFileFromStorage(fileToDelete.path);
      }
      
      // Remove from global files state
      removeFile(fileToDelete.id);
      
      toast({
        title: "File deleted",
        description: `${fileToDelete.displayName || fileToDelete.name} has been removed`,
      });
    } catch (error) {
      console.error("Error deleting file:", error);
      toast({
        title: "Delete failed",
        description: error instanceof Error ? error.message : "There was a problem deleting your file",
        variant: "destructive",
      });
    }
  };

  return { deleteFile };
}
