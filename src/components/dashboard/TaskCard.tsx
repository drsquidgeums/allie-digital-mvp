
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Task } from "@/types/task";
import { Tag } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TaskCardProps {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
  onUpdateColor: (color: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onToggle,
  onDelete,
  onUpdateColor
}) => {
  const [showOptions, setShowOptions] = useState(false);
  
  const colorOptions = [
    { value: "#4CAF50", label: "Green" },
    { value: "#2196F3", label: "Blue" },
    { value: "#FFC107", label: "Yellow" },
    { value: "#F44336", label: "Red" },
    { value: "#9C27B0", label: "Purple" },
    { value: "", label: "None" }
  ];
  
  return (
    <Card 
      className={cn(
        "p-4 transition-all hover:shadow-md cursor-pointer relative",
        task.color ? "border-l-4" : "border"
      )}
      style={{
        borderLeftColor: task.color || undefined,
        backgroundColor: task.color ? `${task.color}10` : undefined
      }}
      onClick={() => setShowOptions(!showOptions)}
    >
      <div className="flex items-start gap-3">
        <div 
          className={cn(
            "mt-1 flex-shrink-0 h-5 w-5 rounded-full border-2",
            task.completed 
              ? "bg-primary border-primary" 
              : "bg-background border-muted-foreground"
          )}
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
        >
          {task.completed && (
            <svg className="h-full w-full text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
        
        <div className="flex-1">
          <p className={cn(
            "text-sm font-medium leading-tight",
            task.completed && "line-through text-muted-foreground"
          )}>
            {task.text}
          </p>
          
          <div className="flex items-center mt-2 justify-between">
            <span className="text-xs px-2 py-1 rounded-full bg-accent/20 text-muted-foreground">
              {task.points} pts
            </span>
            
            <span className="text-xs text-muted-foreground">
              {new Date(task.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div 
                className={cn(
                  "absolute right-0 top-0 bottom-0 w-1.5 rounded-r-md transition-colors",
                  task.color ? "" : "hidden"
                )} 
                style={{ backgroundColor: task.color || "transparent" }}
              />
            </TooltipTrigger>
            <TooltipContent side="right" className="text-xs">
              Click to edit task
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      {showOptions && (
        <div className="mt-3 pt-3 border-t border-border/40">
          <div className="flex items-center gap-2 mb-3">
            <Tag className="h-4 w-4 text-muted-foreground" />
            <p className="text-xs font-medium">Task Color:</p>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-2">
            {colorOptions.map((color) => (
              <button
                key={color.value || 'none'}
                className={cn(
                  "w-6 h-6 rounded-full border transition-transform hover:scale-110",
                  color.value ? "" : "bg-background border-dashed",
                  task.color === color.value ? "ring-2 ring-offset-2 ring-primary" : ""
                )}
                style={{ backgroundColor: color.value || undefined }}
                aria-label={color.label}
                onClick={(e) => {
                  e.stopPropagation();
                  onUpdateColor(color.value);
                }}
              />
            ))}
          </div>
          
          <div className="mt-3 flex justify-end">
            <button
              className="text-xs text-destructive hover:underline"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              Delete Task
            </button>
          </div>
        </div>
      )}
    </Card>
  );
};
