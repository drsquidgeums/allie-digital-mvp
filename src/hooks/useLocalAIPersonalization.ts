import { useState, useEffect, useCallback } from 'react';

interface AIInsight {
  id: string;
  user_id: string;
  insight_type: string;
  insight_data: Record<string, any>;
  confidence: number;
  created_at: string;
  expires_at: string;
}

interface PersonalizationData {
  recommendations: Array<{
    type: string;
    title: string;
    description: string;
    confidence: number;
    actionable: boolean;
    action?: {
      type: string;
      data: Record<string, any>;
    };
  }>;
  smartDefaults: Record<string, any>;
  adaptiveSettings: Record<string, any>;
  focusPatterns: Record<string, any>;
}

interface AnalyticsData {
  event_type: string;
  event_data: Record<string, any>;
  created_at: string;
}

export const useLocalAIPersonalization = () => {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [personalization, setPersonalization] = useState<PersonalizationData>({
    recommendations: [],
    smartDefaults: {},
    adaptiveSettings: {},
    focusPatterns: {}
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const fetchInsights = useCallback(async () => {
    try {
      const storedInsights = localStorage.getItem('demoAIInsights');
      if (storedInsights) {
        const parsedInsights: AIInsight[] = JSON.parse(storedInsights);
        
        // Filter out expired insights
        const validInsights = parsedInsights.filter(insight => 
          new Date(insight.expires_at) > new Date()
        );
        
        setInsights(validInsights);
        
        // Process insights into personalization data
        const processedData = processInsights(validInsights);
        setPersonalization(processedData);
      }
    } catch (error) {
      console.error('Failed to fetch local insights:', error);
    }
  }, []);

  const processInsights = (insights: AIInsight[]): PersonalizationData => {
    const recommendations = insights
      .filter(insight => insight.insight_type === 'recommendation')
      .map(insight => ({
        type: insight.insight_data.type || 'insight',
        title: insight.insight_data.title || 'AI Recommendation',
        description: insight.insight_data.description || 'No description available',
        confidence: insight.confidence,
        actionable: insight.insight_data.actionable || false,
        action: insight.insight_data.action
      }));

    const smartDefaults = insights
      .filter(insight => insight.insight_type === 'smart_default')
      .reduce((acc, insight) => ({
        ...acc,
        [insight.insight_data.setting]: insight.insight_data.value
      }), {});

    const adaptiveSettings = insights
      .filter(insight => insight.insight_type === 'adaptive_setting')
      .reduce((acc, insight) => ({
        ...acc,
        [insight.insight_data.setting]: insight.insight_data.value
      }), {});

    const focusPatterns = insights
      .filter(insight => insight.insight_type === 'focus_pattern')
      .reduce((acc, insight) => ({
        ...acc,
        [insight.insight_data.pattern]: insight.insight_data.data
      }), {});

    return {
      recommendations,
      smartDefaults,
      adaptiveSettings,
      focusPatterns
    };
  };

  const generateDemoInsights = useCallback(async () => {
    setIsGenerating(true);
    
    try {
      // Get analytics data from localStorage
      const analyticsData = JSON.parse(localStorage.getItem('demoAnalytics') || '[]');
      
      // Generate demo insights based on analytics
      const demoInsights = generateInsightsFromAnalytics(analyticsData);
      
      // Store insights in localStorage
      localStorage.setItem('demoAIInsights', JSON.stringify(demoInsights));
      
      // Update state
      await fetchInsights();
    } catch (error) {
      console.error('Failed to generate demo insights:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [fetchInsights]);

  const generateInsightsFromAnalytics = (analytics: AnalyticsData[]): AIInsight[] => {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours from now
    
    const insights: AIInsight[] = [];
    
    // Analyze tool usage patterns
    const toolUsageEvents = analytics.filter(event => event.event_type === 'tool_usage');
    const pageVisitEvents = analytics.filter(event => event.event_type === 'page_visit');
    const pomodoroEvents = analytics.filter(event => event.event_type === 'pomodoro_session');
    
    // Most used tool recommendation
    if (toolUsageEvents.length > 0) {
      const toolCounts = toolUsageEvents.reduce((acc: Record<string, number>, event) => {
        const tool = event.event_data.tool;
        acc[tool] = (acc[tool] || 0) + 1;
        return acc;
      }, {});
      
      const mostUsedTool = Object.entries(toolCounts).sort(([,a], [,b]) => b - a)[0];
      
      insights.push({
        id: crypto.randomUUID(),
        user_id: 'demo-user',
        insight_type: 'recommendation',
        insight_data: {
          type: 'action',
          title: `Optimize ${mostUsedTool[0]} workflow`,
          description: `You've used ${mostUsedTool[0]} ${mostUsedTool[1]} times. Consider creating custom shortcuts or templates to speed up your workflow.`,
          actionable: true,
          action: {
            type: 'optimize_tool',
            data: { tool: mostUsedTool[0] }
          }
        },
        confidence: 0.85,
        created_at: now.toISOString(),
        expires_at: expiresAt.toISOString()
      });
    }
    
    // Time-based insights
    if (pageVisitEvents.length > 0) {
      const timePatterns = pageVisitEvents.map(event => event.event_data.time_of_day);
      const mostActiveTime = timePatterns.reduce((acc: Record<string, number>, time) => {
        acc[time] = (acc[time] || 0) + 1;
        return acc;
      }, {});
      
      const peakTime = Object.entries(mostActiveTime).sort(([,a], [,b]) => (b as number) - (a as number))[0];
      
      insights.push({
        id: crypto.randomUUID(),
        user_id: 'demo-user',
        insight_type: 'focus_pattern',
        insight_data: {
          pattern: 'peak_productivity',
          data: {
            time: peakTime[0],
            sessions: peakTime[1]
          }
        },
        confidence: 0.78,
        created_at: now.toISOString(),
        expires_at: expiresAt.toISOString()
      });
      
      insights.push({
        id: crypto.randomUUID(),
        user_id: 'demo-user',
        insight_type: 'recommendation',
        insight_data: {
          type: 'insight',
          title: `Your peak productivity is in the ${peakTime[0]}`,
          description: `Based on your usage patterns, you're most active during ${peakTime[0]} hours. Consider scheduling important tasks during this time.`,
          actionable: true
        },
        confidence: 0.82,
        created_at: now.toISOString(),
        expires_at: expiresAt.toISOString()
      });
    }
    
    // Pomodoro insights
    if (pomodoroEvents.length > 0) {
      const completionRates = pomodoroEvents.map(event => Number(event.event_data.completion_rate) || 0);
      const avgCompletion = completionRates.reduce((a: number, b: number) => a + b, 0) / completionRates.length;
      
      if (avgCompletion < 0.7) {
        insights.push({
          id: crypto.randomUUID(),
          user_id: 'demo-user',
          insight_type: 'recommendation',
          insight_data: {
            type: 'setting',
            title: 'Consider shorter focus sessions',
            description: `Your average completion rate is ${Math.round(avgCompletion * 100)}%. Try reducing session length to improve completion rates.`,
            actionable: true,
            action: {
              type: 'adjust_pomodoro',
              data: { suggested_duration: 15 }
            }
          },
          confidence: 0.75,
          created_at: now.toISOString(),
          expires_at: expiresAt.toISOString()
        });
      }
    }
    
    // Default recommendations if no specific patterns found
    if (insights.length === 0) {
      insights.push(
        {
          id: crypto.randomUUID(),
          user_id: 'demo-user',
          insight_type: 'recommendation',
          insight_data: {
            type: 'insight',
            title: 'Start tracking your productivity patterns',
            description: 'Use the various tools in the toolbox to begin building your productivity profile. The AI will learn from your usage patterns.',
            actionable: true
          },
          confidence: 0.9,
          created_at: now.toISOString(),
          expires_at: expiresAt.toISOString()
        },
        {
          id: crypto.randomUUID(),
          user_id: 'demo-user',
          insight_type: 'recommendation',
          insight_data: {
            type: 'action',
            title: 'Try the Pomodoro timer',
            description: 'Start with 25-minute focused work sessions to establish a baseline for your productivity patterns.',
            actionable: true,
            action: {
              type: 'start_pomodoro',
              data: { duration: 25 }
            }
          },
          confidence: 0.85,
          created_at: now.toISOString(),
          expires_at: expiresAt.toISOString()
        }
      );
    }
    
    return insights;
  };

  useEffect(() => {
    fetchInsights();
  }, [fetchInsights]);

  return {
    insights,
    personalization,
    isGenerating,
    generateInsights: generateDemoInsights,
    fetchInsights
  };
};