import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  points: number;
}

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showAchievement, setShowAchievement] = useState(false);
  const { toast } = useToast();

  const calculateTotalPoints = () => {
    return tasks.reduce((total, task) => total + (task.completed ? task.points : 0), 0);
  };

  const handleAddTask = (text: string, taskDate: Date) => {
    const newTask = {
      id: Date.now().toString(),
      text,
      completed: false,
      createdAt: taskDate,
      points: 10
    };
    setTasks([...tasks, newTask]);
  };

  const handleToggleTask = (id: string) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        const newStatus = !task.completed;
        if (newStatus) {
          const newTotalPoints = calculateTotalPoints() + task.points;
          if (newTotalPoints >= 20 && newTotalPoints < 50 || 
              newTotalPoints >= 50 && newTotalPoints < 100 ||
              newTotalPoints >= 100) {
            setShowAchievement(true);
          }
          toast({
            title: "Points earned!",
            description: `You earned ${task.points} points for completing this task!`,
          });
        }
        return { ...task, completed: newStatus };
      }
      return task;
    }));
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  return {
    tasks,
    showAchievement,
    setShowAchievement,
    calculateTotalPoints,
    handleAddTask,
    handleToggleTask,
    handleDeleteTask
  };
};