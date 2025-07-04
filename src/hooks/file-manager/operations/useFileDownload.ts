
import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ManagedFile } from '../types';
import { createDownloadUrl } from '../fileService';

/**
 * Hook for handling file download operations
 */
export function useFileDownload() {
  const { toast } = useToast();

  const downloadFile = useCallback(async (file: ManagedFile): Promise<void> => {
    if (!file) {
      console.error('No file provided for download');
      return;
    }

    try {
      let downloadUrl = file.url;
      
      // If no URL or URL has expired, generate a new one
      if (!downloadUrl && file.path) {
        downloadUrl = await createDownloadUrl(file.path);
      }
      
      if (!downloadUrl) {
        throw new Error("File URL not available");
      }
      
      // Create and trigger download
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = file.displayName || file.name;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      toast({
        title: "File downloaded",
        description: `${file.displayName || file.name} has been downloaded`,
      });
    } catch (error) {
      console.error("Error downloading file:", error);
      toast({
        title: "Download failed",
        description: error instanceof Error ? error.message : "There was a problem downloading your file",
        variant: "destructive",
      });
    }
  }, [toast]);

  return { downloadFile };
}
