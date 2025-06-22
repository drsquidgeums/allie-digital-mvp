
import { useCallback } from 'react';
import { useSessionManager } from './useSessionManager';
import { useLogQueue, type SecurityEvent } from './useLogQueue';
import { useSecurityEventLogger } from './useSecurityEventLogger';
import { useAuditExport } from './useAuditExport';

export const useSecurityLogger = () => {
  const { getSessionId, getFingerprint } = useSessionManager();
  const { addToQueue, getActivityLogs } = useLogQueue();
  const { logSecurityEvent, getSecurityEvents } = useSecurityEventLogger();
  const { exportAuditLogs } = useAuditExport();

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

    // Add to queue for batched processing
    addToQueue(logEntry);
  }, [getSessionId, getFingerprint, addToQueue]);

  return {
    logActivity,
    logSecurityEvent,
    getActivityLogs,
    getSecurityEvents,
    exportAuditLogs
  };
};
