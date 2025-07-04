
import { useEffect } from 'react';
import { useAnalytics } from './analytics/useAnalytics';

export const useAnalyticsTracking = () => {
  const { trackDailyActivity, trackToolUsage } = useAnalytics();

  useEffect(() => {
    // Track page visit
    trackDailyActivity('page_visit');
  }, [trackDailyActivity]);

  const trackTool = (toolName: string) => {
    trackToolUsage(toolName);
    trackDailyActivity('tool_usage');
  };

  return { trackTool };
};
