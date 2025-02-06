
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
  if (tasks.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
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
          className="flex items-center gap-3 p-3 rounded-lg bg-accent/5 hover:bg-accent/10 transition-colors"
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
          <span className={`flex-1 text-sm ${task.completed ? "line-through text-muted-foreground" : ""}`}>
            {task.text}
          </span>
          <span className="text-xs px-2 py-1 rounded-full bg-accent/10 text-muted-foreground">
            {task.points} pts
          </span>
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
