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

export const useSecurityLogger = () => {
  const { encryptStorageItem, decryptStorageItem } = useEncryption();
  const logQueueRef = useRef<SecurityEvent[]>([]);
  const flushTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const getSessionId = useCallback(() => {
    let sessionId = sessionStorage.getItem('security_session_id');
    if (!sessionId) {
      sessionId = `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('security_session_id', sessionId);
    }
    return sessionId;
  }, []);

  const getFingerprint = useCallback(() => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillText('fingerprint', 10, 10);
      }
      const canvasFingerprint = canvas.toDataURL();
      
      return btoa(
        navigator.userAgent + 
        navigator.language + 
        screen.width + 
        screen.height + 
        new Date().getTimezoneOffset() +
        canvasFingerprint.slice(-50)
      ).slice(0, 16);
    } catch (error) {
      // Fallback fingerprint if canvas fails
      return btoa(
        navigator.userAgent + 
        navigator.language + 
        Date.now().toString()
      ).slice(0, 16);
    }
  }, []);

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
        console.warn('Failed to load existing logs, starting fresh:', error);
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
        console.warn('Encryption failed, storing unencrypted:', error);
        localStorage.setItem('security_activity_logs', JSON.stringify(existingLogs));
      }
    } catch (error) {
      console.error('Failed to flush security logs:', error);
      // Re-add failed logs to queue for retry
      logQueueRef.current.unshift(...logsToFlush);
    }
  }, [encryptStorageItem, decryptStorageItem]);

  const logActivity = useCallback(async (event: string, details?: any) => {
    const logEntry: SecurityEvent = {
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'activity',
      event,
      details,
      timestamp: new Date().toISOString(),
      sessionId: getSessionId(),
      userAgent: navigator.userAgent,
      ipFingerprint: getFingerprint()
    };

    // Add to queue instead of immediate processing
    logQueueRef.current.push(logEntry);

    // Debounce the flush operation
    if (flushTimeoutRef.current) {
      clearTimeout(flushTimeoutRef.current);
    }
    flushTimeoutRef.current = setTimeout(flushLogQueue, 1000); // Flush every 1 second
  }, [getSessionId, getFingerprint, flushLogQueue]);

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
        console.warn('Failed to load existing security events, starting fresh:', error);
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
        console.warn('Encryption failed, storing unencrypted:', error);
        localStorage.setItem('security_events', JSON.stringify(existingLogs));
      }

      // Log critical security events to console
      if (['suspicious_activity', 'failed_access', 'session_hijack'].includes(event)) {
        console.warn('Security Alert:', logEntry);
      }
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  }, [getSessionId, getFingerprint, encryptStorageItem, decryptStorageItem]);

  const getActivityLogs = useCallback(async () => {
    try {
      // Try encrypted first, fallback to unencrypted
      const encrypted = await decryptStorageItem('security_activity_logs');
      return encrypted || JSON.parse(localStorage.getItem('security_activity_logs') || '[]');
    } catch (error) {
      console.warn('Failed to retrieve activity logs:', error);
      return [];
    }
  }, [decryptStorageItem]);

  const getSecurityEvents = useCallback(async () => {
    try {
      // Try encrypted first, fallback to unencrypted
      const encrypted = await decryptStorageItem('security_events');
      return encrypted || JSON.parse(localStorage.getItem('security_events') || '[]');
    } catch (error) {
      console.warn('Failed to retrieve security events:', error);
      return [];
    }
  }, [decryptStorageItem]);

  const exportAuditLogs = useCallback(async () => {
    try {
      const activities = await getActivityLogs();
      const events = await getSecurityEvents();
      
      const auditData = {
        exportDate: new Date().toISOString(),
        sessionId: getSessionId(),
        activities,
        events,
        summary: {
          totalActivities: activities.length,
          totalSecurityEvents: events.length,
          dateRange: {
            from: activities[0]?.timestamp,
            to: activities[activities.length - 1]?.timestamp
          }
        }
      };

      const blob = new Blob([JSON.stringify(auditData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `security_audit_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export audit logs:', error);
    }
  }, [getActivityLogs, getSecurityEvents, getSessionId]);

  return {
    logActivity,
    logSecurityEvent,
    getActivityLogs,
    getSecurityEvents,
    exportAuditLogs
  };
};
