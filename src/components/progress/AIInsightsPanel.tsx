import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Heart, FileText, Target, Loader2, RefreshCw } from "lucide-react";
import { InsightType, ProgressData } from "@/hooks/useProgressAI";

interface AIInsight {
  content: string;
  type: InsightType;
  loading: boolean;
}

interface AIInsightsPanelProps {
  insights: Record<InsightType, AIInsight>;
  onGenerate: (type: InsightType) => void;
  onGenerateAll: () => void;
  isAnyLoading: boolean;
}

const insightConfig: Record<InsightType, { icon: React.ElementType; title: string; color: string }> = {
  insights: { icon: Sparkles, title: "Smart Insights", color: "text-primary" },
  motivation: { icon: Heart, title: "Motivation", color: "text-chart-2" },
  summary: { icon: FileText, title: "Weekly Summary", color: "text-chart-3" },
  goals: { icon: Target, title: "Goal Recommendations", color: "text-chart-4" },
};

export const AIInsightsPanel: React.FC<AIInsightsPanelProps> = ({
  insights,
  onGenerate,
  onGenerateAll,
  isAnyLoading,
}) => {
  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Progress Insights
        </CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={onGenerateAll}
          disabled={isAnyLoading}
        >
          {isAnyLoading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          Generate All
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(Object.keys(insightConfig) as InsightType[]).map((type) => {
            const config = insightConfig[type];
            const insight = insights[type];
            const Icon = config.icon;

            return (
              <Card key={type} className="bg-accent/20 border-accent/30">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className={`h-4 w-4 ${config.color}`} />
                      <span className="text-sm font-medium">{config.title}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onGenerate(type)}
                      disabled={insight.loading}
                      className="h-7 px-2"
                    >
                      {insight.loading ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <RefreshCw className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  {insight.loading ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    </div>
                  ) : insight.content ? (
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {insight.content}
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground/60 italic">
                      Click refresh to generate {config.title.toLowerCase()}
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
