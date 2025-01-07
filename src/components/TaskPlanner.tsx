import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { TaskCharts } from "./dashboard/TaskCharts";
import { TaskPoints } from "./dashboard/TaskPoints";
import { TaskInput } from "./dashboard/TaskInput";

interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  points: number;
}

interface TaskPlannerProps {
  selectedDate?: Date;
}

const emitTaskNotification = (title: string, message: string) => {
  const event = new CustomEvent('taskNotification', {
    detail: { 
      id: Date.now().toString(),
      title,
      message,
      read: false,
      timestamp: new Date()
    }
  });
  window.dispatchEvent(event);
};

export const TaskPlanner = ({ selectedDate }: TaskPlannerProps) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [points, setPoints] = useState(0);
  const [showStarburst, setShowStarburst] = useState(false);
  const { toast } = useToast();

  const addTask = (text: string) => {
    const taskDate = selectedDate || new Date();
    setTasks([...tasks, { 
      id: Date.now().toString(), 
      text, 
      completed: false,
      createdAt: taskDate,
      points: 10
    }]);
    setShowStarburst(true);
    setTimeout(() => setShowStarburst(false), 700);
    emitTaskNotification(
      "New Task Added",
      `Task "${text}" has been added to your list for ${taskDate.toLocaleDateString()}`
    );
    toast({
      title: "Task added",
      description: "New task has been created successfully",
    });
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        const newStatus = !task.completed;
        if (newStatus) {
          setPoints(prev => prev + task.points);
          toast({
            title: "Points earned!",
            description: `You earned ${task.points} points for completing this task!`,
          });
        } else {
          setPoints(prev => prev - task.points);
        }
        emitTaskNotification(
          newStatus ? "Task Completed" : "Task Reopened",
          `Task "${task.text}" has been ${newStatus ? 'completed' : 'reopened'}`
        );
        return { ...task, completed: newStatus };
      }
      return task;
    }));
  };

  const deleteTask = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      if (task.completed) {
        setPoints(prev => prev - task.points);
      }
      emitTaskNotification(
        "Task Deleted",
        `Task "${task.text}" has been removed`
      );
    }
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <div className="space-y-4">
      <TaskPoints points={points} />
      <TaskInput 
        selectedDate={selectedDate}
        onAddTask={addTask}
        showStarburst={showStarburst}
      />
      <TaskCharts tasks={tasks} />
    </div>
  );
};