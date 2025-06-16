import { useCallback, useEffect } from 'react';
import { useEnhancedRateLimit } from './useEnhancedRateLimit';

interface AccessPolicy {
  allowedIPs?: string[];
  blockedIPs?: string[];
  timeRestrictions?: {
    enabled: boolean;
    allowedDays: number[]; // 0-6, Sunday-Saturday
    allowedHours: { start: number; end: number };
    timezone: string;
  };
  rateLimit?: {
    enabled: boolean;
    maxRequests: number;
    windowMs: number;
  };
}

export const useAccessControl = () => {
  const { checkEnhancedRateLimit } = useEnhancedRateLimit();

  const getAccessPolicy = useCallback((): AccessPolicy => {
    const stored = localStorage.getItem('access_control_policy');
    return stored ? JSON.parse(stored) : {
      timeRestrictions: {
        enabled: false,
        allowedDays: [1, 2, 3, 4, 5], // Monday-Friday
        allowedHours: { start: 9, end: 17 }, // 9 AM to 5 PM
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      rateLimit: {
        enabled: true,
        maxRequests: 100,
        windowMs: 60000 // 1 minute
      }
    };
  }, []);

  const checkTimeRestrictions = useCallback(() => {
    const policy = getAccessPolicy();
    if (!policy.timeRestrictions?.enabled) return true;

    const now = new Date();
    const currentDay = now.getDay();
    const currentHour = now.getHours();

    const { allowedDays, allowedHours } = policy.timeRestrictions;

    if (!allowedDays.includes(currentDay)) {
      console.log('Access denied: Outside allowed days');
      return false;
    }

    if (currentHour < allowedHours.start || currentHour >= allowedHours.end) {
      console.log('Access denied: Outside allowed hours');
      return false;
    }

    return true;
  }, [getAccessPolicy]);

  const checkRateLimit = useCallback(() => {
    const policy = getAccessPolicy();
    if (!policy.rateLimit?.enabled) return true;

    // Use enhanced rate limiting
    const result = checkEnhancedRateLimit(policy.rateLimit.maxRequests, policy.rateLimit.windowMs);
    
    if (!result.allowed && result.delay > 0) {
      console.log(`Rate limit exceeded. Next attempt allowed in ${result.delay}ms`);
      
      // Optional: Could implement actual delay here if needed
      // await new Promise(resolve => setTimeout(resolve, result.delay));
    }

    return result.allowed;
  }, [getAccessPolicy, checkEnhancedRateLimit]);

  const logAccessAttempt = useCallback((success: boolean, reason?: string) => {
    const accessLog = {
      timestamp: new Date().toISOString(),
      success,
      reason,
      userAgent: navigator.userAgent,
      sessionId: sessionStorage.getItem('security_session_id'),
      fingerprint: localStorage.getItem('device_fingerprint')
    };

    const logs = JSON.parse(localStorage.getItem('access_control_logs') || '[]');
    logs.push(accessLog);
    
    // Keep only last 500 logs
    if (logs.length > 500) {
      logs.splice(0, logs.length - 500);
    }
    
    localStorage.setItem('access_control_logs', JSON.stringify(logs));

    if (!success) {
      console.warn('Access denied:', accessLog);
      
      // Dispatch security event
      const event = new CustomEvent('securityAlert', {
        detail: { 
          type: 'access_denied', 
          reason,
          severity: 'medium'
        }
      });
      window.dispatchEvent(event);
    }
  }, []);

  const validateAccess = useCallback(() => {
    const timeValid = checkTimeRestrictions();
    const rateLimitValid = checkRateLimit();

    const isValid = timeValid && rateLimitValid;
    
    let reason = '';
    if (!timeValid) reason = 'time_restrictions';
    if (!rateLimitValid) reason = 'rate_limit';

    logAccessAttempt(isValid, reason);
    
    return isValid;
  }, [checkTimeRestrictions, checkRateLimit, logAccessAttempt]);

  useEffect(() => {
    // Validate access on mount
    validateAccess();
  }, [validateAccess]);

  return {
    validateAccess,
    checkTimeRestrictions,
    checkRateLimit,
    logAccessAttempt
  };
};
