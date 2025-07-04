
import { useCallback, useEffect, useRef } from 'react';

export const useMemoryManager = () => {
  const fileCache = useRef<Map<string, { data: any; lastAccessed: number; size: number }>>(new Map());
  const maxCacheSize = 100 * 1024 * 1024; // 100MB limit

  const addToCache = useCallback((key: string, data: any, size: number) => {
    const currentTime = Date.now();
    
    // Check if adding this would exceed cache limit
    let totalSize = Array.from(fileCache.current.values()).reduce((sum, item) => sum + item.size, 0);
    
    // Remove oldest items if necessary
    while (totalSize + size > maxCacheSize && fileCache.current.size > 0) {
      let oldestKey = '';
      let oldestTime = currentTime;
      
      fileCache.current.forEach((value, key) => {
        if (value.lastAccessed < oldestTime) {
          oldestTime = value.lastAccessed;
          oldestKey = key;
        }
      });
      
      if (oldestKey) {
        const removed = fileCache.current.get(oldestKey);
        fileCache.current.delete(oldestKey);
        totalSize -= removed?.size || 0;
      }
    }
    
    fileCache.current.set(key, { data, lastAccessed: currentTime, size });
  }, []);

  const getFromCache = useCallback((key: string) => {
    const cached = fileCache.current.get(key);
    if (cached) {
      cached.lastAccessed = Date.now();
      return cached.data;
    }
    return null;
  }, []);

  const clearCache = useCallback(() => {
    fileCache.current.clear();
  }, []);

  const getCacheStats = useCallback(() => {
    const totalSize = Array.from(fileCache.current.values()).reduce((sum, item) => sum + item.size, 0);
    return {
      itemCount: fileCache.current.size,
      totalSize,
      availableSpace: maxCacheSize - totalSize
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearCache();
    };
  }, [clearCache]);

  return {
    addToCache,
    getFromCache,
    clearCache,
    getCacheStats
  };
};
