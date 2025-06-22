import { useCallback, useRef } from 'react';
import { useEncryption } from './useEncryption';

interface SecurityEvent {
  id: string;
  type: 'activity' | 'security' | 'access' | 'download' | 'session';
  event: string;
  details?: any;
  timestamp: string;
  sessionId: string;
  userAgent: string;
  ipFingerprint: string;
}

export const useLogQueue = () => {
  const { encryptStorageItem, decryptStorageItem } = useEncryption();
  const logQueueRef = useRef<SecurityEvent[]>([]);
  const flushTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const flushLogQueue = useCallback(async () => {
    if (logQueueRef.current.length === 0) return;

    const logsToFlush = [...logQueueRef.current];
    logQueueRef.current = [];

    try {
      // Get existing logs with fallback
      let existingLogs: SecurityEvent[] = [];
      try {
        existingLogs = await decryptStorageItem('security_activity_logs') || 
                      JSON.parse(localStorage.getItem('security_activity_logs') || '[]');
      } catch (error) {
        existingLogs = [];
      }

      existingLogs.push(...logsToFlush);
      
      // Keep only last 1000 entries to prevent storage bloat
      if (existingLogs.length > 1000) {
        existingLogs.splice(0, existingLogs.length - 1000);
      }
      
      // Store encrypted with error handling
      try {
        await encryptStorageItem('security_activity_logs', existingLogs);
      } catch (error) {
        localStorage.setItem('security_activity_logs', JSON.stringify(existingLogs));
      }
    } catch (error) {
      // Re-add failed logs to queue for retry
      logQueueRef.current.unshift(...logsToFlush);
    }
  }, [encryptStorageItem, decryptStorageItem]);

  const addToQueue = useCallback((logEntry: SecurityEvent) => {
    logQueueRef.current.push(logEntry);

    // Debounce the flush operation
    if (flushTimeoutRef.current) {
      clearTimeout(flushTimeoutRef.current);
    }
    flushTimeoutRef.current = setTimeout(flushLogQueue, 1000); // Flush every 1 second
  }, [flushLogQueue]);

  const getActivityLogs = useCallback(async () => {
    try {
      // Try encrypted first, fallback to unencrypted
      const encrypted = await decryptStorageItem('security_activity_logs');
      return encrypted || JSON.parse(localStorage.getItem('security_activity_logs') || '[]');
    } catch (error) {
      return [];
    }
  }, [decryptStorageItem]);

  return {
    addToQueue,
    getActivityLogs
  };
};

export type { SecurityEvent };
