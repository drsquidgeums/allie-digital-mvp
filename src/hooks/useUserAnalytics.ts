import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AnalyticsEvent {
  event_type: string;
  event_data?: Record<string, any>;
  session_id?: string;
}

export const useUserAnalytics = () => {
  const [user, setUser] = useState<any>(null);
  const sessionId = useRef(crypto.randomUUID());

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const trackEvent = useCallback(async (event: AnalyticsEvent) => {
    if (!user?.id) return;

    try {
      const eventData = {
        user_id: user.id,
        event_type: event.event_type,
        event_data: {
          ...event.event_data,
          // Enhanced context tracking
          user_agent: navigator.userAgent.substring(0, 100),
          screen_resolution: `${screen.width}x${screen.height}`,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          // Add performance context
          connection_type: (navigator as any).connection?.effectiveType || 'unknown'
        },
        session_id: event.session_id || sessionId.current,
      };

      await supabase
        .from('user_analytics')
        .insert(eventData);
    } catch (error) {
      console.error('Failed to track analytics event:', error);
    }
  }, [user?.id]);

  // Track page visits with enhanced context
  useEffect(() => {
    if (user?.id) {
      trackEvent({
        event_type: 'page_visit',
        event_data: { 
          path: window.location.pathname,
          timestamp: new Date().toISOString(),
          referrer: document.referrer,
          viewport: `${window.innerWidth}x${window.innerHeight}`,
          time_of_day: new Date().getHours() < 12 ? 'morning' : 
                      new Date().getHours() < 17 ? 'afternoon' : 'evening'
        }
      });
    }
  }, [user?.id, trackEvent]);

  // Track specific events
  const trackPomodoroSession = useCallback((duration: number, completed: boolean) => {
    trackEvent({
      event_type: 'pomodoro_session',
      event_data: { 
        duration, 
        completed, 
        timestamp: new Date().toISOString(),
        // Enhanced pomodoro tracking
        time_of_day: new Date().getHours(),
        day_of_week: new Date().getDay(),
        completion_rate: completed ? 1 : duration / 1500 // Assuming 25min = 1500s default
      }
    });
  }, [trackEvent]);

  const trackTaskAction = useCallback((action: string, taskData?: Record<string, any>) => {
    trackEvent({
      event_type: 'task_action',
      event_data: { 
        action, 
        ...taskData, 
        timestamp: new Date().toISOString(),
        // Enhanced task tracking
        session_duration: performance.now(), // Time since page load
        task_complexity: taskData?.description?.length > 100 ? 'high' : 
                        taskData?.description?.length > 50 ? 'medium' : 'low'
      }
    });
  }, [trackEvent]);

  const trackDocumentAction = useCallback((action: string, documentData?: Record<string, any>) => {
    trackEvent({
      event_type: 'document_action',
      event_data: { 
        action, 
        ...documentData, 
        timestamp: new Date().toISOString(),
        // Enhanced document tracking
        document_size: documentData?.content?.length || 0,
        session_time: Math.floor(performance.now() / 1000), // Seconds since page load
        interaction_type: action.includes('edit') ? 'productive' : 'passive'
      }
    });
  }, [trackEvent]);

  const trackToolUsage = useCallback((toolName: string, duration?: number) => {
    trackEvent({
      event_type: 'tool_usage',
      event_data: { 
        tool: toolName, 
        duration, 
        timestamp: new Date().toISOString(),
        // Enhanced tool tracking
        usage_context: window.location.pathname,
        tool_efficiency: duration ? (duration < 300 ? 'quick' : duration < 900 ? 'normal' : 'extended') : 'unknown',
        concurrent_tools: document.querySelectorAll('[data-tool-active="true"]').length
      }
    });
  }, [trackEvent]);

  return {
    trackEvent,
    trackPomodoroSession,
    trackTaskAction,
    trackDocumentAction,
    trackToolUsage,
  };
};