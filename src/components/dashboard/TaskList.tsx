import { Button } from "@/components/ui/button";
import { Check, Trash2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

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
    return <div className="text-muted-foreground text-center py-4 text-sm">No tasks yet. Add some tasks to get started!</div>;
  }

  return (
    <ScrollArea className="h-[calc(100vh-24rem)] pr-4">
      <div className="space-y-2">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center gap-2 p-2 rounded-lg bg-background hover:bg-accent/10 border border-border"
          >
            <Button
              size="sm"
              variant="outline"
              className={`p-1 h-5 w-5 ${
                task.completed 
                  ? "bg-[#7E69AB] text-white hover:bg-[#6E59A5] border-[#7E69AB]" 
                  : "border-input"
              }`}
              onClick={() => onToggleTask(task.id)}
            >
              {task.completed && <Check className="h-3 w-3" />}
            </Button>
            <span className={`flex-1 text-sm ${task.completed ? "line-through text-muted-foreground" : ""}`}>
              {task.text}
            </span>
            <span className="text-xs text-muted-foreground">{task.points} pts</span>
            <Button
              size="sm"
              variant="ghost"
              className="p-1 h-5 w-5 text-destructive hover:text-destructive/90"
              onClick={() => onDeleteTask(task.id)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};