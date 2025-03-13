
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
import { Progress } from "@/components/ui/progress";

export const TaskSelector = () => {
  const { state, dispatch } = usePomodoroContext();
  const { tasks } = useTasks();

  const incompleteTasks = tasks.filter(task => !task.completed);

  return (
    <div className="space-y-4">
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
            <SelectItem value="no-task">No task selected</SelectItem>
            {incompleteTasks.length === 0 ? (
              <SelectItem value="no-tasks" disabled>No tasks available</SelectItem>
            ) : (
              incompleteTasks.map((task) => (
                <SelectItem key={task.id} value={task.id}>
                  {task.text}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      {state.currentTask && (
        <div className="space-y-2 rounded-md border p-3 bg-muted/20">
          <div className="flex justify-between items-center text-sm">
            <span>Pomodoro Progress</span>
            <span className="font-medium">
              {state.taskPomodoros[state.currentTask] || 0}/{state.pomodorosRequired}
            </span>
          </div>
          <Progress 
            value={((state.taskPomodoros[state.currentTask] || 0) / state.pomodorosRequired) * 100} 
            className="h-2" 
          />
          <p className="text-xs text-muted-foreground">
            This task will be marked complete after {state.pomodorosRequired} pomodoros
          </p>
        </div>
      )}
    </div>
  );
};
