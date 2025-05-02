
import { useEffect } from "react";
import { FocusSettings } from "@/hooks/useFocusSettings";

/**
 * Hook to track focus mode analytics
 * 
 * Records session start/end times, duration, and settings used
 */
export const useAnalytics = (isActive: boolean, settings: FocusSettings) => {
  useEffect(() => {
    if (!isActive) return;
    
    const sessionStart = new Date();
    console.log("Focus session started:", sessionStart, "with settings:", settings);
    
    // Record session start in local storage for persistence
    const sessions = JSON.parse(localStorage.getItem('focusSessions') || '[]');
    const currentSession = {
      id: Date.now(),
      startTime: sessionStart.toISOString(),
      settings: { ...settings }
    };
    
    localStorage.setItem('focusSessions', JSON.stringify([...sessions, currentSession]));
    
    return () => {
      if (isActive) {
        const sessionEnd = new Date();
        const duration = (sessionEnd.getTime() - sessionStart.getTime()) / 1000 / 60; // in minutes
        console.log(`Focus session ended: ${sessionEnd}. Duration: ${duration.toFixed(2)} minutes`);
        
        // Update the session in storage with end time and duration
        const updatedSessions = JSON.parse(localStorage.getItem('focusSessions') || '[]');
        const sessionIndex = updatedSessions.findIndex((s: any) => s.id === currentSession.id);
        
        if (sessionIndex !== -1) {
          updatedSessions[sessionIndex] = {
            ...updatedSessions[sessionIndex],
            endTime: sessionEnd.toISOString(),
            duration: duration
          };
          
          localStorage.setItem('focusSessions', JSON.stringify(updatedSessions));
        }
      }
    };
  }, [isActive]);
};
