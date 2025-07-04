
import { useEffect, useCallback } from 'react';
import { getFiles } from './fileStore';
import { useFileState } from './core/useFileState';
import { useFileUpload } from './operations/useFileUpload';
import { useFileUpdate } from './operations/useFileUpdate';
import { useFileDelete } from './operations/useFileDelete';
import { useFileDownload } from './operations/useFileDownload';
import { useFileRefresh } from './operations/useFileRefresh';

/**
 * Main hook for managing file operations across the application
 */
export function useFileManager() {
  const { files } = useFileState();
  const { uploadFile, loading: uploadLoading } = useFileUpload();
  const { updateFile, loading: updateLoading } = useFileUpdate();
  const { deleteFile } = useFileDelete();
  const { downloadFile } = useFileDownload();
  const { refreshFiles, loading: refreshLoading } = useFileRefresh();

  // Combined loading state
  const loading = uploadLoading || updateLoading || refreshLoading;

  // Memoized initialization function
  const initializeFiles = useCallback(async () => {
    try {
      if (getFiles().length === 0 && !loading) {
        console.log('Initializing files from storage...');
        await refreshFiles();
      }
    } catch (error) {
      console.error('Failed to initialize files:', error);
    }
  }, [loading, refreshFiles]);

  // Initialize by loading files from Supabase storage if not already loaded
  useEffect(() => {
    initializeFiles();
  }, [initializeFiles]);

  return {
    files,
    loading,
    uploadFile,
    updateFile,
    deleteFile,
    downloadFile,
    refreshFiles
  };
}
