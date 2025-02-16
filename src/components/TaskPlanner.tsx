
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { TaskCharts } from "./dashboard/TaskCharts";
import { TaskPoints } from "./dashboard/TaskPoints";
import { TaskInput } from "./dashboard/TaskInput";
import { emitTaskNotification } from "@/utils/notifications";

interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  points: number;
}

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
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Add New Task</h2>
      <TaskInput 
        selectedDate={selectedDate}
        onAddTask={handleAddTask}
        showStarburst={showStarburst}
      />
      <TaskPoints points={points} />
      <TaskCharts tasks={tasks} />
    </div>
  );
};
