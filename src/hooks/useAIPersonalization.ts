import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { createAnthropicCompletion } from '@/utils/anthropic';

interface AIInsight {
  id: string;
  insight_type: string;
  insight_data: any;
  confidence_score: number;
  created_at: string;
  expires_at?: string;
}

interface PersonalizationData {
  recommendations: string[];
  smartDefaults: Record<string, any>;
  adaptiveSettings: Record<string, any>;
  focusPatterns: Record<string, any>;
}

export const useAIPersonalization = () => {
  const [user, setUser] = useState<any>(null);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [personalization, setPersonalization] = useState<PersonalizationData>({
    recommendations: [],
    smartDefaults: {},
    adaptiveSettings: {},
    focusPatterns: {}
  });
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Fetch existing insights
  const fetchInsights = useCallback(async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('ai_insights')
        .select('*')
        .eq('user_id', user.id)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setInsights(data || []);
      
      // Process insights into personalization data
      const newPersonalization: PersonalizationData = {
        recommendations: [],
        smartDefaults: {},
        adaptiveSettings: {},
        focusPatterns: {}
      };

      data?.forEach(insight => {
        const insightData = typeof insight.insight_data === 'string' 
          ? JSON.parse(insight.insight_data) 
          : insight.insight_data;
        
        switch (insight.insight_type) {
          case 'recommendations':
            newPersonalization.recommendations = insightData.items || [];
            break;
          case 'smart_defaults':
            newPersonalization.smartDefaults = insightData;
            break;
          case 'adaptive_settings':
            newPersonalization.adaptiveSettings = insightData;
            break;
          case 'focus_patterns':
            newPersonalization.focusPatterns = insightData;
            break;
        }
      });

      setPersonalization(newPersonalization);
    } catch (error) {
      console.error('Failed to fetch AI insights:', error);
    }
  }, [user?.id]);

  // Generate new insights based on user analytics
  const generateInsights = useCallback(async () => {
    if (!user?.id || isGenerating) return;

    setIsGenerating(true);

    try {
      // Fetch recent user analytics
      const { data: analytics, error } = await supabase
        .from('user_analytics')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (!analytics || analytics.length === 0) return;

      // Prepare analytics summary for AI
      const analyticsPrompt = `Analyze this user's learning behavior data and provide personalized recommendations:

User Analytics Data:
${JSON.stringify(analytics.map(a => ({
  event_type: a.event_type,
  event_data: a.event_data,
  created_at: a.created_at
})), null, 2)}

Based on this data, provide:
1. 3-5 personalized recommendations to improve their learning
2. Optimal timer settings (pomodoro duration, break length)
3. Best times of day for focused work
4. Task management suggestions

Respond in JSON format:
{
  "recommendations": ["recommendation1", "recommendation2", ...],
  "optimal_pomodoro_duration": number,
  "optimal_break_duration": number,
  "focus_peak_hours": [hour1, hour2, ...],
  "task_suggestions": ["suggestion1", "suggestion2", ...],
  "confidence": number
}`;

      const aiResponse = await createAnthropicCompletion([
        { role: 'system', content: 'You are an AI learning assistant that analyzes user behavior to provide personalized recommendations. Always respond with valid JSON.' },
        { role: 'user', content: analyticsPrompt }
      ]);

      if (aiResponse) {
        try {
          const insightData = JSON.parse(aiResponse);
          
          // Store insights in database
          const expiresAt = new Date();
          expiresAt.setDate(expiresAt.getDate() + 7); // Expire in 7 days

          await supabase.from('ai_insights').insert([
            {
              user_id: user.id,
              insight_type: 'recommendations',
              insight_data: { items: insightData.recommendations },
              confidence_score: insightData.confidence || 0.8,
              expires_at: expiresAt.toISOString()
            },
            {
              user_id: user.id,
              insight_type: 'smart_defaults',
              insight_data: {
                pomodoro_duration: insightData.optimal_pomodoro_duration,
                break_duration: insightData.optimal_break_duration
              },
              confidence_score: insightData.confidence || 0.8,
              expires_at: expiresAt.toISOString()
            },
            {
              user_id: user.id,
              insight_type: 'focus_patterns',
              insight_data: {
                peak_hours: insightData.focus_peak_hours,
                task_suggestions: insightData.task_suggestions
              },
              confidence_score: insightData.confidence || 0.8,
              expires_at: expiresAt.toISOString()
            }
          ]);

          // Refresh insights
          await fetchInsights();
        } catch (parseError) {
          console.error('Failed to parse AI response:', parseError);
        }
      }
    } catch (error) {
      console.error('Failed to generate AI insights:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [user?.id, isGenerating, fetchInsights]);

  // Auto-generate insights when user has enough data
  useEffect(() => {
    if (user?.id && insights.length === 0) {
      // Check if user has enough analytics data (lowered threshold)
      supabase
        .from('user_analytics')
        .select('id')
        .eq('user_id', user.id)
        .then(({ data }) => {
          if (data && data.length >= 3) { // Lowered from 10 to 3 events
            generateInsights();
          }
        });
    }
  }, [user?.id, insights.length, generateInsights]);

  useEffect(() => {
    fetchInsights();
  }, [fetchInsights]);

  return {
    insights,
    personalization,
    isGenerating,
    generateInsights,
    fetchInsights
  };
};