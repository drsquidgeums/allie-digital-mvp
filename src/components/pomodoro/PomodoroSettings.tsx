import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePomodoroContext } from "@/contexts/PomodoroContext";

export const PomodoroSettings = () => {
  const { state, dispatch } = usePomodoroContext();

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="space-y-1">
        <Label>Work Duration</Label>
        <Input
          type="number"
          value={state.workMinutes}
          onChange={(e) => dispatch({ 
            type: 'SET_WORK_MINUTES', 
            payload: Number(e.target.value) 
          })}
          min="1"
          disabled={state.isActive}
          className="h-8"
        />
      </div>
      <div className="space-y-1">
        <Label>Short Break</Label>
        <Input
          type="number"
          value={state.shortBreakMinutes}
          onChange={(e) => dispatch({ 
            type: 'SET_SHORT_BREAK', 
            payload: Number(e.target.value) 
          })}
          min="1"
          disabled={state.isActive}
          className="h-8"
        />
      </div>
      <div className="space-y-1">
        <Label>Long Break</Label>
        <Input
          type="number"
          value={state.longBreakMinutes}
          onChange={(e) => dispatch({ 
            type: 'SET_LONG_BREAK', 
            payload: Number(e.target.value) 
          })}
          min="1"
          disabled={state.isActive}
          className="h-8"
        />
      </div>
    </div>
  );
};