
import React, { useCallback, memo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, XCircle } from "lucide-react";
import { usePomodoroContext } from "@/contexts/PomodoroContext";
import { useTasks } from "@/hooks/useTasks";

export const TaskCompletionPrompt = memo(() => {
  const { taskReadyForCompletion, setTaskReadyForCompletion } = usePomodoroContext();
  const { tasks } = useTasks();
  
  if (!taskReadyForCompletion) return null;
  
  // Find the task details
  const task = tasks.find(t => t.id === taskReadyForCompletion);
  if (!task) {
    setTaskReadyForCompletion(null);
    return null;
  }
  
  const handleConfirm = useCallback(() => {
    // Emit task completion event directly
    const event = new CustomEvent('pomodoroTaskCompletion', {
      detail: { 
        taskId: taskReadyForCompletion
      }
    });
    window.dispatchEvent(event);
    
    console.log('Task completion event dispatched:', taskReadyForCompletion);
    setTaskReadyForCompletion(null);
  }, [taskReadyForCompletion, setTaskReadyForCompletion]);
  
  const handleCancel = useCallback(() => {
    setTaskReadyForCompletion(null);
  }, [setTaskReadyForCompletion]);
  
  return (
    <Card className="p-4 mb-4 border-2 border-primary/50 bg-primary/5 animate-pulse">
      <div className="space-y-3">
        <h4 className="font-medium text-center">Mark Task as Complete?</h4>
        <p className="text-sm text-center text-muted-foreground">
          You've completed all pomodoros for:
        </p>
        <p className="text-center font-medium">{task.text}</p>
        <div className="flex justify-center gap-4 mt-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleCancel}
            className="flex items-center gap-1"
          >
            <XCircle className="h-4 w-4" />
            Not yet
          </Button>
          <Button 
            variant="default" 
            size="sm"
            onClick={handleConfirm}
            className="flex items-center gap-1"
          >
            <CheckCircle className="h-4 w-4" />
            Complete
          </Button>
        </div>
      </div>
    </Card>
  );
});

TaskCompletionPrompt.displayName = "TaskCompletionPrompt";
