
import { useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface SessionConfig {
  idleTimeoutMs: number;
  sessionTimeoutMs: number;
  warningTimeoutMs: number;
  enableDeviceFingerprinting: boolean;
  enableTimeRestrictions: boolean;
  allowedHours: { start: number; end: number };
}

export const useSessionSecurity = () => {
  const { toast } = useToast();

  const getConfig = useCallback((): SessionConfig => {
    const stored = localStorage.getItem('session_security_config');
    return stored ? JSON.parse(stored) : {
      idleTimeoutMs: 30 * 60 * 1000, // 30 minutes
      sessionTimeoutMs: 8 * 60 * 60 * 1000, // 8 hours
      warningTimeoutMs: 5 * 60 * 1000, // 5 minutes before timeout
      enableDeviceFingerprinting: true,
      enableTimeRestrictions: false,
      allowedHours: { start: 9, end: 17 } // 9 AM to 5 PM
    };
  }, []);

  const validateSession = useCallback(() => {
    const config = getConfig();
    const sessionStart = sessionStorage.getItem('session_start_time');
    const deviceFingerprint = localStorage.getItem('device_fingerprint');
    
    if (!sessionStart) {
      sessionStorage.setItem('session_start_time', Date.now().toString());
      return;
    }

    const sessionAge = Date.now() - parseInt(sessionStart);
    
    // Check session timeout
    if (sessionAge > config.sessionTimeoutMs) {
      console.log('Session expired due to age limit');
      cleanupSession();
      return;
    }

    // Check time restrictions
    if (config.enableTimeRestrictions) {
      const currentHour = new Date().getHours();
      if (currentHour < config.allowedHours.start || currentHour > config.allowedHours.end) {
        console.log('Access outside allowed hours');
        toast({
          title: "Access Restricted",
          description: "System access is only allowed during business hours",
          variant: "destructive"
        });
      }
    }

    // Device fingerprinting validation
    if (config.enableDeviceFingerprinting && deviceFingerprint) {
      const currentFingerprint = generateDeviceFingerprint();
      if (currentFingerprint !== deviceFingerprint) {
        console.warn('Device fingerprint mismatch - possible session hijacking');
        const event = new CustomEvent('securityAlert', {
          detail: { type: 'device_mismatch', severity: 'high' }
        });
        window.dispatchEvent(event);
      }
    }
  }, [toast]);

  const checkIdleTime = useCallback((lastActivity: number) => {
    const config = getConfig();
    const idleTime = Date.now() - lastActivity;
    
    if (idleTime > config.idleTimeoutMs) {
      console.log('Session expired due to inactivity');
      toast({
        title: "Session Expired",
        description: "You have been logged out due to inactivity",
      });
      cleanupSession();
    } else if (idleTime > (config.idleTimeoutMs - config.warningTimeoutMs)) {
      // Show warning before timeout
      const remainingMinutes = Math.ceil((config.idleTimeoutMs - idleTime) / 60000);
      toast({
        title: "Session Warning",
        description: `Your session will expire in ${remainingMinutes} minutes due to inactivity`,
      });
    }
  }, [toast]);

  const generateDeviceFingerprint = useCallback(() => {
    // Safely access navigator properties that might not exist
    const getDeviceMemory = () => {
      try {
        return (navigator as any).deviceMemory || 0;
      } catch {
        return 0;
      }
    };

    const components = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset(),
      navigator.hardwareConcurrency || 0,
      getDeviceMemory()
    ];
    
    return btoa(components.join('|')).slice(0, 32);
  }, []);

  const cleanupSession = useCallback(() => {
    // Clear sensitive data from memory
    sessionStorage.clear();
    
    // Clear specific localStorage items (keep logs for audit)
    const keysToKeep = ['security_activity_logs', 'security_events', 'device_fingerprint'];
    const allKeys = Object.keys(localStorage);
    
    allKeys.forEach(key => {
      if (!keysToKeep.includes(key)) {
        localStorage.removeItem(key);
      }
    });

    // Clear any cached data
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => caches.delete(name));
      });
    }

    console.log('Session cleanup completed');
  }, []);

  useEffect(() => {
    // Initialize device fingerprinting
    const config = getConfig();
    if (config.enableDeviceFingerprinting) {
      const existing = localStorage.getItem('device_fingerprint');
      if (!existing) {
        const fingerprint = generateDeviceFingerprint();
        localStorage.setItem('device_fingerprint', fingerprint);
      }
    }

    // Initialize session tracking
    if (!sessionStorage.getItem('session_start_time')) {
      sessionStorage.setItem('session_start_time', Date.now().toString());
    }
  }, [generateDeviceFingerprint, getConfig]);

  return {
    validateSession,
    checkIdleTime,
    cleanupSession,
    generateDeviceFingerprint
  };
};
