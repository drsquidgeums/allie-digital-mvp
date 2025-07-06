
import React, { useState, useCallback, memo } from "react";
import { useToast } from "@/hooks/use-toast";
import { TaskCharts } from "./dashboard/TaskCharts";
import { TaskPoints } from "./dashboard/TaskPoints";
import { TaskInput } from "./dashboard/TaskInput";
import { emitTaskNotification } from "@/utils/notifications";
import { Badge } from "./ui/badge";
import { Task } from "@/types/task";

interface TaskPlannerProps {
  selectedDate?: Date;
  tasks: Task[];
  onAddTask: (text: string, taskDate?: Date) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

export const TaskPlanner = memo(({ selectedDate, tasks, onAddTask, onToggleTask, onDeleteTask }: TaskPlannerProps) => {
  const [showStarburst, setShowStarburst] = useState(false);
  const { toast } = useToast();

  const points = tasks.reduce((total, task) => total + (task.completed ? task.points : 0), 0);

  const taskStats = {
    total: tasks.length,
    completed: tasks.filter(task => task.completed).length,
    pending: tasks.filter(task => !task.completed).length
  };

  const handleAddTask = useCallback((text: string) => {
    console.log('TaskPlanner handleAddTask called with:', text);
    onAddTask(text, selectedDate);
    setShowStarburst(true);
    setTimeout(() => setShowStarburst(false), 700);
    
    emitTaskNotification(
      "New Task Added",
      `Task "${text}" has been added to your list for ${selectedDate?.toLocaleDateString() || new Date().toLocaleDateString()}`
    );
    
    toast({
      title: "Task added",
      description: "New task has been created successfully",
    });
  }, [onAddTask, selectedDate, toast]);

  const handleToggleTask = useCallback((id: string) => {
    console.log('TaskPlanner handleToggleTask called with:', id);
    onToggleTask(id);
    const task = tasks.find(t => t.id === id);
    if (task) {
      const newStatus = !task.completed;
      emitTaskNotification(
        newStatus ? "Task Completed" : "Task Reopened",
        `Task "${task.text}" has been ${newStatus ? 'completed' : 'reopened'}`
      );
      
      if (newStatus) {
        toast({
          title: "Task completed! 🎉",
          description: `You've earned ${task.points} points!`,
        });
      }
    }
  }, [onToggleTask, tasks, toast]);

  const handleDeleteTask = useCallback((id: string) => {
    console.log('TaskPlanner handleDeleteTask called with:', id);
    const task = tasks.find(t => t.id === id);
    if (task) {
      emitTaskNotification(
        "Task Deleted",
        `Task "${task.text}" has been removed`
      );
    }
    onDeleteTask(id);
    toast({
      title: "Task deleted",
      description: "Task has been removed from your list",
    });
  }, [onDeleteTask, tasks, toast]);

  console.log('TaskPlanner render - tasks:', tasks.length, 'points:', points);

  return (
    <div className="h-full flex flex-col">
      <div className="flex-none mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Task Manager</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <Badge variant="outline" className="justify-center py-2">
            Total Tasks: {taskStats.total}
          </Badge>
          <Badge variant="outline" className="justify-center py-2 bg-[#222222] dark:bg-[#F1F1F1] text-white dark:text-[#333333]">
            Completed: {taskStats.completed}
          </Badge>
          <Badge variant="outline" className="justify-center py-2 bg-[#7E69AB] dark:bg-[#7E69AB] text-white">
            Pending: {taskStats.pending}
          </Badge>
        </div>

        <div className="mb-4">
          <TaskInput 
            selectedDate={selectedDate}
            onAddTask={handleAddTask}
            showStarburst={showStarburst}
          />
        </div>

        <div className="mb-4">
          <TaskPoints points={points} />
        </div>
      </div>
      
      <div className="flex-1 min-h-0">
        <div className="h-full bg-card rounded-lg p-4 shadow-sm">
          <TaskCharts tasks={tasks} />
        </div>
      </div>
    </div>
  );
});

TaskPlanner.displayName = "TaskPlanner";
