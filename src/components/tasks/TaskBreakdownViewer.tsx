import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { TaskBreakdown } from '@/hooks/useAITaskBreakdown';

interface TaskBreakdownViewerProps {
  breakdown: TaskBreakdown;
  onSubtaskClick?: (subtask: any) => void;
}

export const TaskBreakdownViewer: React.FC<TaskBreakdownViewerProps> = ({
  breakdown,
  onSubtaskClick
}) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertCircle className="h-4 w-4" />;
      case 'medium': return <Clock className="h-4 w-4" />;
      case 'low': return <CheckCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">AI Task Breakdown</CardTitle>
        <CardDescription>{breakdown.reasoning}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {breakdown.subtasks.map((subtask, index) => (
          <div
            key={index}
            className="p-3 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
            onClick={() => onSubtaskClick?.(subtask)}
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <h4 className="font-medium flex-1">{subtask.title}</h4>
              <Badge variant={getPriorityColor(subtask.priority)} className="flex items-center gap-1">
                {getPriorityIcon(subtask.priority)}
                {subtask.priority}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-2">{subtask.description}</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{subtask.estimatedTime}</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
