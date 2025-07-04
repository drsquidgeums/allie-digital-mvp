
import { useToast } from '@/hooks/use-toast';
import { ManagedFile } from '../types';
import { createDownloadUrl } from '../fileService';

/**
 * Hook for handling file download operations
 */
export function useFileDownload() {
  const { toast } = useToast();

  const downloadFile = async (file: ManagedFile) => {
    try {
      // If we already have a URL, use it
      if (file.url) {
        const a = document.createElement("a");
        a.href = file.url;
        a.download = file.displayName || file.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        toast({
          title: "File downloaded",
          description: `${file.displayName || file.name} has been downloaded`,
        });
      } 
      // If the URL has expired, generate a new one
      else if (file.path) {
        const signedUrl = await createDownloadUrl(file.path);
        
        const a = document.createElement("a");
        a.href = signedUrl;
        a.download = file.displayName || file.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        toast({
          title: "File downloaded",
          description: `${file.displayName || file.name} has been downloaded`,
        });
      } else {
        throw new Error("File URL not available");
      }
    } catch (error) {
      console.error("Error downloading file:", error);
      toast({
        title: "Download failed",
        description: error instanceof Error ? error.message : "There was a problem downloading your file",
        variant: "destructive",
      });
    }
  };

  return { downloadFile };
}
