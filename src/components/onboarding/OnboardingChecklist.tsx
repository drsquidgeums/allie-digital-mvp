import React, { useState } from "react";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle, ChevronRight, ChevronDown, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export const OnboardingChecklist: React.FC = () => {
  const { 
    checklistItems, 
    onboardingEnabled,
    startTour
  } = useOnboarding();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);

  const completedCount = checklistItems.filter(item => item.completed).length;
  const totalCount = checklistItems.length;
  const progressPercent = (completedCount / totalCount) * 100;
  const allCompleted = completedCount === totalCount;

  if (!onboardingEnabled || allCompleted) return null;

  const handleItemClick = (item: typeof checklistItems[0]) => {
    if (item.route) {
      navigate(item.route);
    }
  };

  return (
    <Card className="fixed bottom-20 right-4 z-40 w-80 shadow-lg border-primary/20 overflow-hidden">
      {/* Header - toggles collapse */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50 transition-colors text-left"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <span className="font-medium">Getting Started</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {completedCount}/{totalCount}
          </span>
          {isOpen ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </div>
      </button>

      {/* Collapsible content */}
      {isOpen && (
        <div className="animate-in slide-in-from-top-2 duration-200">
          <div className="px-4 pb-2">
            <Progress value={progressPercent} className="h-2" />
          </div>

          <div className="px-2 pb-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-primary"
              onClick={startTour}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Take the tour
            </Button>
          </div>

          <div className="px-2 pb-4 space-y-1 max-h-64 overflow-y-auto">
            {checklistItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleItemClick(item)}
                className={cn(
                  "w-full flex items-start gap-3 p-2 rounded-lg text-left transition-colors",
                  item.completed 
                    ? "opacity-60" 
                    : "hover:bg-muted/50 cursor-pointer"
                )}
                disabled={item.completed}
              >
                {item.completed ? (
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                )}
                <div>
                  <p className={cn(
                    "text-sm font-medium",
                    item.completed && "line-through"
                  )}>
                    {item.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {item.description}
                  </p>
                </div>
                {!item.completed && item.route && (
                  <ChevronRight className="h-4 w-4 ml-auto shrink-0 text-muted-foreground" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};
