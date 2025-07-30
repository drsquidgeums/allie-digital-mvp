import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface FeedbackData {
  recommendation_id: string;
  action: 'applied' | 'dismissed' | 'saved' | 'viewed';
  effectiveness_rating?: number;
  context?: Record<string, any>;
}

interface RecommendationEffectiveness {
  recommendation_type: string;
  success_rate: number;
  avg_rating: number;
  total_interactions: number;
}

export const useAIFeedback = () => {
  const [user, setUser] = useState<any>(null);
  const [effectiveness, setEffectiveness] = useState<RecommendationEffectiveness[]>([]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Track feedback for AI recommendations
  const trackFeedback = useCallback(async (feedback: FeedbackData) => {
    if (!user?.id) return;

    try {
      // Store feedback in ai_insights table with special feedback type
      await supabase
        .from('ai_insights')
        .insert({
          user_id: user.id,
          insight_type: 'feedback',
          insight_data: {
            recommendation_id: feedback.recommendation_id,
            action: feedback.action,
            effectiveness_rating: feedback.effectiveness_rating,
            context: feedback.context || {},
            timestamp: new Date().toISOString()
          },
          confidence_score: feedback.effectiveness_rating ? feedback.effectiveness_rating / 5 : 0.5,
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
        });

      console.log('AI feedback tracked:', feedback.action);
    } catch (error) {
      console.error('Failed to track AI feedback:', error);
    }
  }, [user?.id]);

  // Get recommendation effectiveness data
  const getEffectiveness = useCallback(async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('ai_insights')
        .select('*')
        .eq('user_id', user.id)
        .eq('insight_type', 'feedback')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      // Analyze effectiveness by recommendation type
      const effectivenessMap = new Map<string, {
        applied: number;
        total: number;
        ratings: number[];
      }>();

      data?.forEach(feedback => {
        const feedbackData = feedback.insight_data as any;
        const type = feedbackData?.context?.type || 'general';
        const current = effectivenessMap.get(type) || { applied: 0, total: 0, ratings: [] };
        
        current.total++;
        if (feedbackData?.action === 'applied') current.applied++;
        if (feedbackData?.effectiveness_rating) current.ratings.push(feedbackData.effectiveness_rating);
        
        effectivenessMap.set(type, current);
      });

      const effectivenessData = Array.from(effectivenessMap.entries()).map(([type, stats]) => ({
        recommendation_type: type,
        success_rate: stats.total > 0 ? stats.applied / stats.total : 0,
        avg_rating: stats.ratings.length > 0 ? 
          stats.ratings.reduce((a, b) => a + b, 0) / stats.ratings.length : 0,
        total_interactions: stats.total
      }));

      setEffectiveness(effectivenessData);
    } catch (error) {
      console.error('Failed to get effectiveness data:', error);
    }
  }, [user?.id]);

  // Get learning insights from feedback patterns
  const getLearningInsights = useCallback(async () => {
    if (!user?.id) return null;

    try {
      const { data, error } = await supabase
        .from('ai_insights')
        .select('*')
        .eq('user_id', user.id)
        .eq('insight_type', 'feedback')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      // Analyze patterns
      const patterns = {
        most_effective_times: [] as string[],
        preferred_recommendation_types: [] as string[],
        dismissal_patterns: [] as string[],
        improvement_areas: [] as string[]
      };

      // Extract timing patterns
      const timePatterns = data?.reduce((acc, feedback) => {
        const feedbackData = feedback.insight_data as any;
        const hour = new Date(feedbackData?.timestamp || feedback.created_at).getHours();
        const timeSlot = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';
        
        if (!acc[timeSlot]) acc[timeSlot] = { applied: 0, total: 0 };
        acc[timeSlot].total++;
        if (feedbackData?.action === 'applied') acc[timeSlot].applied++;
        
        return acc;
      }, {} as Record<string, { applied: number; total: number }>);

      // Find most effective times
      Object.entries(timePatterns || {}).forEach(([time, stats]) => {
        if (stats.total >= 3 && stats.applied / stats.total > 0.7) {
          patterns.most_effective_times.push(time);
        }
      });

      return patterns;
    } catch (error) {
      console.error('Failed to get learning insights:', error);
      return null;
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      getEffectiveness();
    }
  }, [user?.id, getEffectiveness]);

  return {
    trackFeedback,
    effectiveness,
    getEffectiveness,
    getLearningInsights
  };
};