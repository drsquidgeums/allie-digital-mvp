
import { Button } from "@/components/ui/button";
import { Check, Trash2, Tag } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Task } from "@/types/task";
import { useTranslation } from "react-i18next";

interface TaskListProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onUpdateTaskColor: (id: string, color: string) => void;
  isLoading?: boolean;
}

const TASK_COLORS = [
  { value: "#4CAF50", label: "Green" },
  { value: "#2196F3", label: "Blue" },
  { value: "#FFC107", label: "Yellow" },
  { value: "#F44336", label: "Red" },
  { value: "#9C27B0", label: "Purple" },
  { value: "custom", label: "Custom Colour" },
  { value: null, label: "No Colour" },
];

export const TaskList = ({ tasks, onToggleTask, onDeleteTask, onUpdateTaskColor, isLoading = false }: TaskListProps) => {
  const [customColor, setCustomColor] = useState("#000000");
  const { t } = useTranslation();
  const { i18n } = useTranslation();
  const isUKEnglish = i18n.language === 'en-GB';

  if (isLoading) {
    return (
      <div className="text-center py-8 text-muted-foreground shadow-sm rounded-lg bg-card">
        <p>{t('common.loadingText')}</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground shadow-sm rounded-lg bg-card">
        <p>{t('tasks.empty')}</p>
        <p className="text-sm">{t('tasks.addTask')}</p>
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
            <DropdownMenuTrigger>
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
                      <div className="flex items-center gap-2 w-full">
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
                        <span>{isUKEnglish ? "Custom Colour" : "Custom Color"}</span>
                      </div>
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
