
import { useEffect } from 'react';
import { usePdfOptimization } from './performance/usePdfOptimization';
import { useMemoryManager } from './performance/useMemoryManager';
import { useOfflineMode } from './performance/useOfflineMode';

export const useDocumentPerformance = (file?: File | null) => {
  const { optimizeRender, preloadPages, clearCache: clearPdfCache } = usePdfOptimization();
  const { addToCache, getFromCache, clearCache: clearMemoryCache } = useMemoryManager();
  const { isOnline, getOfflineCapabilities } = useOfflineMode();

  useEffect(() => {
    // Cleanup caches when component unmounts or file changes
    return () => {
      clearPdfCache();
      clearMemoryCache();
    };
  }, [file, clearPdfCache, clearMemoryCache]);

  const loadDocument = async (url: string) => {
    // Check cache first
    const cached = getFromCache(url);
    if (cached && isOnline) {
      return cached;
    }

    // In offline mode, only return cached data
    if (!isOnline) {
      return cached || null;
    }

    // Load and cache new document
    try {
      // This would be actual document loading logic
      const documentData = { url, loaded: true };
      addToCache(url, documentData, 1024 * 1024); // 1MB estimate
      return documentData;
    } catch (error) {
      console.error('Failed to load document:', error);
      return null;
    }
  };

  return {
    loadDocument,
    optimizeRender,
    preloadPages,
    isOnline,
    offlineCapabilities: getOfflineCapabilities()
  };
};
