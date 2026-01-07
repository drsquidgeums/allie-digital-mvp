import React from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw } from "lucide-react";
import { usePomodoroContext } from "@/contexts/PomodoroContext";

export const TimerControls = () => {
  const { state, dispatch } = usePomodoroContext();

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Button
          onClick={() => dispatch({ type: 'TOGGLE_TIMER' })}
          size="sm"
          className="flex-1"
        >
          {state.isActive ? (
            <>
              <Pause className="w-4 h-4 mr-2" />
              Pause
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Start
            </>
          )}
        </Button>
        <Button
          onClick={() => dispatch({ type: 'RESET_TIMER' })}
          variant="outline"
          size="sm"
          className="flex-1"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
      </div>
      <p className="text-xs text-center text-muted-foreground">
        Completed: {state.completedPomodoros} / {state.sessionGoal} pomodoros
      </p>
    </div>
  );
};
