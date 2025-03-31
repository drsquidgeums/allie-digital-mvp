
import React from 'react';
import { Task } from "@/types/task";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { TaskCard } from "./TaskCard";
import { Skeleton } from "@/components/ui/skeleton";

interface TaskColumnProps {
  title: string;
  tasks: Task[];
  emptyMessage: string;
  className?: string;
  isLoading?: boolean;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onUpdateTaskColor: (id: string, color: string) => void;
}

export const TaskColumn: React.FC<TaskColumnProps> = ({
  title,
  tasks,
  emptyMessage,
  className,
  isLoading = false,
  onToggleTask,
  onDeleteTask,
  onUpdateTaskColor
}) => {
  return (
    <div className={cn("p-4", className)}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-lg">{title}</h2>
        <Badge variant="outline">{isLoading ? '-' : tasks.length}</Badge>
      </div>

      <div className="space-y-3">
        {isLoading ? (
          // Show loading skeletons
          Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-16 w-full" />
          ))
        ) : tasks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>{emptyMessage}</p>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard 
              key={task.id}
              task={task}
              onToggle={() => onToggleTask(task.id)}
              onDelete={() => onDeleteTask(task.id)}
              onUpdateColor={(color) => onUpdateTaskColor(task.id, color)}
            />
          ))
        )}
      </div>
    </div>
  );
};
