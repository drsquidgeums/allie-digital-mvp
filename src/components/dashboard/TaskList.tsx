import { Button } from "@/components/ui/button";
import { Check, Trash2 } from "lucide-react";

interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  points: number;
}

interface TaskListProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

export const TaskList = ({ tasks, onToggleTask, onDeleteTask }: TaskListProps) => {
  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="flex items-center gap-2 p-2 rounded-lg bg-card border border-border"
        >
          <Button
            size="sm"
            variant="ghost"
            className={`p-1 h-6 w-6 ${task.completed ? "bg-green-500 text-white hover:bg-green-600" : ""}`}
            onClick={() => onToggleTask(task.id)}
          >
            <Check className="h-4 w-4" />
          </Button>
          <span className={`flex-1 ${task.completed ? "line-through text-muted-foreground" : ""}`}>
            {task.text}
          </span>
          <span className="text-sm text-muted-foreground">{task.points} pts</span>
          <Button
            size="sm"
            variant="ghost"
            className="p-1 h-6 w-6 text-destructive hover:text-destructive/90"
            onClick={() => onDeleteTask(task.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
};