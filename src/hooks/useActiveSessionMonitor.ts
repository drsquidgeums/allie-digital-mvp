import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSessionManager } from './security/useSessionManager';

interface ActiveSession {
  id: string;
  user_id: string;
  session_id: string;
  last_activity: string;
  user_agent?: string;
  ip_address?: string;
  page_url?: string;
  created_at: string;
}

export const useActiveSessionMonitor = () => {
  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { getSessionId } = useSessionManager();

  const updateSessionActivity = useCallback(async () => {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.error('Auth error:', authError);
      return;
    }
    
    if (!user) {
      console.log('No authenticated user found');
      return;
    }

    console.log('Updating session activity for user:', user.id);

    try {
      const { error } = await supabase.rpc('update_session_activity', {
        p_user_id: user.id,
        p_session_id: getSessionId(),
        p_user_agent: navigator.userAgent,
        p_page_url: window.location.href
      });
      
      if (error) {
        console.error('RPC error:', error);
      } else {
        console.log('Session activity updated successfully');
      }
    } catch (error) {
      console.error('Failed to update session activity:', error);
    }
  }, [getSessionId]);

  const fetchActiveSessions = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('active_sessions')
        .select('*')
        .order('last_activity', { ascending: false });

      if (error) throw error;
      setActiveSessions(data || []);
    } catch (error) {
      console.error('Failed to fetch active sessions:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const cleanupInactiveSessions = useCallback(async () => {
    try {
      await supabase.rpc('cleanup_inactive_sessions');
    } catch (error) {
      console.error('Failed to cleanup inactive sessions:', error);
    }
  }, []);

  useEffect(() => {
    // Initial fetch
    fetchActiveSessions();

    // Update our session activity
    updateSessionActivity();

    // Set up realtime subscription
    const channel = supabase
      .channel('active-sessions-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'active_sessions'
        },
        () => {
          fetchActiveSessions();
        }
      )
      .subscribe();

    // Update session activity every 60 seconds
    const activityInterval = setInterval(updateSessionActivity, 60000);

    // Cleanup inactive sessions every 5 minutes
    const cleanupInterval = setInterval(cleanupInactiveSessions, 300000);

    // Track page visibility changes
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        updateSessionActivity();
      }
    };

    // Track user activity
    const handleActivity = () => {
      updateSessionActivity();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('click', handleActivity, { passive: true });
    document.addEventListener('keydown', handleActivity, { passive: true });

    return () => {
      supabase.removeChannel(channel);
      clearInterval(activityInterval);
      clearInterval(cleanupInterval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('click', handleActivity);
      document.removeEventListener('keydown', handleActivity);
    };
  }, [fetchActiveSessions, updateSessionActivity, cleanupInactiveSessions]);

  return {
    activeSessions,
    isLoading,
    refreshSessions: fetchActiveSessions,
    updateActivity: updateSessionActivity
  };
};