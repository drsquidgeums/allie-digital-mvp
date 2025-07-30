import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Lightbulb, Sparkles, Clock, Target } from 'lucide-react';
import { useAIPersonalization } from '@/hooks/useAIPersonalization';

interface AIRecommendationsProps {
  className?: string;
  compact?: boolean;
}

export const AIRecommendations: React.FC<AIRecommendationsProps> = ({ 
  className = "", 
  compact = false 
}) => {
  const { personalization, isGenerating, generateInsights } = useAIPersonalization();

  // Always show the component, even without data
  const hasRecommendations = personalization.recommendations.length > 0;

  if (compact) {
    return (
      <div className={`space-y-2 ${className}`}>
        {hasRecommendations ? (
          <>
            {personalization.recommendations.slice(0, 2).map((rec, index) => (
              <div key={index} className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg text-sm">
                <Lightbulb className="w-4 h-4 text-primary shrink-0" />
                <span className="text-muted-foreground">{rec}</span>
              </div>
            ))}
            {personalization.recommendations.length > 2 && (
              <Badge variant="secondary" className="text-xs">
                +{personalization.recommendations.length - 2} more insights
              </Badge>
            )}
          </>
        ) : (
          <div className="flex items-center gap-2 p-2 bg-primary/5 border border-primary/20 rounded-lg text-sm">
            <Sparkles className="w-4 h-4 text-primary shrink-0" />
            <span className="text-muted-foreground">AI learning your patterns...</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">AI Insights</h3>
            <Badge variant="secondary" className="text-xs">
              Personalized
            </Badge>
          </div>
          {!isGenerating && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={generateInsights}
              className="text-xs"
            >
              Refresh
            </Button>
          )}
        </div>

        {isGenerating ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            Analyzing your patterns...
          </div>
        ) : hasRecommendations ? (
          <div className="space-y-3">
            {personalization.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full shrink-0">
                  {index === 0 && <Target className="w-4 h-4 text-primary" />}
                  {index === 1 && <Clock className="w-4 h-4 text-primary" />}
                  {index >= 2 && <Lightbulb className="w-4 h-4 text-primary" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm leading-relaxed">{recommendation}</p>
                </div>
              </div>
            ))}

            {personalization.smartDefaults.pomodoro_duration && (
              <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">Optimal Settings</span>
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div>Work sessions: {personalization.smartDefaults.pomodoro_duration} minutes</div>
                  <div>Break time: {personalization.smartDefaults.break_duration} minutes</div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-primary/5 border border-primary/20 rounded-lg">
              <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full shrink-0">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium mb-1">AI Learning Mode</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Your AI assistant is observing your work patterns to provide personalized recommendations. 
                  Use the tools for a few minutes to see intelligent suggestions appear here.
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 bg-muted/30 rounded">
                <div className="font-medium">Tracks:</div>
                <div className="text-muted-foreground">Tool usage, focus patterns</div>
              </div>
              <div className="p-2 bg-muted/30 rounded">
                <div className="font-medium">Suggests:</div>
                <div className="text-muted-foreground">Optimal timings, workflows</div>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={generateInsights}
              className="w-full text-xs"
            >
              Generate Sample Insights
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};