import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, Clock, Target, Heart, TrendingUp, X } from 'lucide-react';
import { aiEnhancementService, AIInsight } from '@/services/ai/AIEnhancementService';
import { useUserAnalytics } from '@/hooks/useUserAnalytics';

const typeIcons = {
  productivity: TrendingUp,
  wellness: Heart,
  learning: Lightbulb,
  focus: Target,
  motivation: Clock
};

const typeColors = {
  productivity: 'bg-blue-500/10 text-blue-700',
  wellness: 'bg-green-500/10 text-green-700',
  learning: 'bg-purple-500/10 text-purple-700',
  focus: 'bg-orange-500/10 text-orange-700',
  motivation: 'bg-pink-500/10 text-pink-700'
};

interface SmartRecommendationsProps {
  className?: string;
  maxItems?: number;
}

export const SmartRecommendations: React.FC<SmartRecommendationsProps> = ({ 
  className = '', 
  maxItems = 3 
}) => {
  const [recommendations, setRecommendations] = useState<AIInsight[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
  const { getRecentActivity } = useUserAnalytics();

  // Generate recommendations based on user activity
  const generateRecommendations = async () => {
    setIsLoading(true);
    try {
      const recentActivity = getRecentActivity();
      const newRecommendations = await aiEnhancementService.generateSmartRecommendations(recentActivity);
      
      // Filter out dismissed recommendations
      const filtered = newRecommendations.filter(rec => !dismissedIds.has(rec.id));
      setRecommendations(filtered.slice(0, maxItems));
    } catch (error) {
      console.error('Error generating recommendations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-generate recommendations on mount and periodically
  useEffect(() => {
    generateRecommendations();
    
    // Regenerate every 30 minutes
    const interval = setInterval(generateRecommendations, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [dismissedIds]);

  const dismissRecommendation = (id: string) => {
    setDismissedIds(prev => new Set([...prev, id]));
    setRecommendations(prev => prev.filter(rec => rec.id !== id));
  };

  const applyRecommendation = (recommendation: AIInsight) => {
    // Add insight to the AI service for tracking
    aiEnhancementService.addInsight({
      ...recommendation,
      metadata: { ...recommendation.metadata, applied: true }
    });
    
    // Dismiss after applying
    dismissRecommendation(recommendation.id);
  };

  if (recommendations.length === 0 && !isLoading) {
    return null;
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">Smart Suggestions</h3>
        {!isLoading && (
          <Button
            variant="ghost"
            size="sm"
            onClick={generateRecommendations}
            className="h-6 text-xs"
          >
            Refresh
          </Button>
        )}
      </div>

      {isLoading ? (
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-primary/20 rounded-full animate-pulse" />
            <span className="text-sm text-muted-foreground">Generating suggestions...</span>
          </div>
        </Card>
      ) : (
        <div className="space-y-2">
          {recommendations.map((recommendation) => {
            const Icon = typeIcons[recommendation.type] || Lightbulb;
            const colorClass = typeColors[recommendation.type] || typeColors.learning;
            
            return (
              <Card key={recommendation.id} className="p-3 hover:shadow-sm transition-shadow">
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${colorClass}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-medium truncate">{recommendation.title}</h4>
                      <Badge variant="secondary" className="text-xs">
                        {Math.round(recommendation.confidence * 100)}%
                      </Badge>
                    </div>
                    
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                      {recommendation.description}
                    </p>
                    
                    {recommendation.actionable && (
                      <div className="flex items-center gap-1 mt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => applyRecommendation(recommendation)}
                          className="h-6 text-xs"
                        >
                          Apply
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => dismissRecommendation(recommendation.id)}
                          className="h-6 w-6 p-0"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};