
import { Button } from "@/components/ui/button";
import { Check, Trash2, Tag } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

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
  { value: "#9b87f5", label: "Primary Purple" },
  { value: "#7E69AB", label: "Secondary Purple" },
  { value: "#F97316", label: "Bright Orange" },
  { value: "#0EA5E9", label: "Ocean Blue" },
  { value: "#F2FCE2", label: "Soft Green" },
  { value: "#FEC6A1", label: "Soft Orange" },
  { value: "#E5DEFF", label: "Soft Purple" },
  { value: "#FFDEE2", label: "Soft Pink" },
  { value: null, label: "No Color" },
];

export const TaskList = ({ tasks, onToggleTask, onDeleteTask, onUpdateTaskColor }: TaskListProps) => {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground shadow-sm rounded-lg bg-card">
        <p>No tasks yet</p>
        <p className="text-sm">Add some tasks to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <div
          key={task.id}
          className={cn(
            "flex items-center gap-3 p-3 rounded-lg transition-colors shadow-sm",
            task.color 
              ? "border-l-4" 
              : "hover:bg-accent/10 bg-accent/5",
          )}
          style={{
            borderLeftColor: task.color || "transparent",
            backgroundColor: task.color ? `${task.color}10` : undefined
          }}
        >
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
            <DropdownMenuContent align="end">
              {TASK_COLORS.map((color) => (
                <DropdownMenuItem
                  key={color.value || "no-color"}
                  onClick={() => onUpdateTaskColor(task.id, color.value || "")}
                >
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded-full border border-border"
                      style={{ backgroundColor: color.value || "transparent" }}
                    />
                    <span>{color.label}</span>
                  </div>
                </DropdownMenuItem>
              ))}
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
      ))}
    </div>
  );
};
