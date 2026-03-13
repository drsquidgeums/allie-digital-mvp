
import { useCallback, useEffect } from 'react';

interface SecurityMetrics {
  sessionDuration: number;
  activityCount: number;
  securityEventCount: number;
  downloadCount: number;
  accessAttempts: number;
  suspiciousActivityScore: number;
}

export const useSecurityAnalytics = () => {
  const calculateSecurityMetrics = useCallback((): SecurityMetrics => {
    const activities = JSON.parse(localStorage.getItem('security_activity_logs') || '[]');
    const events = JSON.parse(localStorage.getItem('security_events') || '[]');
    const downloads = JSON.parse(localStorage.getItem('security_downloads') || '[]');
    const accessLogs = JSON.parse(localStorage.getItem('access_control_logs') || '[]');
    const sessionStart = sessionStorage.getItem('session_start_time');

    const sessionDuration = sessionStart ? Date.now() - parseInt(sessionStart) : 0;
    
    // Calculate suspicious activity score based on various factors
    let suspiciousScore = 0;
    
    // High activity in short time
    const recentActivities = activities.filter((log: any) => 
      Date.now() - new Date(log.timestamp).getTime() < 300000 // 5 minutes
    );
    if (recentActivities.length > 100) suspiciousScore += 20;
    
    // Multiple failed access attempts
    const failedAccess = accessLogs.filter((log: any) => !log.success);
    if (failedAccess.length > 5) suspiciousScore += 30;
    
    // Unusual download patterns
    if (downloads.length > 10) suspiciousScore += 15;
    
    // Security events
    const criticalEvents = events.filter((event: any) => 
      ['suspicious_activity', 'session_hijack', 'device_mismatch'].includes(event.event)
    );
    suspiciousScore += criticalEvents.length * 25;

    return {
      sessionDuration,
      activityCount: activities.length,
      securityEventCount: events.length,
      downloadCount: downloads.length,
      accessAttempts: accessLogs.length,
      suspiciousActivityScore: Math.min(suspiciousScore, 100)
    };
  }, []);

  const generateSecurityReport = useCallback(() => {
    const metrics = calculateSecurityMetrics();
    const activities = JSON.parse(localStorage.getItem('security_activity_logs') || '[]');
    const events = JSON.parse(localStorage.getItem('security_events') || '[]');
    
    const report = {
      reportId: `report_${Date.now()}`,
      generatedAt: new Date().toISOString(),
      sessionId: sessionStorage.getItem('security_session_id'),
      metrics,
      summary: {
        riskLevel: metrics.suspiciousActivityScore > 50 ? 'HIGH' : 
                   metrics.suspiciousActivityScore > 25 ? 'MEDIUM' : 'LOW',
        recommendations: generateRecommendations(metrics),
        topActivities: getTopActivities(activities),
        criticalEvents: events.filter((e: any) => 
          ['suspicious_activity', 'session_hijack', 'access_denied'].includes(e.event)
        )
      },
      compliance: {
        dataRetentionCompliant: activities.length <= 1000,
        sessionSecurityEnabled: !!sessionStorage.getItem('session_start_time'),
        auditTrailComplete: activities.length > 0 && events.length >= 0
      }
    };

    return report;
  }, [calculateSecurityMetrics]);

  const getTopActivities = useCallback((activities: { event: string }[]) => {
    const activityCounts = activities.reduce<Record<string, number>>((acc, activity) => {
      acc[activity.event] = (acc[activity.event] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(activityCounts)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 5);
  }, []);

  const generateRecommendations = useCallback((metrics: SecurityMetrics) => {
    const recommendations = [];

    if (metrics.suspiciousActivityScore > 50) {
      recommendations.push('Immediate review required - high suspicious activity detected');
    }

    if (metrics.sessionDuration > 8 * 60 * 60 * 1000) {
      recommendations.push('Consider implementing session timeout - session exceeds 8 hours');
    }

    if (metrics.downloadCount > 20) {
      recommendations.push('Review download activity - unusually high number of downloads');
    }

    if (metrics.activityCount > 1000) {
      recommendations.push('Consider archiving old activity logs to maintain performance');
    }

    return recommendations;
  }, []);

  const exportSecurityReport = useCallback(() => {
    const report = generateSecurityReport();
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `security_report_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    console.log('Security report exported:', report.reportId);
  }, [generateSecurityReport]);

  const monitorAnomalies = useCallback(() => {
    const metrics = calculateSecurityMetrics();
    
    if (metrics.suspiciousActivityScore > 75) {
      const event = new CustomEvent('securityAlert', {
        detail: { 
          type: 'anomaly_detected', 
          severity: 'critical',
          score: metrics.suspiciousActivityScore
        }
      });
      window.dispatchEvent(event);
    }
  }, [calculateSecurityMetrics]);

  useEffect(() => {
    // Set up periodic anomaly monitoring
    const anomalyInterval = setInterval(monitorAnomalies, 2 * 60 * 1000); // Every 2 minutes

    return () => clearInterval(anomalyInterval);
  }, [monitorAnomalies]);

  return {
    calculateSecurityMetrics,
    generateSecurityReport,
    exportSecurityReport,
    monitorAnomalies
  };
};
