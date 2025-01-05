import React from "react";
import { Button } from "@/components/ui/button";
import { usePomodoroContext } from "@/contexts/PomodoroContext";

export const TimerControls = () => {
  const { state, dispatch } = usePomodoroContext();

  return (
    <div className="flex justify-between items-center">
      <div className="text-sm text-muted-foreground">
        Completed: {state.completedPomodoros} / {state.sessionGoal}
      </div>
      <div className="space-x-2">
        <Button
          onClick={() => dispatch({ type: 'TOGGLE_TIMER' })}
          variant="default"
          size="sm"
        >
          {state.isActive ? "Pause" : "Start"}
        </Button>
        <Button
          onClick={() => dispatch({ type: 'RESET_TIMER' })}
          variant="outline"
          size="sm"
        >
          Reset
        </Button>
      </div>
    </div>
  );
};