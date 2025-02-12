
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
import { useTasks } from "@/hooks/useTasks";

export const TaskSelector = () => {
  const { state, dispatch } = usePomodoroContext();
  const { tasks } = useTasks();

  const incompleteTasks = tasks.filter(task => !task.completed);

  return (
    <div className="space-y-2">
      <Label>Current Task</Label>
      <Select
        value={state.currentTask || "no-task"}
        onValueChange={(value) => dispatch({ 
          type: 'SET_CURRENT_TASK', 
          payload: value === "no-task" ? null : value 
        })}
        disabled={state.isActive}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a task" />
        </SelectTrigger>
        <SelectContent>
          {incompleteTasks.length === 0 ? (
            <SelectItem value="no-task" disabled>No tasks available</SelectItem>
          ) : (
            incompleteTasks.map((task) => (
              <SelectItem key={task.id} value={task.id}>
                {task.text} {state.taskPomodoros[task.id] ? 
                  `(${state.taskPomodoros[task.id]}/4 pomodoros)` : 
                  '(0/4 pomodoros)'}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
};
