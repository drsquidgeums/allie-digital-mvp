
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { fetchFiles } from '../fileService';
import { setFiles } from '../fileStore';

/**
 * Hook for handling file refresh operations
 */
export function useFileRefresh() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const refreshFiles = async () => {
    setLoading(true);
    try {
      const freshFiles = await fetchFiles();
      setFiles(freshFiles);
    } catch (error) {
      toast({
        title: "Refresh failed",
        description: "There was a problem refreshing your files",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return { refreshFiles, loading };
}
