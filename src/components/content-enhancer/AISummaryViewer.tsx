import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, BookOpen, GraduationCap } from "lucide-react";

interface Summary {
  mainIdea: string;
  keyPoints: string[];
  terms?: Array<{
    term: string;
    definition: string;
  }>;
  reviewTips?: string[];
}

interface AISummaryViewerProps {
  summary: Summary;
}

export const AISummaryViewer = ({ summary }: AISummaryViewerProps) => {
  if (!summary) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No summary generated yet
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="p-6 bg-primary/5">
        <div className="flex items-start gap-3">
          <BookOpen className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
          <div>
            <h4 className="font-semibold mb-2">Main Idea</h4>
            <p className="text-sm leading-relaxed">{summary.mainIdea}</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h4 className="font-semibold mb-3 flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-primary" />
          Key Points
        </h4>
        <ul className="space-y-2">
          {summary.keyPoints.map((point, index) => (
            <li key={index} className="flex items-start gap-2">
              <Badge variant="secondary" className="mt-0.5 px-2 py-0.5 text-xs">
                {index + 1}
              </Badge>
              <span className="text-sm flex-1">{point}</span>
            </li>
          ))}
        </ul>
      </Card>

      {summary.terms && summary.terms.length > 0 && (
        <Card className="p-6">
          <h4 className="font-semibold mb-3">Important Terms</h4>
          <div className="space-y-3">
            {summary.terms.map((term, index) => (
              <div key={index} className="bg-muted/50 p-3 rounded-lg">
                <p className="font-medium text-sm mb-1">{term.term}</p>
                <p className="text-sm text-muted-foreground">{term.definition}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {summary.reviewTips && summary.reviewTips.length > 0 && (
        <Card className="p-6 bg-yellow-50 dark:bg-yellow-950">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            Quick Review Tips
          </h4>
          <ul className="space-y-2">
            {summary.reviewTips.map((tip, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <span className="text-yellow-600 dark:text-yellow-400">✓</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
};
