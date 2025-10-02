import { useState } from "react";
import { PracticeQuestion } from "@/hooks/useContentEnhancer";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

interface PracticeQuestionsViewerProps {
  questions: PracticeQuestion[];
}

export const PracticeQuestionsViewer = ({ questions }: PracticeQuestionsViewerProps) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  if (!questions.length) {
    return <div className="text-sm text-muted-foreground">No practice questions generated yet</div>;
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "medium":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "hard":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "open-ended":
        return "Open-Ended";
      case "short-answer":
        return "Short Answer";
      case "critical-thinking":
        return "Critical Thinking";
      default:
        return type;
    }
  };

  return (
    <div className="space-y-2">
      {questions.map((q, index) => {
        const isExpanded = expandedIndex === index;
        return (
          <Card key={index} className="overflow-hidden">
            <Button
              variant="ghost"
              className="w-full justify-start text-left p-4 h-auto hover:bg-muted/50"
              onClick={() => setExpandedIndex(isExpanded ? null : index)}
            >
              <div className="flex items-start gap-3 flex-1">
                <span className="font-medium text-sm text-muted-foreground shrink-0">
                  Q{index + 1}
                </span>
                <span className="flex-1">{q.question}</span>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 transition-transform ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                />
              </div>
            </Button>
            {isExpanded && (
              <div className="px-4 pb-4 space-y-3 border-t">
                <div className="flex gap-2 pt-3">
                  <Badge variant="outline" className="text-xs">
                    {getTypeLabel(q.type)}
                  </Badge>
                  <Badge variant="outline" className={`text-xs ${getDifficultyColor(q.difficulty)}`}>
                    {q.difficulty}
                  </Badge>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm font-medium mb-2">Suggested Answer:</p>
                  <p className="text-sm text-muted-foreground">{q.suggestedAnswer}</p>
                </div>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
};
