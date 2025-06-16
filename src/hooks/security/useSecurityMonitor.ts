
import { useEffect, useRef } from 'react';
import { useSecurityLogger } from './useSecurityLogger';
import { useSessionSecurity } from './useSessionSecurity';
import { useContentProtection } from './useContentProtection';

export const useSecurityMonitor = () => {
  const { logActivity, logSecurityEvent } = useSecurityLogger();
  const { validateSession, checkIdleTime } = useSessionSecurity();
  const { applyWatermark, monitorClipboard } = useContentProtection();
  const lastActivityRef = useRef<number>(Date.now());

  useEffect(() => {
    // Initialize security monitoring
    console.log('Security monitoring initialized');

    // Track user activity
    const trackActivity = (event: string, details?: any) => {
      lastActivityRef.current = Date.now();
      logActivity(event, details);
    };

    // Monitor mouse and keyboard activity
    const handleActivity = (e: Event) => {
      trackActivity(e.type);
    };

    // Monitor document events
    const handleDocumentEvent = (e: Event) => {
      trackActivity(`document_${e.type}`, {
        target: (e.target as HTMLElement)?.tagName,
        timestamp: new Date().toISOString()
      });
    };

    // Add event listeners for activity tracking
    document.addEventListener('click', handleActivity, { passive: true });
    document.addEventListener('keydown', handleActivity, { passive: true });
    document.addEventListener('scroll', handleActivity, { passive: true });
    document.addEventListener('visibilitychange', handleDocumentEvent);

    // Session validation interval
    const sessionInterval = setInterval(() => {
      validateSession();
      checkIdleTime(lastActivityRef.current);
    }, 30000); // Check every 30 seconds

    // Content protection monitoring
    const protectionInterval = setInterval(() => {
      applyWatermark();
      monitorClipboard();
    }, 60000); // Check every minute

    return () => {
      document.removeEventListener('click', handleActivity);
      document.removeEventListener('keydown', handleActivity);
      document.removeEventListener('scroll', handleActivity);
      document.removeEventListener('visibilitychange', handleDocumentEvent);
      clearInterval(sessionInterval);
      clearInterval(protectionInterval);
    };
  }, [logActivity, logSecurityEvent, validateSession, checkIdleTime, applyWatermark, monitorClipboard]);

  return {
    logActivity,
    logSecurityEvent
  };
};
