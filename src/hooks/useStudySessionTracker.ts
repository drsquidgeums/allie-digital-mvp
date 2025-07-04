
import { useState, useEffect, useRef } from 'react';
import { useToast } from './use-toast';

interface StudySession {
  documentName: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // in seconds
  type: 'reading' | 'editing';
}

export const useStudySessionTracker = (documentName: string = 'Untitled Document') => {
  const [isTracking, setIsTracking] = useState(false);
  const [currentSession, setCurrentSession] = useState<StudySession | null>(null);
  const [totalTimeToday, setTotalTimeToday] = useState(0);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const startTimeRef = useRef<Date | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  // Load sessions from localStorage on mount
  useEffect(() => {
    const savedSessions = localStorage.getItem('study_sessions');
    if (savedSessions) {
      try {
        const parsed = JSON.parse(savedSessions);
        setSessions(parsed);
        
        // Calculate today's total time
        const today = new Date().toDateString();
        const todaySessions = parsed.filter((session: StudySession) => 
          new Date(session.startTime).toDateString() === today
        );
        const todayTotal = todaySessions.reduce((total: number, session: StudySession) => 
          total + session.duration, 0
        );
        setTotalTimeToday(todayTotal);
      } catch (error) {
        console.error('Error loading study sessions:', error);
      }
    }
  }, []);

  const startSession = (type: 'reading' | 'editing' = 'reading') => {
    if (isTracking) return;

    const startTime = new Date();
    startTimeRef.current = startTime;
    
    const session: StudySession = {
      documentName,
      startTime,
      duration: 0,
      type
    };
    
    setCurrentSession(session);
    setIsTracking(true);
    
    // Start interval to update duration
    intervalRef.current = setInterval(() => {
      if (startTimeRef.current) {
        const duration = Math.floor((new Date().getTime() - startTimeRef.current.getTime()) / 1000);
        setCurrentSession(prev => prev ? { ...prev, duration } : null);
      }
    }, 1000);

    toast({
      title: "Study session started",
      description: `Tracking ${type} time for "${documentName}"`,
    });
  };

  const endSession = () => {
    if (!isTracking || !currentSession) return;

    const endTime = new Date();
    const finalDuration = startTimeRef.current ? 
      Math.floor((endTime.getTime() - startTimeRef.current.getTime()) / 1000) : 0;

    const completedSession: StudySession = {
      ...currentSession,
      endTime,
      duration: finalDuration
    };

    const updatedSessions = [...sessions, completedSession];
    setSessions(updatedSessions);
    setTotalTimeToday(prev => prev + finalDuration);
    
    // Save to localStorage
    localStorage.setItem('study_sessions', JSON.stringify(updatedSessions));

    // Clear current session
    setCurrentSession(null);
    setIsTracking(false);
    startTimeRef.current = null;
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    toast({
      title: "Study session completed",
      description: `Studied for ${Math.floor(finalDuration / 60)} minutes`,
    });
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    isTracking,
    currentSession,
    totalTimeToday,
    sessions,
    startSession,
    endSession,
    formatTime
  };
};
