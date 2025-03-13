
import React from "react";
import { Button } from "@/components/ui/button";
import { usePomodoroContext } from "@/contexts/PomodoroContext";
import { Play, Pause, RotateCcw, CheckCircle2 } from "lucide-react";
import { useTasks } from "@/hooks/useTasks";

export const TimerControls = () => {
  const { state, dispatch } = usePomodoroContext();
  const { tasks } = useTasks();

  // Get the current task name if one is selected
  const currentTaskName = state.currentTask 
    ? tasks.find(task => task.id === state.currentTask)?.text || "Unknown task"
    : null;

  return (
    <div className="flex flex-col gap-4">
      <div className="text-sm text-center space-y-1">
        <div className="text-muted-foreground">
          Completed: {state.completedPomodoros} / {state.sessionGoal}
        </div>
        
        {currentTaskName && (
          <div className="text-primary flex items-center justify-center gap-1.5 font-medium">
            <CheckCircle2 className="h-4 w-4" />
            <span className="truncate max-w-[200px]">{currentTaskName}</span>
          </div>
        )}
      </div>
      
      <div className="flex justify-center space-x-2">
        <Button
          onClick={() => dispatch({ type: 'TOGGLE_TIMER' })}
          variant="default"
          size="sm"
          className="w-24 gap-2"
        >
          {state.isActive ? (
            <>
              <Pause className="h-4 w-4" />
              Pause
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              Start
            </>
          )}
        </Button>
        <Button
          onClick={() => dispatch({ type: 'RESET_TIMER' })}
          variant="outline"
          size="sm"
          className="w-24 gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </Button>
      </div>
    </div>
  );
};
