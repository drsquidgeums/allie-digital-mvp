import React from "react";
import { Label } from "@/components/ui/label";
import { usePomodoroContext } from "@/contexts/PomodoroContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const TaskSelector = () => {
  const { state, dispatch } = usePomodoroContext();

  return (
    <div className="space-y-2">
      <Label>Current Task</Label>
      <Select
        value={state.currentTask || ""}
        onValueChange={(value) => dispatch({ 
          type: 'SET_CURRENT_TASK', 
          payload: value 
        })}
        disabled={state.isActive}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a task" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="task1">Task 1</SelectItem>
          <SelectItem value="task2">Task 2</SelectItem>
          <SelectItem value="task3">Task 3</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};