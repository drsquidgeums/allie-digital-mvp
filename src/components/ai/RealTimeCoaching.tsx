import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Brain, Coffee, Target, X } from 'lucide-react';
import { aiEnhancementService, AIInsight } from '@/services/ai/AIEnhancementService';
import { useUserAnalytics } from '@/hooks/useUserAnalytics';

interface RealTimeCoachingProps {
  currentActivity?: string;
  className?: string;
}

export const RealTimeCoaching: React.FC<RealTimeCoachingProps> = ({
  currentActivity = 'general',
  className = ''
}) => {
  const [coachingInsight, setCoachingInsight] = useState<AIInsight | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);
  const { trackEvent } = useUserAnalytics();

  const generateCoachingInsight = async () => {
    try {
      const userPatterns = {
        focusTimes: ['09:00', '14:00'],
        breakPreferences: ['short', 'movement'],
        productivityPeaks: ['morning', 'afternoon'],
        stressIndicators: ['rapid_clicking', 'task_switching'],
        learningStyle: 'visual'
      };

      const insight = await aiEnhancementService.generateCoachingInsight(
        currentActivity,
        userPatterns
      );

      if (insight && !isDismissed) {
        setCoachingInsight(insight);
        trackEvent({
          event_type: 'coaching_insight_shown',
          event_data: { 
            type: insight.type, 
            activity: currentActivity,
            confidence: insight.confidence 
          }
        });
      }
    } catch (error) {
      console.error('Error generating coaching insight:', error);
    }
  };

  // Generate insights based on activity changes and time intervals
  useEffect(() => {
    if (!isDismissed) {
      const timer = setTimeout(() => {
        generateCoachingInsight();
      }, 5000); // Wait 5 seconds before offering coaching

      return () => clearTimeout(timer);
    }
  }, [currentActivity, isDismissed]);

  // Auto-regenerate insights every 15 minutes
  useEffect(() => {
    if (!isDismissed) {
      const interval = setInterval(generateCoachingInsight, 15 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [isDismissed]);

  const dismissInsight = () => {
    setIsDismissed(true);
    setCoachingInsight(null);
    trackEvent({
      event_type: 'coaching_insight_dismissed',
      event_data: { 
        type: coachingInsight?.type,
        activity: currentActivity 
      }
    });
  };

  const acceptSuggestion = () => {
    if (coachingInsight) {
      trackEvent({
        event_type: 'coaching_insight_accepted',
        event_data: { 
          type: coachingInsight.type,
          activity: currentActivity,
          title: coachingInsight.title
        }
      });
      
      // Add to AI insights for tracking
      aiEnhancementService.addInsight({
        ...coachingInsight,
        metadata: { ...coachingInsight.metadata, accepted: true }
      });
    }
    setIsDismissed(true);
    setCoachingInsight(null);
  };

  if (!coachingInsight || isDismissed) {
    return null;
  }

  const getIcon = () => {
    switch (coachingInsight.type) {
      case 'wellness': return <Heart className="w-4 h-4" />;
      case 'focus': return <Target className="w-4 h-4" />;
      case 'productivity': return <Brain className="w-4 h-4" />;
      default: return <Coffee className="w-4 h-4" />;
    }
  };

  const getColorClass = () => {
    switch (coachingInsight.type) {
      case 'wellness': return 'border-green-200 bg-green-50 dark:bg-green-950/20';
      case 'focus': return 'border-orange-200 bg-orange-50 dark:bg-orange-950/20';
      case 'productivity': return 'border-blue-200 bg-blue-50 dark:bg-blue-950/20';
      default: return 'border-purple-200 bg-purple-50 dark:bg-purple-950/20';
    }
  };

  return (
    <Card className={`p-3 ${getColorClass()} ${className} animate-in slide-in-from-right-5 duration-300`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-background border flex items-center justify-center">
          {getIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-sm font-medium">{coachingInsight.title}</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={dismissInsight}
              className="h-6 w-6 p-0 flex-shrink-0"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground mb-2">
            {coachingInsight.description}
          </p>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={acceptSuggestion}
              className="h-6 text-xs"
            >
              Got it!
            </Button>
            <span className="text-xs text-muted-foreground">
              {Math.round(coachingInsight.confidence * 100)}% confident
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};