import { useCallback } from 'react';
import { useEncryption } from './useEncryption';
import { useSessionManager } from './useSessionManager';
import type { SecurityEvent } from './useLogQueue';

export const useSecurityEventLogger = () => {
  const { encryptStorageItem, decryptStorageItem } = useEncryption();
  const { getSessionId, getFingerprint } = useSessionManager();

  const logSecurityEvent = useCallback(async (event: string, details?: any) => {
    const logEntry: SecurityEvent = {
      id: `sec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'security',
      event,
      details,
      timestamp: new Date().toISOString(),
      sessionId: getSessionId(),
      userAgent: navigator.userAgent,
      ipFingerprint: getFingerprint()
    };

    try {
      let existingLogs: SecurityEvent[] = [];
      
      // Try to get existing logs with proper error handling
      try {
        const encrypted = await decryptStorageItem('security_events');
        if (encrypted) {
          existingLogs = Array.isArray(encrypted) ? encrypted : [];
        } else {
          const unencrypted = localStorage.getItem('security_events');
          if (unencrypted) {
            existingLogs = JSON.parse(unencrypted);
          }
        }
      } catch (error) {
        console.warn('Failed to retrieve existing security logs, starting fresh:', error);
        existingLogs = [];
      }

      existingLogs.push(logEntry);
      
      // Keep only last 500 entries
      if (existingLogs.length > 500) {
        existingLogs = existingLogs.slice(-500);
      }
      
      // Store with fallback
      try {
        await encryptStorageItem('security_events', existingLogs);
      } catch (error) {
        console.warn('Encryption failed, storing unencrypted:', error);
        localStorage.setItem('security_events', JSON.stringify(existingLogs));
      }

      // Log critical security events
      if (['suspicious_activity', 'failed_access', 'session_hijack'].includes(event)) {
        console.warn('Security Alert:', logEntry);
      }
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  }, [getSessionId, getFingerprint, encryptStorageItem, decryptStorageItem]);

  const getSecurityEvents = useCallback(async (): Promise<SecurityEvent[]> => {
    try {
      const encrypted = await decryptStorageItem('security_events');
      if (encrypted && Array.isArray(encrypted)) {
        return encrypted;
      }
      
      const unencrypted = localStorage.getItem('security_events');
      return unencrypted ? JSON.parse(unencrypted) : [];
    } catch (error) {
      console.warn('Failed to retrieve security events:', error);
      return [];
    }
  }, [decryptStorageItem]);

  return {
    logSecurityEvent,
    getSecurityEvents
  };
};
