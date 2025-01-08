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
    return <div className="text-muted-foreground text-center py-4">No tasks yet. Add some tasks to get started!</div>;
  }

  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="flex items-center gap-2 p-3 rounded-lg bg-background hover:bg-accent/10 border border-border"
        >
          <Button
            size="sm"
            variant="outline"
            className={`p-1 h-6 w-6 ${
              task.completed 
                ? "bg-[#7E69AB] text-white hover:bg-[#6E59A5] border-[#7E69AB]" 
                : "border-input"
            }`}
            onClick={() => onToggleTask(task.id)}
          >
            {task.completed && <Check className="h-4 w-4" />}
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