
import { useEffect, useCallback } from 'react';

const STORAGE_KEY = 'editor_persisted_file';

interface PersistedFileData {
  fileName: string;
  fileType: string;
  content: string;
  lastModified: number;
  url?: string;
}

/**
 * Hook to persist editor file state across navigation
 * Saves the current file to sessionStorage so it survives page changes
 */
export const useEditorPersistence = () => {
  /**
   * Save the current file data to sessionStorage
   */
  const persistFile = useCallback((file: File | null, content: string, url?: string) => {
    if (!file && !content) {
      sessionStorage.removeItem(STORAGE_KEY);
      return;
    }

    const data: PersistedFileData = {
      fileName: file?.name || 'Untitled Document',
      fileType: file?.type || 'text/plain',
      content,
      lastModified: Date.now(),
      url
    };

    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to persist editor state:', error);
    }
  }, []);

  /**
   * Retrieve persisted file data from sessionStorage
   */
  const getPersistedFile = useCallback((): PersistedFileData | null => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (!stored) return null;
      
      const data = JSON.parse(stored) as PersistedFileData;
      
      // Check if data is stale (older than 24 hours)
      const oneDay = 24 * 60 * 60 * 1000;
      if (Date.now() - data.lastModified > oneDay) {
        sessionStorage.removeItem(STORAGE_KEY);
        return null;
      }
      
      return data;
    } catch (error) {
      console.warn('Failed to retrieve persisted editor state:', error);
      return null;
    }
  }, []);

  /**
   * Create a File object from persisted data
   */
  const createFileFromPersisted = useCallback((data: PersistedFileData): File | null => {
    try {
      const blob = new Blob([data.content], { type: data.fileType });
      return new File([blob], data.fileName, { 
        type: data.fileType,
        lastModified: data.lastModified 
      });
    } catch (error) {
      console.warn('Failed to create file from persisted data:', error);
      return null;
    }
  }, []);

  /**
   * Clear persisted file data
   */
  const clearPersistedFile = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY);
  }, []);

  /**
   * Check if there's persisted data available
   */
  const hasPersistedFile = useCallback((): boolean => {
    return sessionStorage.getItem(STORAGE_KEY) !== null;
  }, []);

  return {
    persistFile,
    getPersistedFile,
    createFileFromPersisted,
    clearPersistedFile,
    hasPersistedFile
  };
};

export default useEditorPersistence;
