
import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { useSecurityMonitor } from '@/hooks/security/useSecurityMonitor';
import { useAccessControl } from '@/hooks/security/useAccessControl';
import { useSecurityAnalytics } from '@/hooks/security/useSecurityAnalytics';
import { useSecurityContext } from './SecurityProvider';

interface EnhancedSecurityContextType {
  securityMetrics: any;
  exportAuditLogs: () => void;
  exportSecurityReport: () => void;
  validateAccess: () => boolean;
}

const EnhancedSecurityContext = createContext<EnhancedSecurityContextType>({
  securityMetrics: null,
  exportAuditLogs: () => {},
  exportSecurityReport: () => {},
  validateAccess: () => true
});

export const useEnhancedSecurity = () => useContext(EnhancedSecurityContext);

export const EnhancedSecurityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { logActivity } = useSecurityMonitor();
  const { validateAccess } = useAccessControl();
  const { calculateSecurityMetrics, exportSecurityReport } = useSecurityAnalytics();
  const securityContext = useSecurityContext();

  useEffect(() => {
    // Initialize enhanced security monitoring with reduced frequency
    console.log('Enhanced security monitoring initialized');
    
    // Log security system initialization only once
    logActivity('security_system_init', {
      antiScreenCapture: securityContext.enableAntiScreenCapture,
      timestamp: new Date().toISOString()
    });

    // Throttled event handlers to reduce performance impact
    let lastSecurityActivity = 0;
    let lastSecurityAlert = 0;
    const throttleMs = 5000; // 5 seconds throttle

    const handleSecurityActivity = (event: CustomEvent) => {
      const now = Date.now();
      if (now - lastSecurityActivity > throttleMs) {
        logActivity('custom_security_event', event.detail);
        lastSecurityActivity = now;
      }
    };

    const handleSecurityAlert = (event: CustomEvent) => {
      const now = Date.now();
      if (now - lastSecurityAlert > throttleMs) {
        console.warn('Security Alert:', event.detail);
        logActivity('security_alert', event.detail);
        lastSecurityAlert = now;
      }
    };

    window.addEventListener('securityActivity', handleSecurityActivity as EventListener);
    window.addEventListener('securityAlert', handleSecurityAlert as EventListener);

    return () => {
      window.removeEventListener('securityActivity', handleSecurityActivity as EventListener);
      window.removeEventListener('securityAlert', handleSecurityAlert as EventListener);
    };
  }, [logActivity, securityContext.enableAntiScreenCapture]);

  const exportAuditLogs = () => {
    try {
      const activities = JSON.parse(localStorage.getItem('security_activity_logs') || '[]');
      const events = JSON.parse(localStorage.getItem('security_events') || '[]');
      const downloads = JSON.parse(localStorage.getItem('security_downloads') || '[]');
      
      const auditData = {
        exportDate: new Date().toISOString(),
        sessionId: sessionStorage.getItem('security_session_id'),
        activities,
        events,
        downloads,
        summary: {
          totalActivities: activities.length,
          totalEvents: events.length,
          totalDownloads: downloads.length
        }
      };

      const blob = new Blob([JSON.stringify(auditData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit_logs_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export audit logs:', error);
    }
  };

  // Memoize the value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    securityMetrics: calculateSecurityMetrics(),
    exportAuditLogs,
    exportSecurityReport,
    validateAccess
  }), [calculateSecurityMetrics, exportSecurityReport, validateAccess]);

  return (
    <EnhancedSecurityContext.Provider value={value}>
      {children}
    </EnhancedSecurityContext.Provider>
  );
};
