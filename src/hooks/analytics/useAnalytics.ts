
import { useCallback, useEffect, useState } from 'react';

interface UsageStats {
  toolUsage: Record<string, number>;
  dailyActivity: Record<string, number>;
  readingSpeed: number[];
  sessionDuration: number;
  documentsProcessed: number;
}

export const useAnalytics = () => {
  const [stats, setStats] = useState<UsageStats>(() => {
    const saved = localStorage.getItem('app_analytics');
    return saved ? JSON.parse(saved) : {
      toolUsage: {},
      dailyActivity: {},
      readingSpeed: [],
      sessionDuration: 0,
      documentsProcessed: 0
    };
  });

  const trackToolUsage = useCallback((toolName: string) => {
    setStats(prev => {
      const updated = {
        ...prev,
        toolUsage: {
          ...prev.toolUsage,
          [toolName]: (prev.toolUsage[toolName] || 0) + 1
        }
      };
      localStorage.setItem('app_analytics', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const trackReadingSpeed = useCallback((wordsPerMinute: number) => {
    setStats(prev => {
      const updated = {
        ...prev,
        readingSpeed: [...prev.readingSpeed.slice(-9), wordsPerMinute]
      };
      localStorage.setItem('app_analytics', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const trackDailyActivity = useCallback((activity: string) => {
    const today = new Date().toDateString();
    setStats(prev => {
      const updated = {
        ...prev,
        dailyActivity: {
          ...prev.dailyActivity,
          [today]: (prev.dailyActivity[today] || 0) + 1
        }
      };
      localStorage.setItem('app_analytics', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const getProductivityMetrics = useCallback(() => {
    const today = new Date().toDateString();
    const thisWeek = Object.keys(stats.dailyActivity)
      .filter(date => {
        const activityDate = new Date(date);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return activityDate >= weekAgo;
      })
      .reduce((sum, date) => sum + stats.dailyActivity[date], 0);

    return {
      todayActivity: stats.dailyActivity[today] || 0,
      weeklyActivity: thisWeek,
      averageReadingSpeed: stats.readingSpeed.length > 0 
        ? Math.round(stats.readingSpeed.reduce((a, b) => a + b, 0) / stats.readingSpeed.length)
        : 0,
      mostUsedTool: Object.entries(stats.toolUsage).sort(([,a], [,b]) => b - a)[0]?.[0] || 'None'
    };
  }, [stats]);

  return {
    stats,
    trackToolUsage,
    trackReadingSpeed,
    trackDailyActivity,
    getProductivityMetrics
  };
};
