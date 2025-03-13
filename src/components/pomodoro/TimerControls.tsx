
import React from "react";
import { Button } from "@/components/ui/button";
import { usePomodoroContext } from "@/contexts/PomodoroContext";
import { Play, Pause, RotateCcw } from "lucide-react";

export const TimerControls = () => {
  const { state, dispatch } = usePomodoroContext();

  return (
    <div className="flex flex-col gap-4">
      <div className="text-sm text-muted-foreground text-center">
        Completed: {state.completedPomodoros} / {state.sessionGoal}
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
