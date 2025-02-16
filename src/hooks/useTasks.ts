
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  points: number;
  color?: string;
}

// Create a shared state outside the hook
let sharedTasks: Task[] = [];
const listeners = new Set<(tasks: Task[]) => void>();

const notifyListeners = () => {
  listeners.forEach(listener => listener(sharedTasks));
};

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>(sharedTasks);
  const [showAchievement, setShowAchievement] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Subscribe to changes
    const listener = (newTasks: Task[]) => {
      setTasks(newTasks);
    };
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

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
    sharedTasks = [...sharedTasks, newTask];
    notifyListeners();
  };

  const handleToggleTask = (id: string) => {
    sharedTasks = sharedTasks.map(task => {
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
    });
    notifyListeners();
  };

  const handleDeleteTask = (id: string) => {
    sharedTasks = sharedTasks.filter(task => task.id !== id);
    notifyListeners();
  };

  const handleUpdateTaskColor = (id: string, color: string) => {
    sharedTasks = sharedTasks.map(task => {
      if (task.id === id) {
        return { ...task, color };
      }
      return task;
    });
    notifyListeners();
    toast({
      title: "Task updated",
      description: "Task color has been updated",
    });
  };

  return {
    tasks,
    showAchievement,
    setShowAchievement,
    calculateTotalPoints,
    handleAddTask,
    handleToggleTask,
    handleDeleteTask,
    handleUpdateTaskColor
  };
};
