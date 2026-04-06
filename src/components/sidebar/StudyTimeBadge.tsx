
import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export const StudyTimeBadge: React.FC = () => {
  const [totalSeconds, setTotalSeconds] = useState(0);

  useEffect(() => {
    const calculateToday = () => {
      const savedSessions = localStorage.getItem('study_sessions');
      if (!savedSessions) return 0;
      try {
        const sessions = JSON.parse(savedSessions);
        const today = new Date().toDateString();
        return sessions
          .filter((s: any) => new Date(s.startTime).toDateString() === today)
          .reduce((sum: number, s: any) => sum + (s.duration || 0), 0);
      } catch {
        return 0;
      }
    };

    setTotalSeconds(calculateToday());
    const interval = setInterval(() => setTotalSeconds(calculateToday()), 30000);
    return () => clearInterval(interval);
  }, []);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  const display = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

  return (
    <div className="flex items-center gap-2 px-2 py-1.5 rounded-md text-sm text-muted-foreground">
      <Clock className="h-4 w-4 text-primary" />
      <span>Today: <span className="font-medium text-foreground">{display}</span></span>
    </div>
  );
};
