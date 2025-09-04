import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Brain, Coffee, Moon, Sun, Activity } from 'lucide-react';
import { aiEnhancementService, AIInsight } from '@/services/ai/AIEnhancementService';
import { useUserAnalytics } from '@/hooks/useUserAnalytics';

interface WellnessMonitorProps {
  className?: string;
}

export const WellnessMonitor: React.FC<WellnessMonitorProps> = ({ 
  className = '' 
}) => {
  const [wellnessInsights, setWellnessInsights] = useState<AIInsight[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [wellnessScore, setWellnessScore] = useState<number>(0);
  const { getRecentActivity, trackEvent } = useUserAnalytics();

  const analyzeWellness = async () => {
    setIsAnalyzing(true);
    try {
      const recentActivity = getRecentActivity();
      const insights = await aiEnhancementService.analyzeWellness(recentActivity);
      
      setWellnessInsights(insights);
      
      // Calculate wellness score based on insights and activity patterns
      const score = calculateWellnessScore(recentActivity, insights);
      setWellnessScore(score);

      trackEvent({
        event_type: 'wellness_analysis_completed',
        event_data: { 
          insightCount: insights.length,
          wellnessScore: score,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Error analyzing wellness:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const calculateWellnessScore = (activity: any[], insights: AIInsight[]): number => {
    // Simple wellness score calculation
    let score = 75; // Base score
    
    // Adjust based on activity patterns
    const errorRate = activity.filter(a => a.type === 'error').length / Math.max(activity.length, 1);
    const completionRate = activity.filter(a => a.type === 'completed').length / Math.max(activity.length, 1);
    
    score -= errorRate * 20; // Reduce score for errors (stress indicator)
    score += completionRate * 15; // Increase score for completions
    
    // Adjust based on time of day (circadian rhythm consideration)
    const currentHour = new Date().getHours();
    if (currentHour >= 22 || currentHour <= 6) {
      score -= 10; // Late night work penalty
    }
    
    return Math.max(0, Math.min(100, Math.round(score)));
  };

  // Auto-analyze wellness every hour
  useEffect(() => {
    analyzeWellness();
    const interval = setInterval(analyzeWellness, 60 * 60 * 1000); // Every hour
    return () => clearInterval(interval);
  }, []);

  const getWellnessIcon = (score: number) => {
    if (score >= 80) return <Heart className="w-4 h-4 text-green-600" />;
    if (score >= 60) return <Activity className="w-4 h-4 text-yellow-600" />;
    return <Brain className="w-4 h-4 text-red-600" />;
  };

  const getWellnessColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100 dark:bg-green-950/30';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-950/30';
    return 'text-red-600 bg-red-100 dark:bg-red-950/30';
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'wellness': return <Heart className="w-4 h-4" />;
      case 'focus': return <Brain className="w-4 h-4" />;
      case 'motivation': return <Sun className="w-4 h-4" />;
      default: return <Coffee className="w-4 h-4" />;
    }
  };

  const applyWellnessRecommendation = (insight: AIInsight) => {
    trackEvent({
      event_type: 'wellness_recommendation_applied',
      event_data: { 
        type: insight.type,
        title: insight.title,
        confidence: insight.confidence
      }
    });

    // Add to AI service for tracking
    aiEnhancementService.addInsight({
      ...insight,
      metadata: { ...insight.metadata, applied: true, source: 'wellness_monitor' }
    });
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Heart className="w-4 h-4" />
            Wellness Monitor
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge className={getWellnessColor(wellnessScore)}>
              {wellnessScore}%
            </Badge>
            {getWellnessIcon(wellnessScore)}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {isAnalyzing ? (
          <div className="flex items-center gap-2 py-4">
            <div className="w-4 h-4 bg-primary/20 rounded-full animate-pulse" />
            <span className="text-sm text-muted-foreground">
              Analyzing wellness patterns...
            </span>
          </div>
        ) : (
          <div className="space-y-3">
            {wellnessInsights.length > 0 ? (
              wellnessInsights.slice(0, 2).map((insight, index) => (
                <div key={insight.id || index} className="flex items-start gap-3 p-2 rounded-lg border">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                    {getInsightIcon(insight.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium mb-1">{insight.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                      {insight.description}
                    </p>
                    
                    {insight.actionable && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => applyWellnessRecommendation(insight)}
                        className="h-6 text-xs"
                      >
                        Try this
                      </Button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground mb-2">
                  Your wellness patterns look good!
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={analyzeWellness}
                  className="h-6 text-xs"
                >
                  Check again
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};