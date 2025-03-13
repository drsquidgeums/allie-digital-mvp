
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePomodoroContext } from "@/contexts/PomodoroContext";

export const PomodoroSettings = () => {
  const { state, dispatch } = usePomodoroContext();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="space-y-2">
        <Label className="text-sm font-medium">Work Duration (min)</Label>
        <Input
          type="number"
          value={state.workMinutes}
          onChange={(e) => dispatch({ 
            type: 'SET_WORK_MINUTES', 
            payload: Number(e.target.value) || 1
          })}
          min="1"
          max="60"
          disabled={state.isActive}
          className="h-9"
        />
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium">Short Break (min)</Label>
        <Input
          type="number"
          value={state.shortBreakMinutes}
          onChange={(e) => dispatch({ 
            type: 'SET_SHORT_BREAK', 
            payload: Number(e.target.value) || 1
          })}
          min="1"
          max="30"
          disabled={state.isActive}
          className="h-9"
        />
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium">Long Break (min)</Label>
        <Input
          type="number"
          value={state.longBreakMinutes}
          onChange={(e) => dispatch({ 
            type: 'SET_LONG_BREAK', 
            payload: Number(e.target.value) || 1
          })}
          min="1"
          max="60"
          disabled={state.isActive}
          className="h-9"
        />
      </div>
    </div>
  );
};
