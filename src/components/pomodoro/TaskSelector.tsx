
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
import { Badge } from "@/components/ui/badge";

export const TaskSelector = () => {
  const { state, dispatch } = usePomodoroContext();
  const { tasks } = useTasks();

  // Only show incomplete tasks
  const incompleteTasks = tasks.filter(task => !task.completed);

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Label className="text-xs font-medium text-muted-foreground">Current Task</Label>
        {state.currentTask && (
          <Badge variant="outline" className="text-xs h-5">
            {state.taskPomodoros[state.currentTask] || 0}/4
          </Badge>
        )}
      </div>
      
      <Select
        value={state.currentTask || "no-task"}
        onValueChange={(value) => dispatch({ 
          type: 'SET_CURRENT_TASK', 
          payload: value === "no-task" ? null : value 
        })}
        disabled={state.isActive}
      >
        <SelectTrigger className="w-full h-8 text-xs">
          <SelectValue placeholder="Select a task" />
        </SelectTrigger>
        <SelectContent className="max-h-[200px] bg-popover dark:bg-workspace-dark">
          <SelectItem value="no-task" className="text-xs">No task selected</SelectItem>
          {incompleteTasks.length === 0 ? (
            <SelectItem value="no-tasks-available" disabled className="text-xs">No tasks available</SelectItem>
          ) : (
            incompleteTasks.map((task) => (
              <SelectItem key={task.id} value={task.id} className="text-xs py-1.5">
                <span className="truncate max-w-[200px]">{task.text}</span>
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
      
      <p className="text-xs text-muted-foreground">
        Complete 4 pomodoros to mark task complete
      </p>
    </div>
  );
};
