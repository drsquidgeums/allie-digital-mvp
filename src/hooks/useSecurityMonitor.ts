
import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

interface SecurityEvent {
  type: 'suspicious_activity' | 'rate_limit' | 'validation_error' | 'auth_failure';
  message: string;
  timestamp: number;
  metadata?: Record<string, any>;
}

export const useSecurityMonitor = () => {
  const { toast } = useToast();

  const logSecurityEvent = (event: SecurityEvent) => {
    // Log to console for development
    console.warn(`[SECURITY] ${event.type}: ${event.message}`, {
      timestamp: new Date(event.timestamp).toISOString(),
      ...event.metadata
    });

    // Store in localStorage for review (limited history)
    const existingLogs = JSON.parse(localStorage.getItem("security_logs") || "[]");
    const newLogs = [event, ...existingLogs].slice(0, 50); // Keep last 50 events
    localStorage.setItem("security_logs", JSON.stringify(newLogs));

    // Show user notification for critical events
    if (event.type === 'suspicious_activity' || event.type === 'auth_failure') {
      toast({
        title: "Security Alert",
        description: "Suspicious activity detected. Please review your actions.",
        variant: "destructive"
      });
    }
  };

  const checkSuspiciousActivity = () => {
    // Monitor for rapid consecutive actions
    const activityKey = 'user_activity_timestamps';
    const now = Date.now();
    const activities = JSON.parse(localStorage.getItem(activityKey) || "[]");
    
    // Add current activity
    const updatedActivities = [now, ...activities].slice(0, 10); // Keep last 10
    localStorage.setItem(activityKey, JSON.stringify(updatedActivities));
    
    // Check for suspicious patterns (more than 5 actions in 10 seconds)
    const recentActivities = updatedActivities.filter(time => now - time < 10000);
    if (recentActivities.length > 5) {
      logSecurityEvent({
        type: 'suspicious_activity',
        message: 'Rapid consecutive actions detected',
        timestamp: now,
        metadata: { activityCount: recentActivities.length }
      });
    }
  };

  // Monitor for security events
  useEffect(() => {
    const handleSecurityEvent = (event: CustomEvent<SecurityEvent>) => {
      logSecurityEvent(event.detail);
    };

    window.addEventListener('security-event', handleSecurityEvent as EventListener);
    
    return () => {
      window.removeEventListener('security-event', handleSecurityEvent as EventListener);
    };
  }, []);

  return {
    logSecurityEvent,
    checkSuspiciousActivity
  };
};

// Helper to dispatch security events
export const dispatchSecurityEvent = (event: SecurityEvent) => {
  window.dispatchEvent(new CustomEvent('security-event', { detail: event }));
};
