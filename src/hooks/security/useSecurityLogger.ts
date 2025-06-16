import { useCallback } from 'react';

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
  const getSessionId = useCallback(() => {
    let sessionId = sessionStorage.getItem('security_session_id');
    if (!sessionId) {
      sessionId = `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('security_session_id', sessionId);
    }
    return sessionId;
  }, []);

  const getFingerprint = useCallback(() => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx?.fillText('fingerprint', 10, 10);
    const canvasFingerprint = canvas.toDataURL();
    
    return btoa(
      navigator.userAgent + 
      navigator.language + 
      screen.width + 
      screen.height + 
      new Date().getTimezoneOffset() +
      canvasFingerprint.slice(-50)
    ).slice(0, 16);
  }, []);

  const logActivity = useCallback((event: string, details?: any) => {
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

    // Store in localStorage for persistence
    const existingLogs = JSON.parse(localStorage.getItem('security_activity_logs') || '[]');
    existingLogs.push(logEntry);
    
    // Keep only last 1000 entries to prevent storage bloat
    if (existingLogs.length > 1000) {
      existingLogs.splice(0, existingLogs.length - 1000);
    }
    
    localStorage.setItem('security_activity_logs', JSON.stringify(existingLogs));
  }, [getSessionId, getFingerprint]);

  const logSecurityEvent = useCallback((event: string, details?: any) => {
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

    // Store security events separately
    const existingLogs = JSON.parse(localStorage.getItem('security_events') || '[]');
    existingLogs.push(logEntry);
    
    if (existingLogs.length > 500) {
      existingLogs.splice(0, existingLogs.length - 500);
    }
    
    localStorage.setItem('security_events', JSON.stringify(existingLogs));

    // Log critical security events to console
    if (['suspicious_activity', 'failed_access', 'session_hijack'].includes(event)) {
      console.warn('Security Alert:', logEntry);
    }
  }, [getSessionId, getFingerprint]);

  const getActivityLogs = useCallback(() => {
    return JSON.parse(localStorage.getItem('security_activity_logs') || '[]');
  }, []);

  const getSecurityEvents = useCallback(() => {
    return JSON.parse(localStorage.getItem('security_events') || '[]');
  }, []);

  const exportAuditLogs = useCallback(() => {
    const activities = getActivityLogs();
    const events = getSecurityEvents();
    
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
  }, [getActivityLogs, getSecurityEvents, getSessionId]);

  return {
    logActivity,
    logSecurityEvent,
    getActivityLogs,
    getSecurityEvents,
    exportAuditLogs
  };
};
