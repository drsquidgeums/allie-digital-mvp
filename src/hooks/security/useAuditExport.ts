
import { useCallback } from 'react';
import { useLogQueue } from './useLogQueue';
import { useSecurityEventLogger } from './useSecurityEventLogger';
import { useSessionManager } from './useSessionManager';

export const useAuditExport = () => {
  const { getActivityLogs } = useLogQueue();
  const { getSecurityEvents } = useSecurityEventLogger();
  const { getSessionId } = useSessionManager();

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
    exportAuditLogs
  };
};
