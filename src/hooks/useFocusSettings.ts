
import { useState, useEffect } from 'react';

export interface FocusSettings {
  blockNotifications: boolean;
  blockPopups: boolean;
  blockSocialMedia: boolean;
  muteAudio: boolean;
  // New settings
  blockEmails: boolean;
  blockMessaging: boolean;
  minimizeDistraction: boolean;
  autoBreaks: boolean;
  focusDuration: number; // in minutes
  // Adding missing properties
  reduceMotion: boolean;
  dimScreen: boolean;
}

export interface FocusSession {
  startTime: number;
  endTime: number | null;
  duration: number; // in seconds
  completed: boolean;
  interrupted: boolean;
}

const FOCUS_SETTINGS_KEY = 'focus_settings';
const FOCUS_SESSIONS_KEY = 'focus_sessions';

export const useFocusSettings = () => {
  const [settings, setSettings] = useState<FocusSettings>(() => {
    // Try to load settings from localStorage
    const savedSettings = localStorage.getItem(FOCUS_SETTINGS_KEY);
    if (savedSettings) {
      try {
        return JSON.parse(savedSettings);
      } catch (e) {
        console.error('Failed to parse saved focus settings:', e);
      }
    }
    
    // Default settings if none found
    return {
      blockNotifications: true,
      blockPopups: true,
      blockSocialMedia: true,
      muteAudio: false,
      blockEmails: false,
      blockMessaging: false,
      minimizeDistraction: true,
      autoBreaks: false,
      focusDuration: 25,
      // Default values for new properties
      reduceMotion: false,
      dimScreen: false,
    };
  });

  const [sessions, setSessions] = useState<FocusSession[]>(() => {
    const savedSessions = localStorage.getItem(FOCUS_SESSIONS_KEY);
    if (savedSessions) {
      try {
        return JSON.parse(savedSessions);
      } catch (e) {
        console.error('Failed to parse saved focus sessions:', e);
        return [];
      }
    }
    return [];
  });

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(FOCUS_SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  // Save sessions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(FOCUS_SESSIONS_KEY, JSON.stringify(sessions));
  }, [sessions]);

  const updateSetting = (key: keyof FocusSettings, value: any) => {
    setSettings(prev => {
      const newSettings = { ...prev, [key]: value };
      return newSettings;
    });
  };

  const addSession = (session: FocusSession) => {
    setSessions(prev => [...prev, session]);
  };

  const updateCurrentSession = (updates: Partial<FocusSession>) => {
    setSessions(prev => {
      const newSessions = [...prev];
      const currentSessionIndex = newSessions.length - 1;
      
      if (currentSessionIndex >= 0) {
        newSessions[currentSessionIndex] = {
          ...newSessions[currentSessionIndex],
          ...updates
        };
      }
      
      return newSessions;
    });
  };

  const getSessionStats = () => {
    const completedSessions = sessions.filter(s => s.completed);
    const totalSessions = sessions.length;
    const totalFocusTime = sessions.reduce((sum, session) => 
      sum + (session.duration || 0), 0);
    
    const averageSessionLength = completedSessions.length > 0 ? 
      completedSessions.reduce((sum, session) => sum + session.duration, 0) / completedSessions.length : 0;
    
    return {
      totalSessions,
      completedSessions: completedSessions.length,
      totalFocusTime,
      averageSessionLength,
      sessions
    };
  };

  return { 
    settings, 
    updateSetting, 
    sessions, 
    addSession, 
    updateCurrentSession,
    getSessionStats
  };
};
