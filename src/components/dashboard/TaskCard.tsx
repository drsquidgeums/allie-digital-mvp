
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Task } from "@/types/task";
import { Tag } from "lucide-react";
import { useTranslation } from "react-i18next";
import { TaskLabels } from "./TaskLabels";
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
  onUpdateLabels?: (labels: string[]) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onToggle,
  onDelete,
  onUpdateColor,
  onUpdateLabels
}) => {
  const [showOptions, setShowOptions] = useState(false);
  const { i18n } = useTranslation();
  
  const colorOptions = [
    { value: "#4CAF50", label: i18n.language.startsWith('en-GB') ? "Green" : "Green" },
    { value: "#2196F3", label: i18n.language.startsWith('en-GB') ? "Blue" : "Blue" },
    { value: "#FFC107", label: i18n.language.startsWith('en-GB') ? "Yellow" : "Yellow" },
    { value: "#F44336", label: i18n.language.startsWith('en-GB') ? "Red" : "Red" },
    { value: "#9C27B0", label: i18n.language.startsWith('en-GB') ? "Purple" : "Purple" },
    { value: "", label: i18n.language.startsWith('en-GB') ? "None" : "None" }
  ];

  const handleAddLabel = (label: string) => {
    if (onUpdateLabels) {
      const newLabels = [...(task.labels || []), label];
      onUpdateLabels(newLabels);
    }
  };

  const handleRemoveLabel = (label: string) => {
    if (onUpdateLabels) {
      const newLabels = (task.labels || []).filter(l => l !== label);
      onUpdateLabels(newLabels);
    }
  };
  
  return (
    <Card 
      className={cn(
        "p-4 transition-all hover:shadow-md cursor-pointer relative",
        task.color ? "border-l-4" : "border"
      )}
      style={{
        borderLeftColor: task.color || undefined,
        backgroundColor: task.color ? `${task.color}15` : undefined
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
            "text-sm font-medium leading-tight mb-2",
            task.completed && "line-through text-muted-foreground"
          )}>
            {task.text}
          </p>
          
          {/* Labels */}
          {task.labels && task.labels.length > 0 && (
            <div className="mb-2">
              <TaskLabels
                labels={task.labels}
                onAddLabel={handleAddLabel}
                onRemoveLabel={handleRemoveLabel}
              />
            </div>
          )}
          
          <div className="flex items-center justify-between">
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
                className="flex items-center ml-2"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowOptions(true);
                }}
              >
                <div 
                  className={cn(
                    "h-5 w-5 rounded-full border transition-transform hover:scale-110",
                    !task.color && "border-dashed"
                  )}
                  style={{ 
                    backgroundColor: task.color || "transparent",
                    borderColor: task.color ? task.color : undefined
                  }}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent side="right" className="text-xs">
              {i18n.language.startsWith('en-GB') ? "Click to change colour" : "Click to change color"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      {showOptions && (
        <div className="mt-3 pt-3 border-t border-border/40">
          <div className="flex items-center gap-2 mb-3">
            <Tag className="h-4 w-4 text-muted-foreground" />
            <p className="text-xs font-medium">
              {i18n.language.startsWith('en-GB') ? "Task Colour:" : "Task Color:"}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
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

            {/* Custom color input */}
            <div className="relative w-6 h-6">
              <input 
                type="color"
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => {
                  e.stopPropagation();
                  onUpdateColor(e.target.value);
                }}
              />
              <div className="w-6 h-6 rounded-full border border-dashed flex items-center justify-center">
                <span className="text-xs">+</span>
              </div>
            </div>
          </div>

          {/* Labels Section */}
          <div className="mb-4">
            <p className="text-xs font-medium mb-2">Labels:</p>
            <TaskLabels
              labels={task.labels || []}
              onAddLabel={handleAddLabel}
              onRemoveLabel={handleRemoveLabel}
            />
          </div>
          
          <div className="flex justify-end">
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
