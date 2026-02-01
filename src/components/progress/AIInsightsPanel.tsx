import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Heart, FileText, Target, Loader2, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";
import { InsightType } from "@/hooks/useProgressAI";

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

const insightConfig: Record<InsightType, { icon: React.ElementType; title: string; bgColor: string; iconColor: string; borderColor: string }> = {
  insights: { 
    icon: Sparkles, 
    title: "Smart Insights", 
    bgColor: "bg-primary/15",
    iconColor: "text-primary",
    borderColor: "border-primary/30"
  },
  motivation: { 
    icon: Heart, 
    title: "Motivation", 
    bgColor: "bg-chart-2/15",
    iconColor: "text-chart-2",
    borderColor: "border-chart-2/30"
  },
  summary: { 
    icon: FileText, 
    title: "Weekly Summary", 
    bgColor: "bg-chart-3/15",
    iconColor: "text-chart-3",
    borderColor: "border-chart-3/30"
  },
  goals: { 
    icon: Target, 
    title: "Goal Recommendations", 
    bgColor: "bg-chart-4/15",
    iconColor: "text-chart-4",
    borderColor: "border-chart-4/30"
  },
};

export const AIInsightsPanel: React.FC<AIInsightsPanelProps> = ({
  insights,
  onGenerate,
  onGenerateAll,
  isAnyLoading,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="mb-6">
      <Card className="border-primary/20 bg-gradient-to-br from-card to-primary/5">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="p-1.5 rounded-lg bg-primary/20">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            AI Progress Insights
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onGenerateAll}
              disabled={isAnyLoading}
              className="border-primary/30 hover:bg-primary/10"
            >
              {isAnyLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Generate All
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setIsOpen(!isOpen)}
              aria-expanded={isOpen}
              aria-label={isOpen ? "Collapse AI Insights" : "Expand AI Insights"}
            >
              {isOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardHeader>
        {isOpen && (
          <CardContent className="pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(Object.keys(insightConfig) as InsightType[]).map((type) => {
                const config = insightConfig[type];
                const insight = insights[type];
                const Icon = config.icon;

                return (
                  <Card key={type} className={`${config.bgColor} ${config.borderColor} border`}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`p-1 rounded-md ${config.bgColor}`}>
                            <Icon className={`h-4 w-4 ${config.iconColor}`} />
                          </div>
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
                          <Loader2 className={`h-5 w-5 animate-spin ${config.iconColor}`} />
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
        )}
      </Card>
    </div>
  );
};
