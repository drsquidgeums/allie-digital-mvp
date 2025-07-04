
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { fetchFiles } from '../fileService';
import { setFiles } from '../fileStore';

/**
 * Hook for handling file refresh operations
 */
export function useFileRefresh() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const refreshFiles = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      console.log('Refreshing files from storage...');
      const freshFiles = await fetchFiles();
      setFiles(freshFiles);
      console.log('Files refreshed successfully, count:', freshFiles.length);
    } catch (error) {
      console.error('Error refreshing files:', error);
      toast({
        title: "Refresh failed",
        description: "There was a problem refreshing your files",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return { refreshFiles, loading };
}
