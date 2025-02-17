
import React, { useState } from "react";
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
  onAddTask: (text: string) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

export const TaskPlanner = ({ selectedDate, tasks, onAddTask, onToggleTask, onDeleteTask }: TaskPlannerProps) => {
  const [showStarburst, setShowStarburst] = useState(false);
  const { toast } = useToast();

  const points = tasks.reduce((total, task) => total + (task.completed ? task.points : 0), 0);

  const taskStats = {
    total: tasks.length,
    completed: tasks.filter(task => task.completed).length,
    pending: tasks.filter(task => !task.completed).length
  };

  const handleAddTask = (text: string) => {
    onAddTask(text);
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
  };

  const handleToggleTask = (id: string) => {
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
  };

  const handleDeleteTask = (id: string) => {
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
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Task Manager</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

      <TaskInput 
        selectedDate={selectedDate}
        onAddTask={handleAddTask}
        showStarburst={showStarburst}
      />

      <TaskPoints points={points} />
      
      <div className="bg-card rounded-lg p-4 shadow-sm">
        <TaskCharts tasks={tasks} />
      </div>
    </div>
  );
};
