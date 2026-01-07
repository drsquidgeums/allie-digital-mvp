import React from "react";
import { Progress } from "@/components/ui/progress";
import { usePomodoroContext } from "@/contexts/PomodoroContext";

export const TimerDisplay = () => {
  const { state } = usePomodoroContext();
  const progress = ((state.workMinutes * 60 + state.seconds) / (state.isWork ? (25 * 60) : (state.shortBreakMinutes * 60))) * 100;

  return (
    <div className="border-2 border-primary/30 bg-primary/5 p-4 rounded-lg">
      <div className="text-center space-y-2">
        <h3 className="text-3xl font-bold tabular-nums">
          {String(state.workMinutes).padStart(2, "0")}:
          {String(state.seconds).padStart(2, "0")}
        </h3>
        <p className="text-xs text-muted-foreground">
          {state.isWork ? "Work Time" : "Break Time"}
        </p>
        <Progress value={progress} className="h-1.5" />
      </div>
    </div>
  );
};
