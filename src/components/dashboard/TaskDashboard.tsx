
import React, { useState, useMemo } from 'react';
import { WorkspaceLayout } from "@/components/WorkspaceLayout";
import { useTasks } from "@/hooks/useTasks";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Task } from "@/types/task";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { TaskInput } from "@/components/dashboard/TaskInput";

export const TaskDashboard: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [showCompleted, setShowCompleted] = useState<boolean>(true);
  const { toast } = useToast();
  const { 
    tasks, 
    handleAddTask, 
    handleToggleTask, 
    handleDeleteTask,
    handleUpdateTaskColor
  } = useTasks();

  // Group tasks by completion status
  const groupedTasks = useMemo(() => {
    // Filter tasks for the selected date
    const filteredTasks = tasks.filter(task => {
      if (!selectedDate) return true;
      
      const taskDate = new Date(task.createdAt);
      return (
        taskDate.getDate() === selectedDate.getDate() &&
        taskDate.getMonth() === selectedDate.getMonth() &&
        taskDate.getFullYear() === selectedDate.getFullYear()
      );
    });

    return {
      todo: filteredTasks.filter(task => !task.completed),
      completed: filteredTasks.filter(task => task.completed),
    };
  }, [tasks, selectedDate]);

  return (
    <WorkspaceLayout>
      <div className="p-4 h-full max-w-[1600px] mx-auto">
        <div className="mb-6 flex flex-col md:flex-row justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-1">Task Board</h1>
            <p className="text-muted-foreground">
              {selectedDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowCalendar(!showCalendar)}
              className="flex items-center gap-2 px-3 py-2 rounded-md bg-accent/30 hover:bg-accent/50 transition-colors"
            >
              <CalendarIcon className="h-4 w-4" />
              <span>Calendar</span>
            </button>
            
            <div className="flex items-center gap-2">
              <Switch 
                id="show-completed" 
                checked={showCompleted} 
                onCheckedChange={setShowCompleted}
              />
              <Label htmlFor="show-completed">Show Completed</Label>
            </div>
          </div>
        </div>

        {showCalendar && (
          <Card className="p-4 mb-6 border-none shadow-sm">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border-none mx-auto"
            />
          </Card>
        )}

        <div className="mb-6">
          <TaskInput 
            selectedDate={selectedDate}
            onAddTask={(text) => handleAddTask(text, selectedDate)}
            showStarburst={false}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* To-Do Column */}
          <TaskColumn 
            title="To Do" 
            tasks={groupedTasks.todo}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
            onUpdateTaskColor={handleUpdateTaskColor}
            emptyMessage="No tasks to do! Add some using the form above."
            className="bg-background border border-dashed border-accent/50 rounded-lg"
          />

          {/* Completed Column */}
          {showCompleted && (
            <TaskColumn
              title="Completed" 
              tasks={groupedTasks.completed}
              onToggleTask={handleToggleTask}
              onDeleteTask={handleDeleteTask}
              onUpdateTaskColor={handleUpdateTaskColor}
              emptyMessage="No completed tasks yet. Complete a task to see it here!"
              className="bg-background/50 border border-dashed border-muted/50 rounded-lg"
            />
          )}
        </div>
      </div>
    </WorkspaceLayout>
  );
};

interface TaskColumnProps {
  title: string;
  tasks: Task[];
  emptyMessage: string;
  className?: string;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onUpdateTaskColor: (id: string, color: string) => void;
}

const TaskColumn: React.FC<TaskColumnProps> = ({
  title,
  tasks,
  emptyMessage,
  className,
  onToggleTask,
  onDeleteTask,
  onUpdateTaskColor
}) => {
  return (
    <div className={cn("p-4", className)}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-lg">{title}</h2>
        <Badge variant="outline">{tasks.length}</Badge>
      </div>

      <div className="space-y-3">
        {tasks.length === 0 ? (
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

interface TaskCardProps {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
  onUpdateColor: (color: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onToggle,
  onDelete,
  onUpdateColor
}) => {
  const [showOptions, setShowOptions] = useState(false);
  
  // Task color options
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
        "p-4 transition-all hover:shadow-md cursor-pointer",
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
      </div>
      
      {/* Task options */}
      {showOptions && (
        <div className="mt-3 pt-3 border-t border-border/40">
          <p className="text-xs font-medium mb-2">Task Color:</p>
          <div className="flex flex-wrap gap-2">
            {colorOptions.map((color) => (
              <button
                key={color.value || 'none'}
                className={cn(
                  "w-6 h-6 rounded-full border",
                  color.value ? "" : "bg-background border-dashed"
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
