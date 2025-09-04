import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Lightbulb, Sparkles, Clock, Target, Filter } from 'lucide-react';
import { useLocalAIPersonalization } from '@/hooks/useLocalAIPersonalization';
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
  const { personalization, isGenerating, generateInsights, fetchInsights } = useLocalAIPersonalization();
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

  // Convert recommendations to structured recommendations
  const structuredRecommendations = useMemo((): AIRecommendation[] => {
    return personalization.recommendations.map((rec, index) => ({
      id: `rec-${index}`,
      type: rec.type as RecommendationType,
      title: rec.title,
      description: rec.description,
      confidence: Math.round(rec.confidence * 100),
      actionable: rec.actionable,
      actionLabel: rec.actionable ? 'Apply' : undefined,
      action: rec.actionable ? () => toast({ 
        title: "Recommendation applied!", 
        description: rec.title
      }) : undefined
    })).filter(rec => !dismissedIds.has(rec.id));
  }, [personalization.recommendations, dismissedIds, toast]);

  const filteredRecommendations = useMemo(() => {
    if (filterType === 'all') return structuredRecommendations;
    return structuredRecommendations.filter(rec => rec.type === filterType);
  }, [structuredRecommendations, filterType]);

  const handleGenerateDemo = async () => {
    toast({ title: "Generating AI insights...", description: "This may take a moment." });
    
    try {
      await generateInsights();
      toast({ 
        title: "AI insights generated!", 
        description: "Your personalized recommendations are ready." 
      });
    } catch (error) {
      console.error('Demo generation error:', error);
      toast({ 
        title: "Error occurred", 
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
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
              <div key={rec.id} className="flex items-center gap-2 p-2 bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-lg">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  rec.type === 'action' ? 'bg-green-100 text-green-600' :
                  rec.type === 'setting' ? 'bg-blue-100 text-blue-600' :
                  rec.type === 'warning' ? 'bg-red-100 text-red-600' :
                  'bg-purple-100 text-purple-600'
                }`}>
                  {rec.type === 'action' ? '⚡' : 
                   rec.type === 'setting' ? '⚙️' : 
                   rec.type === 'warning' ? '⚠️' : '💡'}
                </div>
                <span className="text-xs font-medium flex-1 line-clamp-2">{rec.title}</span>
                <div className="flex gap-1">
                  {rec.actionable && (
                    <button 
                      onClick={() => rec.action?.()} 
                      className="w-5 h-5 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center text-xs transition-colors"
                      title="Apply"
                    >
                      ✓
                    </button>
                  )}
                  <button 
                    onClick={() => handleDismiss(rec.id)} 
                    className="w-5 h-5 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-full flex items-center justify-center text-xs transition-colors"
                    title="Dismiss"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
            {filteredRecommendations.length > 2 && (
              <div className="flex items-center justify-center p-1">
                <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">
                  +{filteredRecommendations.length - 2} more
                </Badge>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center gap-2 p-2 bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-lg">
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center animate-pulse">
              <Sparkles className="w-3 h-3 text-primary" />
            </div>
            <span className="text-xs text-muted-foreground">Learning your patterns...</span>
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
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <h3 className="font-semibold">AI Insights</h3>
            <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">
              {structuredRecommendations.length}
            </Badge>
          </div>
          <div className="flex gap-1">
            <button 
              onClick={() => setFilterType(filterType === 'all' ? 'action' : 'all')}
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                filterType === 'all' 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              }`}
              title={filterType === 'all' ? 'Show all' : 'Filter active'}
            >
              <Filter className="w-3 h-3" />
            </button>
            {!isGenerating && (
              <button 
                onClick={hasRecommendations ? generateInsights : handleGenerateDemo}
                className="w-7 h-7 rounded-full bg-green-100 hover:bg-green-200 text-green-600 flex items-center justify-center transition-all"
                title={hasRecommendations ? 'Refresh insights' : 'Generate demo insights'}
              >
                ⚡
              </button>
            )}
          </div>
        </div>

        {isGenerating ? (
          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <div className="flex flex-col">
              <span className="text-sm font-medium">Analyzing patterns...</span>
              <span className="text-xs text-muted-foreground">This takes a moment</span>
            </div>
          </div>
        ) : hasRecommendations ? (
          <div className="space-y-3">
            {filteredRecommendations.map((recommendation) => (
              <div key={recommendation.id} className="group relative">
                <div className={`p-3 rounded-lg border-2 transition-all ${
                  recommendation.type === 'action' ? 'bg-green-50 border-green-200 hover:border-green-300' :
                  recommendation.type === 'setting' ? 'bg-blue-50 border-blue-200 hover:border-blue-300' :
                  recommendation.type === 'warning' ? 'bg-red-50 border-red-200 hover:border-red-300' :
                  'bg-purple-50 border-purple-200 hover:border-purple-300'
                }`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-lg ${
                      recommendation.type === 'action' ? 'bg-green-100' :
                      recommendation.type === 'setting' ? 'bg-blue-100' :
                      recommendation.type === 'warning' ? 'bg-red-100' :
                      'bg-purple-100'
                    }`}>
                      {recommendation.type === 'action' ? '⚡' : 
                       recommendation.type === 'setting' ? '⚙️' : 
                       recommendation.type === 'warning' ? '⚠️' : '💡'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium mb-1">{recommendation.title}</p>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <div key={i} className={`w-2 h-2 rounded-full mr-1 ${
                              i < Math.round(recommendation.confidence / 20) ? 'bg-yellow-400' : 'bg-gray-200'
                            }`} />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">{recommendation.confidence}%</span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {recommendation.actionable && (
                        <button 
                          onClick={() => {
                            recommendation.action?.();
                            handleApply(recommendation.id);
                          }}
                          className="w-8 h-8 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center transition-colors"
                          title="Apply this recommendation"
                        >
                          ✓
                        </button>
                      )}
                      <button 
                        onClick={() => handleSave(recommendation.id)}
                        className="w-8 h-8 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center transition-colors"
                        title="Save for later"
                      >
                        ⭐
                      </button>
                      <button 
                        onClick={() => handleDismiss(recommendation.id)}
                        className="w-8 h-8 bg-gray-400 hover:bg-gray-500 text-white rounded-full flex items-center justify-center transition-colors"
                        title="Dismiss"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {personalization.smartDefaults.pomodoro_duration && (
              <div className="p-3 bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                    <Clock className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-sm font-medium">Optimal Settings</span>
                </div>
                <div className="flex gap-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">{personalization.smartDefaults.pomodoro_duration}</div>
                    <div className="text-xs text-blue-600">work min</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">{personalization.smartDefaults.break_duration}</div>
                    <div className="text-xs text-blue-600">break min</div>
                  </div>
                </div>
              </div>
            )}

            {savedIds.size > 0 && (
              <div className="p-3 bg-gradient-to-r from-yellow-50 to-yellow-100 border-2 border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center">
                    <Target className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-sm font-medium">Saved Insights</span>
                  <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-300">
                    {savedIds.size}
                  </Badge>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-br from-primary/10 via-primary/5 to-primary/10 border-2 border-primary/20 rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center animate-pulse">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium">AI Learning Mode</p>
                  <p className="text-xs text-muted-foreground">Watching your patterns</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-2 bg-white/50 rounded-lg text-center">
                  <div className="text-lg">👀</div>
                  <div className="text-xs font-medium">Tracks</div>
                  <div className="text-xs text-muted-foreground">Usage patterns</div>
                </div>
                <div className="p-2 bg-white/50 rounded-lg text-center">
                  <div className="text-lg">🎯</div>
                  <div className="text-xs font-medium">Suggests</div>
                  <div className="text-xs text-muted-foreground">Better workflows</div>
                </div>
              </div>
              
              <button 
                onClick={handleGenerateDemo}
                disabled={isGenerating}
                className="w-full py-2 bg-gradient-to-r from-primary to-primary/80 text-white rounded-lg font-medium hover:from-primary/90 hover:to-primary/70 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <span>✨</span>
                    Try AI Demo
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};