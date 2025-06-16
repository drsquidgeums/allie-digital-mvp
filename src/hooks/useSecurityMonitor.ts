import { useEffect } from "react";
import { toast } from "sonner";

interface SecurityEvent {
  type: 'xss_attempt' | 'rate_limit_exceeded' | 'invalid_input' | 'auth_failure';
  timestamp: number;
  details?: string;
}

const securityEvents: SecurityEvent[] = [];

export const useSecurityMonitor = () => {
  const logSecurityEvent = (event: SecurityEvent) => {
    securityEvents.push(event);
    console.warn('Security Event:', event);
    
    // Keep only last 100 events to prevent memory leaks
    if (securityEvents.length > 100) {
      securityEvents.splice(0, securityEvents.length - 100);
    }
  };

  const getSecurityEvents = () => {
    return [...securityEvents];
  };

  // Monitor for suspicious activity patterns
  useEffect(() => {
    const monitorInterval = setInterval(() => {
      const recentEvents = securityEvents.filter(
        event => Date.now() - event.timestamp < 300000 // Last 5 minutes
      );

      // Alert if too many security events in short time
      if (recentEvents.length > 10) {
        toast.error("Multiple security events detected. Please refresh the page.");
        console.error("High frequency security events:", recentEvents);
      }
    }, 60000); // Check every minute

    return () => clearInterval(monitorInterval);
  }, []);

  return {
    logSecurityEvent,
    getSecurityEvents
  };
};
