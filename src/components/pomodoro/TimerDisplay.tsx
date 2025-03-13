
import React from "react";
import { Progress } from "@/components/ui/progress";
import { usePomodoroContext } from "@/contexts/PomodoroContext";

export const TimerDisplay = () => {
  const { state } = usePomodoroContext();
  
  // Calculate progress percentage based on current phase
  const totalSeconds = state.isWork 
    ? state.workMinutes * 60 
    : (state.completedPomodoros % 4 === 0 && !state.isWork 
        ? state.longBreakMinutes * 60 
        : state.shortBreakMinutes * 60);
  
  const remainingSeconds = (state.workMinutes * 60) + state.seconds;
  const progress = (remainingSeconds / totalSeconds) * 100;

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-3xl font-bold">
          {String(state.workMinutes).padStart(2, "0")}:
          {String(state.seconds).padStart(2, "0")}
        </h3>
        <p className="text-sm text-muted-foreground">
          {state.isWork ? "Work Time" : "Break Time"}
        </p>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
};
