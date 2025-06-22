
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
      // Store security events separately with encryption
      let existingLogs: SecurityEvent[] = [];
      try {
        existingLogs = await decryptStorageItem('security_events') || 
                      JSON.parse(localStorage.getItem('security_events') || '[]');
      } catch (error) {
        existingLogs = [];
      }

      existingLogs.push(logEntry);
      
      if (existingLogs.length > 500) {
        existingLogs.splice(0, existingLogs.length - 500);
      }
      
      // Store encrypted with fallback
      try {
        await encryptStorageItem('security_events', existingLogs);
      } catch (error) {
        localStorage.setItem('security_events', JSON.stringify(existingLogs));
      }

      // Log critical security events for debugging
      if (['suspicious_activity', 'failed_access', 'session_hijack'].includes(event)) {
        console.warn('Security Alert:', logEntry);
      }
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  }, [getSessionId, getFingerprint, encryptStorageItem, decryptStorageItem]);

  const getSecurityEvents = useCallback(async () => {
    try {
      // Try encrypted first, fallback to unencrypted
      const encrypted = await decryptStorageItem('security_events');
      return encrypted || JSON.parse(localStorage.getItem('security_events') || '[]');
    } catch (error) {
      return [];
    }
  }, [decryptStorageItem]);

  return {
    logSecurityEvent,
    getSecurityEvents
  };
};
