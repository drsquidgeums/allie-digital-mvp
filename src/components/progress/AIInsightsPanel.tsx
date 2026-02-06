import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Heart, FileText, Target, Loader2, RefreshCw, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from "lucide-react";
import { InsightType } from "@/hooks/useProgressAI";
import { cn } from "@/lib/utils";

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

const insightConfig: Record<InsightType, { icon: React.ElementType; title: string; shortTitle: string; bgColor: string; iconColor: string; borderColor: string; emptyPrompt: string }> = {
  insights: { 
    icon: Sparkles, 
    title: "Smart Insights", 
    shortTitle: "Insights",
    bgColor: "bg-primary/10",
    iconColor: "text-primary",
    borderColor: "border-primary/20",
    emptyPrompt: "Analyse your productivity patterns and provide actionable advice"
  },
  motivation: { 
    icon: Heart, 
    title: "Motivation", 
    shortTitle: "Motivation",
    bgColor: "bg-chart-2/10",
    iconColor: "text-chart-2",
    borderColor: "border-chart-2/20",
    emptyPrompt: "Get personalised encouragement based on your progress"
  },
  summary: { 
    icon: FileText, 
    title: "Weekly Summary", 
    shortTitle: "Summary",
    bgColor: "bg-chart-3/10",
    iconColor: "text-chart-3",
    borderColor: "border-chart-3/20",
    emptyPrompt: "Review your week's achievements and areas for growth"
  },
  goals: { 
    icon: Target, 
    title: "Goal Recommendations", 
    shortTitle: "Goals",
    bgColor: "bg-chart-4/10",
    iconColor: "text-chart-4",
    borderColor: "border-chart-4/20",
    emptyPrompt: "Receive suggested targets based on your performance"
  },
};

const insightTypes: InsightType[] = ["insights", "motivation", "summary", "goals"];

export const AIInsightsPanel: React.FC<AIInsightsPanelProps> = ({
  insights,
  onGenerate,
  onGenerateAll,
  isAnyLoading,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const activeType = insightTypes[activeIndex];
  const activeConfig = insightConfig[activeType];
  const activeInsight = insights[activeType];
  const ActiveIcon = activeConfig.icon;

  const goToPrev = () => {
    setActiveIndex((prev) => (prev === 0 ? insightTypes.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setActiveIndex((prev) => (prev === insightTypes.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="mb-6">
      <Card className="border-primary/20 bg-gradient-to-br from-card to-primary/5 overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
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
          <CardContent className="pt-0">
            {/* Tab Navigation */}
            <div className="flex items-center gap-1 mb-4 p-1 rounded-lg bg-muted/50">
              {insightTypes.map((type, index) => {
                const config = insightConfig[type];
                const Icon = config.icon;
                const isActive = index === activeIndex;
                
                return (
                  <button
                    key={type}
                    onClick={() => setActiveIndex(index)}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-md text-sm font-medium transition-all",
                      isActive 
                        ? `${config.bgColor} ${config.iconColor} shadow-sm` 
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    <Icon className={cn("h-4 w-4", isActive && config.iconColor)} />
                    <span className="hidden sm:inline">{config.shortTitle}</span>
                  </button>
                );
              })}
            </div>

            {/* Content Area with Navigation */}
            <div className="relative">
              {/* Mobile Navigation Arrows */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 z-10 sm:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full bg-background/80 shadow-sm"
                  onClick={goToPrev}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 z-10 sm:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full bg-background/80 shadow-sm"
                  onClick={goToNext}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Active Insight Card */}
              <div 
                className={cn(
                  "rounded-xl p-5 border-2 transition-all min-h-[160px]",
                  activeConfig.bgColor,
                  activeConfig.borderColor
                )}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={cn("p-2 rounded-lg", activeConfig.bgColor)}>
                      <ActiveIcon className={cn("h-5 w-5", activeConfig.iconColor)} />
                    </div>
                    <div>
                      <h3 className="font-semibold">{activeConfig.title}</h3>
                      <p className="text-xs text-muted-foreground">
                        {activeIndex + 1} of {insightTypes.length}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onGenerate(activeType)}
                    disabled={activeInsight.loading}
                    className={cn("h-8 px-3", activeConfig.iconColor)}
                  >
                    {activeInsight.loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <RefreshCw className="h-4 w-4 mr-1.5" />
                        Generate
                      </>
                    )}
                  </Button>
                </div>

                <div className="min-h-[80px]">
                  {activeInsight.loading ? (
                    <div className="flex items-center justify-center py-6">
                      <div className="flex items-center gap-3">
                        <Loader2 className={cn("h-5 w-5 animate-spin", activeConfig.iconColor)} />
                        <span className="text-sm text-muted-foreground">Analysing your progress...</span>
                      </div>
                    </div>
                  ) : activeInsight.content ? (
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {activeInsight.content}
                    </p>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-4 text-center">
                      <p className="text-sm text-muted-foreground/70 mb-2">
                        {activeConfig.emptyPrompt}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onGenerate(activeType)}
                        className={cn("gap-2", activeConfig.borderColor)}
                      >
                        <Sparkles className="h-3.5 w-3.5" />
                        Generate {activeConfig.shortTitle}
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Dot Indicators for Mobile */}
              <div className="flex justify-center gap-1.5 mt-3 sm:hidden">
                {insightTypes.map((type, index) => (
                  <button
                    key={type}
                    onClick={() => setActiveIndex(index)}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all",
                      index === activeIndex 
                        ? "bg-primary w-4" 
                        : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                    )}
                    aria-label={`Go to ${insightConfig[type].title}`}
                  />
                ))}
              </div>
            </div>

            {/* Info Text */}
            <p className="text-xs text-muted-foreground mt-4 text-center">
              <Sparkles className="h-3 w-3 inline mr-1" />
              AI insights are generated based on your actual task completion patterns, streaks, and productivity data
            </p>
          </CardContent>
        )}
      </Card>
    </div>
  );
};
