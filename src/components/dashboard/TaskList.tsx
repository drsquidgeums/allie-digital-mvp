
import { Button } from "@/components/ui/button";
import { Check, Trash2, Tag, Timer } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { usePomodoroContext } from "@/contexts/PomodoroContext";

interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  points: number;
  color?: string;
}

interface TaskListProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onUpdateTaskColor: (id: string, color: string) => void;
}

const TASK_COLORS = [
  { value: "custom", label: "Custom Color" },
  { value: null, label: "No Color" },
];

export const TaskList = ({ tasks, onToggleTask, onDeleteTask, onUpdateTaskColor }: TaskListProps) => {
  const [customColor, setCustomColor] = useState("#000000");
  const { state, dispatch } = usePomodoroContext();

  const handleStartPomodoro = (taskId: string) => {
    dispatch({ type: 'SET_CURRENT_TASK', payload: taskId });
    dispatch({ type: 'SWITCH_TO_WORK' });
    dispatch({ type: 'TOGGLE_TIMER' });
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground shadow-sm rounded-lg bg-card">
        <p>No tasks yet</p>
        <p className="text-sm">Add some tasks to get started!</p>
      </div>
    );
  }

  const handleColorSelect = (taskId: string, colorValue: string | null) => {
    if (colorValue === "custom") {
      return; // Don't update the color yet, wait for custom input
    }
    onUpdateTaskColor(taskId, colorValue || "");
  };

  return (
    <div className="space-y-3">
      {tasks.map((task) => {
        const pomodorosCompleted = state.taskPomodoros[task.id] || 0;
        const pomodoroProgress = (pomodorosCompleted / state.pomodorosRequired) * 100;
        const isCurrentTask = state.currentTask === task.id;
        
        return (
          <div
            key={task.id}
            className={cn(
              "flex flex-col gap-2 p-3 rounded-lg transition-colors shadow-sm",
              task.color 
                ? "border-l-4" 
                : "hover:bg-accent/10 bg-accent/5",
              isCurrentTask && "ring-1 ring-primary"
            )}
            style={{
              borderLeftColor: task.color || "transparent",
              backgroundColor: task.color ? `${task.color}10` : undefined
            }}
          >
            <div className="flex items-center gap-3">
              <Button
                size="sm"
                variant="outline"
                className={`p-1 h-6 w-6 rounded-full ${
                  task.completed 
                    ? "bg-primary text-primary-foreground hover:bg-primary/90 border-primary" 
                    : "border-input"
                }`}
                onClick={() => onToggleTask(task.id)}
              >
                {task.completed && <Check className="h-3 w-3" />}
              </Button>
              <span className={`flex-1 text-sm ${task.completed ? "line-through text-gray-400 dark:text-gray-300" : ""}`}>
                {task.text}
              </span>
              <span className="text-xs px-2 py-1 rounded-full bg-accent/10 text-muted-foreground">
                {task.points} pts
              </span>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="p-1 h-6 w-6"
                  >
                    <Tag className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-[200px]">
                  {TASK_COLORS.map((color) => (
                    <DropdownMenuItem
                      key={color.value || "no-color"}
                      onClick={() => handleColorSelect(task.id, color.value)}
                    >
                      <div className="flex items-center gap-2 w-full">
                        {color.value === "custom" ? (
                          <>
                            <Input 
                              type="color" 
                              value={customColor}
                              className="w-12 h-6 p-0 cursor-pointer"
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) => {
                                setCustomColor(e.target.value);
                                onUpdateTaskColor(task.id, e.target.value);
                              }}
                            />
                            <span>Custom Color</span>
                          </>
                        ) : (
                          <>
                            <div 
                              className="w-4 h-4 rounded-full border border-border"
                              style={{ backgroundColor: color.value || "transparent" }}
                            />
                            <span>{color.label}</span>
                          </>
                        )}
                      </div>
                    </DropdownMenuItem>
                  ))}
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem onClick={() => handleStartPomodoro(task.id)}>
                    <div className="flex items-center gap-2 w-full">
                      <Timer className="h-4 w-4" />
                      <span>Start Pomodoro</span>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                size="sm"
                variant="ghost"
                className="p-1 h-6 w-6 text-muted-foreground hover:text-destructive"
                onClick={() => onDeleteTask(task.id)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
            
            {!task.completed && pomodorosCompleted > 0 && (
              <div className="pl-8 pr-2">
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-muted-foreground">Pomodoro Progress</span>
                  <span>{pomodorosCompleted}/{state.pomodorosRequired}</span>
                </div>
                <Progress 
                  value={pomodoroProgress} 
                  className="h-1.5" 
                />
              </div>
            )}
            
            {isCurrentTask && state.isActive && (
              <div className="pl-8 pr-2 mt-1">
                <div className="text-xs text-primary font-medium flex items-center gap-1">
                  <Timer className="h-3 w-3" />
                  <span>Pomodoro active</span>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
