
import { useCallback } from 'react';

interface RateLimitViolation {
  timestamp: number;
  count: number;
  lastViolation: number;
}

export const useEnhancedRateLimit = () => {
  const getDeviceFingerprint = useCallback(() => {
    const components = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset(),
      navigator.hardwareConcurrency || 0
    ];
    return btoa(components.join('|')).slice(0, 16);
  }, []);

  const getViolationHistory = useCallback(() => {
    const fingerprint = getDeviceFingerprint();
    const key = `rate_limit_violations_${fingerprint}`;
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : { timestamp: 0, count: 0, lastViolation: 0 };
  }, [getDeviceFingerprint]);

  const updateViolationHistory = useCallback((violation: RateLimitViolation) => {
    const fingerprint = getDeviceFingerprint();
    const key = `rate_limit_violations_${fingerprint}`;
    localStorage.setItem(key, JSON.stringify(violation));
  }, [getDeviceFingerprint]);

  const calculateDelay = useCallback((violationCount: number) => {
    // Progressive delays: 1s, 5s, 30s, 300s (5min)
    const delays = [1000, 5000, 30000, 300000];
    const index = Math.min(violationCount - 1, delays.length - 1);
    return delays[index];
  }, []);

  const checkEnhancedRateLimit = useCallback((maxRequests: number, windowMs: number) => {
    const now = Date.now();
    const windowStart = now - windowMs;
    const fingerprint = getDeviceFingerprint();
    
    // Get recent requests for this device
    const requests = JSON.parse(sessionStorage.getItem(`rate_limit_requests_${fingerprint}`) || '[]');
    const recentRequests = requests.filter((timestamp: number) => timestamp > windowStart);
    
    if (recentRequests.length >= maxRequests) {
      // Rate limit exceeded - update violation history
      const violations = getViolationHistory();
      const timeSinceLastViolation = now - violations.lastViolation;
      
      // Reset count if it's been more than an hour since last violation
      if (timeSinceLastViolation > 3600000) {
        violations.count = 1;
      } else {
        violations.count += 1;
      }
      
      violations.lastViolation = now;
      violations.timestamp = now;
      updateViolationHistory(violations);
      
      const delay = calculateDelay(violations.count);
      
      console.log(`Enhanced rate limit exceeded. Progressive delay: ${delay}ms`);
      
      // Dispatch security event with delay info
      const event = new CustomEvent('securityAlert', {
        detail: { 
          type: 'enhanced_rate_limit_exceeded',
          severity: 'medium',
          violationCount: violations.count,
          delay: delay,
          fingerprint: fingerprint.slice(-8)
        }
      });
      window.dispatchEvent(event);
      
      return { allowed: false, delay };
    }

    // Add current request
    recentRequests.push(now);
    sessionStorage.setItem(`rate_limit_requests_${fingerprint}`, JSON.stringify(recentRequests));
    
    return { allowed: true, delay: 0 };
  }, [getDeviceFingerprint, getViolationHistory, updateViolationHistory, calculateDelay]);

  const resetViolationHistory = useCallback(() => {
    const fingerprint = getDeviceFingerprint();
    const key = `rate_limit_violations_${fingerprint}`;
    localStorage.removeItem(key);
  }, [getDeviceFingerprint]);

  return {
    checkEnhancedRateLimit,
    resetViolationHistory,
    getViolationHistory
  };
};
