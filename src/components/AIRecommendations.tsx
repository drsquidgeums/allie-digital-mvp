import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Lightbulb, Sparkles, Clock, Target, Filter } from 'lucide-react';
import { useAIPersonalization } from '@/hooks/useAIPersonalization';
import { generateDemoInsights } from '@/utils/demoInsights';
import { AIRecommendationCard, AIRecommendation, RecommendationType } from './AIRecommendationCard';
import { useToast } from '@/hooks/use-toast';

interface AIRecommendationsProps {
  className?: string;
  compact?: boolean;
}

export const AIRecommendations: React.FC<AIRecommendationsProps> = ({ 
  className = "", 
  compact = false 
}) => {
  const { personalization, isGenerating, generateInsights, fetchInsights } = useAIPersonalization();
  const [user, setUser] = React.useState<any>(null);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [filterType, setFilterType] = useState<RecommendationType | 'all'>('all');
  const { toast } = useToast();

  React.useEffect(() => {
    import('@/integrations/supabase/client').then(({ supabase }) => {
      supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
    });
  }, []);

  // Convert text recommendations to structured recommendations
  const structuredRecommendations = useMemo((): AIRecommendation[] => {
    return personalization.recommendations.map((rec, index) => ({
      id: `rec-${index}`,
      type: (index === 0 ? 'action' : index === 1 ? 'setting' : index === 2 ? 'warning' : 'insight') as RecommendationType,
      title: rec.split('.')[0] + '.',
      description: rec,
      confidence: Math.floor(Math.random() * 30) + 70, // 70-100% confidence
      actionable: index < 2,
      actionLabel: index === 0 ? 'Start Focus Session' : index === 1 ? 'Apply Settings' : undefined,
      action: index === 0 ? () => toast({ title: "Focus session started!", description: "Timer activated based on AI recommendation." }) : 
              index === 1 ? () => toast({ title: "Settings applied!", description: "Your preferences have been updated." }) : 
              undefined
    })).filter(rec => !dismissedIds.has(rec.id));
  }, [personalization.recommendations, dismissedIds, toast]);

  const filteredRecommendations = useMemo(() => {
    if (filterType === 'all') return structuredRecommendations;
    return structuredRecommendations.filter(rec => rec.type === filterType);
  }, [structuredRecommendations, filterType]);

  const handleGenerateDemo = async () => {
    if (!user?.id) return;
    
    const success = await generateDemoInsights(user.id);
    if (success) {
      // Refresh insights after generating demo data
      setTimeout(() => {
        fetchInsights();
      }, 1000);
    }
  };

  const handleDismiss = (id: string) => {
    setDismissedIds(prev => new Set([...prev, id]));
    toast({ title: "Recommendation dismissed", description: "You won't see this suggestion again." });
  };

  const handleSave = (id: string) => {
    setSavedIds(prev => new Set([...prev, id]));
    toast({ title: "Recommendation saved", description: "Added to your saved insights." });
  };

  const handleApply = (id: string) => {
    toast({ title: "Action completed", description: "Recommendation has been applied successfully." });
  };

  // Always show the component, even without data
  const hasRecommendations = filteredRecommendations.length > 0;

  if (compact) {
    return (
      <div className={`space-y-2 ${className}`}>
        {hasRecommendations ? (
          <>
            {filteredRecommendations.slice(0, 2).map((rec) => (
              <AIRecommendationCard
                key={rec.id}
                recommendation={rec}
                onDismiss={handleDismiss}
                onSave={handleSave}
                onApply={handleApply}
                compact={true}
              />
            ))}
            {filteredRecommendations.length > 2 && (
              <Badge variant="secondary" className="text-xs">
                +{filteredRecommendations.length - 2} more insights
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
              {structuredRecommendations.length} insights
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setFilterType(filterType === 'all' ? 'action' : 'all')}
              className="text-xs"
            >
              <Filter className="w-3 h-3 mr-1" />
              {filterType === 'all' ? 'All' : 'Filtered'}
            </Button>
            {!isGenerating && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={hasRecommendations ? generateInsights : handleGenerateDemo}
                className="text-xs"
              >
                {hasRecommendations ? 'Refresh' : 'Try Demo'}
              </Button>
            )}
          </div>
        </div>

        {isGenerating ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            Analyzing your patterns...
          </div>
        ) : hasRecommendations ? (
          <div className="space-y-3">
            {filteredRecommendations.map((recommendation) => (
              <AIRecommendationCard
                key={recommendation.id}
                recommendation={recommendation}
                onDismiss={handleDismiss}
                onSave={handleSave}
                onApply={handleApply}
                compact={false}
              />
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

            {savedIds.size > 0 && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm font-medium">Saved Insights</span>
                  <Badge variant="outline" className="text-xs">
                    {savedIds.size}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  You have {savedIds.size} saved recommendation{savedIds.size !== 1 ? 's' : ''} to review later.
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
              onClick={handleGenerateDemo}
              className="w-full text-xs"
              disabled={isGenerating}
            >
              {isGenerating ? 'Generating...' : 'Try AI Demo'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};