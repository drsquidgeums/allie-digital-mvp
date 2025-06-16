
import React, { createContext, useContext, useEffect } from 'react';
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
    // Initialize enhanced security monitoring
    console.log('Enhanced security monitoring initialized');
    
    // Log security system initialization
    logActivity('security_system_init', {
      antiScreenCapture: securityContext.enableAntiScreenCapture,
      timestamp: new Date().toISOString()
    });

    // Listen for custom security events
    const handleSecurityActivity = (event: CustomEvent) => {
      logActivity('custom_security_event', event.detail);
    };

    const handleSecurityAlert = (event: CustomEvent) => {
      console.warn('Security Alert:', event.detail);
      logActivity('security_alert', event.detail);
    };

    window.addEventListener('securityActivity', handleSecurityActivity as EventListener);
    window.addEventListener('securityAlert', handleSecurityAlert as EventListener);

    return () => {
      window.removeEventListener('securityActivity', handleSecurityActivity as EventListener);
      window.removeEventListener('securityAlert', handleSecurityAlert as EventListener);
    };
  }, [logActivity, securityContext.enableAntiScreenCapture]);

  const exportAuditLogs = () => {
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
  };

  const value = {
    securityMetrics: calculateSecurityMetrics(),
    exportAuditLogs,
    exportSecurityReport,
    validateAccess
  };

  return (
    <EnhancedSecurityContext.Provider value={value}>
      {children}
    </EnhancedSecurityContext.Provider>
  );
};
