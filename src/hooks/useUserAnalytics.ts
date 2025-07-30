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
      await supabase
        .from('user_analytics')
        .insert({
          user_id: user.id,
          event_type: event.event_type,
          event_data: event.event_data || {},
          session_id: event.session_id || sessionId.current,
        });
    } catch (error) {
      console.error('Failed to track analytics event:', error);
    }
  }, [user?.id]);

  // Track page visits
  useEffect(() => {
    if (user?.id) {
      trackEvent({
        event_type: 'page_visit',
        event_data: { 
          path: window.location.pathname,
          timestamp: new Date().toISOString()
        }
      });
    }
  }, [user?.id, trackEvent]);

  // Track specific events
  const trackPomodoroSession = useCallback((duration: number, completed: boolean) => {
    trackEvent({
      event_type: 'pomodoro_session',
      event_data: { duration, completed, timestamp: new Date().toISOString() }
    });
  }, [trackEvent]);

  const trackTaskAction = useCallback((action: string, taskData?: Record<string, any>) => {
    trackEvent({
      event_type: 'task_action',
      event_data: { action, ...taskData, timestamp: new Date().toISOString() }
    });
  }, [trackEvent]);

  const trackDocumentAction = useCallback((action: string, documentData?: Record<string, any>) => {
    trackEvent({
      event_type: 'document_action',
      event_data: { action, ...documentData, timestamp: new Date().toISOString() }
    });
  }, [trackEvent]);

  const trackToolUsage = useCallback((toolName: string, duration?: number) => {
    trackEvent({
      event_type: 'tool_usage',
      event_data: { tool: toolName, duration, timestamp: new Date().toISOString() }
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