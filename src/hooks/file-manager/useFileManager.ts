
import React, { useCallback } from 'react';
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

  // Initialize files only once if needed
  const initializeFiles = useCallback(async () => {
    if (getFiles().length === 0 && !loading) {
      await refreshFiles();
    }
  }, [refreshFiles, loading]);

  // Only initialize once when component mounts
  React.useEffect(() => {
    let mounted = true;
    
    const init = async () => {
      if (mounted) {
        await initializeFiles();
      }
    };
    
    init();
    
    return () => {
      mounted = false;
    };
  }, []); // Remove dependencies to prevent re-initialization

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
